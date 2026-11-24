// V04 · The bumps on F and J (paradoja · oficina · órbita · mito contra realidad · paleta office)
const { C, clamp, lerp, ease, easeOut, easeBack } = require('../engine/core');
const A = require('../engine/art');

function darkRoom(g) {
  g.fillStyle = '#141B33'; g.fillRect(-1200, -2000, 2400, 4000);
  A.rrect(g, -700, -1500, 520, 700, 20); A.ink(g, '#22305A'); g.fillStyle = '#F4E9C8'; g.beginPath(); g.arc(-520, -1300, 70, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 4; i++) { A.rrect(g, 200, -1500 + i * 220, 600, 30, 8); A.ink(g, '#3A4670'); for (let k = 0; k < 5; k++) { A.rrect(g, 230 + k * 110, -1600 + i * 220, 70, 100, 6); A.ink(g, ['#7A5CC2', '#2EC4B6', '#FF6B5B', '#F2A541', '#9CC5D8'][(i + k) % 5]); } }
  g.fillStyle = '#3B2B22'; g.fillRect(-1200, 200, 2400, 1800); for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(-1200, 260 + i * 120); g.lineTo(1200, 230 + i * 120); g.lineWidth = 6; g.strokeStyle = 'rgba(0,0,0,0.25)'; g.stroke(); }
  return;  g.fillStyle = '#10162A'; g.fillRect(-1200, -2000, 2400, 4000); const r = g.createRadialGradient(0, -200, 50, 0, -200, 1100); r.addColorStop(0, 'rgba(120,220,200,0.35)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(-1200, -2000, 2400, 4000); }
function officeBg(g) { g.fillStyle = '#CDEBDD'; g.fillRect(-1200, -2000, 2400, 1400); A.rrect(g, -600, -1500, 500, 700, 20); A.ink(g, '#F6EBD6'); A.rrect(g, 200, -1400, 380, 300, 20); A.ink(g, '#9CC5D8'); g.translate(0, 1400); A.desk(g); }
function mintBg(g) { const gr = g.createLinearGradient(0, -1500, 0, 1500); gr.addColorStop(0, '#2F6F62'); gr.addColorStop(1, '#173B44'); g.fillStyle = gr; g.fillRect(-1200, -2000, 2400, 4000); }

function stamp(ctx, txt, x, y, color, k, rot) {
  const s = lerp(2.2, 1, easeOut(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2);
  A.rrect(ctx, -270, -90, 540, 180, 26); ctx.lineWidth = 16; ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = color; ctx.font = '800 120px Bricolage'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 6); ctx.restore();
}
function fingers(ctx, kb, s, down, t) {
  // dedos índice sobre F y J (posiciones de keyboard(): fila 2, columnas 3 y 6)
  const fx = -760 + 3 * 150 + 40, jx = -760 + 6 * 150 + 40, ky = -20;
  for (const kx of [fx, jx]) A.finger(ctx, kb.x + kx * s, kb.y + (ky - 330 + 260 * down) * s, s * 1.1, 0);
}

module.exports = (words) => ({
  id: 'v04', words,
  title: { lines: ['FIND F AND J WITH', 'YOUR *EYES CLOSED*'], until: 2.6 },
  shots: [
    { // 0 · cierra los ojos: aún encuentras F y J (habitación a oscuras)
      w: 0, bg: darkRoom, bgColor: '#10162A', light: 'night', bgBlur: 5, cam: [{ x: -110, y: -240, z: 0.9, r: -0.07 }, { x: 90, y: -320, z: 1.2, r: 0.03 }],
      draw(ctx, { t, p }) { A.keyboard(ctx, 0, -330, 0.56, { t, glowFJ: 0.6 + 0.4 * Math.sin(t * 4) }); A.pip(ctx, 300, -720, 95, { t, blink: true, mouth: 'smile' }); } },
    { // 1 · dos bultitos lo hacen posible (macro de la tecla F)
      w: 10, bg: officeBg, light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -300, z: 0.9, r: 0.05 }, { x: 0, y: -230, z: 1.3, r: -0.03 }],
      draw(ctx, { t, p }) { A.key(ctx, -200, -360, 330, 330, 'F', { bump: true }); A.key(ctx, 220, -360, 330, 330, 'J', { bump: true }); A.ring(ctx, -200, -360 + 330 * 0.3, 70, t); A.ring(ctx, 220, -360 + 330 * 0.3, 70, t); } },
    { // 2 · MITO: solo para personas ciegas
      w: 16, bg: mintBg, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -360, z: 1.05, r: -0.03 }, { x: 0, y: -330, z: 1.0, r: 0.03 }],
      draw(ctx, { t, p }) { stamp(ctx, 'MYTH', 0, -700, C.coral, clamp(p * 3), -0.08); A.pip(ctx, 0, -330, 110, { t, mouth: 'flat', brows: 1, look: [0, -1] }); } },
    { // 3 · PLOT TWIST (firma): la razón real es para todo el que escribe
      w: 23, bgColor: '#14213D', light: 'night', enter: [-1, 0], cam: [{ x: 0, y: -80, z: 0.95, r: 0.05 }, { x: 0, y: -100, z: 1.12, r: -0.05 }],
      draw(ctx, { t }) {
        A.gear(ctx, -260, -440, 290, { teeth: 12, rot: t * 0.8, color: '#7FC8A9' });
        A.gear(ctx, 260, -170, 210, { teeth: 9, rot: -t * 1.1, color: C.brass });
        A.gear(ctx, 330, -650, 130, { teeth: 7, rot: t * 1.6, color: '#E3B35C' });
        A.pip(ctx, 0, -20, 125, { t, mouth: 'grin', arm: 'wave', brows: -0.5 });
      } },
    { // 4 · tus dedos tienen casa en la fila central
      w: 33, bg: officeBg, light: 'night', enter: [1, 0], cam: [{ x: -200, y: -330, z: 1.0, r: -0.05 }, { x: 150, y: -330, z: 1.05, r: 0.04 }],
      draw(ctx, { t, p }) {
        A.keyboard(ctx, 0, -330, 0.56, { t, glowFJ: 0.3 });
        A.rrect(ctx, -0.56 * 830, -330 - 0.56 * 75, 0.56 * 1560, 0.56 * 150, 30); ctx.lineWidth = 12; ctx.strokeStyle = C.key; ctx.globalAlpha = clamp(p * 3); ctx.stroke(); ctx.globalAlpha = 1;
        A.label(ctx, 'HOME ROW', 0, -620, { size: 66, bg: C.key });
      } },
    { // 5 · índice izquierdo en F, derecho en J
      w: 42, bg: officeBg, light: 'night', enter: [0, -1], cam: [{ x: 0, y: -380, z: 1.15, r: 0.04 }, { x: 0, y: -330, z: 1.0, r: -0.04 }],
      draw(ctx, { t, p }) { const kb = { x: 0, y: -280 }; A.keyboard(ctx, kb.x, kb.y, 0.56, { t, glowFJ: 1 }); fingers(ctx, kb, 0.56, easeOut(clamp(p * 1.8)), t); } },
    { // 6 · desde ahí, cada letra está a un paso
      w: 52, bg: officeBg, light: 'night', enter: [1, 0], cam: [{ x: 160, y: -330, z: 1.0, r: -0.03 }, { x: -160, y: -330, z: 1.05, r: 0.05 }],
      draw(ctx, { t, p }) {
        const s = 0.56, kb = { x: 0, y: -330 }; A.keyboard(ctx, kb.x, kb.y, s, { t, glowFJ: 1 });
        const P = (r, i) => [kb.x + (-760 + i * 150 + r * 40) * s, kb.y + (-170 + r * 150) * s];
        const targets = [[0, 3], [2, 3], [1, 2], [0, 6], [2, 6], [1, 7], [0, 4], [2, 5]];
        targets.forEach(([r, i], n) => { const from = P(1, i < 5 ? 3 : 6), to = P(r, i); const k = clamp(p * 3 - n * 0.2); if (k > 0) A.arrow(ctx, from[0], from[1], lerp(from[0], to[0], k), lerp(from[1], to[1], k), { color: C.teal, w: 12, head: 26, lw: 4 }); });
      } },
    { // 7 · los encuentras al tacto
      w: 62, bg: darkRoom, bgColor: '#10162A', bgBlur: 5, light: 'night', enter: [0, 1], cam: [{ x: 0, y: -330, z: 1.0, r: -0.05 }, { x: 0, y: -300, z: 1.2, r: 0.05 }],
      draw(ctx, { t, p }) { const kb = { x: 0, y: -280 }; A.keyboard(ctx, kb.x, kb.y, 0.56, { t, glowFJ: 1 }); fingers(ctx, kb, 0.56, 1, t); A.ring(ctx, -0.56 * 270, -280, 50, t); A.ring(ctx, 0.56 * 180, -280, 50, t); } },
    { // 8 · sin mirar abajo; sin una línea entera desplazada una tecla
      w: 70, bg: officeBg, light: 'night', enter: [1, 0], cam: [{ x: -80, y: -380, z: 1.05, r: 0.03 }, { x: 80, y: -380, z: 1.12, r: -0.03 }],
      draw(ctx, { t, p, video, T }) {
        A.rrect(ctx, -440, -760, 880, 560, 36); A.ink(ctx, '#F7F7FA', 8);
        ctx.font = '800 120px Bricolage'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const off = T >= video.words[73][1] / 1000;
        ctx.fillStyle = off ? C.coral : C.ink; ctx.fillText(off ? 'JR;;P' : 'HELLO', 0, -500);
        if (off) { ctx.fillStyle = '#7A7F95'; ctx.font = '700 54px Bricolage'; ctx.fillText('(you meant HELLO)', 0, -360); }
      } },
    { // 9 · REALIDAD: ayudan a cualquiera a escribir sin mirar
      w: 81, bg: mintBg, light: 'warm', enter: [-1, 0], cam: [{ x: 0, y: -330, z: 1.0, r: 0.03 }, { x: 0, y: -350, z: 1.08, r: -0.03 }],
      draw(ctx, { t, p }) { stamp(ctx, 'REALITY', 0, -620, C.teal, clamp(p * 3), 0.06); A.keyboard(ctx, 0, -260, 0.5, { t, glowFJ: 1 }); } },
    { // 10 · el teclado numérico tiene uno en el 5 · mismo truco para números
      w: 88, bg: officeBg, light: 'warm', enter: [1, 0], cam: [{ x: 0, y: -420, z: 0.95, r: -0.04 }, { x: 0, y: -330, z: 1.15, r: 0.04 }],
      draw(ctx, { t, p }) { A.numpad(ctx, 0, -480, 0.72, { glow5: clamp(p * 2) }); A.ring(ctx, 0, -480 + (-45 + 0.3 * 140) * 0.72, 50, t); } },
    { // 11 · el móvil no tiene bultos: por eso miras abajo
      w: 102, bg: officeBg, light: 'warm', enter: [0, 1], cam: [{ x: 0, y: -330, z: 1.05, r: 0.05 }, { x: 0, y: -380, z: 1.0, r: -0.03 }],
      draw(ctx, { t, p }) { A.phone(ctx, 100, -480, 0.68, t); A.pip(ctx, -330, -620, 95, { t, look: [0.6, 1], mouth: 'flat', brows: 0.6 }); } },
    { // 12 · remate y bucle: a oscuras, F y J brillan · "Now close your eyes"
      w: 114, bg: darkRoom, bgColor: '#10162A', light: 'night', bgBlur: 5, enter: [-1, 0], cam: [{ x: 90, y: -320, z: 1.2, r: 0.03 }, { x: -110, y: -240, z: 0.9, r: -0.07 }],
      draw(ctx, { t, p }) { A.keyboard(ctx, 0, -330, 0.56, { t, glowFJ: 0.6 + 0.4 * Math.sin(t * 4) }); A.pip(ctx, 300, -720, 95, { t, blink: p > 0.6, mouth: 'smile' }); } },
  ],
});
