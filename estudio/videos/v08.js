// V08 · Soda can dome (antes/después · exterior de verano · órbita · lineal · paleta garage)
const { C, clamp, lerp, ease, easeOut, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T } = require('./_common');
const summer = g => { grad('#7FD8F7', '#E9F8FF')(g); g.fillStyle = '#7CC36E'; g.fillRect(-900, 200, 1800, 1500); A.cloud(g, -400, -900, 140, '#FFFFFF'); A.cloud(g, 380, -1150, 110, '#FFFFFF'); };
const steel = grad('#3A3A46', '#8E2C2C');

module.exports = (words) => ({
  id: 'v08', words,
  title: { lines: ['A SODA CAN IS AS', 'THIN AS *PAPER*'], until: 2.6 },
  shots: [
    { w: 0, bg: summer, light: 'warm', cam: [{ x: 0, y: -460, z: 1.0, r: -0.04 }, { x: 0, y: -480, z: 1.15, r: 0.03 }], draw(ctx, { t }) { B.sodaCan(ctx, 0, -470, 0.85, { t }); popLabel(ctx, t, 1.2, '~0.1 mm WALL', 0, -330, { size: 56, bg: C.key }); } },
    { w: 10, bg: summer, light: 'warm', enter: [1, 0], cam: [{ x: 60, y: -480, z: 1.15, r: 0.04 }, { x: -40, y: -470, z: 1.05, r: -0.03 }], draw(ctx, { t }) { B.sodaCan(ctx, 0, -470, 0.85, { t, wobble: 0.6 }); popNumber(ctx, t, 0.5, '?', 330, -880, 200, C.key); } },
    { w: 15, bg: steel, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -480, z: 1.05, r: -0.05 }, { x: 0, y: -470, z: 1.15, r: 0.05 }], draw(ctx, { t }) { B.sodaCan(ctx, 0, -470, 0.85, { t, pressure: 1 }); popLabel(ctx, t, 0.9, '90 PSI', 0, -940, { size: 80, bg: C.key }); } },
    { w: 27, bg: steel, light: 'warm', enter: [1, 0], cam: [{ x: -80, y: -480, z: 1.0 }, { x: 80, y: -480, z: 1.05 }],
      draw(ctx, { t }) { B.tire(ctx, -230, -470, 0.9, t * 0.8); B.sodaCan(ctx, 250, -470, 0.6, { t, pressure: 0.7 }); popNumber(ctx, t, 0.6, '3X', 0, -880, 170, C.key); popLabel(ctx, t, 1.0, '~32 PSI', -230, -330, { size: 50, bg: C.cream }); } },
    { w: 34, bg: summer, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -380, z: 1.0, r: 0.05 }, { x: 0, y: -260, z: 1.3, r: -0.04 }],
      draw(ctx, { t, p }) { const f = ease(clamp(p * 2)); ctx.save(); ctx.translate(0, -470); ctx.rotate(Math.PI * f); B.sodaCan(ctx, 0, 0, 0.85, { t, cut: clamp(p * 2 - 0.8) }); ctx.restore(); popLabel(ctx, t, 2.6, 'DOME', 230, -900, { size: 70, bg: C.key }); } },
    twist(49, ['#C0C4D6', C.brass, '#E76F51']),
    { w: 57, bg: steel, light: 'night', enter: [1, 0], cam: [{ x: 0, y: -460, z: 1.0, r: -0.05 }, { x: 0, y: -440, z: 1.12, r: 0.05 }],
      draw(ctx, { t, video, T: TT }) { const wob = TT >= T(video, 63) ? 1 : 0; B.sodaCan(ctx, 0, -500, 0.8, { t, bulge: ease(clamp(t * 1.5)), wobble: wob, pressure: 0.6 }); popLabel(ctx, t, 0.5, 'FLAT BOTTOM?', 0, -940, { size: 58, bg: C.coral }); cross(ctx, 300, -880, 50, clamp(t - 1)); } },
    { w: 69, bg: grad('#5D4157', '#A8CABA'), light: 'night', enter: [0, 1], cam: [{ x: 0, y: -500, z: 0.95 }, { x: 0, y: -470, z: 1.12 }],
      draw(ctx, { t }) { B.stoneArch(ctx, 0, -500, 0.85, clamp(t), t); popLabel(ctx, t, 0.7, 'ARCH', 0, -940, { size: 70, bg: C.key }); check(ctx, 320, -180, 60, clamp(t * 1.5 - 2.5)); } },
    { w: 84, bg: steel, light: 'night', enter: [1, 0], cam: [{ x: 0, y: -300, z: 1.35, r: 0.04 }, { x: 0, y: -440, z: 1.0, r: -0.04 }],
      draw(ctx, { t, video, T: TT }) { ctx.save(); ctx.translate(0, -470); ctx.rotate(Math.PI); B.sodaCan(ctx, 0, 0, 0.85, { t, cut: 1 }); ctx.restore(); popLabel(ctx, t, 0.6, 'LESS METAL', -200, -900, { size: 54, bg: C.cream }); if (TT >= T(video, 93)) popLabel(ctx, TT - T(video, 93), 0.05, '3X THICKER', 200, -330, { size: 58, bg: C.key }); } },
    { w: 105, bg: grad('#5D4157', '#A8CABA'), light: 'warm', enter: [-1, 0], cam: [{ x: -160, y: -470, z: 1.0 }, { x: 160, y: -470, z: 1.0 }],
      draw(ctx, { t }) { B.stoneArch(ctx, -220, -480, 0.55, 0.6, t); ctx.beginPath(); ctx.moveTo(140, -260); ctx.quadraticCurveTo(300, -560, 460, -720); ctx.lineTo(460, -260); ctx.closePath(); A.ink(ctx, A.warmCool(ctx, 140, -720, 320, 460, '#A8957C')); B.wave(ctx, 140, -300, 0, 0, 1, 0, '#2E86AB'); popLabel(ctx, t, 0.6, 'BRIDGES', -220, -880, { size: 54, bg: C.cream }); popLabel(ctx, t, 1.2, 'DAMS', 300, -880, { size: 54, bg: C.cream }); } },
    { w: 112, bg: summer, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -480, z: 1.15, r: 0.03 }, { x: 0, y: -460, z: 1.0, r: -0.04 }], draw(ctx, { t }) { B.sodaCan(ctx, 0, -470, 0.85, { t }); A.pip(ctx, -330, -860, 85, { t, arm: 'point', pointAt: -0.5, mouth: 'grin' }); } },
  ],
});
