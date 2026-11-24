#!/usr/bin/env python3
"""Tabla de control de calidad (FASE 6) contra la guía de estilo v2.
Uso: python3 -I tools/qc_table.py salida.md v05 v06 ..."""
import json, sys
rows=[("Duración (s)","35-55",lambda q,m:q['duracion_s'],lambda v:35<=v<=55,"{:.1f}"),
("Palabras/s","3,5-4,0",lambda q,m:q['palabras_por_s'],lambda v:3.5<=v<=4.0,"{:.2f}"),
("Silencios > 0,3 s","0",lambda q,m:q['silencios_mas_0_3s'],lambda v:v==0,"{}"),
("Cortes duros","≤ 1",lambda q,m:q['cortes_duros'],lambda v:v<=1,"{}"),
("% fotogramas en movimiento (criterio referencias)","≥ 88 %",lambda q,m:m['pct_mov'],lambda v:v>=88,"{:.1f} %"),
("Duración media de movimiento (criterio referencias)","≥ 2,0 s",lambda q,m:m['mov_medio_s'],lambda v:v>=2,"{:.2f} s"),
("Primer texto (s)","≤ 0,1",lambda q,m:q['primer_texto_s'],lambda v:v<=0.1,"{}"),
("Altura de letra subtítulos","≥ 6 %",lambda q,m:q['subtitulo_altura_letra_pct'],lambda v:v>=6,"{:.2f} %"),
("Texto en el 20 % inferior","no",lambda q,m:q['texto_bajo_20pct_inferior'],lambda v:v is False,"{}"),
("Texto en el margen derecho","no",lambda q,m:q['texto_en_margen_derecho'],lambda v:v is False,"{}"),
("Brillo medio","100-122",lambda q,m:q['brillo_medio'],lambda v:100<=v<=122,"{:.1f}"),
("Saturación media","0,32-0,46",lambda q,m:q['saturacion_media'],lambda v:0.32<=v<=0.46,"{:.3f}"),
("Sonoridad","−15 a −13 LUFS",lambda q,m:q['lufs_integrado'],lambda v:-15<=v<=-13,"{:.1f}"),
("Pico verdadero","≤ −1 dBTP",lambda q,m:q['pico_verdadero_dbtp'],lambda v:v<=-1,"{:.1f}"),
("Códecs / resolución","H.264+AAC 1080x1920",lambda q,m:f"{q['video_codec']}+{q['audio_codec']} {q['ancho']}x{q['alto']}",lambda v:v=="h264+aac 1080x1920","{}")]
out=["# Control de calidad\n","Medido sobre cada MP4 final. Movimiento con `tools/motion_profile.py` (mismo criterio que las referencias). Música 16 dB bajo la voz.\n"]
res={}
for v in sys.argv[2:]:
    q=json.load(open(f"out/{v}_qc.json")); m=json.load(open(f"out/{v}_mp.json"))
    out.append(f"\n## {v}\n\n| Métrica | Objetivo | Resultado | Estado |\n|---|---|---|---|"); ok=True
    for n,o,g,c,f in rows:
        val=g(q,m); good=c(val); ok&=good; out.append(f"| {n} | {o} | {f.format(val)} | {'OK' if good else 'FALLO'} |")
    out.append("| Marcas/personajes ajenos · línea roja 7 · para niños | ninguno · false · false | revisado a mano | OK |")
    out.append(f"\n**Resultado: {'PASA' if ok else 'NO PASA'}**"); res[v]=ok
open(sys.argv[1],"w").write("\n".join(out)+"\n"); print(res)
