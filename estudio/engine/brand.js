// Recursos del canal: foto de perfil, banner y marca de agua (diseños originales)
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs'); const path = require('path');
const { C, strokeText } = require('./core');
const A = require('./art');
const OUT = path.join(__dirname, '..', 'brand'); fs.mkdirSync(OUT, { recursive: true });

function bgGears(g, w, h, seed = 1) {
  const gr = g.createLinearGradient(0, 0, w * 0.4, h); gr.addColorStop(0, '#1F3263'); gr.addColorStop(1, '#14213D');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.save(); g.globalAlpha = 0.18;
  const r = A.rng ? A.rng(seed) : null;
  const spots = [[0.08, 0.2, 0.22], [0.92, 0.75, 0.3], [0.85, 0.12, 0.14], [0.15, 0.9, 0.16], [0.5, 1.05, 0.2]];
  for (const [x, y, s] of spots) A.gear(g, x * w, y * h, s * Math.min(w, h) * 1.6, { teeth: 10, rot: x * 3, color: '#9DB8D9' });
  g.restore();
}

// 1) foto de perfil 800x800 (se recorta en círculo)
{
  const c = createCanvas(800, 800), g = c.getContext('2d');
  const gr = g.createRadialGradient(400, 330, 60, 400, 400, 560); gr.addColorStop(0, '#2B4A8A'); gr.addColorStop(1, '#14213D');
  g.fillStyle = gr; g.fillRect(0, 0, 800, 800);
  g.save(); g.globalAlpha = 0.25; A.gear(g, 400, 400, 390, { teeth: 16, rot: 0.1, color: '#9DB8D9', hole: 0.86 }); g.restore();
  A.pip(g, 400, 360, 210, { mouth: 'grin', look: [0.3, -0.2], arm: 'point', pointAt: -0.6, brows: -0.3 });
  fs.writeFileSync(path.join(OUT, 'perfil_800x800.png'), c.toBuffer('image/png'));
}

// 2) banner 2560x1440 · zona segura central 1546x423 (visible en todos los dispositivos)
{
  const W = 2560, H = 1440, c = createCanvas(W, H), g = c.getContext('2d');
  bgGears(g, W, H);
  const sx = (W - 1546) / 2, sy = (H - 423) / 2;
  g.font = '800 140px Bricolage'; const tw = g.measureText('HIDDEN GEARS').width;
  g.font = '800 44px Bricolage'; const sw = g.measureText('The real reason everyday things are built like that.').width;
  const blockW = 350 + Math.max(tw, sw); const x0 = (W - blockW) / 2, tx = x0 + 350;
  A.pip(g, x0 + 130, sy + 200, 125, { mouth: 'grin', arm: 'wave', look: [1, 0] });
  g.textBaseline = 'middle'; g.textAlign = 'left';
  strokeText(g, 'HIDDEN', tx, sy + 125, 140, C.cream, 24);
  g.font = '800 140px Bricolage'; const wHidden = g.measureText('HIDDEN ').width;
  strokeText(g, 'GEARS', tx + wHidden, sy + 125, 140, C.key, 24);
  strokeText(g, 'The real reason everyday things are built like that.', tx + 4, sy + 262, 44, C.cream, 9);
  g.font = '800 40px Bricolage'; const lw = g.measureText('NEW SHORTS EVERY WEEK').width;
  A.label(g, 'NEW SHORTS EVERY WEEK', tx + lw / 2 + 24, sy + 352, { size: 40, bg: C.key });
  fs.writeFileSync(path.join(OUT, 'banner_2560x1440.png'), c.toBuffer('image/png'));
  // guía de la zona segura (solo para revisar)
  g.strokeStyle = 'rgba(255,80,80,0.9)'; g.lineWidth = 6; g.strokeRect(sx, sy, 1546, 423);
  fs.writeFileSync(path.join(OUT, 'banner_guia_zona_segura.png'), c.toBuffer('image/png'));
}

// 3) marca de agua 150x150 (PNG transparente, YouTube la pone en la esquina)
{
  const c = createCanvas(300, 300), g = c.getContext('2d');
  A.gear(g, 150, 150, 135, { teeth: 10, rot: 0.2, color: C.brass, hole: 0.0001 });
  A.ell(g, 150, 150, 95, 95); A.ink(g, '#14213D', 0);
  g.textAlign = 'center'; g.textBaseline = 'middle'; strokeText(g, 'HG', 150, 156, 92, C.key, 12);
  const s = createCanvas(150, 150); s.getContext('2d').drawImage(c, 0, 0, 150, 150);
  fs.writeFileSync(path.join(OUT, 'marca_agua_150x150.png'), s.toBuffer('image/png'));
}
console.log(fs.readdirSync(OUT));
