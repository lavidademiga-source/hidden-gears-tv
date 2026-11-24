// V05 · Train wheels are cones (paradoja · vía de tren · grúa vertical · lineal · paleta neón)
const { C, clamp, lerp, ease, easeOut, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T } = require('./_common');
const sky = spots('#3A1C71', '#D76D77', '#FFAF7B');
const lab = grad('#16222A', '#3A6073');

function trainScene(ctx, t, p) { B.rails(ctx, -340); B.trainCar(ctx, -60 + t * 30, -560, 0.95, '#7B2FF7', t); popLabel(ctx, t, 1.2, 'CONES?', 200, -880, { size: 66, bg: '#00F5D4', rot: -0.05 }); }

module.exports = (words) => ({
  id: 'v05', words, grade: { b: 1.42, s: 1.0 },
  title: { lines: ['TRAIN WHEELS', 'ARE *CONES*'], until: 2.4 },
  shots: [
    { w: 0, bg: sky, light: 'warm', cam: [{ x: 0, y: -470, z: 1.2 }, { x: 40, y: -560, z: 0.95 }], draw(ctx, { t, p }) { trainScene(ctx, t, p); } },
    { w: 7, bg: lab, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -200, z: 0.9 }, { x: -60, y: -360, z: 1.15 }],
      draw(ctx, { t }) { B.wheelset(ctx, 0, -470, 1.05, { labels: t > 1.3, t }); A.pip(ctx, -330, -880, 80, { t, arm: 'point', pointAt: 0.9, mouth: 'o' }); } },
    { w: 20, bg: lab, light: 'warm', enter: [1, 0], cam: [{ x: 60, y: -380, z: 1.1 }, { x: -60, y: -320, z: 1.0 }],
      draw(ctx, { t }) { B.wheelset(ctx, 0, -470, 1.05, { t }); popLabel(ctx, t, 0.4, 'CONE', -280, -830, { size: 60, bg: '#00F5D4' }); popLabel(ctx, t, 0.7, 'CONE', 280, -830, { size: 60, bg: '#00F5D4' }); popLabel(ctx, t, 1.4, 'ONE STEEL AXLE', 0, -170, { size: 54, bg: C.cream }); } },
    { w: 28, bg: lab, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -260, z: 0.95 }, { x: 0, y: -400, z: 1.15 }],
      draw(ctx, { t }) {
        for (const sx of [-1, 1]) { A.gear(ctx, sx * 260, -520, 170, { teeth: 12, rot: t * 3, color: '#D6A04B' }); }
        ctx.beginPath(); ctx.moveTo(-260, -520); ctx.lineTo(260, -520); ctx.lineWidth = 40; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 26; ctx.strokeStyle = '#B9C0CF'; ctx.stroke();
        popLabel(ctx, t, 1.0, 'LOCKED', 0, -790, { size: 64, bg: C.key }); popLabel(ctx, t, 1.8, 'SAME SPEED', 0, -250, { size: 58, bg: '#00F5D4' });
      } },
    { w: 40, bg: grad('#2C3E50', '#4CA1AF'), light: 'warm', enter: [1, 0], cam: [{ x: -120, y: -300, z: 0.9 }, { x: 60, y: -360, z: 1.05 }],
      draw(ctx, { t }) { B.curveTrack(ctx, 0, -520, 0.75, 0.15, t); popNumber(ctx, t, 0.5, '?', 300, -880, 200, C.key); A.pip(ctx, -330, -860, 85, { t, mouth: 'flat', brows: 1, look: [1, -1] }); } },
    twist(48, ['#00F5D4', C.brass, '#F15BB5']),
    { w: 56, bg: lab, light: 'night', enter: [1, 0], cam: [{ x: -40, y: -420, z: 1.05 }, { x: 80, y: -400, z: 1.1 }],
      draw(ctx, { t, p }) { B.wheelset(ctx, 0, -480, 1.0, { shift: ease(clamp(p * 1.5)), t }); A.arrow(ctx, -120, -820, 200, -820, { color: C.coral }); popLabel(ctx, t, 0.6, 'CURVE', 0, -950, { size: 54, bg: C.cream }); } },
    { w: 63, bg: lab, light: 'night', enter: [0, 1], cam: [{ x: 160, y: -420, z: 1.3 }, { x: -120, y: -420, z: 1.2 }],
      draw(ctx, { t, video, T: TT }) { const inner = TT >= T(video, 71); B.wheelset(ctx, 0, -480, 1.0, { shift: 1, glowOuter: inner ? 0.3 : 1, glowInner: inner ? 1 : 0, t }); popLabel(ctx, t, 0.3, 'FAT PART', 250, -830, { size: 54, bg: C.key }); if (inner) popLabel(ctx, TT - T(video, 71), 0.1, 'THIN PART', -250, -830, { size: 54, bg: '#7FA6B8' }); } },
    { w: 79, bg: grad('#2C3E50', '#4CA1AF'), light: 'night', enter: [1, 0], cam: [{ x: 120, y: -420, z: 1.0 }, { x: 0, y: -360, z: 0.92 }],
      draw(ctx, { t, p }) { B.curveTrack(ctx, 0, -520, 0.75, ease(p), t); popLabel(ctx, t, 1.0, 'LONGER', 230, -940, { size: 56, bg: C.key }); popLabel(ctx, t, 1.6, 'SHORTER', -200, -230, { size: 52, bg: '#7FA6B8' }); } },
    { w: 93, bg: grad('#232526', '#414345'), light: 'warm', enter: [-1, 0], cam: [{ x: 0, y: -480, z: 1.1 }, { x: 0, y: -360, z: 0.95 }],
      draw(ctx, { t, video, T: TT }) {
        const trains = TT >= T(video, 102);
        if (!trains) { A.carTop(ctx, 0, -470, 0.9, { color: C.coral, t }); A.gear(ctx, 0, -360, 90, { teeth: 10, rot: t * 2, color: C.brass }); A.gear(ctx, 120, -360, 60, { teeth: 8, rot: -t * 3, color: '#E3B35C' }); popLabel(ctx, t, 0.5, 'DIFFERENTIAL', 0, -850, { size: 56, bg: C.key }); }
        else { B.wheelset(ctx, 0, -480, 0.95, { t, glowOuter: 1, glowInner: 1 }); popLabel(ctx, TT - T(video, 102), 0.05, 'JUST SHAPE', 0, -850, { size: 64, bg: '#00F5D4' }); check(ctx, 330, -230, 60, clamp((TT - T(video, 102)) * 3 - 0.5)); }
      } },
    { w: 106, bg: lab, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -440, z: 1.15 }, { x: 0, y: -400, z: 1.0 }],
      draw(ctx, { t }) { B.wheelset(ctx, 0, -480, 1.0, { shift: Math.sin(t * 5) * Math.exp(-t * 0.9), t }); popLabel(ctx, t, 1.0, 'SELF-CENTERING', 0, -850, { size: 58, bg: C.key }); } },
    { w: 116, bg: sky, light: 'warm', enter: [-1, 0], cam: [{ x: 40, y: -560, z: 0.95 }, { x: 0, y: -470, z: 1.2 }], draw(ctx, { t, p }) { trainScene(ctx, t + 2, p); } },
  ],
});
