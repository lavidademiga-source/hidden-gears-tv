#!/usr/bin/env python3
"""Voz del canal: recorta pausas, ajusta tempo y devuelve marcas por palabra.

Uso: python3 -I tools/voice_pipeline.py DIR transcripcion.json [--wps 3.75]
Lee DIR/raw.wav (24 kHz mono), escribe DIR/voice.wav (48 kHz mono) y DIR/words.json
([[texto, ms_ini, ms_fin], ...] ya en la línea de tiempo final).
"""
import argparse
import json
import subprocess
import wave

import numpy as np

SR = 24000
LEAD_MS = 60  # silencio inicial: la voz arranca en el fotograma 2


def read_wav(p):
    with wave.open(p) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def write_wav(p, x, sr):
    x = np.clip(x, -1, 1)
    with wave.open(p, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def target_gap(prev_text):
    if prev_text.endswith(("...", "…")):
        return 0.24
    if prev_text.endswith((".", "?", "!")):
        return 0.16
    if prev_text.endswith((",", ":", ";")):
        return 0.09
    return 0.03


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("transcript")
    ap.add_argument("--wps", type=float, default=3.75)
    ap.add_argument("--script", help="texto del guion para marcar puntos suspensivos")
    a = ap.parse_args()

    x = read_wav(f"{a.dir}/raw.wav")
    tr = json.load(open(a.transcript))
    words = [[w["text"], w["start_ms"] / 1000, w["end_ms"] / 1000] for w in tr["words"]]
    if a.script:
        # recupera '...' del guion (la transcripción los pierde) para alargar esa pausa
        toks = a.script.split()
        j = 0
        for t in toks:
            if t.endswith("...") and j < len(words):
                core = t.strip(".").lower()
                for k in range(j, len(words)):
                    if words[k][0].strip(".,?!").lower() == core:
                        words[k][0] = words[k][0].rstrip(".,") + "..."
                        j = k + 1
                        break

    # 1) recorta huecos: se conserva el borde de cada palabra y se quita el centro del hueco
    pieces, new_words, t_out = [], [], 0.0
    pad = 0.04
    for i, (txt, s, e) in enumerate(words):
        s0 = max(0.0, s - pad) if i == 0 else None
        if i == 0:
            seg_start = s0
        nxt = words[i + 1][1] if i + 1 < len(words) else len(x) / SR
        gap = max(0.0, nxt - e)
        keep = min(gap, target_gap(txt)) if i + 1 < len(words) else min(gap, 0.25)
        seg_end = e + keep
        pieces.append((seg_start, seg_end))
        new_words.append([txt, t_out + (s - seg_start), t_out + (e - seg_start)])
        t_out += seg_end - seg_start
        seg_start = nxt - min(0.0, 0) if i + 1 < len(words) else None
        if i + 1 < len(words):
            seg_start = nxt  # empieza justo en la siguiente palabra
    fade = int(0.008 * SR)
    out = []
    for (s, e) in pieces:
        seg = x[int(s * SR):int(e * SR)].copy()
        if len(seg) > 2 * fade:
            seg[:fade] *= np.linspace(0, 1, fade)
            seg[-fade:] *= np.linspace(1, 0, fade)
        out.append(seg)
    y = np.concatenate(out)
    write_wav(f"{a.dir}/trim.wav", y, SR)

    # 2) tempo para llegar a las palabras/s objetivo
    speech = new_words[-1][2] - new_words[0][1]
    wps_now = len(new_words) / speech
    tempo = float(np.clip(a.wps / wps_now, 0.9, 1.35))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{a.dir}/trim.wav", "-af",
                    f"adelay={LEAD_MS},atempo={tempo:.4f},aresample=48000,highpass=f=70,"
                    "acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2",
                    "-ac", "1", f"{a.dir}/voice.wav"], check=True)
    final = [[w[0], round((w[1] / tempo) * 1000 + LEAD_MS), round((w[2] / tempo) * 1000 + LEAD_MS)]
             for w in new_words]
    json.dump(final, open(f"{a.dir}/words.json", "w"), ensure_ascii=False)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
                                "csv=p=0", f"{a.dir}/voice.wav"], capture_output=True, text=True).stdout)
    gaps = [(final[i + 1][1] - final[i][2]) / 1000 for i in range(len(final) - 1)]
    print(json.dumps({"palabras": len(final), "wps_antes": round(wps_now, 2), "tempo": round(tempo, 3),
                      "wps_final": round(len(final) / ((final[-1][2] - final[0][1]) / 1000), 2),
                      "duracion_voz_s": round(dur, 2), "hueco_max_s": round(max(gaps), 2)}))
    for i, w in enumerate(final):
        print(i, w[0], w[1], end=" | ")
    print()


if __name__ == "__main__":
    main()
