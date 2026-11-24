// V07 · QR code squares (cifra imposible · fábrica/pantalla · despiece · cuenta atrás · paleta office)
const { C, clamp, lerp, ease, easeOut, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T } = require('./_common');
const ice = spots('#CDEBDD', '#F4F1E4', '#7FB79F');
const deep = grad('#1F4037', '#3E7C6A');

module.exports = (words) => ({
  id: 'v07', words, grade: { b: 0.84, s: 1.15 },
  title: { lines: ['THE 3 SQUARES ON', 'EVERY *QR CODE*'], until: 2.6 },
  shots: [
    { w: 0, bg: ice, light: 'warm', cam: [{ x: 0, y: -500, z: 1.15 }, { x: 0, y: -470, z: 0.98 }], draw(ctx, { t }) { B.qrCode(ctx, 0, -480, 620, { glowFinders: 0.6 + 0.4 * Math.sin(t * 4), t }); popLabel(ctx, t, 1.4, 'NOT DECORATION', 0, -330, { size: 56, bg: C.key }); } },
    { w: 11, bg: ice, light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -480, z: 1.0 }, { x: 0, y: -500, z: 1.2 }],
      draw(ctx, { t, video, T: TT }) { B.qrCode(ctx, 0, -480, 620, { rot: Math.sin(t) * 0.08, glowFinders: TT >= T(video, 16) ? 1 : 0, missing: TT >= T(video, 24) ? 1 : 0, t }); if (TT >= T(video, 24)) popLabel(ctx, TT - T(video, 24), 0.05, 'NOT HERE', 230, -330, { size: 52, bg: C.coral }); } },
    twist(28, ['#9DB8D9', C.brass, '#BDE0FE']),
    { w: 35, bg: deep, light: 'night', enter: [1, 0], cam: [{ x: 0, y: -460, z: 0.95 }, { x: 0, y: -480, z: 1.1 }],
      draw(ctx, { t }) { B.phoneFrame(ctx, 0, -470, 0.78, t); B.qrCode(ctx, 0, -480, 300, { glowFinders: 1, t }); popLabel(ctx, t, 0.9, '3 THINGS', 0, -1000, { size: 64, bg: C.key }); } },
    { w: 42, bg: deep, light: 'night', enter: [0, 1], cam: [{ x: -100, y: -480, z: 1.05 }, { x: 60, y: -480, z: 1.12 }],
      draw(ctx, { t }) { popNumber(ctx, t, 0.0, '3', -330, -880, 220, C.key); const k = easeOut(clamp(t * 1.5)); B.qrCode(ctx, lerp(260, 60, k), lerp(-300, -470, k), 380, { glowFinders: 1, t }); ctx.lineWidth = 10; ctx.strokeStyle = C.teal; ctx.strokeRect(60 - 240, -470 - 240, 480, 480); popLabel(ctx, t, 0.5, 'WHERE', 60, -330, { size: 60, bg: C.teal }); } },
    { w: 48, bg: deep, light: 'night', enter: [1, 0], cam: [{ x: 60, y: -480, z: 1.12 }, { x: -40, y: -480, z: 1.02 }],
      draw(ctx, { t }) { popNumber(ctx, t, 0.0, '2', -330, -880, 220, C.key); const s = 260 + 200 * (0.5 + 0.5 * Math.sin(t * 3)); B.qrCode(ctx, 60, -470, s, { glowFinders: 1, t }); A.arrow(ctx, 60 - s / 2, -130, 60 + s / 2, -130, { color: C.teal, w: 14, head: 30 }); popLabel(ctx, t, 0.5, 'HOW BIG', 60, -330, { size: 56, bg: C.teal }); } },
    { w: 54, bg: deep, light: 'night', enter: [0, -1], cam: [{ x: -40, y: -480, z: 1.02 }, { x: 40, y: -470, z: 1.15 }],
      draw(ctx, { t }) { popNumber(ctx, t, 0.0, '1', -330, -880, 240, C.key); B.qrCode(ctx, 60, -470, 420, { glowFinders: 1, rot: Math.sin(t * 2.4) * 1.2, t }); A.arrow(ctx, 340, -380, 340, -780, { color: C.coral, w: 24, head: 46 }); popLabel(ctx, t, 0.4, 'UP', 340, -860, { size: 60, bg: C.coral }); } },
    { w: 60, bg: ice, light: 'night', enter: [1, 0], cam: [{ x: 0, y: -480, z: 0.98 }, { x: 120, y: -360, z: 1.3 }],
      draw(ctx, { t }) { B.qrCode(ctx, 0, -480, 620, { glowFinders: 1, missing: 1, t }); A.ring(ctx, 230, -250, 90, t, C.coral); popLabel(ctx, t, 1.2, 'GIVES IT AWAY', -100, -330, { size: 52, bg: C.coral }); } },
    { w: 72, bg: ice, light: 'warm', enter: [-1, 0], cam: [{ x: -200, y: -480, z: 1.05 }, { x: 200, y: -480, z: 1.05 }],
      draw(ctx, { t }) { [[-360, Math.PI / 2], [0, Math.PI], [360, -0.5]].forEach(([x, r], i) => { B.qrCode(ctx, x, -520, 280, { rot: r, glowFinders: 1, seed: 7, t }); check(ctx, x, -240, 50, clamp(t * 2 - i * 0.5)); }); } },
    { w: 85, bg: deep, light: 'night', enter: [0, 1], cam: [{ x: 0, y: -500, z: 1.25 }, { x: 0, y: -480, z: 1.0 }],
      draw(ctx, { t }) {
        const m = 70; const cx = -245, cy = -720; ctx.fillStyle = C.ink; A.rrect(ctx, cx - 30, cy - 30, 7 * m + 60, 7 * m + 60, 20); A.ink(ctx, '#FFFFFF', 6);
        ctx.fillStyle = '#1B1B2F'; ctx.fillRect(cx, cy, 7 * m, 7 * m); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(cx + m, cy + m, 5 * m, 5 * m); ctx.fillStyle = '#E85D04'; ctx.fillRect(cx + 2 * m, cy + 2 * m, 3 * m, 3 * m);
        popLabel(ctx, t, 0.6, '1 : 1 : 3 : 1 : 1', 0, -330, { size: 60, bg: C.key }); popLabel(ctx, t, 1.8, 'RARE IN TEXT', 0, -940, { size: 54, bg: C.cream });
      } },
    { w: 100, bg: grad('#3E5151', '#DECBA4'), light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -440, z: 0.95 }, { x: 0, y: -480, z: 1.15 }],
      draw(ctx, { t }) { popNumber(ctx, t, 0.0, '1994', 0, -880, 200, C.key, -0.03); B.partsBox(ctx, 0, -380, 1.0, t); B.qrCode(ctx, 0, -330, 200, { t }); popLabel(ctx, t, 1.3, 'CAR PARTS', 0, -330, { size: 56, bg: C.cream }); } },
    { w: 113, bg: ice, light: 'warm', enter: [-1, 0], cam: [{ x: 0, y: -470, z: 0.98 }, { x: 0, y: -500, z: 1.15 }], draw(ctx, { t }) { B.qrCode(ctx, 0, -480, 620, { glowFinders: 0.6 + 0.4 * Math.sin(t * 4), t }); A.pip(ctx, 330, -860, 85, { t, arm: 'thumb', mouth: 'grin' }); } },
  ],
});
