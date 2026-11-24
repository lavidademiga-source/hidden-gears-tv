// V03 · The tiny arrow on your fuel gauge (error famoso · gasolinera · travelling lateral · lineal · paleta garage)
const { C, clamp, lerp, ease, easeOut, easeBack } = require('../engine/core');
const A = require('../engine/art');

function stationBg(g) {
  A.skyGrad(g, '#2A1B3D', '#B5473A');
  g.fillStyle = '#3A3F55'; g.fillRect(-1200, 200, 2400, 1600);
  for (let i = -4; i <= 4; i++) { g.fillStyle = '#F4D35E'; g.fillRect(i * 300 - 60, 900, 120, 26); }
  A.rrect(g, -900, -900, 1800, 160, 20); A.ink(g, '#D7263D'); // marquesina
  for (const x of [-600, 600]) { A.rrect(g, x - 40, -760, 80, 1000, 10); A.ink(g, '#9AA0B5'); }
  g.fillStyle = 'rgba(255,240,200,0.35)'; g.beginPath(); g.moveTo(-700, -740); g.lineTo(700, -740); g.lineTo(1000, 400); g.lineTo(-1000, 400); g.closePath(); g.fill();
}
function dashBg(g) { for (let i = 0; i < 9; i++) { A.rrect(g, -1000 + i * 230, -1500, 160, 90, 20); A.ink(g, ['#3A3F5C', '#4A4F6C'][i % 2]); } for (let i = 0; i < 6; i++) { g.fillStyle = ['#2EC4B6', '#F2A541', '#FF6B5B'][i % 3]; g.beginPath(); g.arc(-800 + i * 320, 800, 30, 0, Math.PI * 2); g.fill(); } g.fillStyle = '#1E1F2B'; g.fillRect(-1200, -2000, 2400, 4000); A.rrect(g, -1000, -500, 2000, 1000, 200); A.ink(g, '#2C2E40'); A.rrect(g, -1100, 600, 2200, 1400, 60); A.ink(g, '#262838'); }
function rainBg(g) { A.skyGrad(g, '#33415C', '#5C677D'); g.fillStyle = '#2B2F3F'; g.fillRect(-1200, 300, 2400, 1700); for (let i = -3; i <= 3; i++) { A.rrect(g, i * 330 - 120, -500, 240, 800, 10); A.ink(g, '#4A5068'); for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#F4D35E' : '#6B7390'; g.fillRect(i * 330 - 90 + (k % 2) * 100, -440 + Math.floor(k / 2) * 220, 70, 90); } } }
function officeBg(g) { g.fillStyle = '#E9D8B4'; g.fillRect(-1200, -2000, 2400, 4000); A.rrect(g, -500, -1000, 1000, 600, 30); A.ink(g, '#9CC5D8'); g.fillStyle = '#B98B5E'; g.fillRect(-1200, 250, 2400, 1700); }

function stationShot(ctx, t, p, rev) {
  // el coche llega por el lado equivocado: surtidor a la izquierda, tapa a la derecha
  A.pump(ctx, -330, -330, 0.9, C.teal);
  const k = rev ? 1 : easeOut(clamp(p * 1.6));
  A.carTop(ctx, lerp(500, 80, k), -300, 0.85, { color: '#D7263D', capSide: 1, capGlow: k > 0.9 ? 1 : 0, t });
  if (k > 0.9) A.label(ctx, 'WRONG SIDE!', 120, -690, { size: 64, bg: C.key, rot: -0.04 });
}

module.exports = (words) => ({
  id: 'v03', words,
  title: { lines: ['WRONG SIDE OF', 'THE *PUMP* AGAIN?'], until: 2.8 },
  shots: [
    { w: 0, bg: stationBg, bgBlur: 4, bgParallax: 0.75, bgColor: '#2A1B3D', light: 'warm', cam: [{ x: 220, y: -220, z: 0.86 }, { x: -120, y: -300, z: 1.18 }],
      draw(ctx, { t, p }) { stationShot(ctx, t, p, false); } },
    { // 1 · mira el indicador: el triángulo
      w: 11, bg: dashBg, bgBlur: 5, bgColor: '#1E1F2B', light: 'warm', enter: [1, 0], cam: [{ x: -120, y: -260, z: 0.9 }, { x: 60, y: -150, z: 1.35 }],
      draw(ctx, { t, p }) { A.gauge(ctx, 0, -320, 1.05, { level: 0.18, arrowDir: 1, arrowGlow: clamp(p * 2 - 0.5), t }); } },
    { // 2 · señala el lado de la tapa: izquierda/derecha
      w: 25, bg: stationBg, bgColor: '#2A1B3D', light: 'warm', enter: [1, 0], cam: [{ x: -140, y: -280, z: 1.0 }, { x: 140, y: -280, z: 1.0 }],
      draw(ctx, { t, p, video }) {
        const tl = video.words[35][1] / 1000, tr = video.words[39][1] / 1000; const T = arguments[1].T;
        const dir = T < tr ? -1 : 1; const on = T >= tl;
        A.gauge(ctx, -230, -560, 0.5, { level: 0.2, arrowDir: on ? dir : 1, arrowGlow: on ? 1 : 0.4, t });
        A.carTop(ctx, 230, -320, 0.72, { color: '#D7263D', capSide: on ? dir : 1, capGlow: 1, t });
        if (on) A.label(ctx, dir < 0 ? 'LEFT' : 'RIGHT', -230, -180, { size: 66, bg: C.key });
      } },
    { // 3 · PLOT TWIST (firma) + diseñador empapado (nube de lluvia sobre Pip)
      w: 43, bgColor: '#14213D', light: 'night', enter: [-1, 0], cam: [{ x: 0, y: -60, z: 0.95, r: -0.04 }, { x: 0, y: -100, z: 1.1, r: 0.04 }],
      draw(ctx, { t, p }) {
        A.gear(ctx, -260, -480, 280, { teeth: 12, rot: t * 0.8, color: '#C0C4D6' });
        A.gear(ctx, 260, -240, 200, { teeth: 9, rot: -t * 1.1, color: C.brass });
        A.cloud(ctx, 20, -330, 120, '#8D99AE'); A.rain(ctx, t, 18, 2, [-120, -260, 280, 300]);
        A.pip(ctx, 20, -40, 115, { t, mouth: p > 0.5 ? 'flat' : 'grin', brows: p > 0.5 ? 1 : -0.5, blink: p > 0.5 });
      } },
    { // 4 · 1986: un coche de empresa (sin dibujar a la persona real)
      w: 54, bg: officeBg, light: 'night', enter: [1, 0], cam: [{ x: -100, y: -330, z: 1.0 }, { x: 100, y: -300, z: 1.08 }],
      draw(ctx, { t, p }) {
        A.bigNumber(ctx, '1986', 0, -760, 210, C.key, -0.04);
        A.carTop(ctx, -60 + 120 * p, -250, 0.6, { color: '#4E6E8E', capSide: -1, t });
        A.label(ctx, 'COMPANY CAR', 240, -560, { size: 52, bg: C.cream, rot: 0.04 });
      } },
    { // 5 · llueve y no sabe de qué lado está la tapa
      w: 66, bg: rainBg, light: 'night', enter: [1, 0], cam: [{ x: 120, y: -280, z: 1.15 }, { x: -60, y: -300, z: 1.0 }],
      draw(ctx, { t, p }) {
        A.rain(ctx, t, 110, 7);
        A.carTop(ctx, 0, -300, 0.8, { color: '#4E6E8E', capSide: -1, t });
        for (const s of [-1, 1]) A.bigNumber(ctx, '?', s * 330, -330 + Math.sin(t * 4 + s) * 20, 170, C.key);
      } },
    { // 6 · escribe un memo: «pon una flecha junto al indicador» · y se olvida
      w: 79, bg: officeBg, light: 'night', enter: [0, 1], cam: [{ x: 0, y: -380, z: 1.12 }, { x: 0, y: -300, z: 0.95 }],
      draw(ctx, { t, p, video, T }) {
        const forgot = T >= video.words[90][1] / 1000;
        memo(ctx, t, forgot);
      } },
    { // 7 · 3 años después: salpicaderos de 1989
      w: 95, bg: dashBg, bgBlur: 5, bgColor: '#1E1F2B', light: 'warm', enter: [1, 0], cam: [{ x: 120, y: -300, z: 1.0 }, { x: -60, y: -260, z: 1.15 }],
      draw(ctx, { t, p }) {
        A.bigNumber(ctx, '1989', 0, -820, 200, C.key, 0.03);
        A.gauge(ctx, 0, -330, 0.85, { level: 0.55, arrowDir: 1, arrowGlow: clamp(p * 2), t });
      } },
    { // 8 · hoy: en la mayoría de coches nuevos
      w: 105, bg: stationBg, bgColor: '#2A1B3D', light: 'warm', enter: [1, 0], cam: [{ x: -300, y: -300, z: 0.95 }, { x: 300, y: -300, z: 0.95 }],
      draw(ctx, { t, p }) {
        const cols = ['#D7263D', '#2EC4B6', '#F2A541', '#7A5CC2', '#4E6E8E', '#FF6B5B'];
        cols.forEach((c, i) => A.carTop(ctx, -750 + i * 300, -300, 0.48, { color: c, capSide: i % 2 ? 1 : -1, capGlow: 1, t: t + i * 0.2 }));
        A.label(ctx, 'MOST NEW CARS', 0, -720, { size: 60, bg: C.key });
      } },
    { // 9 · sin apps, sin adivinar: un triangulito
      w: 113, bg: dashBg, bgBlur: 4, bgParallax: 0.75, bgColor: '#1E1F2B', light: 'warm', enter: [0, -1], cam: [{ x: -140, y: -300, z: 0.92 }, { x: 140, y: -350, z: 1.3 }],
      draw(ctx, { t, p, video, T }) {
        const t2 = video.words[115][1] / 1000, t3 = video.words[117][1] / 1000;
        if (T < t3) {
          A.phone(ctx, -230, -380, 0.45, t); A.bigNumber(ctx, '?', 230, -380, 220, C.cream);
          strike(ctx, -230, -380, 1); if (T >= t2) strike(ctx, 230, -380, 1);
        } else {
          ctx.save(); ctx.translate(0, -360); const s = easeBack(clamp((T - t3) * 3)) * 2.4; ctx.scale(s, s);
          ctx.shadowColor = C.key; ctx.shadowBlur = 50; ctx.beginPath(); ctx.moveTo(-60, -70); ctx.lineTo(70, 0); ctx.lineTo(-60, 70); ctx.closePath(); A.ink(ctx, C.key, 6); ctx.restore();
        }
      } },
    { // 10 · remate y bucle: vuelve a la gasolinera
      w: 121, bg: stationBg, bgBlur: 4, bgParallax: 0.75, bgColor: '#2A1B3D', light: 'warm', enter: [-1, 0], cam: [{ x: -120, y: -300, z: 1.18 }, { x: 220, y: -220, z: 0.86 }],
      draw(ctx, { t, p }) { stationShot(ctx, t, 1 - p, false); A.pip(ctx, -360, -720, 85, { t, arm: 'point', pointAt: 0.9, mouth: 'smile' }); } },
  ],
});

function strike(ctx, x, y, k) { ctx.beginPath(); ctx.moveTo(x - 160, y - 160); ctx.lineTo(x + 160, y + 160); ctx.moveTo(x + 160, y - 160); ctx.lineTo(x - 160, y + 160); ctx.lineWidth = 26; ctx.strokeStyle = C.coral; ctx.lineCap = 'round'; ctx.stroke(); }
function memo(ctx, t, forgot) {
  A.memo(ctx, 0, -380, 0.95, -0.04 + Math.sin(t) * 0.01, ['Put an arrow', 'by the fuel gauge', 'to show the side', 'of the gas cap.'], t);
  if (forgot) { ctx.save(); ctx.globalAlpha = 0.85; for (let i = 0; i < 3; i++) A.bigNumber(ctx, 'z', 300 + i * 70, -760 - i * 90 - ((t * 60) % 40), 90 + i * 30, C.cream); ctx.restore(); }
  A.pip(ctx, -380, -820, 85, { t, arm: forgot ? 'none' : 'point', pointAt: -0.6, mouth: forgot ? 'flat' : 'grin', blink: forgot });
}
