#!/usr/bin/env node
/*
 * Siap S2 — build script
 * ----------------------------------------------------------------------------
 * 1. Membaca semua bank soal di folder bank/ (format ringkas, mudah ditulis).
 * 2. Memvalidasi setiap soal (jumlah opsi, kunci, passage, duplikat, dll).
 * 3. Mengacak urutan opsi secara deterministik lalu MENGENKODE kunci jawaban +
 *    pembahasan, sehingga kunci tidak tampil di aplikasi sebelum ujian selesai.
 * 4. Menggabungkan konten belajar (content/*.md) dan kosakata ke folder data/.
 *
 * Jalankan:  node tools/build.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BANK_DIR = path.join(ROOT, 'bank');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUT_DIR = path.join(ROOT, 'data');
const KEY = 'LJK-2B-SiapS2'; // harus sama dengan assets/js/util.js

function enc(obj) {
  const b = Buffer.from(JSON.stringify(obj), 'utf8');
  for (let i = 0; i < b.length; i++) b[i] ^= KEY.charCodeAt(i % KEY.length);
  return b.toString('base64');
}
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, r) {
  const b = arr.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

const WE_RE = /\[([A-D])\|([^\]]+)\]/g;
const CAT_OK = ['verbal', 'kuantitatif', 'penalaran', 'english'];
const errors = [];
const warnings = [];
const items = [];
const passages = {};
const stemsSeen = new Map();

const files = fs.readdirSync(BANK_DIR).filter((f) => f.endsWith('.js') && f !== 'vocab.js').sort();
for (const f of files) {
  const mod = require(path.join(BANK_DIR, f));
  const prefix = mod.prefix || path.basename(f, '.js');
  for (const [pid, p] of Object.entries(mod.passages || {})) {
    if (passages[pid]) errors.push(`${f}: passage ${pid} duplikat`);
    // Bacaan tertulis memakai x (teks); audio panjang (listening Part B/C) memakai au: [['W'|'M'|'N', kalimat], ...]
    const okAudio = Array.isArray(p.au) && p.au.length >= 2 && p.au.every((l) => Array.isArray(l) && /^[WMN]$/.test(l[0]) && typeof l[1] === 'string' && l[1].trim());
    if (!p.t || !(p.x || okAudio)) errors.push(`${f}: passage ${pid} wajib punya t (judul) dan x (teks) atau au (skrip audio)`);
    passages[pid] = p;
  }
  const counters = {};
  for (const set of mod.sets || []) {
    const cat = set.cat || mod.cat;
    const sub = set.sub;
    if (!CAT_OK.includes(cat)) errors.push(`${f}: kategori tidak dikenal "${cat}"`);
    for (const raw of set.items) {
      counters[sub] = (counters[sub] || 0) + 1;
      const id = `${prefix}.${sub}.${String(counters[sub]).padStart(3, '0')}`;
      let it;
      if (Array.isArray(raw)) {
        if (set.type === 'we') {
          const [sent, letter, e] = raw;
          const parts = [...sent.matchAll(WE_RE)];
          if (parts.length !== 4) errors.push(`${id}: written expression wajib 4 bagian bergaris bawah (ditemukan ${parts.length})`);
          parts.forEach((m, i) => { if (m[1] !== 'ABCD'[i]) errors.push(`${id}: urutan penanda harus A,B,C,D`); });
          it = { q: sent, o: parts.map((m) => m[2]), a: 'ABCD'.indexOf(letter), e, f: true, we: true };
        } else {
          const e = raw[raw.length - 1];
          const head = raw[0];
          const opts = raw.slice(1, -1);
          const q = set.stem ? set.stem.replace('{w}', head) : head;
          it = { q, o: opts, a: 0, e };
        }
      } else {
        it = { ...raw };
      }
      it.i = id;
      it.c = cat;
      it.s = sub;
      it.l = it.l || set.level || 2;
      if (set.passage && !it.p) it.p = set.passage;

      // --- validasi ---
      if (!it.q || typeof it.q !== 'string') errors.push(`${id}: stem kosong`);
      if (!Array.isArray(it.o) || it.o.length < 2 || it.o.length > 5) errors.push(`${id}: jumlah opsi harus 2–5 (ada ${it.o && it.o.length})`);
      if (typeof it.a !== 'number' || it.a < 0 || it.a >= it.o.length) errors.push(`${id}: indeks kunci tidak valid (${it.a})`);
      const norm = it.o.map((o) => String(o).trim().toLowerCase());
      if (new Set(norm).size !== norm.length && !it.we) errors.push(`${id}: ada opsi kembar → ${it.o.join(' | ')}`);
      if (it.o.some((o) => String(o).trim() === '')) errors.push(`${id}: ada opsi kosong`);
      if (!it.e) warnings.push(`${id}: belum ada pembahasan`);
      if (it.p && !passages[it.p]) errors.push(`${id}: passage "${it.p}" tidak ditemukan`);
      if (it.au && (!Array.isArray(it.au) || !it.au.length)) errors.push(`${id}: audio script tidak valid`);
      const stemKey = `${sub}::${it.q.trim().toLowerCase()}::${it.p || ''}`;
      if (stemsSeen.has(stemKey) && !it.au && !set.sameStem) warnings.push(`${id}: stem sama dengan ${stemsSeen.get(stemKey)}`);
      stemsSeen.set(stemKey, id);

      // --- acak opsi deterministik (kecuali urutan tetap) ---
      if (!it.f) {
        const perm = shuffle(it.o.map((_, i) => i), rng(hash(id)));
        it.o = perm.map((i) => it.o[i]);
        it.a = perm.indexOf(it.a);
      }
      const out = { i: it.i, c: it.c, s: it.s, l: it.l, q: it.q, o: it.o };
      if (it.p) out.p = it.p;
      if (it.f) out.f = 1;
      if (it.we) out.we = 1;
      if (it.au) out.au = it.au;
      if (it.h) out.h = 1;
      out.k = enc({ a: it.a, e: it.e || '' });
      items.push(out);
    }
  }
}

// --- laporan ---
const counts = {};
for (const it of items) {
  counts[it.c] = counts[it.c] || {};
  counts[it.c][it.s] = (counts[it.c][it.s] || 0) + 1;
}
const ansDist = [0, 0, 0, 0, 0];
const keyed = items.map((it) => {
  const b = Buffer.from(it.k, 'base64');
  for (let i = 0; i < b.length; i++) b[i] ^= KEY.charCodeAt(i % KEY.length);
  return JSON.parse(b.toString('utf8')).a;
});
keyed.forEach((a) => ansDist[a]++);

console.log('\n📚 Bank soal Siap S2');
for (const [c, subs] of Object.entries(counts)) {
  const tot = Object.values(subs).reduce((a, b) => a + b, 0);
  console.log(`  ${c.padEnd(12)} ${String(tot).padStart(4)}  ` + Object.entries(subs).map(([s, n]) => `${s}:${n}`).join('  '));
}
console.log(`  ${'TOTAL'.padEnd(12)} ${String(items.length).padStart(4)}  | passage: ${Object.keys(passages).length}`);
console.log(`  Sebaran kunci A–E: ${ansDist.map((n, i) => 'ABCDE'[i] + '=' + n).join(' ')}`);
if (warnings.length) console.log(`\n⚠️  ${warnings.length} peringatan:\n  ` + warnings.slice(0, 40).join('\n  '));
if (errors.length) {
  console.error(`\n❌ ${errors.length} error:\n  ` + errors.join('\n  '));
  process.exit(1);
}

// --- tulis output ---
fs.mkdirSync(OUT_DIR, { recursive: true });
const header = '/* AUTO-GENERATED oleh tools/build.js — jangan diedit manual. Sumber: folder bank/ */\n';
const bankObj = { v: 1, passages, items };
fs.writeFileSync(path.join(OUT_DIR, 'bank.js'), header + 'window.SIAP_BANK=' + JSON.stringify(bankObj) + ';\n');

const vocab = require(path.join(BANK_DIR, 'vocab.js'));
const vSeen = new Set();
vocab.forEach((v, i) => {
  if (!Array.isArray(v) || v.length < 5) errors.push(`vocab #${i}: format [kata, kelas, sinonim, arti, contoh]`);
  const w = String(v[0]).toLowerCase();
  if (vSeen.has(w)) warnings.push(`vocab duplikat: ${w}`);
  vSeen.add(w);
});
fs.writeFileSync(path.join(OUT_DIR, 'vocab.js'), header.replace('bank/', 'bank/vocab.js') + 'window.SIAP_VOCAB=' + JSON.stringify(vocab) + ';\n');

const content = {};
for (const f of fs.readdirSync(CONTENT_DIR).filter((x) => x.endsWith('.md')).sort()) {
  content[path.basename(f, '.md')] = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8');
}
fs.writeFileSync(path.join(OUT_DIR, 'content.js'), header.replace('bank/', 'content/') + 'window.SIAP_CONTENT=' + JSON.stringify(content) + ';\n');

console.log(`\n✅ Selesai: data/bank.js (${items.length} soal), data/vocab.js (${vocab.length} kata), data/content.js (${Object.keys(content).length} halaman)\n`);
