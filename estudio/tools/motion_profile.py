#!/usr/bin/env python3
"""Perfil de movimiento robusto (tolera fotogramas repetidos de grabaciones de pantalla).
Uso: python3 -I tools/motion_profile.py video.mp4 [--crop w:h:x:y] -> JSON en stdout"""
import importlib.util, json, sys, os
import numpy as np
spec = importlib.util.spec_from_file_location('m', os.path.join(os.path.dirname(__file__), 'measure.py'))
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
args = sys.argv[1:]; crop = None
if '--crop' in args:
    crop = args[args.index('--crop') + 1]; m.CROP = crop
    w, h = [int(v) for v in crop.split(':')[:2]]; m.AW = 270; m.AH = int(round(270 * h / w / 2) * 2)
rows = m.analyse_frames(args[0]); n = len(rows)
mot = np.array([r.get('motion', 0) for r in rows]); diff = np.array([r.get('diff', 0) for r in rows])
mv = mot > 0.04
# fotograma repetido: diferencia casi nula -> se hereda el estado vecino (no cuenta como parada)
dup = diff < 0.15
for i in range(1, n):
    if dup[i]: mv[i] = mv[i - 1]
# une huecos de hasta 3 fotogramas
runs, cur, gap = [], 0, 0
for v in mv:
    if v: cur += 1 + gap if cur else 1; gap = 0
    else:
        if cur and gap < 3: gap += 1
        elif cur: runs.append(cur); cur = 0; gap = 0
if cur: runs.append(cur)
# cambios de plano (cortes duros y suaves): pico de diferencia frente a la vecindad
ch = [i for i in range(2, n - 2) if diff[i] > 10 and diff[i] > 3.5 * max(np.median(diff[max(1, i - 8):i + 9]), 0.5)]
ch = [c for k, c in enumerate(ch) if k == 0 or c - ch[k - 1] > 6]
dur = n / 30
print(json.dumps({'video': os.path.basename(args[0]), 'dur': round(dur, 1), 'pct_mov': round(100 * mv[~dup | True].mean(), 1),
                  'mov_medio_s': round(np.mean(runs) / 30, 2) if runs else 0, 'cambios_plano': len(ch),
                  'plano_medio_s': round(dur / (len(ch) + 1), 2)}))
