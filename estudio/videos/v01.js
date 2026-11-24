// V01 · The hole in your airplane window
const { C, clamp, lerp, ease, easeOut, easeBack } = require('../engine/core');
const A = require('../engine/art');
const SKY = ['#FF9F5A', '#7A5CC2']; // paleta secundaria: dusk

function skyBg(g) { A.skyGrad(g, '#5B4BB0', '#FF9F5A'); A.cloud(g, -400, 500, 160, '#FFD3B0'); A.cloud(g, 350, 750, 200, '#FFC59C'); A.cloud(g, 200, -600, 110, '#FFE2CC'); A.cloud(g, -300, -200, 90, '#F9D2C0'); }
function cabinBg(g) {
  g.fillStyle = '#D9D2C4'; g.fillRect(-900, -1600, 1800, 3200);
  for (let i = -3; i <= 3; i++) { A.rrect(g, i * 420 - 150, 300, 300, 500, 60); A.ink(g, '#3D5A99'); A.rrect(g, i * 420 - 130, 150, 260, 200, 50); A.ink(g, '#4A6BB0'); }
  g.fillStyle = '#C2B9A8'; g.fillRect(-900, -1600, 1800, 500);
}
function sectionBg(g) { const gr = g.createLinearGradient(-800, 0, 800, 0); gr.addColorStop(0, '#1D3A6E'); gr.addColorStop(0.5, '#24477F'); gr.addColorStop(1, '#5A3E2E'); g.fillStyle = gr; g.fillRect(-900, -1600, 1800, 3200); }

module.exports = (words) => ({
  id: 'v01', words,
  title: { lines: ['YOUR PLANE WINDOW', 'HAS A *HOLE*'], until: 2.9 },
  shots: [
    { // 0 · 35,000 ft: el avión en el cielo, la cámara viaja hacia una ventanilla
      w: 0, bg: skyBg, bgColor: '#7A5CC2', light: 'warm', cam: [{ x: 0, y: -60, z: 0.78 }, { x: -140, y: -40, z: 1.25 }],
      draw(ctx, { t, p }) {
        A.cloud(ctx, 380 - t * 120, 380, 140, '#FFE0C8');
        A.plane(ctx, 0, -40 + Math.sin(t * 1.3) * 10, 0.95, t);
        A.ring(ctx, -360 + 58 * 3, -64, 40, t);
        A.label(ctx, '35,000 FT', 260, -360, { size: 60, bg: C.key, rot: -0.05 });
      },
    },
    { // 1 · mira de cerca: ventanilla desde dentro, el agujero
      w: 10, bg: cabinBg, light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -120, z: 0.9 }, { x: 0, y: 40, z: 1.32 }],
      draw(ctx, { t, p }) {
        A.cabinWindow(ctx, 0, -300, 1.0, { holeGlow: p > 0.25 ? 1 : 0, t, sky: SKY });
        A.pip(ctx, -330, 60, 105, { t, arm: 'point', pointAt: -0.35, look: [1, 0], mouth: 'o' });
      },
    },
    { // 2 · fuera -60 bajo cero, dentro el aire empuja
      w: 20, bg: sectionBg, light: 'warm', enter: [1, 0], cam: [{ x: -170, y: -120, z: 1.05 }, { x: 170, y: -120, z: 1.05 }],
      draw(ctx, { t, p, T }) {
        A.snow(ctx, t, 50, 2, [-760, -1000, 600, 1700]);
        A.paneSection(ctx, 0, -260, 0.7, { labels: false, t, pressure: clamp((p - 0.4) * 3) });
        A.thermometer(ctx, -330, -240, 0.9, '-60°F', 0.12);
        for (let j = 0; j < 3; j++) { const k = (t * 1.2 + j * 0.33) % 1; ctx.globalAlpha = clamp(p * 2 - 0.6); A.arrow(ctx, 430 - 90 * k, -420 + j * 220, 230 - 90 * k, -420 + j * 220, { color: C.coral }); ctx.globalAlpha = 1; }
        A.label(ctx, 'CABIN', 250, 120, { size: 52, bg: C.coral });
      },
    },
    { // 3 · ¿quién taladra eso?
      w: 34, bg: cabinBg, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -40, z: 1.0, r: -0.03 }, { x: 60, y: -80, z: 1.18, r: 0.03 }],
      draw(ctx, { t, p }) {
        A.cabinWindow(ctx, -60, -330, 0.9, { t, sky: SKY });
        A.drill(ctx, 330 - 120 * easeOut(p), -160, 1.0, t * 30);
        A.pip(ctx, -330, 60, 110, { t, mouth: 'o', brows: 1, look: [1, -0.5], squash: 1 + 0.08 * Math.sin(t * 12) });
      },
    },
    { // 4 · PLOT TWIST: firma (engranajes) y la luz pasa a azul noche
      w: 43, bgColor: '#14213D', light: 'night', enter: [-1, 0], cam: [{ x: 0, y: -60, z: 0.92, r: -0.05 }, { x: 0, y: -100, z: 1.12, r: 0.04 }],
      draw(ctx, { t, p }) {
        A.gear(ctx, -260, -420, 300, { teeth: 12, rot: t * 0.8, color: '#C9852E' });
        A.gear(ctx, 250, -150, 210, { teeth: 9, rot: -t * 1.1 + 0.2, color: C.brass });
        A.gear(ctx, 330, -620, 130, { teeth: 7, rot: t * 1.6, color: '#E3B35C' });
        A.pip(ctx, 0, 60, 130, { t, mouth: 'grin', blink: t % 1.2 > 1.05, arm: 'up', brows: -0.5 });
      },
    },
    { // 5 · no es un panel: son tres (despiece)
      w: 52, bg: sectionBg, light: 'night', enter: [1, 0], cam: [{ x: 0, y: -160, z: 0.95, r: 0.02 }, { x: 0, y: -120, z: 1.1, r: -0.02 }],
      draw(ctx, { t, p }) {
        ctx.save(); ctx.transform(1, -0.12, 0, 1, 0, 0);
        A.paneSection(ctx, 0, -280, 0.68, { sep: easeBack(clamp(p * 1.6 - 0.15)), t, hole: false });
        ctx.restore();
        const k = clamp(p * 2.2 - 0.9);
        if (k > 0) { ctx.globalAlpha = k; A.label(ctx, '3 PANES', 0, -900, { size: 80, bg: C.key }); ctx.globalAlpha = 1; }
      },
    },
    { // 6 · el exterior aguanta la presión; el del medio es el repuesto
      w: 59, bg: sectionBg, light: 'night', enter: [1, 0], cam: [{ x: -120, y: -140, z: 1.0 }, { x: 60, y: -140, z: 1.12 }],
      draw(ctx, { t, p }) {
        A.paneSection(ctx, 0, -280, 0.68, { sep: 0.6, t, pressure: 1, spareGlow: clamp((p - 0.5) * 3), hole: false });
        if (p > 0.55) A.label(ctx, 'SPARE', 0, -900, { size: 72, bg: C.key, rot: 0.04 });
      },
    },
    { // 7 · el agujero deja pasar el aire de cabina al hueco
      w: 72, bg: sectionBg, light: 'night', enter: [0, -1], cam: [{ x: 80, y: 60, z: 1.35 }, { x: -40, y: -120, z: 1.0 }],
      draw(ctx, { t, p }) {
        A.paneSection(ctx, 0, -280, 0.68, { sep: 0.6, t, flow: 1, pressure: clamp(p * 2 - 0.6), hole: true });
        A.ring(ctx, 0, -280 + 343 * 0.68, 50, t);
        A.pip(ctx, 340, 60, 95, { t, arm: 'point', pointAt: -2.4, look: [-1, -0.3], mouth: 'smile' });
      },
    },
    { // 8 · si el exterior falla, el repuesto toma el relevo
      w: 94, bg: sectionBg, light: 'night', enter: [1, 0], cam: [{ x: -80, y: -160, z: 1.15 }, { x: 0, y: -140, z: 0.98 }],
      draw(ctx, { t, p }) {
        A.paneSection(ctx, 0, -280, 0.68, { sep: 0.6, t, crack: clamp(p * 2), spareGlow: clamp(p * 2 - 0.5), hole: true });
        A.pip(ctx, -330, 60, 100, { t, arm: 'thumb', mouth: 'grin' });
      },
    },
    { // 9 · extra: deja salir la humedad, la vista no se empaña
      w: 104, bg: cabinBg, light: 'warm', enter: [-1, 0], cam: [{ x: 0, y: -80, z: 1.2 }, { x: 0, y: -160, z: 0.95 }],
      draw(ctx, { t, p }) {
        A.cabinWindow(ctx, 0, -320, 1.0, { fog: 1 - ease(clamp(p * 1.4 - 0.1)), t, sky: SKY, holeGlow: 1 });
        if (p > 0.6) A.label(ctx, 'NO FOG', 230, -760, { size: 60, bg: C.teal, rot: 0.06 });
      },
    },
    { // 10 · remate: vuelve al avión a 35,000 ft (bucle con el plano 1)
      w: 115, bg: skyBg, bgColor: '#7A5CC2', light: 'warm', enter: [0, 1], cam: [{ x: -140, y: -40, z: 1.25 }, { x: 0, y: -60, z: 0.78 }],
      draw(ctx, { t, p }) {
        A.cloud(ctx, 380 - t * 120, 380, 140, '#FFE0C8');
        A.plane(ctx, 0, -40 + Math.sin(t * 1.3) * 10, 0.95, t);
        A.ring(ctx, -360 + 58 * 3, -64, 40, t);
        A.label(ctx, '35,000 FT', 260, -360, { size: 60, bg: C.key, rot: -0.05 });
      },
    },
  ],
});
