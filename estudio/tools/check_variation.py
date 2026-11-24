#!/usr/bin/env python3
"""REGLA DE VARIACIÓN: el candidato debe cambiar >= 3 de 5 variables frente a cada uno de los últimos 10.
Uso: python3 -I tools/check_variation.py biblia/registro.csv gancho escenario coreografia estructura paleta"""
import csv, sys
VARS = ["gancho", "escenario", "coreografia", "estructura", "paleta"]
reg = list(csv.DictReader(open(sys.argv[1])))[-10:]
cand = dict(zip(VARS, sys.argv[2:7]))
ok = True
for r in reg:
    changed = sum(r[v] != cand[v] for v in VARS)
    if changed < 3:
        ok = False
        print(f"FALLO frente a {r['id']}: solo cambian {changed}/5")
print("OK" if ok else "NO CUMPLE", f"(comparado con {len(reg)} vídeos)")
sys.exit(0 if ok else 1)
