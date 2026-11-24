// Hidden Gears · dibujos de la semana 2 (diseños originales, sin marcas)
const { C, clamp, lerp, ease, easeOut, easeBack, rng, strokeText } = require('./core');
const A = require('./art');
const { ink, rrect, ell, warmCool, mix, arrow, label, ring } = A;

// aparece con rebote en el instante 'at' (s) dentro del plano; devuelve escala 0..1
const popIn = (t, at, d = 0.35) => easeBack(clamp((t - at) / d));

// ---------- tren ----------
function rails(ctx, y, w = 1600, color = '#9AA0B5') {
  for (let i = -10; i <= 10; i++) { rrect(ctx, i * 90 - 30, y + 30, 60, 40, 8); ink(ctx, '#6B4E3A', 4); }
  for (const dy of [0]) { rrect(ctx, -w / 2, y + dy, w, 26, 6); ink(ctx, color, 5); }
}
// sección frontal de un eje: dos ruedas cónicas, eje y carriles. shift = desplazamiento lateral (-1..1)
function wheelset(ctx, x, y, s, { shift = 0, glowOuter = 0, glowInner = 0, labels = false, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const gauge = 520, dx = shift * 40;
  // carriles (cabezas redondeadas)
  for (const sx of [-1, 1]) { rrect(ctx, sx * gauge / 2 - 40, 150, 80, 140, 20); ink(ctx, '#8C93A8', 6); rrect(ctx, sx * gauge / 2 - 60, 280, 120, 30, 8); ink(ctx, '#6B7287', 5); }
  // eje
  rrect(ctx, -gauge / 2 - 40 + dx, 40, gauge + 80, 44, 20); ink(ctx, '#B9C0CF', 6);
  // ruedas cónicas: más anchas dentro (pestaña), más estrechas fuera
  for (const sx of [-1, 1]) {
    const cx = sx * gauge / 2 + dx;
    ctx.save(); ctx.translate(cx, 62); ctx.scale(sx, 1);
    // perfil muy cónico: pestaña dentro, banda de rodadura que se estrecha hacia fuera
    ctx.beginPath(); ctx.moveTo(-80, -165); ctx.lineTo(-80, 165); ctx.lineTo(-45, 165); ctx.lineTo(-45, 120); ctx.lineTo(85, 62); ctx.lineTo(85, -62); ctx.lineTo(-45, -120); ctx.lineTo(-45, -165); ctx.closePath();
    const g = sx > 0 ? glowOuter : glowInner;
    ink(ctx, g ? mix('#D6A04B', '#FFC94A', g) : '#D6A04B', 7);
    ctx.restore();
  }
  if (labels) { label(ctx, 'WIDER INSIDE', -150, -250, { size: 50, bg: C.key }); label(ctx, 'NARROW OUTSIDE', 200, -330, { size: 46, bg: C.cream }); }
  ctx.restore();
}
function trainCar(ctx, x, y, s, color = '#2E86AB', t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -420, -260, 840, 300, 40); ink(ctx, warmCool(ctx, -420, -260, 840, 300, color), 8);
  for (let i = 0; i < 5; i++) { rrect(ctx, -360 + i * 150, -210, 110, 110, 18); ink(ctx, '#BFE6F5', 5); }
  rrect(ctx, -420, -30, 840, 30, 8); ink(ctx, C.coral, 5);
  for (const wx of [-280, -150, 150, 280]) { ell(ctx, wx, 70, 55, 55); ink(ctx, '#3D3D55', 7); ell(ctx, wx, 70, 18, 18); ink(ctx, '#B9C0CF', 4); ctx.save(); ctx.translate(wx, 70); ctx.rotate(t * 6); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.lineWidth = 6; ctx.strokeStyle = '#8C93A8'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
function curveTrack(ctx, x, y, s, prog = 0, t = 0) {
  // vista cenital: dos carriles en curva y un eje que la recorre
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const R1 = 520, R2 = 700;
  ctx.translate(250, -150);
  for (const R of [R1, R2]) { ctx.beginPath(); ctx.arc(-600, 300, R, -Math.PI * 0.5, 0); ctx.lineWidth = 26; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = '#B9C0CF'; ctx.stroke(); }
  const a = lerp(-Math.PI * 0.45, -0.1, prog);
  const p1 = [-600 + Math.cos(a) * R1, 300 + Math.sin(a) * R1], p2 = [-600 + Math.cos(a) * R2, 300 + Math.sin(a) * R2];
  ctx.beginPath(); ctx.moveTo(...p1); ctx.lineTo(...p2); ctx.lineWidth = 18; ctx.strokeStyle = '#B9C0CF'; ctx.stroke();
  ell(ctx, p1[0], p1[1], 34, 34); ink(ctx, '#7FA6B8', 6); ell(ctx, p2[0], p2[1], 52, 52); ink(ctx, C.key, 6);
  // arcos recorridos (dentro corto, fuera largo)
  ctx.lineWidth = 10;
  for (const [R, c] of [[R1, '#7FA6B8'], [R2, C.key]]) { ctx.beginPath(); ctx.arc(-600, 300, R, -Math.PI * 0.5, a); ctx.strokeStyle = c; ctx.stroke(); }
  ctx.restore();
}

// ---------- microondas ----------
function microwave(ctx, x, y, s, { t = 0, open = 0, glow = 1, mesh = 1, popcorn = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -460, -290, 920, 580, 50); ink(ctx, warmCool(ctx, -460, -290, 920, 580, '#E9E4DA'), 8);
  rrect(ctx, 250, -240, 170, 480, 24); ink(ctx, '#D3CCBF', 6);
  for (let i = 0; i < 9; i++) { ell(ctx, 300 + (i % 3) * 50, -170 + Math.floor(i / 3) * 60, 16, 16); ink(ctx, '#8C93A8', 4); }
  rrect(ctx, 300, 60, 70, 140, 14); ink(ctx, C.coral, 5);
  // ventana con luz interior
  rrect(ctx, -410, -240, 620, 480, 30); ink(ctx, '#2B2F4A', 7);
  ctx.save(); rrect(ctx, -400, -230, 600, 460, 26); ctx.clip();
  const g = ctx.createRadialGradient(-100, 20, 20, -100, 20, 380); g.addColorStop(0, `rgba(255,210,120,${0.9 * glow})`); g.addColorStop(1, 'rgba(40,40,60,1)'); ctx.fillStyle = g; ctx.fillRect(-400, -230, 600, 460);
  ell(ctx, -100, 150, 230, 40); ink(ctx, 'rgba(255,255,255,0.35)', 4);
  if (popcorn) { const r = rng(5); for (let i = 0; i < 26; i++) { const k = clamp(popcorn * 1.4 - r() * 0.4); if (k > 0) { ctx.save(); ctx.translate(-220 + r() * 240, 120 - k * (40 + r() * 140)); ctx.scale(k, k); A.cloud(ctx, 0, 0, 22, '#FFF6DA'); ctx.restore(); } } }
  // malla metálica
  if (mesh) { ctx.globalAlpha = 0.55 * mesh; ctx.fillStyle = '#10121E'; for (let yy = -230; yy < 230; yy += 22) for (let xx = -400 + ((yy / 22) % 2) * 11; xx < 200; xx += 22) { ctx.beginPath(); ctx.rect(xx, yy, 22, 22); ctx.arc(xx + 11, yy + 11, 7, 0, Math.PI * 2, true); ctx.fill(); } ctx.globalAlpha = 1; }
  ctx.restore();
  ctx.restore();
}
function meshMacro(ctx, x, y, s, t = 0, highlight = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -420, -420, 840, 840, 40); ink(ctx, '#3D4160', 8);
  for (let r = -3; r <= 3; r++) for (let c = -3; c <= 3; c++) { ell(ctx, c * 120 + (r % 2 ? 60 : 0), r * 120, 42, 42); ink(ctx, '#FFE2A0', 5); }
  if (highlight) { ring(ctx, 0, 0, 60, t); label(ctx, '2 mm', 0, -520, { size: 70, bg: C.key }); }
  ctx.restore();
}
function wave(ctx, x0, y, len, amp, wl, phase, color, lw = 12, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath();
  for (let i = 0; i <= 160; i++) { const x = x0 + (i / 160) * len; const yy = y + Math.sin((x - x0) / wl * Math.PI * 2 - phase) * amp; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
  ctx.lineWidth = lw + 8; ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = lw; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}

// ---------- QR ----------
function qrCode(ctx, x, y, size, { seed = 7, finders = 1, glowFinders = 0, rot = 0, t = 0, missing = 0 } = {}) {
  const N = 25, m = size / N; const r = rng(seed);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-size / 2, -size / 2);
  rrect(ctx, -m * 2, -m * 2, size + m * 4, size + m * 4, m); ink(ctx, '#FFFFFF', 6);
  const inFinder = (i, j) => (i < 8 && j < 8) || (i > N - 9 && j < 8) || (i < 8 && j > N - 9);
  ctx.fillStyle = C.ink;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (!inFinder(i, j) && r() > 0.52) ctx.fillRect(i * m, j * m, m + 0.5, m + 0.5);
  const fp = [[0, 0], [N - 7, 0], [0, N - 7]];
  fp.forEach(([i, j]) => {
    const col = glowFinders ? mix('#1B1B2F', '#E85D04', glowFinders) : C.ink;
    ctx.fillStyle = col; ctx.fillRect(i * m, j * m, 7 * m, 7 * m); ctx.fillStyle = '#FFFFFF'; ctx.fillRect((i + 1) * m, (j + 1) * m, 5 * m, 5 * m); ctx.fillStyle = col; ctx.fillRect((i + 2) * m, (j + 2) * m, 3 * m, 3 * m);
    if (glowFinders) { ctx.save(); ctx.globalAlpha = glowFinders; ctx.lineWidth = 10; ctx.strokeStyle = C.key; ctx.strokeRect(i * m - 8, j * m - 8, 7 * m + 16, 7 * m + 16); ctx.restore(); }
  });
  if (missing) { ctx.save(); ctx.globalAlpha = missing; ctx.setLineDash([18, 14]); ctx.lineWidth = 10; ctx.strokeStyle = C.coral; ctx.strokeRect((N - 7) * m - 8, (N - 7) * m - 8, 7 * m + 16, 7 * m + 16); ctx.restore(); }
  ctx.restore();
}
function phoneFrame(ctx, x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -300, -560, 600, 1120, 80); ink(ctx, '#1A1C2C', 12);
  rrect(ctx, -270, -525, 540, 1050, 60); ctx.lineWidth = 6; ctx.strokeStyle = '#3D4160'; ctx.stroke();
  // esquinas de visor
  ctx.lineWidth = 14; ctx.strokeStyle = C.key; ctx.lineCap = 'round';
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.moveTo(sx * 200, sy * 120); ctx.lineTo(sx * 200, sy * 200); ctx.lineTo(sx * 120, sy * 200); ctx.stroke(); }
  ctx.restore();
}
function partsBox(ctx, x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-260, -120); ctx.lineTo(260, -120); ctx.lineTo(260, 200); ctx.lineTo(-260, 200); ctx.closePath(); ink(ctx, warmCool(ctx, -260, -120, 520, 320, '#C9945B'), 7);
  ctx.beginPath(); ctx.moveTo(-260, -120); ctx.lineTo(-180, -200); ctx.lineTo(340, -200); ctx.lineTo(260, -120); ctx.closePath(); ink(ctx, '#B07D47', 7);
  A.gear(ctx, 0, -150, 90, { teeth: 10, rot: t, color: '#B9C0CF' });
  ctx.restore();
}

// ---------- lata ----------
function sodaCan(ctx, x, y, s, { bulge = 0, cut = 0, flip = 0, color = '#D7263D', pressure = 0, t = 0, wobble = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 9) * 0.08 * wobble); ctx.scale(s, s * (flip ? -1 : 1));
  const top = -380, bot = 380;
  ctx.beginPath(); ctx.moveTo(-200, top + 40); ctx.lineTo(-160, top); ctx.lineTo(160, top); ctx.lineTo(200, top + 40); ctx.lineTo(200, bot - 50);
  ctx.quadraticCurveTo(200, bot + bulge * 120, 0, bot + bulge * 130); ctx.quadraticCurveTo(-200, bot + bulge * 120, -200, bot - 50); ctx.closePath();
  ink(ctx, warmCool(ctx, -200, top, 400, bot - top, color), 8);
  rrect(ctx, -200, -120, 400, 150, 4); ink(ctx, mix(color, '#FFFFFF', 0.75), 0);
  ctx.save(); ctx.globalAlpha = 0.3; rrect(ctx, -150, top + 50, 50, bot - top - 120, 25); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
  ell(ctx, 0, top + 10, 150, 24); ink(ctx, '#C9CED6', 6); rrect(ctx, -40, top - 6, 80, 26, 12); ink(ctx, '#9AA0B5', 4);
  if (cut) {
    // corte del fondo en cúpula
    ctx.save(); ctx.globalAlpha = cut;
    ctx.beginPath(); ctx.moveTo(-200, bot - 50); ctx.lineTo(-170, bot); ctx.quadraticCurveTo(0, bot - 150, 170, bot); ctx.lineTo(200, bot - 50);
    ctx.lineWidth = 26; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = '#C9CED6'; ctx.stroke();
    ctx.restore();
  }
  if (pressure) { for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + t; const k = (t * 1.4 + i * 0.13) % 1; ctx.globalAlpha = pressure * (1 - k); A.arrow(ctx, Math.cos(a) * 60, Math.sin(a) * 120, Math.cos(a) * (130 + 40 * k), Math.sin(a) * (260 + 60 * k), { color: C.coral, w: 16, head: 32, lw: 4 }); ctx.globalAlpha = 1; } }
  ctx.restore();
}
function stoneArch(ctx, x, y, s, load = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 9; i++) {
    const a0 = Math.PI + (i / 9) * Math.PI, a1 = Math.PI + ((i + 1) / 9) * Math.PI;
    ctx.beginPath(); ctx.arc(0, 200, 380, a0, a1); ctx.arc(0, 200, 250, a1, a0, true); ctx.closePath(); ink(ctx, warmCool(ctx, -380, -180, 760, 380, '#B8A48A'), 6);
  }
  for (const sx of [-1, 1]) { rrect(ctx, sx * 315 - 65, 200, 130, 260, 8); ink(ctx, '#A8957C', 6); }
  if (load) for (let i = -2; i <= 2; i++) { const k = (t * 1.5 + i * 0.2) % 1; ctx.globalAlpha = load * (1 - k * 0.6); arrow(ctx, i * 120, -420 + k * 60, i * 110, -230 + k * 40, { color: C.coral, w: 18, head: 36, lw: 4 }); ctx.globalAlpha = 1; }
  ctx.restore();
}
function tire(ctx, x, y, s, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(t); ell(ctx, 0, 0, 230, 230); ink(ctx, '#2B2B38', 10); ell(ctx, 0, 0, 120, 120); ink(ctx, '#B9C0CF', 8); for (let i = 0; i < 5; i++) { ctx.save(); ctx.rotate(i * Math.PI * 0.4); rrect(ctx, -14, -110, 28, 80, 10); ink(ctx, '#8C93A8', 4); ctx.restore(); } ctx.restore(); }

// ---------- clavija ----------
function plug(ctx, x, y, s, { holes = 1, glowHoles = 0, t = 0, tag = 0, insert = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sx of [-1, 1]) {
    rrect(ctx, sx * 70 - 22, -330 + insert * -0, 44, 230, 10); ink(ctx, warmCool(ctx, sx * 70 - 22, -330, 44, 230, '#D9DCE3'), 6);
    if (holes) { ell(ctx, sx * 70, -265, 13, 13); ink(ctx, '#2A2E45', 4); if (glowHoles) ring(ctx, sx * 70, -265, 40, t); }
  }
  rrect(ctx, -170, -120, 340, 260, 60); ink(ctx, warmCool(ctx, -170, -120, 340, 260, '#F4F1EA'), 8);
  rrect(ctx, -50, 130, 100, 300, 40); ink(ctx, '#F4F1EA', 7);
  if (tag) { ctx.save(); ctx.globalAlpha = tag; ctx.beginPath(); ctx.moveTo(70, -265); ctx.lineTo(230, -150); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke(); rrect(ctx, 180, -150, 200, 120, 14); ink(ctx, C.key, 6); ctx.fillStyle = C.ink; ctx.font = '800 40px Bricolage'; ctx.textAlign = 'center'; ctx.fillText('DO NOT', 280, -100); ctx.fillText('PLUG IN', 280, -55); ctx.restore(); }
  ctx.restore();
}
function outlet(ctx, x, y, s, { bumps = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -240, -330, 480, 660, 40); ink(ctx, warmCool(ctx, -240, -330, 480, 660, '#F4F1EA'), 8);
  for (const yy of [-150, 150]) { rrect(ctx, -150, yy - 110, 300, 220, 90); ink(ctx, '#ECE7DC', 6); for (const sx of [-1, 1]) { rrect(ctx, sx * 70 - 14, yy - 60, 28, 90, 6); ink(ctx, '#2A2E45', 0); if (bumps) { ell(ctx, sx * 70 + 10, yy - 15, 8 * bumps, 8 * bumps); ink(ctx, C.key, 3); } } ell(ctx, 0, yy + 60, 20, 24); ink(ctx, '#2A2E45', 0); }
  ctx.restore();
}
function robotGripper(ctx, x, y, s, close = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -60, -560, 120, 360, 20); ink(ctx, warmCool(ctx, -60, -560, 120, 360, C.brass), 7);
  rrect(ctx, -200, -220, 400, 70, 20); ink(ctx, '#8C93A8', 7);
  for (const sx of [-1, 1]) { const ox = sx * lerp(190, 70, close); rrect(ctx, ox - 18, -170, 36, 130, 12); ink(ctx, '#B9C0CF', 6); ell(ctx, ox, -50, 15, 15); ink(ctx, C.coral, 4); }
  ctx.restore();
}

// ---------- carretera ----------
function roadTop(ctx, x, y, s, { t = 0, dots = 1, paint = 1, rainK = 0, scroll = 0, glow = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#3A3F55'; ctx.fillRect(-700, -1500, 1400, 3000);
  for (const lx of [-650, 650]) { ctx.fillStyle = '#F4F1EA'; ctx.fillRect(lx - 14, -1500, 28, 3000); }
  for (const lx of [-220, 220]) {
    for (let k = -14; k <= 14; k++) {
      const yy = ((k * 110 + scroll * 600) % 3080) - 1500 + (lx > 0 ? 55 : 0);
      if (paint) { ctx.globalAlpha = paint; ctx.fillStyle = '#F4F1EA'; ctx.fillRect(lx - 10, yy, 20, 60); ctx.globalAlpha = 1; }
      if (dots) { ctx.globalAlpha = dots; ell(ctx, lx, yy + 30, 26, 26); ink(ctx, '#F4F1EA', 5); if (glow) { ell(ctx, lx, yy + 30, 34, 34); ctx.lineWidth = 6 * glow; ctx.strokeStyle = C.key; ctx.stroke(); } ctx.globalAlpha = 1; }
    }
  }
  if (rainK) A.rain(ctx, t, 90, 4, [-700, -1500, 1400, 3000]);
  ctx.restore();
}
function dotMacro(ctx, x, y, s, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#3A3F55'; ctx.fillRect(-500, -400, 1000, 800); ctx.beginPath(); ctx.ellipse(0, 40, 260, 70, 0, 0, Math.PI * 2); ctx.fillStyle = '#20232F'; ctx.fill(); ctx.beginPath(); ctx.moveTo(-250, 40); ctx.quadraticCurveTo(0, -180, 250, 40); ctx.closePath(); ink(ctx, warmCool(ctx, -250, -180, 500, 220, '#F4F1EA'), 8); ctx.restore(); }

// ---------- surtidor / boquilla en corte ----------
function nozzle(ctx, x, y, s, { t = 0, flow = 1, air = 1, covered = 0, disc = 0, latch = 0, clickK = 0, fuelLevel = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // depósito con nivel
  rrect(ctx, 80, 120, 560, 380, 40); ink(ctx, '#2B2F4A', 7);
  ctx.save(); rrect(ctx, 86, 126, 548, 368, 36); ctx.clip(); ctx.fillStyle = '#F2A541'; ctx.fillRect(86, 494 - 368 * fuelLevel, 548, 368 * fuelLevel); ctx.restore();
  // cuerpo de la boquilla (mango) y caño
  rrect(ctx, -520, -330, 520, 230, 60); ink(ctx, warmCool(ctx, -520, -330, 520, 230, '#4E6E8E'), 8);
  ctx.save(); ctx.translate(-20, -220); ctx.rotate(0.42);
  rrect(ctx, 0, -38, 560, 76, 30); ink(ctx, '#C9CED6', 7);
  // tubito sensor y agujero en la punta
  ctx.beginPath(); ctx.moveTo(20, -14); ctx.lineTo(520, -14); ctx.lineWidth = 8; ctx.strokeStyle = '#2A2E45'; ctx.stroke();
  ell(ctx, 520, -14, 12, 12); ink(ctx, covered ? '#F2A541' : '#FFFFFF', 4);
  if (air && !covered) { const r = rng(2); for (let i = 0; i < 8; i++) { const k = (r() + t * 1.2) % 1; ell(ctx, lerp(520, 30, k), -14, 7, 7); ink(ctx, '#BFE9FF', 2); } }
  if (flow) { const r = rng(3); for (let i = 0; i < 14; i++) { const k = (r() + t * 1.6) % 1; ell(ctx, lerp(40, 600, k), 14, 10, 7); ink(ctx, '#F2A541', 2); } }
  ctx.restore();
  // disco de goma (membrana) y pestillo
  ell(ctx, -300, -215, 80, 22 + disc * 18); ink(ctx, '#3D3D55', 6);
  ctx.save(); ctx.translate(-300, -215 - disc * 40); rrect(ctx, -10, -90, 20, 90, 8); ink(ctx, '#B9C0CF', 4); ctx.restore();
  ctx.save(); ctx.translate(-420, -110); ctx.rotate(-latch * 0.5); rrect(ctx, -10, 0, 200, 34, 12); ink(ctx, C.coral, 6); ctx.restore();
  // muelle
  ctx.beginPath(); for (let i = 0; i <= 12; i++) { const xx = -480 + i * 12; ctx.lineTo(xx, -270 + (i % 2 ? -18 : 18)); } ctx.lineWidth = 6; ctx.strokeStyle = '#8C93A8'; ctx.stroke();
  if (clickK) { ctx.globalAlpha = clickK; A.bigNumber(ctx, 'CLICK!', -260, -460, 120, C.key, -0.08); ctx.globalAlpha = 1; }
  ctx.restore();
}

module.exports = { popIn, rails, wheelset, trainCar, curveTrack, microwave, meshMacro, wave, qrCode, phoneFrame, partsBox, sodaCan, stoneArch, tire, plug, outlet, robotGripper, roadTop, dotMacro, nozzle };
