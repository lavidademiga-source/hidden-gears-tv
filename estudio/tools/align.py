#!/usr/bin/env python3
"""Alinea el guion (texto con la puntuación buena) con las marcas de la transcripción.
Uso: python3 -I tools/align.py script.txt compact.txt out_transcript.json
compact.txt: 'palabra ini fin|palabra ini fin|...' (ms) copiado de audio.transcribe."""
import json, re, sys
script = open(sys.argv[1]).read().split()
tr = []
for it in open(sys.argv[2]).read().strip().split("|"):
    t, s, e = it.rsplit(" ", 2); tr.append((t, int(s), int(e)))
norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower().replace(",", ""))
# fusiona/parte por letras: recorre ambos con cadenas acumuladas
out, j, buf_s = [], 0, None
i = 0
while i < len(script):
    target = norm(script[i]); acc = ""; s0 = tr[j][1]; e0 = tr[j][2]
    while j < len(tr) and len(acc) < len(target):
        acc += norm(tr[j][0]); e0 = tr[j][2]; j += 1
    if acc != target:
        # número escrito en cifras en la transcripción o palabra partida al revés: acepta y sigue
        print("aviso:", script[i], "<->", acc, file=sys.stderr)
    out.append({"text": script[i], "start_ms": s0, "end_ms": e0}); i += 1
assert j == len(tr), f"sobran palabras de la transcripción: {tr[j:]}"
json.dump({"words": out}, open(sys.argv[3], "w"))
print(len(out), "palabras alineadas")
