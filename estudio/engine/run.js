// node engine/run.js v01 [--sample 0,1.5,3]  -> out/v01_video.mp4 (+ out/v01_meta.json) o PNG de revisión
const fs = require('fs'); const path = require('path');
const { render, FPS } = require('./core');
const id = process.argv[2];
const words = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'audio', id, 'words.json')));
const video = require(path.join(__dirname, '..', 'videos', id + '.js'))(words);
video.duration = words[words.length - 1][2] / 1000 + 0.45;
const si = process.argv.indexOf('--sample');
(async () => {
  const out = path.join(__dirname, '..', 'out');
  if (si > 0) {
    const ts = process.argv[si + 1].split(',').map(Number);
    fs.mkdirSync(path.join(out, 'review'), { recursive: true });
    await render(video, null, { frames: ts.map(t => Math.round(t * FPS)), prefix: path.join(out, 'review', id) });
    console.log('sample ok');
  } else {
    const t0 = Date.now();
    const meta = await render(video, path.join(out, id + '_video.mp4'));
    meta.duracion_s = video.duration;
    fs.writeFileSync(path.join(out, id + '_meta.json'), JSON.stringify(meta, null, 1));
    console.log('render ok', ((Date.now() - t0) / 1000).toFixed(1) + 's', JSON.stringify(meta));
  }
})();
