# Guía de estilo numérica (PROVISIONAL)

Estado: **valores por defecto de la FASE 1**. Aún no hay referencias medidas en /referencias.
Cuando se midan 15-20 Shorts con `tools/measure.py`, esta tabla se sustituye por mediana y p25-p75 reales. No cambiar sin datos.

| Métrica | Objetivo | Rango aceptado |
|---|---|---|
| Duración | 45 s | 35-55 s (nunca > 60) |
| Palabras/segundo | 3,7 | 3,5-4,0 |
| Silencios > 0,3 s | 0 | 0 |
| Cortes duros | 0 | ≤ 1 |
| % fotogramas con cámara en movimiento | ≥ 90 % | ≥ 85 % |
| Duración media de cada movimiento | ≥ 2,5 s | ≥ 2,0 s |
| Escena nueva cada | 4 s | 3-6 s |
| Primer texto en pantalla | fotograma 1 (0,0 s) | ≤ 0,1 s |
| Altura de letra de subtítulos | ≥ 6 % del alto (≥ 115 px) | ≥ 6 % |
| Posición de subtítulos | centro al 60 % del alto | fuera del 20 % inferior y del 18 % derecho |
| Brillo medio (Y, 0-255) | 110 | 80-150 |
| Saturación media (0-1) | 0,45 | 0,35-0,65 |
| Sonoridad integrada | −14 LUFS | −15 a −13 |
| Pico verdadero | ≤ −1 dBTP | ≤ −1 |
| Música bajo la voz | −16 dB | −12 a −18 dB |
