// V06 · Microwave door mesh (cifra imposible · cocina de noche · dolly-in · lineal · paleta neón)
const { C, clamp, lerp, ease, easeOut, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T } = require('./_common');
const kitchen = g => { grad('#3A1C71', '#5B86E5')(g); for (let i = -4; i <= 4; i++) { A.rrect(g, i * 260 - 110, -1500, 220, 220, 16); A.ink(g, '#6A5ACD', 5); } g.fillStyle = '#2E2A5A'; g.fillRect(-900, 120, 1800, 1500); g.fillStyle = '#00F5D4'; g.fillRect(-900, 80, 1800, 40); };
const dark = grad('#1A0B2E', '#4B1D6B');

function mwShot(ctx, t, o = {}) { B.microwave(ctx, 0, -520, 0.9, { t, ...o }); }

module.exports = (words) => ({
  id: 'v06', words, grade: { b: 1.89, s: 0.75 }, motionBoost: 1.8,
  title: { lines: ['YOUR MICROWAVE IS', 'FULL OF *HOLES*'], until: 2.5 },
  shots: [
    { w: 0, bg: kitchen, light: 'warm', cam: [{ x: 0, y: -470, z: 0.95 }, { x: -60, y: -500, z: 1.15 }], draw(ctx, { t }) { mwShot(ctx, t); popLabel(ctx, t, 1.1, 'ON PURPOSE', 0, -330, { size: 60, bg: C.key }); } },
    { w: 9, bg: kitchen, light: 'warm', enter: [1, 0], cam: [{ x: -60, y: -500, z: 1.2 }, { x: -120, y: -520, z: 2.4 }], draw(ctx, { t }) { mwShot(ctx, t); popLabel(ctx, t, 1.4, 'METAL MESH', -100, -790, { size: 50, bg: C.cream }); } },
    { w: 21, bg: dark, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -480, z: 1.15 }, { x: 0, y: -470, z: 0.95 }], draw(ctx, { t }) { B.meshMacro(ctx, 0, -470, 0.8, t, 1); } },
    { w: 25, bg: kitchen, light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -520, z: 1.1 }, { x: 60, y: -500, z: 1.2 }],
      draw(ctx, { t }) { mwShot(ctx, t); ctx.save(); ctx.beginPath(); ctx.rect(-360, -720, 540, 400); ctx.clip(); for (let i = 0; i < 3; i++) B.wave(ctx, -380, -640 + i * 120, 600, 40, 160, t * 8 + i, '#FF6B9E', 10); ctx.restore(); popLabel(ctx, t, 1.0, 'HEATS FOOD', 0, -330, { size: 56, bg: C.coral }); } },
    { w: 34, bg: kitchen, light: 'warm', enter: [-1, 0], cam: [{ x: 120, y: -480, z: 1.0 }, { x: 0, y: -500, z: 1.1 }],
      draw(ctx, { t }) { mwShot(ctx, t, { glow: 0.6 }); B.wave(ctx, -380, -500, 900 + t * 120, 60, 260, t * 6, '#FF6B9E', 14, 0.9); popNumber(ctx, t, 0.6, '?', 320, -880, 200, C.key); A.pip(ctx, -330, -880, 85, { t, mouth: 'o', brows: 1 }); } },
    twist(40, ['#FFB4A2', C.brass, '#E5989B']),
    { w: 47, bg: dark, light: 'night', enter: [1, 0], cam: [{ x: -100, y: -480, z: 1.05 }, { x: 100, y: -480, z: 1.05 }],
      draw(ctx, { t }) { B.wave(ctx, -460, -480, 920, 120, 460, t * 4, '#FF6B9E', 22); popLabel(ctx, t, 0.5, '12 cm', -200, -800, { size: 80, bg: C.key }); popLabel(ctx, t, 1.6, '~5 INCHES', 200, -330, { size: 60, bg: C.cream }); } },
    { w: 58, bg: dark, light: 'night', enter: [0, 1], cam: [{ x: 0, y: -460, z: 0.95 }, { x: 0, y: -480, z: 1.15 }],
      draw(ctx, { t, p }) {
        A.rrect(ctx, 120, -900, 60, 840, 10); A.ink(ctx, '#3D4160', 6); for (let k = 0; k < 14; k++) { A.ell(ctx, 150, -870 + k * 60, 10, 10); A.ink(ctx, '#FFE2A0', 3); }
        const k = (t * 0.6) % 1; const x = lerp(-500, 110, Math.min(1, k * 2)); const back = k > 0.5;
        B.wave(ctx, back ? lerp(110, -500, (k - 0.5) * 2) - 460 : x - 460, -480, 460, 110, 460, t * 4, '#FF6B9E', 20);
        popLabel(ctx, t, 0.8, 'TOO SMALL', 200, -960, { size: 56, bg: C.key }); popLabel(ctx, t, 2.4, 'BOUNCES BACK', -230, -330, { size: 52, bg: C.coral });
      } },
    { w: 78, bg: dark, light: 'night', enter: [1, 0], cam: [{ x: 0, y: -500, z: 1.15 }, { x: 0, y: -470, z: 0.98 }],
      draw(ctx, { t }) {
        A.rrect(ctx, -400, -700, 800, 60, 20); A.ink(ctx, '#FF6B9E', 6); A.label(ctx, 'WAVE', 0, -790, { size: 50, bg: C.cream });
        const k = B.popIn(t, 0.9); A.rrect(ctx, -400, -520, 80 * k, 60, 20); A.ink(ctx, C.key, 6);
        popLabel(ctx, t, 1.2, 'HOLE < 1/10', 60, -490, { size: 56, bg: C.key }); popLabel(ctx, t, 2.4, 'DESIGN RULE', 0, -330, { size: 54, bg: C.cream });
      } },
    { w: 97, bg: dark, light: 'night', enter: [0, -1], cam: [{ x: -80, y: -480, z: 1.0 }, { x: 80, y: -480, z: 1.1 }],
      draw(ctx, { t }) {
        A.rrect(ctx, 120, -900, 60, 840, 10); A.ink(ctx, '#3D4160', 6); for (let k = 0; k < 14; k++) { A.ell(ctx, 150, -870 + k * 60, 10, 10); A.ink(ctx, '#FFE2A0', 3); }
        for (let i = 0; i < 4; i++) { const x0 = ((t * 300 + i * 260) % 1200) - 700; B.wave(ctx, x0, -870 + 120 + i * 180, 220, 8, 22, t * 20, '#FFF3B0', 5); }
        popLabel(ctx, t, 0.4, 'LIGHT', -300, -800, { size: 64, bg: '#FFF3B0' }); popLabel(ctx, t, 1.8, 'SLIPS THROUGH', -200, -330, { size: 52, bg: C.teal });
      } },
    { w: 109, bg: kitchen, light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -520, z: 1.25 }, { x: -40, y: -500, z: 1.05 }], draw(ctx, { t, p }) { mwShot(ctx, t, { popcorn: p }); A.pip(ctx, 330, -860, 90, { t, mouth: 'grin', look: [-1, -1] }); } },
    { w: 120, bg: kitchen, light: 'warm', enter: [-1, 0], cam: [{ x: -60, y: -500, z: 1.15 }, { x: 0, y: -470, z: 0.95 }],
      draw(ctx, { t, video, T: TT }) { mwShot(ctx, t, { popcorn: 1 }); B.wave(ctx, -380, -600, 460, 40, 200, t * 6, '#FF6B9E', 10, 0.9); if (TT >= T(video, 129)) B.wave(ctx, 220, -440, 340, 6, 24, t * 20, '#FFF3B0', 5); popLabel(ctx, t, 0.3, 'STAYS IN', -200, -330, { size: 54, bg: C.coral }); if (TT >= T(video, 129)) popLabel(ctx, TT - T(video, 129), 0.05, 'GETS OUT', 260, -880, { size: 54, bg: '#FFF3B0' }); } },
  ],
});
