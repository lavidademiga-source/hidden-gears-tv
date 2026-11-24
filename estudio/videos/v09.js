// V09 · Plug prong holes (error famoso · salón de casa · travelling · mito contra realidad · paleta office)
const { C, clamp, lerp, ease, easeOut, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T } = require('./_common');
const room = g => { grad('#DDE8D5', '#BFD3B8')(g); g.fillStyle = '#C9A27A'; g.fillRect(-900, 250, 1800, 1400); A.rrect(g, -700, -1300, 360, 520, 20); A.ink(g, '#F6EBD6', 5); };
const mint = grad('#1F4037', '#4E8C7A');

function stamp(ctx, txt, x, y, color, k, rot) { const s = lerp(2, 1, easeOut(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2); A.rrect(ctx, -250, -80, 500, 160, 24); ctx.lineWidth = 14; ctx.strokeStyle = color; ctx.stroke(); ctx.fillStyle = color; ctx.font = '800 96px Bricolage'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 6); ctx.restore(); }

module.exports = (words) => ({
  id: 'v09', words, grade: { b: 0.83, s: 1.2 }, motionBoost: 2.6,
  title: { lines: ['WHY DO PLUG PRONGS', 'HAVE *HOLES*?'], until: 2.4 },
  shots: [
    { w: 0, bg: room, light: 'warm', cam: [{ x: 0, y: -560, z: 1.2 }, { x: 0, y: -500, z: 1.0 }], draw(ctx, { t }) { B.plug(ctx, 0, -380, 1.1, { glowHoles: 1, t }); } },
    { w: 6, bg: room, light: 'warm', enter: [1, 0], cam: [{ x: -200, y: -480, z: 1.0 }, { x: 160, y: -480, z: 1.0 }],
      draw(ctx, { t }) { A.rrect(ctx, -520, -760, 220, 360, 30); A.ink(ctx, '#F2C14E'); A.rrect(ctx, -430, -400, 40, 300, 10); A.ink(ctx, '#8C93A8'); ctx.beginPath(); ctx.moveTo(-410, -100); ctx.bezierCurveTo(-300, 40, -40, 0, 120, -100); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke(); B.plug(ctx, 200, -380, 0.8, { glowHoles: 1, t }); popLabel(ctx, t, 1.3, '2 PRONGS · 2 HOLES', 160, -880, { size: 50, bg: C.key }); } },
    { w: 16, bg: mint, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -480, z: 1.05 }, { x: 0, y: -480, z: 1.15 }], draw(ctx, { t }) { popNumber(ctx, t, 0.0, '3', 0, -620, 300, C.key); for (let i = 0; i < 3; i++) popNumber(ctx, t, 0.4 + i * 0.25, '?', -300 + i * 300, -880 + (i % 2) * 60, 120, C.cream); popLabel(ctx, t, 0.8, 'ANSWERS ONLINE', 0, -360, { size: 54, bg: C.cream }); } },
    { w: 21, bg: mint, light: 'warm', enter: [1, 0], cam: [{ x: -60, y: -500, z: 1.0 }, { x: 60, y: -480, z: 1.08 }],
      draw(ctx, { t, video, T: TT }) { stamp(ctx, 'MYTH 1', 0, -860, C.coral, clamp(t * 3), -0.06); B.plug(ctx, 0, -380, 0.8, { t }); popLabel(ctx, t, 0.6, 'SAVES METAL?', 0, -330, { size: 54, bg: C.cream }); if (TT >= T(video, 26)) { cross(ctx, 0, -470, 140, clamp((TT - T(video, 26)) * 3)); popLabel(ctx, TT - T(video, 26), 0.2, 'NO PROOF', 260, -620, { size: 52, bg: C.coral }); } } },
    { w: 35, bg: room, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -480, z: 1.15 }, { x: 0, y: -500, z: 1.0 }],
      draw(ctx, { t, video, T: TT }) { stamp(ctx, 'MYTH 2', 0, -940, C.coral, clamp(t * 3), 0.05); B.outlet(ctx, 0, -460, 0.85, { bumps: TT >= T(video, 44) ? 1 : 0 }); if (TT >= T(video, 42)) popLabel(ctx, TT - T(video, 42), 0.05, 'HALF TRUE', 0, -330, { size: 60, bg: C.key }); } },
    { w: 56, bg: room, light: 'warm', enter: [1, 0], cam: [{ x: 80, y: -480, z: 1.1 }, { x: -60, y: -480, z: 1.0 }], draw(ctx, { t }) { B.outlet(ctx, 0, -460, 0.85, { bumps: 0 }); popLabel(ctx, t, 0.6, 'TODAY: FRICTION', 0, -330, { size: 56, bg: C.teal }); } },
    twist(66, ['#A3C9A8', C.brass, '#84B59F']),
    { w: 75, bg: mint, light: 'night', enter: [1, 0], cam: [{ x: -100, y: -480, z: 1.0 }, { x: 100, y: -500, z: 1.1 }],
      draw(ctx, { t, video, T: TT }) { A.rrect(ctx, -330, -920, 660, 760, 20); A.ink(ctx, '#FFF8E7'); ctx.fillStyle = C.ink; ctx.font = '800 56px Bricolage'; ctx.textAlign = 'center'; ctx.fillText('PLUG STANDARD', 0, -830); for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(27,27,47,0.25)'; ctx.fillRect(-260, -760 + i * 50, 520 - (i % 2) * 120, 14); }
        popLabel(ctx, t, 0.6, 'HOLE: OPTIONAL', 0, -400, { size: 54, bg: C.key }); if (TT >= T(video, 83)) popLabel(ctx, TT - T(video, 83), 0.3, 'FOR MANUFACTURING', 0, -330, { size: 50, bg: C.teal }); } },
    { w: 91, bg: grad('#232526', '#414345'), light: 'night', enter: [0, 1], cam: [{ x: 0, y: -520, z: 1.2 }, { x: 0, y: -480, z: 1.0 }],
      draw(ctx, { t, video, T: TT }) { const mold = TT >= T(video, 98); B.robotGripper(ctx, 0, -490, 0.9, ease(clamp(t * 1.5)), t); ctx.save(); ctx.globalAlpha = mold ? ease(clamp((TT - T(video, 98)) * 2)) : 0; B.plug(ctx, 0, -230, 0.8, { t }); ctx.restore(); if (!mold) { for (const sx of [-1, 1]) { A.rrect(ctx, sx * 56 - 18, -520, 36, 180, 8); A.ink(ctx, '#D9DCE3', 5); A.ell(ctx, sx * 56, -480, 11, 11); A.ink(ctx, '#2A2E45', 3); } } popLabel(ctx, t, 0.5, 'GRIPPED BY THE HOLES', 0, -330, { size: 48, bg: C.key }); } },
    { w: 105, bg: room, light: 'warm', enter: [-1, 0], cam: [{ x: -80, y: -480, z: 1.0 }, { x: 80, y: -480, z: 1.1 }], draw(ctx, { t }) { B.plug(ctx, -80, -380, 0.9, { tag: ease(clamp(t * 1.5)), t }); popLabel(ctx, t, 0.3, 'BONUS', -300, -880, { size: 60, bg: C.key }); } },
    { w: 115, bg: room, light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -500, z: 1.0 }, { x: 0, y: -560, z: 1.2 }], draw(ctx, { t }) { B.plug(ctx, 0, -380, 1.1, { glowHoles: 1, t }); A.pip(ctx, 330, -860, 85, { t, arm: 'point', pointAt: -2.0, mouth: 'smile' }); } },
  ],
});
