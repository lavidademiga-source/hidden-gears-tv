#!/usr/bin/env python3
"""Empaqueta un vídeo para el repo de publicación (FASE 7 + FASE 10).

Uso: python3 -I tools/package.py ID  -> cola/AAAA-MM-DD/{AAAA-MM-DD_1_tema.mp4, manifest.json}
Valida: JSON correcto, archivo == nombre real, url_descarga apunta al archivo, publicar_en con el
desfase de Madrid de esa fecha, sin < ni >, título <= 60, códecs y tamaño (ffprobe).
"""
import json
import os
import subprocess
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANAL = "Hidden Gears"
REPO = "lavidademiga-source/hidden-gears-tv"
CAT = "28"  # Ciencia y tecnología, fija para todo el canal

V = json.load(open(f"{ROOT}/biblia/videos.json"))


def main(vid):
    v = V[vid]
    fecha, hora, orden = v["fecha"], v["hora"], v.get("orden", 1)
    name = f"{fecha}_{orden}_{v['tema']}.mp4"
    d = f"{ROOT}/cola/{fecha}"
    os.makedirs(d, exist_ok=True)
    src = f"{ROOT}/out/{vid}_final.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-c:v", "libx264", "-preset", "slow", "-crf", "20",
                    "-maxrate", "8M", "-bufsize", "16M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", f"{d}/{name}"], check=True)
    pr = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", f"{d}/{name}"],
                                   capture_output=True, text=True).stdout)
    vs = next(s for s in pr["streams"] if s["codec_type"] == "video")
    au = next(s for s in pr["streams"] if s["codec_type"] == "audio")
    dur = float(pr["format"]["duration"]); size = int(pr["format"]["size"])
    assert vs["codec_name"] == "h264" and au["codec_name"] == "aac" and (vs["width"], vs["height"]) == (1080, 1920)
    assert dur < 60 and size < 100e6
    dt = datetime.fromisoformat(f"{fecha}T{hora}:00").replace(tzinfo=ZoneInfo("Europe/Madrid"))
    desc = v["descripcion"].strip() + "\n\n" + " ".join(v["hashtags"])
    m = {
        "canal": CANAL,
        "fecha": fecha,
        "videos": [{
            "orden": orden,
            "archivo": name,
            "url_descarga": f"https://raw.githubusercontent.com/{REPO}/main/{fecha}/{name}",
            "publicar_en": dt.isoformat(timespec="seconds"),
            "zona_horaria": "Europe/Madrid",
            "titulo": v["titulo"],
            "descripcion": desc,
            "hashtags": v["hashtags"],
            "etiquetas": v["etiquetas"],
            "categoria_id": CAT,
            "idioma": "en",
            "para_ninos": False,
            "contenido_sintetico_realista": False,
            "privacidad_hasta_publicar": "private",
            "comentario_fijado": v["comentario_fijado"],
            "duracion_s": round(dur),
        }],
    }
    txt = json.dumps(m, ensure_ascii=False, indent=2)
    assert "<" not in txt and ">" not in txt, "hay < o > en el manifest"
    assert len(v["titulo"]) <= 60, "título > 60"
    json.loads(txt)
    assert m["videos"][0]["url_descarga"].endswith("/" + fecha + "/" + name) and os.path.exists(f"{d}/{name}")
    open(f"{d}/manifest.json", "w").write(txt + "\n")
    print(json.dumps({"carpeta": fecha, "archivo": name, "publicar_en": m["videos"][0]["publicar_en"],
                      "duracion_s": round(dur, 2), "tamano_mb": round(size / 1e6, 1)}, ensure_ascii=False))


if __name__ == "__main__":
    for vid in sys.argv[1:]:
        main(vid)
