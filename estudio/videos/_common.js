// Piezas compartidas de los guiones gráficos
const { C, clamp, lerp, ease, easeOut, easeBack } = require('../engine/core');
const A = require('../engine/art');
const B = require('../engine/art2');

const grad = (c1, c2) => g => { const gr = g.createLinearGradient(0, -1600, 0, 1600); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(-900, -1600, 1800, 3200); };
const spots = (c1, c2, c3) => g => { grad(c1, c2)(g); g.globalAlpha = 0.18; for (const [x, y, r] of [[-500, -900, 260], [480, -300, 200], [-420, 500, 220], [380, 1000, 260]]) A.gear(g, x, y, r, { teeth: 10, rot: x, color: c3 }); g.globalAlpha = 1; };

// plano de firma «Plot twist»: engranajes + Pip, luz de noche
function twist(w, colors = ['#9DB8D9', C.brass, '#E3B35C'], enter = [-1, 0]) {
  return {
    w, bgColor: '#1B2A4E', light: 'night', enter, cam: [{ x: 0, y: -100, z: 0.92, r: -0.05 }, { x: 0, y: -120, z: 1.14, r: 0.05 }],
    draw(ctx, { t }) {
      A.gear(ctx, -250, -470, 290, { teeth: 12, rot: t * 0.9, color: colors[0] });
      A.gear(ctx, 260, -190, 210, { teeth: 9, rot: -t * 1.2, color: colors[1] });
      A.gear(ctx, 320, -680, 130, { teeth: 7, rot: t * 1.7, color: colors[2] });
      A.pip(ctx, -10, -10, 120, { t, mouth: 'grin', arm: t > 0.6 ? 'up' : 'none', brows: -0.5, blink: t % 1.3 > 1.15 });
    },
  };
}
// etiqueta que aparece con rebote en el instante 'at'
function popLabel(ctx, t, at, txt, x, y, o = {}) { const k = B.popIn(t, at); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); A.label(ctx, txt, 0, 0, o); ctx.restore(); }
function popNumber(ctx, t, at, txt, x, y, size, color = C.key, rot = 0) { const k = B.popIn(t, at); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); A.bigNumber(ctx, txt, 0, 0, size, color, rot); ctx.restore(); }
function cross(ctx, x, y, r, k = 1) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k); ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.lineWidth = 24; ctx.strokeStyle = C.coral; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
function check(ctx, x, y, r, k = 1) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k); ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r * 0.3, y + r * 0.7); ctx.lineTo(x + r, y - r * 0.6); ctx.lineWidth = 24; ctx.strokeStyle = C.teal; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
const T = (video, i) => video.words[i][1] / 1000; // instante (s, global) de la palabra i

module.exports = { C, clamp, lerp, ease, easeOut, easeBack, A, B, grad, spots, twist, popLabel, popNumber, cross, check, T };
