// Hidden Gears · motor de render por código (Canvas 2D, 1080x1920, 30 fps)
// Cada vídeo define planos ligados a palabras; el motor pone cámara, luz, grano,
// título, subtítulos y transiciones de cámara (sin cortes duros) y envía RGBA a ffmpeg.
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const W = 1080, H = 1920, FPS = 30;
const ROOT = path.join(__dirname, '..');
for (const f of ['bricolage-grotesque-latin-800-normal.woff2', 'bricolage-grotesque-latin-700-normal.woff2']) {
  GlobalFonts.registerFromPath(path.join(ROOT, 'fonts/fontsource-bricolage-grotesque-5.3.0/package/files', f), 'Bricolage');
}
const FONT = 'Bricolage';

const C = {
  ink: '#1B1B2F', brass: '#F2A541', key: '#FFC94A', cream: '#FDF6E3', night: '#14213D',
  teal: '#2EC4B6', coral: '#FF6B5B', white: '#FFFFFF',
};

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));           // entrada y salida suaves
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeBack = t => { t = clamp(t); const s = 1.7; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function camLerp(a, b, t) {
  return { x: lerp(a.x || 0, b.x || 0, t), y: lerp(a.y || 0, b.y || 0, t), z: lerp(a.z || 1, b.z || 1, t), r: lerp(a.r || 0, b.r || 0, t) };
}
function applyCam(ctx, cam, parallax = 1) {
  ctx.translate(W / 2, H / 2);
  ctx.scale(1 + (cam.z - 1) * parallax, 1 + (cam.z - 1) * parallax);
  ctx.rotate(cam.r * parallax);
  ctx.translate(-cam.x * parallax, -cam.y * parallax);
}

// ---------- capas fijas ----------
function makeGrain() {
  const tiles = [];
  for (let k = 0; k < 6; k++) {
    const c = createCanvas(360, 640); const g = c.getContext('2d');
    const img = g.createImageData(360, 640); const r = rng(77 + k);
    for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - 0.5) * 120; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0); tiles.push(c);
  }
  return tiles;
}
const GRAIN = makeGrain();

function light(ctx, mode, t) {
  // luz que sigue la historia: cálida al plantear, azul noche al explicar
  ctx.save();
  if (mode === 'night') {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(70,95,170,0.42)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createRadialGradient(W * 0.75, H * 0.2, 50, W * 0.75, H * 0.2, H * 0.7);
    g.addColorStop(0, 'rgba(90,200,255,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } else {
    ctx.globalCompositeOperation = 'soft-light';
    const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
    g.addColorStop(0, 'rgba(255,190,90,0.55)'); g.addColorStop(1, 'rgba(40,60,140,0.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';
    const r = ctx.createRadialGradient(W * 0.2, H * 0.12, 30, W * 0.2, H * 0.12, H * 0.55);
    r.addColorStop(0, 'rgba(255,200,120,0.25)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
function finish(ctx, frame) {
  ctx.save();
  const v = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.32, W / 2, H * 0.48, H * 0.78);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,10,30,0.55)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.10;
  ctx.drawImage(GRAIN[frame % GRAIN.length], 0, 0, W, H);
  ctx.restore();
}

// ---------- texto ----------
function strokeText(ctx, txt, x, y, size, fill, strokeW) {
  ctx.font = `800 ${size}px ${FONT}`;
  ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  ctx.lineWidth = strokeW; ctx.strokeStyle = C.ink; ctx.strokeText(txt, x, y);
  ctx.fillStyle = fill; ctx.fillText(txt, x, y);
}
function drawTitle(ctx, title, t) {
  // título a 2 líneas con la palabra clave en color; visible desde el fotograma 1
  const out = clamp((t - title.until) / 0.45);
  if (out >= 1) return null;
  const a = 1 - easeOut(out), dy = -60 * easeOut(out);
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let size = 104; const ys = [H * 0.125, H * 0.19];
  ctx.font = `800 ${size}px ${FONT}`;
  const widest = Math.max(...title.lines.map(l => ctx.measureText(l.replace(/\*/g, '')).width));
  if (widest > W * 0.86) size = Math.floor(size * W * 0.86 / widest);
  const boxes = [];
  title.lines.forEach((line, i) => {
    // cada línea puede tener una palabra clave entre * *
    const parts = line.split(/(\*[^*]+\*)/).filter(Boolean);
    ctx.font = `800 ${size}px ${FONT}`;
    let total = 0; const segs = parts.map(p => { const k = p.startsWith('*'); const s = k ? p.slice(1, -1) : p; const w = ctx.measureText(s).width; total += w; return { s, k, w }; });
    let x = W * 0.5 - total / 2;
    const tilt = Math.sin(t * 2.2 + i) * 0.006;
    ctx.save(); ctx.translate(W / 2, ys[i] + dy); ctx.rotate(tilt); ctx.translate(-W / 2, -(ys[i] + dy));
    ctx.textAlign = 'left';
    for (const sg of segs) { strokeText(ctx, sg.s, x, ys[i] + dy, size, sg.k ? C.key : C.cream, 22); x += sg.w; }
    ctx.restore();
    boxes.push({ x0: W * 0.5 - total / 2, x1: W * 0.5 + total / 2, y0: ys[i] - size / 2, y1: ys[i] + size / 2 });
  });
  ctx.restore();
  return boxes;
}

function chunkWords(words) {
  // bloques de 2-4 palabras; se corta en puntuación
  const blocks = []; let cur = [];
  words.forEach((w, i) => {
    cur.push(i);
    const end = /[.,?!:;…]$|\.\.\.$/.test(w[0]);
    if (cur.length >= 3 || (end && cur.length >= 2) || (end && /[.?!]$/.test(w[0]))) { blocks.push(cur); cur = []; }
  });
  if (cur.length) { if (cur.length === 1 && blocks.length) blocks[blocks.length - 1].push(...cur); else blocks.push(cur); }
  return blocks;
}
const SUB = { size: 116, cy: 0.685, maxW: 0.80, cx: 0.45 };
function drawSubs(ctx, words, blocks, tMs) {
  let bi = -1;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]; const s = words[b[0]][1] - 80; const nextS = i + 1 < blocks.length ? words[blocks[i + 1][0]][1] - 80 : words[b[b.length - 1]][2] + 400;
    if (tMs >= s && tMs < nextS) { bi = i; break; }
  }
  if (bi < 0) return null;
  const b = blocks[bi]; const t0 = words[b[0]][1] - 80;
  const pop = easeBack((tMs - t0) / 140);
  const toks = b.map(i => ({ s: words[i][0].toUpperCase(), i }));
  ctx.save(); ctx.font = `800 ${SUB.size}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const space = ctx.measureText(' ').width;
  // reparte en líneas que quepan en maxW
  const lines = [[]]; let lw = 0;
  for (const tk of toks) { tk.w = ctx.measureText(tk.s).width; if (lw + tk.w > W * SUB.maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(tk); lw += tk.w + space; }
  const lh = SUB.size * 1.08; const y0 = H * SUB.cy - (lines.length - 1) * lh / 2;
  const box = { x0: 1e9, x1: -1e9, y0: y0 - SUB.size / 2, y1: y0 + (lines.length - 1) * lh + SUB.size / 2 };
  ctx.translate(W * SUB.cx, H * SUB.cy); const sc = 0.82 + 0.18 * pop; ctx.scale(sc, sc); ctx.translate(-W * SUB.cx, -H * SUB.cy);
  lines.forEach((ln, li) => {
    const tw = ln.reduce((a, t) => a + t.w, 0) + space * (ln.length - 1);
    let x = W * SUB.cx - tw / 2; const y = y0 + li * lh;
    box.x0 = Math.min(box.x0, x); box.x1 = Math.max(box.x1, x + tw);
    for (const tk of ln) {
      const active = tMs >= words[tk.i][1] - 60 && tMs < (words[tk.i + 1] ? words[tk.i + 1][1] - 60 : words[tk.i][2] + 300);
      const said = tMs >= words[tk.i][1] - 60;
      ctx.save();
      if (active) { ctx.translate(x + tk.w / 2, y); ctx.scale(1.08, 1.08); ctx.translate(-(x + tk.w / 2), -y); }
      strokeText(ctx, tk.s, x, y, SUB.size, active ? C.key : (said ? C.white : 'rgba(255,255,255,0.92)'), 20);
      ctx.restore();
      x += tk.w + space;
    }
  });
  ctx.restore();
  return box;
}

// ---------- render ----------
function shotTimes(video) {
  const words = video.words; const total = video.duration;
  const starts = video.shots.map((s, i) => i === 0 ? 0 : Math.max(0, words[s.w][1] / 1000 - 0.20));
  return video.shots.map((s, i) => ({ s: starts[i], e: i + 1 < starts.length ? starts[i + 1] : total }));
}

function drawShot(ctx, video, shot, k, tShot, dur, tGlobal) {
  const p = clamp(tShot / dur);
  // velocidad nunca cero dentro del plano: mezcla lineal + suave
  const cam = camLerp(shot.cam[0], shot.cam[1], 0.65 * p + 0.35 * ease(p));
  // empuje lento continuo (acercamiento en cada pausa)
  cam.z *= 1 + 0.07 * p;
  ctx.save();
  ctx.fillStyle = shot.bgColor || C.night; ctx.fillRect(0, 0, W, H);
  if (shot.bg) {
    if (!shot._bgCache) {
      const c = createCanvas(W * 1.6, H * 1.6); const g = c.getContext('2d');
      g.translate(W * 0.8, H * 0.8); shot.bg(g, video); shot._bgBlurred = createCanvas(W * 1.6, H * 1.6);
      const gb = shot._bgBlurred.getContext('2d'); gb.filter = `blur(${shot.bgBlur ?? 10}px)`; gb.drawImage(c, 0, 0); shot._bgCache = c;
    }
    ctx.save(); applyCam(ctx, cam, shot.bgParallax ?? 0.35);
    ctx.drawImage(shot._bgBlurred, -W * 0.8, -H * 0.8);
    ctx.restore();
  }
  ctx.save(); applyCam(ctx, cam, 1);
  shot.draw(ctx, { p, t: tShot, dur, T: tGlobal, video, k });
  ctx.restore();
  if (shot.overlay) shot.overlay(ctx, { p, t: tShot, dur, T: tGlobal });
  light(ctx, shot.light || 'warm', tShot);
  ctx.restore();
  return cam;
}

async function render(video, outFile, opts = {}) {
  const frames = Math.round(video.duration * FPS);
  const times = shotTimes(video);
  const blocks = chunkWords(video.words);
  const main = createCanvas(W, H), ctx = main.getContext('2d');
  const A = createCanvas(W, H), B = createCanvas(W, H);
  const meta = { primer_texto_s: 0, subtitulo_altura_letra_pct: +(100 * SUB.size / H).toFixed(2), subtitulo_centro_y_pct: SUB.cy * 100, texto_bajo_20pct_inferior: false, texto_en_margen_derecho: false, planos: times.map(x => +x.s.toFixed(2)) };
  const only = opts.frames; // lista de fotogramas para revisar
  let ff = null;
  if (!only) {
    ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', `${FPS}`, '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  }
  const TR = 0.42; // duración de la transición de cámara
  const list = only || [...Array(frames).keys()];
  for (const f of list) {
    const t = f / FPS;
    let k = times.findIndex(x => t >= x.s && t < x.e); if (k < 0) k = times.length - 1;
    const sh = video.shots[k], tm = times[k];
    const next = video.shots[k + 1];
    const intoNext = next ? (t - (tm.e - TR)) / TR : -1;
    if (intoNext > 0 && next) {
      // viaje de cámara al siguiente momento: barrido con desenfoque de movimiento
      const dir = next.enter || [1, 0];
      const q = ease(intoNext);
      const ga = A.getContext('2d'), gb = B.getContext('2d');
      drawShot(ga, video, sh, k, t - tm.s, tm.e - tm.s, t);
      drawShot(gb, video, next, k + 1, 0, times[k + 1].e - times[k + 1].s, t);
      ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
      const dx = dir[0] * W, dy = dir[1] * H;
      const blur = Math.sin(Math.PI * q);
      ctx.save(); if (blur > 0.05) ctx.filter = `blur(${(9 * blur).toFixed(1)}px)`;
      ctx.drawImage(A, -dx * q, -dy * q); ctx.drawImage(B, dx * (1 - q), dy * (1 - q));
      ctx.restore();
      ctx.globalAlpha = 1;
    } else {
      drawShot(ctx, video, sh, k, t - tm.s, tm.e - tm.s, t);
    }
    const tb = video.title ? drawTitle(ctx, video.title, t) : null;
    const sb = drawSubs(ctx, video.words, blocks, t * 1000);
    if (sb) { if (sb.y1 > H * 0.8) meta.texto_bajo_20pct_inferior = true; if (sb.x1 * 1.0 > W * 0.86) meta.texto_en_margen_derecho = true; }
    if (tb) for (const b of tb) { if (b.x1 > W * 0.92) meta.texto_en_margen_derecho_titulo = true; }
    finish(ctx, f);
    if (only) {
      fs.writeFileSync(opts.prefix + `_${String(f).padStart(4, '0')}.png`, main.toBuffer('image/png'));
    } else {
      const buf = Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
  }
  if (ff) { ff.stdin.end(); await new Promise(r => ff.on('close', r)); }
  return meta;
}

module.exports = { W, H, FPS, C, FONT, clamp, lerp, ease, easeOut, easeBack, rng, render, strokeText, chunkWords };
