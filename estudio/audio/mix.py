#!/usr/bin/env python3
"""Música, efectos y logo sonoro generados por código + mezcla final.

Uso: python3 -I audio/mix.py ID --key 0 --bpm 104 --seed 1 --twist-word 43
Lee audio/ID/voice.wav, audio/ID/words.json, out/ID_meta.json (inicio de planos) y out/ID_video.mp4.
Escribe out/ID_final.mp4 con voz a -14 LUFS, música 12-18 dB por debajo y pico <= -1 dBTP.
"""
import argparse
import json
import os
import re
import subprocess
import wave

import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def wr(p, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    with wave.open(p, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def env(n, a, d, s=0.0, r=0.0):
    e = np.ones(n) * s
    na, nd = int(a * SR), int(d * SR)
    e[:na] = np.linspace(0, 1, max(na, 1))[:len(e[:na])]
    seg = e[na:na + nd]
    e[na:na + nd] = np.linspace(1, s, max(nd, 1))[:len(seg)]
    if r:
        nr = int(r * SR); e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lp(x, cut):
    # filtro paso bajo de un polo (suficiente para suavizar)
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y


def note(f, dur, kind="pluck"):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == "pluck":
        x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
        return x * env(n, 0.004, dur * 0.9) * np.exp(-t * 6)
    if kind == "pad":
        x = sum(np.sin(2 * np.pi * f * (1 + d) * t + p) for d, p in ((0, 0), (0.004, 1), (-0.005, 2))) / 3
        x += 0.25 * np.sin(2 * np.pi * f * 2 * t)
        return x * env(n, 0.35, 0.2, 0.8, 0.4)
    if kind == "bass":
        x = np.sin(2 * np.pi * f * t) + 0.2 * np.sin(2 * np.pi * 2 * f * t)
        return x * env(n, 0.01, dur * 0.8, 0.0)
    if kind == "bell":
        x = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.76 * f * t) + 0.2 * np.sin(2 * np.pi * 5.4 * f * t)
        return x * np.exp(-t * 4) * env(n, 0.002, 0.01, 1)


def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)


def music(dur, key, bpm, seed):
    r = np.random.default_rng(seed)
    n = int(dur * SR); out = np.zeros(n)
    beat = 60 / bpm
    prog = [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]]  # I-vi-IV-V con séptimas
    r.shuffle(prog[1:])
    root = 57 + key
    bar = 4 * beat
    nb = int(np.ceil(dur / bar))
    pattern = r.permutation([0, 1, 2, 3, 2, 1, 3, 0])
    for b in range(nb):
        ch = prog[b % 4]; t0 = b * bar
        for m in ch[:3]:
            x = note(mtof(root + m), bar + 0.3, "pad") * 0.10
            i = int(t0 * SR); out[i:i + len(x)] += x[:max(0, n - i)]
        x = note(mtof(root - 12 + ch[0]), beat * 1.8, "bass") * 0.35
        for k in (0, 2):
            i = int((t0 + k * beat) * SR); out[i:i + len(x)] += x[:max(0, n - i)]
        for s in range(8):  # arpegio en corcheas
            m = ch[pattern[s] % 4] + 12
            x = note(mtof(root + m), beat * 0.9, "pluck") * 0.16
            i = int((t0 + s * beat / 2) * SR); out[i:i + len(x)] += x[:max(0, n - i)]
        for k in range(4):  # golpe suave y charles
            kt = np.arange(int(0.18 * SR)) / SR
            kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 18) * 0.45
            i = int((t0 + k * beat) * SR); out[i:i + len(kick)] += kick[:max(0, n - i)]
            hat = r.standard_normal(int(0.04 * SR)) * np.exp(-np.arange(int(0.04 * SR)) / SR * 90) * 0.05
            i = int((t0 + k * beat + beat / 2) * SR); out[i:i + len(hat)] += hat[:max(0, n - i)]
    fade = int(0.3 * SR); out[-fade:] *= np.linspace(1, 0.4, fade)
    return out


def whoosh(d=0.45, seed=0):
    r = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    x = r.standard_normal(n)
    sweep = np.sin(np.pi * t / d) ** 2
    y = lp(x, 900) * sweep
    return y / (np.abs(y).max() + 1e-9) * 0.5


def ratchet_logo():
    # logo sonoro de 1 s: 3 clics de carraca + campanilla de 2 notas (Mi5 -> Si5)
    n = int(1.0 * SR); out = np.zeros(n)
    r = np.random.default_rng(7)
    for k in range(3):
        cl = r.standard_normal(int(0.012 * SR)) * np.exp(-np.arange(int(0.012 * SR)) / SR * 400)
        cl = cl + np.sin(2 * np.pi * 2400 * np.arange(len(cl)) / SR) * np.exp(-np.arange(len(cl)) / SR * 300)
        i = int(k * 0.09 * SR); out[i:i + len(cl)] += cl * 0.5
    for j, m in enumerate((76, 83)):
        b = note(mtof(m), 0.7, "bell") * 0.35
        i = int((0.3 + j * 0.14) * SR); out[i:i + len(b)] += b[:max(0, n - i)]
    return out


def pop():
    n = int(0.08 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (900 - 5000 * t) * t) * np.exp(-t * 60) * 0.4


def place(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf):
        return
    m = min(len(x), len(buf) - i); buf[i:i + m] += x[:m] * gain


def lufs(path):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", p.stderr)[-1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id"); ap.add_argument("--key", type=int, default=0); ap.add_argument("--bpm", type=float, default=104)
    ap.add_argument("--seed", type=int, default=1); ap.add_argument("--twist-word", type=int, required=True)
    ap.add_argument("--pops", default="", help="instantes (s) con 'pop'")
    a = ap.parse_args()
    adir = f"{ROOT}/audio/{a.id}"; out = f"{ROOT}/out"
    meta = json.load(open(f"{out}/{a.id}_meta.json")); words = json.load(open(f"{adir}/words.json"))
    dur = meta["duracion_s"]
    n = int(dur * SR)

    mus = music(dur, a.key, a.bpm, a.seed)
    sfx = np.zeros(n)
    for s in meta["planos"][1:]:
        place(sfx, whoosh(seed=int(s * 10)), max(0, s - 0.42 + 0.0), 0.8)
    place(sfx, ratchet_logo(), words[a.twist_word][1] / 1000 - 0.05, 0.9)
    for p in filter(None, a.pops.split(",")):
        place(sfx, pop(), float(p), 0.8)

    wr(f"{adir}/music.wav", mus); wr(f"{adir}/sfx.wav", sfx)
    # 1) voz a -14 LUFS (dos pasadas de loudnorm), 2) música a -30 LUFS (16 dB por debajo) con ducking
    v14 = f"{adir}/voice14.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{adir}/voice.wav", "-af",
                    "loudnorm=I=-14:TP=-2:LRA=7:linear=true", "-ar", str(SR), "-ac", "2", v14], check=True)
    gv = -14 - lufs(v14)
    gm = -30 - lufs(f"{adir}/music.wav")
    fc = (f"[1:a]volume={gv:.2f}dB[v];[2:a]volume={gm:.2f}dB[m];[v]asplit[v1][v2];"
          f"[m][v2]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=300[md];"
          f"[3:a]volume=-8dB[s];[v1][md][s]amix=inputs=3:normalize=0,"
          f"alimiter=limit=0.84:level=false,apad=whole_dur={dur}[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{out}/{a.id}_video.mp4", "-i", v14, "-i", f"{adir}/music.wav",
                    "-i", f"{adir}/sfx.wav", "-filter_complex", fc, "-map", "0:v", "-map", "[a]",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", str(SR), "-t", f"{dur}",
                    "-movflags", "+faststart", f"{out}/{a.id}_final.mp4"], check=True)
    print(json.dumps({"voz_lufs": round(lufs(v14) + gv, 1), "musica_lufs": round(lufs(f"{adir}/music.wav") + gm, 1),
                      "final_lufs": lufs(f"{out}/{a.id}_final.mp4")}))


if __name__ == "__main__":
    main()
