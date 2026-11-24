#!/usr/bin/env python3
"""Mide un Short fotograma a fotograma (30 fps, sin muestrear).

Uso: python3 -I tools/measure.py video.mp4 [--words words.json] [--meta render_meta.json] [--json out.json]

Métricas: duración, códecs, resolución, tamaño, palabras/s y silencios (si hay words.json
con [[texto, ms_ini, ms_fin], ...]), cortes duros, % de fotogramas con cámara en movimiento
(correlación de fase por cuadrantes, subpíxel), duración media de cada movimiento, brillo,
contraste y saturación por segundo, primer texto en pantalla (heurística), tamaño y posición
de subtítulos (exacto si hay render_meta.json; si no, heurística), LUFS y pico verdadero.
"""
import argparse
import json
import re
import subprocess
import sys

import numpy as np

FPS = 30
AW, AH = 540, 960  # resolución de análisis (mitad): todos los fotogramas


def ffprobe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path],
        capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
    return {
        "duracion_s": float(d["format"]["duration"]),
        "tamano_mb": int(d["format"]["size"]) / 1e6,
        "video_codec": v["codec_name"], "ancho": v["width"], "alto": v["height"],
        "fps": v.get("r_frame_rate"),
        "audio_codec": a["codec_name"] if a else None,
    }


CROP = None


def frames(path):
    vf = (f"crop={CROP}," if CROP else "") + f"fps={FPS},scale={AW}:{AH}"
    cmd = ["ffmpeg", "-v", "error", "-i", path, "-vf", vf,
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    n = AW * AH * 3
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, np.uint8).reshape(AH, AW, 3)
    p.wait()


_win = None


def phase_shift(a, b):
    """Desplazamiento subpíxel (dy, dx) entre dos parches en gris por correlación de fase."""
    global _win
    if _win is None or _win.shape != a.shape:
        _win = np.outer(np.hanning(a.shape[0]), np.hanning(a.shape[1]))
    A = np.fft.fft2((a - a.mean()) * _win)
    B = np.fft.fft2((b - b.mean()) * _win)
    R = A * np.conj(B)
    R /= np.abs(R) + 1e-9
    r = np.fft.ifft2(R).real
    iy, ix = np.unravel_index(np.argmax(r), r.shape)
    peak = r[iy, ix]

    def sub(arr, i, n):
        l, c, rr = arr[(i - 1) % n], arr[i], arr[(i + 1) % n]
        d = l - 2 * c + rr
        return 0.0 if abs(d) < 1e-12 else 0.5 * (l - rr) / d

    dy = iy + sub(r[:, ix], iy, r.shape[0])
    dx = ix + sub(r[iy, :], ix, r.shape[1])
    if dy > r.shape[0] / 2:
        dy -= r.shape[0]
    if dx > r.shape[1] / 2:
        dx -= r.shape[1]
    return dy, dx, peak


def analyse_frames(path):
    gray_prev = None
    rows = []
    for i, f in enumerate(frames(path)):
        rgb = f.astype(np.float32) / 255.0
        y = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
        mx, mn = rgb.max(-1), rgb.min(-1)
        sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0)
        # textos: densidad de bordes horizontales fuertes por banda (heurística)
        gx = np.abs(np.diff(y, axis=1))
        band_edges = (gx > 0.35).mean(axis=1)  # por fila
        row = {"i": i, "Y": float(y.mean() * 255), "C": float(y.std() * 255), "S": float(sat.mean()),
               "edge_rows": band_edges}
        if gray_prev is not None:
            diff = float(np.abs(y - gray_prev).mean() * 255)
            # movimiento: correlación de fase en 4 cuadrantes (traslación, zoom y giro)
            h2, w2 = AH // 2, AW // 2
            shifts = []
            for (yy, xx) in ((0, 0), (0, w2), (h2, 0), (h2, w2)):
                dy, dx, pk = phase_shift(y[yy:yy + h2, xx:xx + w2], gray_prev[yy:yy + h2, xx:xx + w2])
                shifts.append((dy, dx, pk))
            mags = [np.hypot(dy, dx) for dy, dx, _ in shifts]
            row.update(diff=diff, motion=float(np.median(mags)), motion_max=float(max(mags)),
                       peak=float(np.mean([s[2] for s in shifts])))
        rows.append(row)
        gray_prev = y
    return rows


def loudness(path):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-filter_complex",
                        "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    t = p.stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", t)
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", t)
    return (float(I[-1]) if I else None), (float(tp[-1]) if tp else None)


def silences_audio(path, noise="-35dB", d=0.3):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                        f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
                       capture_output=True, text=True)
    return len(re.findall(r"silence_end", p.stderr))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--words")
    ap.add_argument("--meta")
    ap.add_argument("--json")
    ap.add_argument("--crop", help="w:h:x:y en píxeles del vídeo original (grabaciones de pantalla)")
    a = ap.parse_args()
    global CROP, AW, AH
    if a.crop:
        CROP = a.crop
        w, h = [int(v) for v in a.crop.split(":")[:2]]
        AW = 270; AH = int(round(270 * h / w / 2) * 2)

    res = ffprobe(a.video)
    rows = analyse_frames(a.video)
    n = len(rows)
    res["fotogramas_analizados"] = n

    diffs = np.array([r.get("diff", 0) for r in rows])
    mot = np.array([r.get("motion", 0) for r in rows])
    # corte duro: salto de diferencia muy por encima de la vecindad y correlación baja
    cuts = []
    for i in range(1, n):
        local = np.median(diffs[max(1, i - 5):i + 6])
        if diffs[i] > 25 and diffs[i] > 4 * max(local, 1) and rows[i]["peak"] < 0.08:
            cuts.append(round(i / FPS, 2))
    res["cortes_duros"] = len(cuts)
    res["cortes_duros_t"] = cuts

    moving = mot > 0.04  # px a 540x960
    moving[0] = moving[1] if n > 1 else False
    res["pct_camara_en_movimiento"] = round(100 * moving.mean(), 1)
    segs, run = [], 0
    for m in moving:
        if m:
            run += 1
        elif run:
            segs.append(run)
            run = 0
    if run:
        segs.append(run)
    res["movimientos"] = len(segs)
    res["duracion_media_movimiento_s"] = round(np.mean(segs) / FPS, 2) if segs else 0

    secs = max(1, int(np.ceil(n / FPS)))
    per_s = []
    for s in range(secs):
        ch = rows[s * FPS:(s + 1) * FPS]
        if ch:
            per_s.append({"s": s, "brillo": round(np.mean([r["Y"] for r in ch]), 1),
                          "contraste": round(np.mean([r["C"] for r in ch]), 1),
                          "saturacion": round(np.mean([r["S"] for r in ch]), 3)})
    res["por_segundo"] = per_s
    res["brillo_medio"] = round(float(np.mean([r["Y"] for r in rows])), 1)
    res["contraste_medio"] = round(float(np.mean([r["C"] for r in rows])), 1)
    res["saturacion_media"] = round(float(np.mean([r["S"] for r in rows])), 3)

    if a.meta:
        meta = json.load(open(a.meta))
        res["primer_texto_s"] = meta.get("primer_texto_s")
        res["subtitulo_altura_letra_pct"] = meta.get("subtitulo_altura_letra_pct")
        res["subtitulo_centro_y_pct"] = meta.get("subtitulo_centro_y_pct")
        res["texto_bajo_20pct_inferior"] = meta.get("texto_bajo_20pct_inferior")
        res["texto_en_margen_derecho"] = meta.get("texto_en_margen_derecho")
    else:
        first = None
        for r in rows:
            if (r["edge_rows"] > 0.06).sum() > 8:
                first = round(r["i"] / FPS, 2)
                break
        res["primer_texto_s_aprox"] = first
        acc = np.zeros(AH)
        for r in rows:
            acc += r["edge_rows"] > 0.06
        band = np.where(acc > 0.3 * n)[0]
        if len(band):
            res["subtitulo_banda_y_pct_aprox"] = [round(100 * band.min() / AH, 1), round(100 * band.max() / AH, 1)]

    if a.words:
        w = json.load(open(a.words))
        dur_speech = (w[-1][2] - w[0][1]) / 1000
        res["palabras"] = len(w)
        res["palabras_por_s"] = round(len(w) / dur_speech, 2)
        gaps = [(w[i + 1][1] - w[i][2]) / 1000 for i in range(len(w) - 1)]
        res["silencios_mas_0_3s"] = sum(g > 0.3 for g in gaps)
        res["hueco_max_s"] = round(max(gaps), 2) if gaps else 0
        res["voz_empieza_s"] = round(w[0][1] / 1000, 2)
    res["silencios_audio_mezcla"] = silences_audio(a.video)
    res["lufs_integrado"], res["pico_verdadero_dbtp"] = loudness(a.video)

    out = {k: v for k, v in res.items() if k != "por_segundo"}
    print(json.dumps(out, indent=1, ensure_ascii=False))
    if a.json:
        json.dump(res, open(a.json, "w"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    sys.exit(main())
