// V02 · The second hole on a padlock (cuenta atrás · exterior invernal · despiece · paleta arctic)
const { C, clamp, lerp, ease, easeOut, easeBack } = require('../engine/core');
const A = require('../engine/art');

function winterBg(g) {
  A.skyGrad(g, '#9FD3F0', '#E8F6FF');
  g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(0, 1300, 1400, 600, 0, 0, Math.PI * 2); g.fill();
  for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(i * 260, 700); g.lineTo(i * 260 - 120, 1100); g.lineTo(i * 260 + 120, 1100); g.closePath(); g.fillStyle = '#5E8FA8'; g.fill(); }
  A.fence(g, 400, '#7B8FA6');
}
function coldBg(g) { const gr = g.createLinearGradient(0, -1500, 0, 1500); gr.addColorStop(0, '#1B3B5F'); gr.addColorStop(1, '#3E7FA8'); g.fillStyle = gr; g.fillRect(-900, -1600, 1800, 3200); }

module.exports = (words) => ({
  id: 'v02', words,
  title: { lines: ['THIS HOLE ISN\'T', 'FOR THE *KEY*'], until: 3.0 },
  shots: [
    { // 0 · gancho: candado colgado en una verja nevada
      w: 0, bg: winterBg, bgColor: '#CFEAF8', light: 'warm', cam: [{ x: 0, y: -120, z: 0.85 }, { x: 0, y: -40, z: 1.12 }],
      draw(ctx, { t, p }) {
        A.snow(ctx, t, 60, 4);
        ctx.save(); ctx.translate(0, -470); ctx.rotate(Math.sin(t * 1.6) * 0.05); A.padlock(ctx, 0, 0, 0.8, { t, glowHole: 1 }); ctx.restore();
      },
    },
    { // 1 · dale la vuelta: hay un segundo agujero y ninguna llave entra
      w: 13, bg: coldBg, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -420, z: 0.95 }, { x: 60, y: -200, z: 1.3 }],
      draw(ctx, { t, p }) {
        const flip = easeBack(clamp(p * 2.2));
        ctx.save(); ctx.translate(0, -520); ctx.rotate(lerp(0, -0.35, flip)); A.padlock(ctx, 0, 0, 0.9, { t, glowHole: p > 0.35 ? 1 : 0 }); ctx.restore();
        if (p > 0.55) { ctx.globalAlpha = clamp((p - 0.55) * 4); A.label(ctx, 'NO KEY FITS', 260, -720, { size: 58, bg: C.coral, rot: 0.05 }); ctx.globalAlpha = 1; }
        A.pip(ctx, -320, -200, 95, { t, mouth: 'flat', brows: 1, look: [1, -0.6], blink: false });
      },
    },
    { // 2 · PLOT TWIST (firma)
      w: 35, bgColor: '#14213D', light: 'night', enter: [-1, 0], cam: [{ x: 0, y: -80, z: 0.95, r: 0.04 }, { x: 0, y: -100, z: 1.12, r: -0.04 }],
      draw(ctx, { t }) {
        A.gear(ctx, 240, -440, 300, { teeth: 12, rot: -t * 0.8, color: '#9DB8D9' });
        A.gear(ctx, -250, -160, 210, { teeth: 9, rot: t * 1.1, color: C.brass });
        A.gear(ctx, -330, -640, 130, { teeth: 7, rot: -t * 1.6, color: '#E3B35C' });
        A.pip(ctx, 0, -10, 125, { t, mouth: 'grin', arm: 'up', brows: -0.5, blink: t % 1.2 > 1.05 });
      },
    },
    { // 3 · tres trabajos, cuenta atrás · n.º 3: aceite
      w: 42, bg: coldBg, light: 'night', enter: [1, 0], cam: [{ x: -60, y: -300, z: 1.05 }, { x: 60, y: -260, z: 1.0 }],
      draw(ctx, { t, p, video }) {
        const tOil = (video.words[49][1] / 1000);
        const k = clamp((p - 0.3) * 2.5);
        ['3', '2', '1'].forEach((n, i) => { const sl = easeBack(clamp(p * 3 - i * 0.3)); ctx.globalAlpha = 1 - k * (i ? 1 : 0); A.bigNumber(ctx, n, -300 + i * 300, -800 + (1 - sl) * -300, 260, i === 0 ? C.key : C.cream); ctx.globalAlpha = 1; });
        ctx.globalAlpha = k; A.padlock(ctx, -40, -400, 0.75, { t, sep: 0.25, oil: k, glowHole: k }); ctx.globalAlpha = 1;
        if (k > 0.5) A.label(ctx, 'OIL', 300, -560, { size: 70, bg: C.key, rot: -0.05 });
      },
    },
    { // 4 · n.º 2: hielo (nieve y lluvia en la intemperie)
      w: 64, bg: winterBg, bgColor: '#CFEAF8', light: 'night', enter: [1, 0], cam: [{ x: 120, y: -200, z: 1.15 }, { x: -60, y: -260, z: 0.98 }],
      draw(ctx, { t, p }) {
        A.snow(ctx, t, 90, 6);
        A.bigNumber(ctx, '2', -300, -800, 260, C.key, -0.06);
        A.padlock(ctx, 60, -330, 0.8, { t });
        A.label(ctx, 'ICE', 300, -800, { size: 70, bg: '#BFE9FF', rot: 0.05 });
      },
    },
    { // 5 · el agua atrapada se congela y bloquea (vista en corte)
      w: 74, bg: coldBg, light: 'night', enter: [0, -1], cam: [{ x: 0, y: -250, z: 0.95 }, { x: 0, y: -150, z: 1.25 }],
      draw(ctx, { t, p }) {
        A.padlock(ctx, 0, -420, 0.9, { t, cut: 1, sep: 0.5 * ease(p), ice: clamp(p * 2), water: 1 - clamp(p * 2) });
        A.pip(ctx, -370, -200, 95, { t, mouth: 'o', brows: 1, squash: 1 + 0.05 * Math.sin(t * 40) });
      },
    },
    { // 6 · n.º 1: drenaje · la lluvia entra por el ojo de la llave
      w: 83, bg: coldBg, light: 'warm', enter: [1, 0], cam: [{ x: -80, y: -320, z: 1.0 }, { x: 40, y: -220, z: 1.2 }],
      draw(ctx, { t, p }) {
        A.rain(ctx, t, 70, 9, [-700, -1100, 1400, 1600]);
        A.bigNumber(ctx, '1', -320, -830, 260, C.key, -0.05);
        A.sparkle(ctx, -170, -900, 40, t);
        A.padlock(ctx, 60, -380, 0.8, { t, cut: clamp(p * 2 - 0.3), water: clamp(p * 2 - 0.5) });
        A.label(ctx, 'DRAINAGE', 250, -800, { size: 62, bg: C.teal, rot: 0.04 });
      },
    },
    { // 7 · la gravedad la saca por el agujerito
      w: 92, bg: coldBg, light: 'warm', enter: [0, 1], cam: [{ x: 60, y: -360, z: 1.05 }, { x: 80, y: -80, z: 1.3 }],
      draw(ctx, { t, p }) {
        A.padlock(ctx, 0, -460, 0.85, { t, cut: 1, water: 1, drain: 1, glowHole: 1 });
        A.arrow(ctx, 380, -600, 380, -200, { color: C.teal, w: 30, head: 54 });
        A.label(ctx, 'GRAVITY', 380, -720, { size: 54, bg: C.teal });
      },
    },
    { // 8 · menos óxido y ningún candado congelado
      w: 102, bg: winterBg, bgColor: '#CFEAF8', light: 'warm', enter: [-1, 0], cam: [{ x: 0, y: -300, z: 1.08 }, { x: 0, y: -240, z: 0.95 }],
      draw(ctx, { t, p }) {
        ctx.save(); ctx.globalAlpha = 0.9; A.padlock(ctx, -230, -380, 0.5, { t, rust: 1, body: '#B98A4A' }); ctx.restore();
        ctx.beginPath(); ctx.moveTo(-400, -560); ctx.lineTo(-60, -180); ctx.moveTo(-60, -560); ctx.lineTo(-400, -180); ctx.lineWidth = 24; ctx.strokeStyle = C.coral; ctx.lineCap = 'round'; ctx.stroke();
        A.padlock(ctx, 230, -400, 0.55, { t }); A.sparkle(ctx, 380, -620, 40, t); A.sparkle(ctx, 120, -260, 28, t + 1);
        A.pip(ctx, 0, 60, 100, { t, arm: 'thumb', mouth: 'grin' });
      },
    },
    { // 9 · remate y bucle: vuelve al candado de la verja
      w: 112, bg: winterBg, bgColor: '#CFEAF8', light: 'warm', enter: [0, -1], cam: [{ x: 0, y: -40, z: 1.12 }, { x: 0, y: -120, z: 0.85 }],
      draw(ctx, { t, p }) {
        A.snow(ctx, t, 60, 4);
        ctx.save(); ctx.translate(0, -470); ctx.rotate(Math.sin(t * 1.6) * 0.05); A.padlock(ctx, 0, 0, 0.8, { t, glowHole: 1 }); ctx.restore();
      },
    },
  ],
});
