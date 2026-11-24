// V10 · Botts' dots (cifra imposible · autopista · grúa · lineal · paleta dusk)
const { C, clamp, lerp, ease, easeOut, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T } = require('./_common');
const dusk = grad('#FF9966', '#FF5E62');

function road(ctx, t, o = {}) { B.roadTop(ctx, 0, -470, 0.75, { t, scroll: t * 0.3, ...o }); }

module.exports = (words) => ({
  id: 'v10', words, grade: { b: 1.2, s: 1.0 },
  title: { lines: ['20 MILLION *BUMPS*', 'ON PURPOSE'], until: 2.4 },
  shots: [
    { w: 0, bgColor: '#3A3F55', light: 'warm', cam: [{ x: 0, y: -300, z: 0.95 }, { x: 0, y: -520, z: 1.2 }], draw(ctx, { t }) { road(ctx, t, { glow: 0.6 }); A.carTop(ctx, 0, -460, 0.6, { color: C.coral, t }); popLabel(ctx, t, 1.0, '20,000,000', 0, -330, { size: 70, bg: C.key }); } },
    { w: 9, bg: grad('#3A3F55', '#2B2F3F'), light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -440, z: 1.0 }, { x: 0, y: -470, z: 1.25 }], draw(ctx, { t }) { B.dotMacro(ctx, 0, -470, 0.9, t); popLabel(ctx, t, 1.4, 'GLUED ON', 0, -330, { size: 56, bg: C.cream }); } },
    { w: 20, bgColor: '#3A3F55', light: 'warm', enter: [1, 0], cam: [{ x: -80, y: -500, z: 1.1 }, { x: 80, y: -480, z: 1.05 }],
      draw(ctx, { t }) { road(ctx, t); const sh = Math.sin(t * 60) * 6; A.carTop(ctx, -220 + 220 * ease(clamp(t)) + sh, -460, 0.6, { color: C.coral, t }); popLabel(ctx, t, 0.9, 'RUMBLE', 260, -880, { size: 62, bg: C.key, rot: Math.sin(t * 30) * 0.05 }); } },
    { w: 27, bg: dusk, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -480, z: 1.0 }, { x: 0, y: -500, z: 1.12 }], draw(ctx, { t }) { B.dotMacro(ctx, 0, -560, 0.6, t); popLabel(ctx, t, 0.3, "BOTTS' DOTS", 0, -880, { size: 72, bg: C.key }); popLabel(ctx, t, 1.4, 'NAMED AFTER ELBERT BOTTS', 0, -330, { size: 44, bg: C.cream }); } },
    { w: 39, bg: dusk, light: 'warm', enter: [1, 0], cam: [{ x: -60, y: -480, z: 1.05 }, { x: 60, y: -480, z: 1.12 }], draw(ctx, { t, video, T: TT }) { popNumber(ctx, t, 0.3, '1950s', 0, -700, 200, C.key, -0.03); if (TT >= T(video, 47)) popNumber(ctx, TT - T(video, 47), 0.4, '1936?', 120, -330, 150, C.cream, 0.04); } },
    twist(57, ['#FFC3A0', C.brass, '#FF7B54']),
    { w: 65, bgColor: '#3A3F55', light: 'night', enter: [1, 0], cam: [{ x: 0, y: -470, z: 1.0 }, { x: 0, y: -470, z: 1.2 }], draw(ctx, { t, p }) { road(ctx, t, { dots: 0, paint: 1 - ease(p), rainK: 1 }); popLabel(ctx, t, 0.6, 'PAINT FADES', 0, -330, { size: 56, bg: C.cream }); } },
    { w: 76, bgColor: '#3A3F55', light: 'night', enter: [0, 1], cam: [{ x: 0, y: -470, z: 1.2 }, { x: 0, y: -470, z: 1.0 }], draw(ctx, { t }) { road(ctx, t, { dots: 1, paint: 0.2, rainK: 1, glow: 1 }); popLabel(ctx, t, 0.5, 'STILL VISIBLE', 0, -330, { size: 56, bg: C.key }); } },
    { w: 85, bgColor: '#3A3F55', light: 'night', enter: [1, 0], cam: [{ x: 60, y: -480, z: 1.05 }, { x: 160, y: -460, z: 1.15 }], draw(ctx, { t, p }) { road(ctx, t, { glow: 0.5 }); const x = lerp(-100, 165, ease(clamp(p * 1.5))); A.carTop(ctx, x + Math.sin(t * 60) * (p > 0.5 ? 6 : 0), -460, 0.6, { color: '#4E6E8E', t }); popLabel(ctx, t, 1.4, 'WAKE UP!', 280, -880, { size: 62, bg: C.coral }); } },
    { w: 96, bgColor: '#3A3F55', light: 'warm', enter: [-1, 0], cam: [{ x: 0, y: -470, z: 1.0 }, { x: 0, y: -500, z: 1.2 }], draw(ctx, { t, p }) { road(ctx, t, { dots: 1 - ease(clamp(p * 1.3)), paint: 1, glow: 0 }); popLabel(ctx, t, 0.8, 'PHASING OUT', 0, -880, { size: 60, bg: C.coral }); popLabel(ctx, t, 2.6, 'REFLECTIVE PAINT', 0, -330, { size: 54, bg: C.key }); } },
    { w: 115, bgColor: '#3A3F55', light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -520, z: 1.2 }, { x: 0, y: -300, z: 0.95 }], draw(ctx, { t }) { road(ctx, t, { glow: 0.6 }); A.carTop(ctx, 0, -460, 0.6, { color: C.coral, t }); A.pip(ctx, 330, -860, 85, { t, mouth: 'smile', arm: 'wave' }); } },
  ],
});
