// Hidden Gears · biblioteca de dibujo por código (diseños originales)
const { C, clamp, lerp, ease, easeOut, rng, strokeText } = require('./core');

const LW = 7; // contorno de tinta
function ink(ctx, fill, lw = LW, stroke = C.ink) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function ell(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); }
function shade(ctx, x0, y0, x1, y1, a, b) { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
// luz cálida arriba-izquierda, sombra fría abajo-derecha
function warmCool(ctx, x, y, w, h, base) { const g = ctx.createLinearGradient(x, y, x + w * 0.6, y + h); g.addColorStop(0, mix(base, '#FFE2A8', 0.35)); g.addColorStop(0.55, base); g.addColorStop(1, mix(base, '#203A80', 0.35)); return g; }
function hex(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }

// ---------- Pip: engranaje mascota ----------
function gearPath(ctx, x, y, r, teeth = 8, depth = 0.22, rot = 0) {
  ctx.beginPath();
  const n = teeth * 4;
  for (let i = 0; i <= n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    const ph = i % 4; const rr = (ph === 1 || ph === 2) ? r : r * (1 - depth);
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
}
function gear(ctx, x, y, r, { teeth = 10, rot = 0, color = C.brass, hole = 0.32 } = {}) {
  gearPath(ctx, x, y, r, teeth, 0.2, rot); ink(ctx, warmCool(ctx, x - r, y - r, 2 * r, 2 * r, color));
  ell(ctx, x, y, r * hole, r * hole); ink(ctx, C.ink, 0);
  ell(ctx, x, y, r * 0.62, r * 0.62); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(27,27,47,0.35)'; ctx.stroke();
}
function pip(ctx, x, y, s, o = {}) {
  // s = radio. o: rot, look [x,y], mouth ('smile'|'o'|'grin'|'flat'), blink, arm ('point'|'up'|'wave'|'thumb'|'none'), pointAt angle, brows
  const t = o.t || 0;
  const bob = Math.sin(t * 5) * s * 0.03;
  ctx.save(); ctx.translate(x, y + bob);
  const sq = o.squash || 1; ctx.scale(1 / Math.sqrt(sq), sq);
  // brazos de alambre detrás del cuerpo
  ctx.lineWidth = s * 0.07; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
  const armL = () => { ctx.beginPath(); ctx.moveTo(-s * 0.8, s * 0.1); ctx.quadraticCurveTo(-s * 1.25, s * 0.45, -s * 1.15, s * 0.8); ctx.stroke(); hand(ctx, -s * 1.15, s * 0.8, s); };
  armL();
  const a = o.arm || 'none';
  ctx.save();
  if (a === 'point') { const ang = o.pointAt ?? -0.4; ctx.beginPath(); ctx.moveTo(s * 0.8, 0); const ex = s * 0.8 + Math.cos(ang) * s * 0.75, ey = Math.sin(ang) * s * 0.75; ctx.quadraticCurveTo(s * 1.1, ey * 0.2, ex, ey); ctx.stroke(); hand(ctx, ex, ey, s, true, ang); }
  else if (a === 'up' || a === 'wave') { const w = a === 'wave' ? Math.sin(t * 10) * 0.25 : 0; const ex = s * 1.25 + Math.sin(w) * s * 0.2, ey = -s * 0.85; ctx.beginPath(); ctx.moveTo(s * 0.8, -s * 0.1); ctx.quadraticCurveTo(s * 1.3, -s * 0.2, ex, ey); ctx.stroke(); hand(ctx, ex, ey, s); }
  else if (a === 'thumb') { ctx.beginPath(); ctx.moveTo(s * 0.8, s * 0.1); ctx.quadraticCurveTo(s * 1.3, s * 0.2, s * 1.25, -s * 0.3); ctx.stroke(); hand(ctx, s * 1.25, -s * 0.3, s); ctx.beginPath(); ctx.moveTo(s * 1.25, -s * 0.38); ctx.lineTo(s * 1.25, -s * 0.62); ctx.lineWidth = s * 0.11; ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(s * 0.8, s * 0.1); ctx.quadraticCurveTo(s * 1.25, s * 0.45, s * 1.15, s * 0.8); ctx.stroke(); hand(ctx, s * 1.15, s * 0.8, s); }
  ctx.restore();
  // piernas
  ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.85); ctx.lineTo(-s * 0.38, s * 1.25); ctx.moveTo(s * 0.3, s * 0.85); ctx.lineTo(s * 0.38, s * 1.25); ctx.stroke();
  ell(ctx, -s * 0.45, s * 1.28, s * 0.2, s * 0.09); ink(ctx, C.ink, 0); ell(ctx, s * 0.45, s * 1.28, s * 0.2, s * 0.09); ink(ctx, C.ink, 0);
  // cuerpo
  gearPath(ctx, 0, 0, s, 8, 0.2, (o.rot || 0)); ink(ctx, warmCool(ctx, -s, -s, 2 * s, 2 * s, C.brass), s * 0.06);
  ell(ctx, 0, 0, s * 0.74, s * 0.74); ink(ctx, mix(C.brass, '#FFE7B0', 0.35), s * 0.035);
  // ojos
  const lx = (o.look ? o.look[0] : 0) * s * 0.08, ly = (o.look ? o.look[1] : 0) * s * 0.08;
  const blink = o.blink ? 0.12 : 1;
  for (const ex of [-0.27, 0.27]) {
    ell(ctx, ex * s, -s * 0.12, s * 0.2, s * 0.26 * blink); ink(ctx, C.white, s * 0.035);
    if (blink > 0.5) { ell(ctx, ex * s + lx, -s * 0.08 + ly, s * 0.09, s * 0.12); ink(ctx, C.ink, 0); ell(ctx, ex * s + lx + s * 0.03, -s * 0.13 + ly, s * 0.03, s * 0.035); ink(ctx, C.white, 0); }
  }
  // cejas
  const br = o.brows || 0; ctx.lineWidth = s * 0.06; ctx.strokeStyle = C.ink;
  ctx.beginPath(); ctx.moveTo(-s * 0.42, -s * 0.45 - br * s * 0.08); ctx.lineTo(-s * 0.14, -s * 0.42 + br * s * 0.04); ctx.moveTo(s * 0.14, -s * 0.42 + br * s * 0.04); ctx.lineTo(s * 0.42, -s * 0.45 - br * s * 0.08); ctx.stroke();
  // nariz tornillo
  ell(ctx, 0, s * 0.12, s * 0.08, s * 0.08); ink(ctx, '#C9CED6', s * 0.03); ctx.beginPath(); ctx.moveTo(-s * 0.05, s * 0.12); ctx.lineTo(s * 0.05, s * 0.12); ctx.lineWidth = s * 0.025; ctx.stroke();
  // boca
  const m = o.mouth || 'smile'; ctx.lineWidth = s * 0.055;
  if (m === 'o') { ell(ctx, 0, s * 0.38, s * 0.1, s * 0.13); ink(ctx, '#5A1E2B', s * 0.04); }
  else if (m === 'grin') { ctx.beginPath(); ctx.moveTo(-s * 0.25, s * 0.3); ctx.quadraticCurveTo(0, s * 0.62, s * 0.25, s * 0.3); ctx.closePath(); ink(ctx, '#5A1E2B', s * 0.045); }
  else if (m === 'flat') { ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.38); ctx.lineTo(s * 0.18, s * 0.36); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-s * 0.22, s * 0.32); ctx.quadraticCurveTo(0, s * 0.5, s * 0.22, s * 0.32); ctx.stroke(); }
  ctx.restore();
}
function hand(ctx, x, y, s, point = false, ang = 0) {
  ell(ctx, x, y, s * 0.13, s * 0.13); ink(ctx, C.cream, s * 0.04);
  if (point) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); rrect(ctx, s * 0.08, -s * 0.04, s * 0.2, s * 0.08, s * 0.04); ink(ctx, C.cream, s * 0.03); ctx.restore(); }
}

// ---------- piezas genéricas ----------
function arrow(ctx, x0, y0, x1, y1, { color = C.coral, w = 26, head = 48, lw = 6 } = {}) {
  const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(a);
  ctx.beginPath(); ctx.moveTo(0, -w / 2); ctx.lineTo(L - head, -w / 2); ctx.lineTo(L - head, -w); ctx.lineTo(L, 0); ctx.lineTo(L - head, w); ctx.lineTo(L - head, w / 2); ctx.lineTo(0, w / 2); ctx.closePath();
  ink(ctx, color, lw); ctx.restore();
}
function label(ctx, txt, x, y, { size = 54, bg = C.cream, fg = C.ink, rot = 0, pad = 20 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.font = `800 ${size}px Bricolage`; const w = ctx.measureText(txt).width;
  rrect(ctx, -w / 2 - pad, -size * 0.65, w + 2 * pad, size * 1.3, 18); ink(ctx, bg, 6);
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4);
  ctx.restore();
}
function ring(ctx, x, y, r, t, color = C.key) {
  for (let i = 0; i < 2; i++) { const k = (t * 1.2 + i * 0.5) % 1; ell(ctx, x, y, r * (0.6 + k), r * (0.6 + k)); ctx.lineWidth = 10 * (1 - k); ctx.strokeStyle = color; ctx.globalAlpha = 1 - k; ctx.stroke(); ctx.globalAlpha = 1; }
}
function cloud(ctx, x, y, s, color = '#FFF4E6') {
  ctx.beginPath();
  for (const [dx, dy, r] of [[-1, 0.1, 0.55], [-0.4, -0.3, 0.7], [0.35, -0.2, 0.6], [0.95, 0.12, 0.5]]) ctx.ellipse(x + dx * s, y + dy * s, r * s, r * s * 0.8, 0, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + s * 0.3, s * 1.45, s * 0.28, 0, 0, Math.PI * 2); ctx.fill();
}
function skyGrad(ctx, top, bottom, w = 1800, h = 3200) { ctx.fillStyle = shade(ctx, 0, -h / 2, 0, h / 2, top, bottom); ctx.fillRect(-w / 2, -h / 2, w, h); }
function snow(ctx, t, n = 70, seed = 3, area = [-700, -1100, 1400, 2200]) {
  const r = rng(seed); ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < n; i++) { const x0 = r(), y0 = r(), sz = 4 + r() * 9, sp = 0.05 + r() * 0.08; const x = area[0] + ((x0 + Math.sin(t + i) * 0.01) % 1) * area[2], y = area[1] + ((y0 + t * sp) % 1) * area[3]; ell(ctx, x, y, sz, sz); ctx.fill(); }
}
function rain(ctx, t, n = 80, seed = 5, area = [-700, -1100, 1400, 2200]) {
  const r = rng(seed); ctx.strokeStyle = 'rgba(190,220,255,0.75)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const x0 = r(), y0 = r(), sp = 0.5 + r() * 0.4; const x = area[0] + x0 * area[2], y = area[1] + ((y0 + t * sp) % 1) * area[3]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 50); ctx.stroke(); }
}
function sparkle(ctx, x, y, s, t) { const k = 0.6 + 0.4 * Math.sin(t * 8); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? s * 0.3 : s; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ink(ctx, C.key, 4); ctx.restore(); }

// ---------- avión ----------
function plane(ctx, x, y, s, t = 0, color = '#F4F1EA') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // ala trasera
  ctx.beginPath(); ctx.moveTo(-60, 20); ctx.lineTo(120, -150); ctx.lineTo(190, -150); ctx.lineTo(90, 30); ctx.closePath(); ink(ctx, mix(color, '#7C8DB5', 0.35));
  // fuselaje
  ctx.beginPath(); ctx.moveTo(-520, 10); ctx.quadraticCurveTo(-560, -60, -470, -80); ctx.lineTo(380, -80); ctx.quadraticCurveTo(520, -70, 560, 0); ctx.quadraticCurveTo(520, 60, 380, 70); ctx.lineTo(-460, 70); ctx.quadraticCurveTo(-540, 60, -520, 10); ctx.closePath();
  ink(ctx, warmCool(ctx, -560, -80, 1120, 150, color));
  // cola
  ctx.beginPath(); ctx.moveTo(-430, -78); ctx.lineTo(-540, -280); ctx.lineTo(-470, -280); ctx.lineTo(-330, -78); ctx.closePath(); ink(ctx, C.teal);
  // franja
  ctx.beginPath(); ctx.moveTo(-500, 20); ctx.lineTo(540, 20); ctx.lineWidth = 16; ctx.strokeStyle = C.coral; ctx.stroke();
  // ventanillas
  for (let i = 0; i < 12; i++) { ell(ctx, -360 + i * 58, -25, 14, 20); ink(ctx, '#2B3A67', 4); }
  // cabina
  ctx.beginPath(); ctx.moveTo(450, -50); ctx.quadraticCurveTo(510, -45, 530, -15); ctx.lineTo(455, -15); ctx.closePath(); ink(ctx, '#2B3A67', 4);
  // ala delantera
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-200, 230); ctx.lineTo(-120, 230); ctx.lineTo(140, 40); ctx.closePath(); ink(ctx, mix(color, '#FFE2A8', 0.2));
  ell(ctx, -60, 140, 60, 30); ink(ctx, '#B9C0CF');
  ctx.restore();
}
// ventanilla vista desde dentro
function cabinWindow(ctx, x, y, s, { fog = 0, holeGlow = 0, t = 0, sky = ['#FF9F5A', '#7A5CC2'] } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // panel de pared
  rrect(ctx, -330, -470, 660, 940, 90); ink(ctx, warmCool(ctx, -330, -470, 660, 940, '#E9E4DA'));
  // marco
  rrect(ctx, -250, -370, 500, 740, 230); ink(ctx, '#CFC8BB');
  rrect(ctx, -210, -325, 420, 650, 200); ctx.save(); ctx.clip();
  ctx.fillStyle = shade(ctx, 0, -325, 0, 325, sky[0], sky[1]); ctx.fillRect(-210, -325, 420, 650);
  cloud(ctx, -60 + ((t * 40) % 500) - 200, 120, 90, '#FFE9D6'); cloud(ctx, 120 - ((t * 25) % 500) + 200, -120, 60, '#FFD9C0');
  if (fog > 0) { ctx.fillStyle = `rgba(235,240,245,${0.85 * fog})`; ctx.fillRect(-210, -325, 420, 650); const r = rng(9); ctx.fillStyle = `rgba(255,255,255,${0.7 * fog})`; for (let i = 0; i < 30; i++) { ell(ctx, -190 + r() * 380, -300 + r() * 600, 6 + r() * 10, 6 + r() * 10); ctx.fill(); } }
  // reflejo
  ctx.globalAlpha = 0.25; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-150, -325); ctx.lineTo(-60, -325); ctx.lineTo(-210, 100); ctx.lineTo(-210, -60); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
  rrect(ctx, -210, -325, 420, 650, 200); ink(ctx, null, 8);
  // agujero de respiración en la parte baja
  if (holeGlow > 0) ring(ctx, 0, 250, 70, t);
  ell(ctx, 0, 250, 9, 9); ink(ctx, C.ink, 3);
  // persiana
  rrect(ctx, -200, -365, 400, 50, 16); ink(ctx, '#BDB4A5');
  ctx.restore();
}
// corte lateral de la ventanilla: 3 paneles
function paneSection(ctx, x, y, s, { sep = 0, t = 0, flow = 0, crack = 0, spareGlow = 0, pressure = 0, labels = true, hole = true } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const xs = [-190 - sep * 130, 0, 190 + sep * 130];
  // juntas de goma arriba y abajo
  for (const yy of [-560, 560]) { rrect(ctx, xs[0] - 50, yy - 30, xs[2] - xs[0] + 100, 60, 26); ink(ctx, '#3D3D55'); } // exterior, medio, interior
  const names = ['OUTER', 'MIDDLE', 'INNER'];
  const cols = ['#9ED8F0', '#B8E6F5', '#DFF3FA'];
  xs.forEach((px, i) => {
    const th = i === 2 ? 44 : 70;
    rrect(ctx, px - th / 2, -520, th, 1040, th / 2); ink(ctx, i === 1 && spareGlow ? mix(cols[i], '#FFE08A', spareGlow) : cols[i]);
    if (labels) label(ctx, names[i], px, i === 1 ? -660 : -740, { size: 64, rot: 0 });
  });
  if (spareGlow) { ctx.globalAlpha = 0.5 * spareGlow; ctx.shadowColor = C.key; ctx.shadowBlur = 60; rrect(ctx, xs[1] - 30, -530, 60, 1060, 30); ctx.lineWidth = 10; ctx.strokeStyle = C.key; ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
  // agujero en el panel medio
  if (hole) { rrect(ctx, xs[1] - 24, 330, 48, 26, 8); ink(ctx, C.ink, 0); }
  if (flow > 0) {
    // aire de cabina entrando por el agujero al hueco
    const r = rng(4);
    for (let i = 0; i < 26; i++) {
      const k = (r() + t * 0.35) % 1; const path = k < 0.5 ? [lerp(xs[2] - 20, xs[1] + 10, k * 2), 343] : [lerp(xs[1] - 10, xs[0] + 40, (k - 0.5) * 2), 343 - (k - 0.5) * 2 * (200 + r() * 500)];
      ctx.globalAlpha = flow * (1 - Math.abs(k - 0.5)); ell(ctx, path[0], path[1], 9, 9); ink(ctx, C.key, 3); ctx.globalAlpha = 1;
    }
  }
  if (pressure > 0) {
    for (let j = 0; j < 4; j++) { const yy = -360 + j * 220; const k = (t * 1.5 + j * 0.25) % 1; ctx.globalAlpha = pressure; arrow(ctx, xs[0] + 200 + 60 * (1 - k), yy, xs[0] + 40, yy, { color: C.coral, w: 22, head: 42 }); ctx.globalAlpha = 1; }
  }
  if (crack > 0) {
    ctx.lineWidth = 6; ctx.strokeStyle = C.ink; const r = rng(11);
    for (let i = 0; i < 6; i++) { ctx.beginPath(); let cx = xs[0], cy = -100 + r() * 200; ctx.moveTo(cx, cy); for (let j = 0; j < 4 * crack; j++) { cx += (r() - 0.5) * 30; cy += (r() - 0.5) * 220; ctx.lineTo(cx, cy); } ctx.stroke(); }
  }
  ctx.restore();
}
function thermometer(ctx, x, y, s, txt, level = 0.15) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -40, -260, 80, 420, 40); ink(ctx, '#FFFFFF');
  ell(ctx, 0, 190, 70, 70); ink(ctx, '#5BC0EB');
  rrect(ctx, -18, 160 - 380 * level, 36, 380 * level + 40, 18); ctx.fillStyle = '#5BC0EB'; ctx.fill();
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(10, -200 + i * 60); ctx.lineTo(36, -200 + i * 60); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
  if (txt) label(ctx, txt, 0, -330, { size: 64, bg: '#5BC0EB', fg: C.ink });
  ctx.restore();
}
function drill(ctx, x, y, s, spin = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -40, -60, 260, 120, 40); ink(ctx, warmCool(ctx, -40, -60, 260, 120, C.coral));
  ctx.beginPath(); ctx.moveTo(120, 40); ctx.lineTo(170, 230); ctx.lineTo(90, 230); ctx.lineTo(60, 50); ctx.closePath(); ink(ctx, mix(C.coral, '#000000', 0.2));
  rrect(ctx, -110, -30, 80, 60, 12); ink(ctx, '#3D3D55');
  ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(-260, 0); ctx.lineWidth = 22; ctx.strokeStyle = '#C9CED6'; ctx.stroke();
  for (let i = 0; i < 5; i++) { const xx = -130 - i * 26 - (spin * 26) % 26; ctx.beginPath(); ctx.moveTo(xx, -11); ctx.lineTo(xx - 14, 11); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
}


// ---------- candado ----------
function padlock(ctx, x, y, s, { t = 0, cut = 0, sep = 0, flip = 0, water = 0, ice = 0, oil = 0, drain = 0, rust = 0, glowHole = 0, body = '#E0A33A' } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // arco (sube al separar las piezas)
  ctx.save(); ctx.translate(0, -sep * 160);
  ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-150, -200); ctx.arc(0, -200, 150, Math.PI, 0); ctx.lineTo(150, 0);
  ctx.lineWidth = 70; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 52; ctx.strokeStyle = '#C9CED6'; ctx.stroke();
  ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(0, -200, 150, Math.PI * 1.15, Math.PI * 1.5); ctx.stroke();
  ctx.restore();
  // cuerpo
  rrect(ctx, -260, -40, 520, 470, 70); ink(ctx, warmCool(ctx, -260, -40, 520, 470, body), 9);
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-230, 40 + i * 100); ctx.lineTo(230, 40 + i * 100); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(27,27,47,0.25)'; ctx.stroke(); }
  if (rust > 0) { const r = rng(21); ctx.fillStyle = `rgba(150,70,30,${0.6 * rust})`; for (let i = 0; i < 18; i++) { ell(ctx, -220 + r() * 440, -10 + r() * 420, 14 + r() * 30, 10 + r() * 20); ctx.fill(); } }
  if (cut > 0) {
    // vista en corte: cilindro, pines y canal de drenaje
    ctx.save(); ctx.globalAlpha = cut;
    rrect(ctx, -170, 20, 340, 380, 40); ink(ctx, '#2B2F4A', 6);
    rrect(ctx, -60, 60, 120, 300, 50); ink(ctx, '#C9CED6', 5);
    for (let i = 0; i < 4; i++) { rrect(ctx, -110 + i * 0, 0, 0, 0, 0); rrect(ctx, -20, 80 + i * 60, 40, 36 + (i % 2) * 10, 8); ink(ctx, C.brass, 4); }
    // canal hasta el agujero de abajo
    rrect(ctx, 80, 300, 34, 130, 14); ink(ctx, '#0E1022', 4);
    ctx.restore();
  }
  // ojo de la llave delante (flip=0) o agujero de drenaje abajo (vista inferior)
  if (flip < 0.5) { ell(ctx, 0, 230, 34, 34); ink(ctx, C.ink, 0); ctx.beginPath(); ctx.moveTo(-14, 240); ctx.lineTo(14, 240); ctx.lineTo(8, 320); ctx.lineTo(-8, 320); ctx.closePath(); ink(ctx, C.ink, 0); }
  // agujero de drenaje en la base
  ell(ctx, 97, 432, 18, 8); ink(ctx, C.ink, 0);
  if (glowHole) ring(ctx, 97, 432, 60, t);
  // agua que entra por el ojo y sale por abajo
  if (water > 0) {
    const r = rng(8);
    for (let i = 0; i < 10; i++) { const k = (r() + t * 0.7) % 1; const px = lerp(0, 97, clamp(k * 1.4 - 0.2)), py = lerp(230, 470 + drain * 160, k); ctx.globalAlpha = water * (1 - k * 0.3); drop(ctx, px, py, 18); ctx.globalAlpha = 1; }
  }
  if (ice > 0) { ctx.globalAlpha = ice; rrect(ctx, -170, 260, 340, 150, 30); ink(ctx, 'rgba(200,240,255,0.85)', 6); const r = rng(3); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; for (let i = 0; i < 6; i++) { ctx.beginPath(); const xx = -150 + r() * 300; ctx.moveTo(xx, 270); ctx.lineTo(xx + 30, 330); ctx.lineTo(xx - 10, 390); ctx.stroke(); } ctx.globalAlpha = 1; }
  if (oil > 0) { oilCan(ctx, 330, 560 - 100 * oil, 0.9, -0.6); ctx.globalAlpha = oil; drop(ctx, 120, 500 - ((t * 200) % 60), 16, '#E8B04A'); ctx.globalAlpha = 1; }
  ctx.restore();
}
function drop(ctx, x, y, r, color = '#6EC8FF') { ctx.beginPath(); ctx.moveTo(x, y - r * 1.8); ctx.quadraticCurveTo(x + r * 1.1, y - r * 0.2, x, y + r); ctx.quadraticCurveTo(x - r * 1.1, y - r * 0.2, x, y - r * 1.8); ink(ctx, color, 4); }
function oilCan(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -70, -60, 140, 150, 26); ink(ctx, warmCool(ctx, -70, -60, 140, 150, C.coral));
  ctx.beginPath(); ctx.moveTo(-20, -60); ctx.lineTo(-90, -200); ctx.lineTo(-70, -205); ctx.lineTo(20, -60); ctx.closePath(); ink(ctx, '#C9CED6');
  ctx.restore();
}
function fence(ctx, y, color = '#7B6A5A') { for (let i = -8; i <= 8; i++) { rrect(ctx, i * 110 - 30, y - 300, 60, 420, 20); ink(ctx, color); } rrect(ctx, -900, y - 220, 1800, 40, 10); ink(ctx, color); rrect(ctx, -900, y - 20, 1800, 40, 10); ink(ctx, color); }

// ---------- coche, gasolinera y salpicadero ----------
function carTop(ctx, x, y, s, { color = C.coral, capSide = 1, capGlow = 0, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -170, -330, 340, 660, 120); ink(ctx, warmCool(ctx, -170, -330, 340, 660, color));
  rrect(ctx, -130, -170, 260, 150, 40); ink(ctx, '#2B3A67'); rrect(ctx, -125, 130, 250, 110, 40); ink(ctx, '#2B3A67');
  rrect(ctx, -120, -10, 240, 130, 30); ink(ctx, mix(color, '#FFFFFF', 0.15));
  for (const [wx, wy] of [[-185, -200], [185, -200], [-185, 200], [185, 200]]) { rrect(ctx, wx - 25, wy - 60, 50, 120, 18); ink(ctx, C.ink, 0); }
  // tapa del depósito
  rrect(ctx, capSide * 168 - 22, 140, 44, 70, 14); ink(ctx, '#3D3D55', 5);
  if (capGlow) ring(ctx, capSide * 168, 175, 60, t);
  ctx.restore();
}
function pump(ctx, x, y, s, color = C.teal) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -110, -330, 220, 520, 30); ink(ctx, warmCool(ctx, -110, -330, 220, 520, color));
  rrect(ctx, -75, -280, 150, 110, 16); ink(ctx, '#1E2A44');
  ctx.fillStyle = C.key; ctx.font = '800 50px Bricolage'; ctx.textAlign = 'center'; ctx.fillText('$$', 0, -210);
  rrect(ctx, -90, 190, 180, 40, 10); ink(ctx, '#3D3D55');
  ctx.beginPath(); ctx.moveTo(110, -120); ctx.bezierCurveTo(220, -100, 220, 120, 160, 160); ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.stroke();
  rrect(ctx, 120, 140, 70, 40, 10); ink(ctx, '#3D3D55');
  ctx.restore();
}
function gauge(ctx, x, y, s, { level = 0.25, arrowDir = 1, arrowGlow = 0, t = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(ctx, 0, 0, 360, 360); ink(ctx, '#1A1C2C', 10);
  ell(ctx, 0, 0, 330, 330); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.stroke();
  const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;
  for (let i = 0; i <= 8; i++) { const a = lerp(a0, a1, i / 8); ctx.beginPath(); ctx.moveTo(Math.cos(a) * 250, Math.sin(a) * 250); ctx.lineTo(Math.cos(a) * 300, Math.sin(a) * 300); ctx.lineWidth = i % 4 ? 6 : 12; ctx.strokeStyle = i < 2 ? C.coral : '#F2F2F2'; ctx.stroke(); }
  ctx.fillStyle = '#F2F2F2'; ctx.font = '800 64px Bricolage'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('E', Math.cos(a0) * 190, Math.sin(a0) * 190); ctx.fillText('F', Math.cos(a1) * 190, Math.sin(a1) * 190);
  // icono del surtidor
  ctx.save(); ctx.translate(-40, 120); rrect(ctx, -34, -50, 68, 100, 10); ctx.fillStyle = '#F2F2F2'; ctx.fill(); rrect(ctx, -22, -38, 44, 30, 4); ctx.fillStyle = '#1A1C2C'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(34, -20); ctx.lineTo(56, -10); ctx.lineTo(56, 40); ctx.lineWidth = 8; ctx.strokeStyle = '#F2F2F2'; ctx.stroke(); ctx.restore();
  // la flecha
  ctx.save(); ctx.translate(70, 120); ctx.scale(arrowDir, 1);
  if (arrowGlow) { ctx.shadowColor = C.key; ctx.shadowBlur = 40 * arrowGlow; }
  ctx.beginPath(); ctx.moveTo(-26, -30); ctx.lineTo(30, 0); ctx.lineTo(-26, 30); ctx.closePath(); ctx.fillStyle = arrowGlow ? mix('#F2F2F2', '#FFC94A', arrowGlow) : '#F2F2F2'; ctx.fill();
  ctx.restore();
  if (arrowGlow) ring(ctx, 70, 120, 60, t);
  // aguja
  const a = lerp(a0, a1, level) + Math.sin(t * 3) * 0.01;
  ctx.beginPath(); ctx.moveTo(-Math.cos(a) * 40, -Math.sin(a) * 40); ctx.lineTo(Math.cos(a) * 280, Math.sin(a) * 280); ctx.lineWidth = 14; ctx.strokeStyle = C.coral; ctx.lineCap = 'round'; ctx.stroke();
  ell(ctx, 0, 0, 36, 36); ink(ctx, '#3D3D55');
  ctx.restore();
}
function memo(ctx, x, y, s, rot, lines, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -260, -330, 520, 660, 10); ink(ctx, '#FFF8E7');
  ctx.fillStyle = C.ink; ctx.font = '800 54px Bricolage'; ctx.textAlign = 'left'; ctx.fillText('MEMO', -210, -240);
  ctx.font = '700 40px Bricolage'; lines.forEach((l, i) => ctx.fillText(l, -210, -160 + i * 60));
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-210, 60 + i * 50); ctx.lineTo(180 - (i % 2) * 90, 60 + i * 50); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(27,27,47,0.25)'; ctx.stroke(); }
  // boceto: coche visto desde arriba + flecha
  rrect(ctx, -60, 230, 90, 60, 14); ink(ctx, null, 5); arrow(ctx, 50, 260, 170, 260, { color: C.coral, w: 16, head: 30, lw: 4 });
  ctx.restore();
}
function bigNumber(ctx, txt, x, y, size, color = C.key, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; strokeText(ctx, txt, 0, 0, size, color, size * 0.14); ctx.restore(); }

// ---------- teclado ----------
function key(ctx, x, y, w, h, txt, { bump = false, press = 0, glow = 0, color = '#F4F1EA' } = {}) {
  ctx.save(); ctx.translate(x, y + press * 10);
  rrect(ctx, -w / 2, -h / 2 + 14, w, h, 22); ink(ctx, '#9AA0B5', 5);
  rrect(ctx, -w / 2, -h / 2, w, h, 22); ink(ctx, glow ? mix(color, '#FFC94A', glow) : color, 5);
  if (txt) { ctx.fillStyle = C.ink; ctx.font = `800 ${Math.round(h * 0.42)}px Bricolage`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, -h * 0.08); }
  if (bump) { rrect(ctx, -w * 0.18, h * 0.26, w * 0.36, h * 0.09, h * 0.045); ink(ctx, '#C8CCD8', 4); }
  ctx.restore();
}
const ROWS = ['QWERTYUIOP', 'ASDFGHJKL;', 'ZXCVBNM,./'];
function keyboard(ctx, x, y, s, { t = 0, glowFJ = 0, press = null } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -900, -300, 1800, 600, 50); ink(ctx, warmCool(ctx, -900, -300, 1800, 600, '#3B4466'), 8);
  ROWS.forEach((row, r) => [...row].forEach((ch, i) => {
    const kx = -760 + i * 150 + r * 40, ky = -170 + r * 150;
    const fj = ch === 'F' || ch === 'J';
    key(ctx, kx, ky, 132, 132, ch, { bump: fj, glow: fj ? glowFJ : 0, press: press === ch ? 1 : 0 });
  }));
  ctx.restore();
}
function finger(ctx, x, y, s, rot = 0, color = '#F2C9A0') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -55, -60, 110, 420, 55); ink(ctx, warmCool(ctx, -55, -60, 110, 420, color));
  rrect(ctx, -34, -40, 68, 70, 26); ink(ctx, '#F9E3CF', 4);
  ctx.restore();
}
function numpad(ctx, x, y, s, { glow5 = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -290, -380, 580, 760, 46); ink(ctx, warmCool(ctx, -290, -380, 580, 760, '#3B4466'), 8);
  const labels = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];
  labels.forEach((l, i) => key(ctx, -165 + (i % 3) * 165, -210 + Math.floor(i / 3) * 165, 140, 140, l, { bump: l === '5', glow: l === '5' ? glow5 : 0 }));
  key(ctx, -82, 285, 305, 140, '0');
  key(ctx, 165, 285, 140, 140, '.');
  ctx.restore();
}
function phone(ctx, x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -220, -440, 440, 880, 70); ink(ctx, '#1A1C2C', 10);
  rrect(ctx, -195, -405, 390, 810, 50); ink(ctx, '#DDE7F5', 4);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { rrect(ctx, -180 + i * 61, 120 + r * 80, 52, 66, 10); ink(ctx, '#FFFFFF', 3); }
  ctx.restore();
}
function desk(ctx) { ctx.fillStyle = '#C9A27A'; ctx.fillRect(-1200, -2000, 2400, 4000); for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(-1200, -1900 + i * 140); ctx.bezierCurveTo(-300, -1880 + i * 140, 300, -1940 + i * 140, 1200, -1900 + i * 140); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(120,80,40,0.25)'; ctx.stroke(); } }

module.exports = { padlock, drop, oilCan, fence, carTop, pump, gauge, memo, bigNumber, key, keyboard, finger, numpad, phone, desk,  LW, ink, rrect, ell, shade, warmCool, mix, gear, gearPath, pip, arrow, label, ring, cloud, skyGrad, snow, rain, sparkle, plane, cabinWindow, paneSection, thermometer, drill };
