# Guía de estilo numérica · v2 (medida, 24 nov 2026)

Fuente: 15 Shorts de referencia del nicho (grabaciones de pantalla en /referencias, 384x848, interfaz recortada),
medidos con `tools/measure.py` y `tools/motion_profile.py` sobre todos los fotogramas a 30 fps.
Canales: Zack D. Films (8), NYKentertain (4), ZeckFelms (2), Jared Owen (1). Tabla completa: referencias/medidas/resumen.md.
Límites de la muestra: ref02 sin voz; ref08 con tramo a velocidad 2x (fuera de duración); ref05 y ref15 con doblaje automático;
5 duran menos de 30 s. Sin transcripción todavía: palabras/s y silencios siguen con el valor por defecto.

| Métrica | Referencias: mediana (p25-p75) | Objetivo Hidden Gears | Semana 1 (nuestros) |
|---|---|---|---|
| Duración (s) | 27,0 (23,9-32,7); válidos ≥ 30 s: 33,6 (31,6-34,7) | **31-35 s** (≈ 115 palabras) | 35,5-37,5 → recortar |
| Palabras/s | sin medir (falta transcripción) | 3,5-4,0 (por defecto) | 3,55 |
| Silencios > 0,3 s | sin medir | 0 | 0 |
| % fotogramas con movimiento | 85,2 (81,7-89,7) | **≥ 88 %** (por encima de la mediana) | 91,7-95,1 ✔ |
| Duración media de cada movimiento (s) | 2,3 (1,8-4,2) | **2,0-4,0 s** | 3,9-7,0 → más eventos visuales |
| Nueva acción/plano cada | ≈ 2-4 s (inspección visual) | **2,5-3,5 s** | 3,0-4,0 |
| Brillo medio (0-255) | 110,7 (99,4-122,4) | **100-122** | 82-113 → subir escenas nocturnas |
| Contraste medio | 45,9 (43,1-52,6) | 43-53 | 40-46 ✔ |
| Saturación media | 0,36 (0,30-0,45) | 0,32-0,46 | 0,37-0,48 ✔ (límite alto) |
| Subtítulos | 1-3 palabras, blanco con contorno, ~3,5 % del alto, centro ~77 % de la pantalla | 2-3 palabras, ≥ 6 % del alto (regla FASE 5), centro 68,5 % | ✔ |
| Primer fotograma | en plena acción; a veces rótulo grande (ref09) | acción + título 2 líneas | ✔ |
| Sonoridad | no medible en grabación de pantalla | −14 LUFS | −14 ✔ |

## Cambios para la semana 2 (con datos)
1. Duración 35-37 s → 31-35 s (≈ 115 palabras): la mediana de los válidos es 33,6 s.
2. Brillo de escenas «noche»: multiplicador de luz 0,42 → 0,28 para que el brillo medio quede en 100-122 (V03 dio 82).
3. Un evento visual nuevo (zoom, pieza que entra, etiqueta) cada ~2 s dentro de cada plano, para bajar el movimiento medio de 4-7 s a 2-4 s.
