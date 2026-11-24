#!/usr/bin/env python3
"""Resume las medidas de /referencias en mediana y p25-p75 -> biblia/estilo.md (FASE 1, paso 4).
Uso: python3 -I tools/style_from_refs.py referencias/medidas/*.json"""
import json, sys
import numpy as np
KEYS = ["duracion_s", "palabras_por_s", "silencios_mas_0_3s", "cortes_duros", "pct_camara_en_movimiento",
        "duracion_media_movimiento_s", "brillo_medio", "contraste_medio", "saturacion_media",
        "primer_texto_s_aprox", "lufs_integrado"]
rows = [json.load(open(p)) for p in sys.argv[1:]]
print("| Métrica | Mediana | p25-p75 | n |\n|---|---|---|---|")
for k in KEYS:
    v = np.array([r[k] for r in rows if r.get(k) is not None], float)
    if len(v):
        print(f"| {k} | {np.median(v):.2f} | {np.percentile(v,25):.2f}-{np.percentile(v,75):.2f} | {len(v)} |")
