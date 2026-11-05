#!/usr/bin/env node
/*
 * Siap S2 — audit tampilan teks soal.
 * Mencari teks yang akan tampil "mentah" di layar, misalnya tag HTML yang ter-escape
 * (<span class="seq"> terlihat sebagai tulisan) atau entitas seperti &times; yang tidak dirender.
 * Memeriksa semua soal bank, bacaan, dan 300 sampel per generator di keempat tingkat kesulitan.
 * Jalankan setelah build:  node tools/audit-render.js
 */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = global;
global.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
global.atob = (s) => Buffer.from(s, 'base64').toString('binary');
['data/vocab.js', 'data/bank.js', 'data/content.js', 'assets/js/util.js', 'assets/js/exams.js', 'assets/js/scoring.js', 'assets/js/content-data.js', 'assets/js/generators.js']
  .forEach((f) => require(path.join(ROOT, f)));
const S = global.SiapS2;
const B = global.SIAP_BANK;
const problems = [];
const RAW = /&lt;\/?[a-z][^&]*&gt;|&amp;[a-z]+;|&amp;#\d+;|\bundefined\b|\bNaN\b|\[object Object\]/i;
const check = (where, html) => { const m = String(html).match(RAW); if (m) problems.push(`${where}: "${m[0]}"`); };
const checkRawHtml = (where, html) => {
  // stem tepercaya dari generator: pastikan tag seimbang dan tanpa teks "undefined"
  const open = (String(html).match(/<span\b/g) || []).length, close = (String(html).match(/<\/span>/g) || []).length;
  if (open !== close) problems.push(`${where}: <span> tidak seimbang (${open}/${close})`);
  if (/undefined|NaN|\[object/.test(html)) problems.push(`${where}: berisi undefined/NaN`);
};

B.items.forEach((it) => {
  check(it.i + ' soal', S.rich(it.q));
  it.o.forEach((o, j) => check(`${it.i} opsi ${j}`, it.h ? o : S.rich(o)));
  check(it.i + ' pembahasan', S.rich(S.dec(it.k).e || ''));
});
Object.entries(B.passages || {}).forEach(([id, p]) => {
  if (p.au) p.au.forEach(([, t], j) => check(`audio ${id} baris ${j}`, S.esc(t)));
  else check('bacaan ' + id, S.rich(p.x));
});

let n = 0;
for (const sub of Object.keys(S.GEN)) {
  for (const minL of [1, 2, 3, 4]) {
    for (let t = 0; t < 75; t++) {
      const g = S.generate(sub, S.rng(t * 131 + minL * 7 + sub.length), minL);
      if (!g) continue;
      n++;
      const where = `gen ${sub} L${g.l || 2}`;
      if (g.qh) checkRawHtml(where + ' soal', g.q); else check(where + ' soal', S.rich(g.q));
      g.o.forEach((o, j) => check(`${where} opsi ${j}`, g.h ? o : S.rich(o)));
      check(where + ' pembahasan', S.rich(g.e || ''));
    }
  }
}
const uniq = [...new Set(problems)];
console.log(`Diperiksa: ${B.items.length} soal bank, ${Object.keys(B.passages || {}).length} bacaan, ${n} soal generator.`);
if (uniq.length) { console.error(`❌ ${uniq.length} potensi teks mentah:\n  ` + uniq.slice(0, 40).join('\n  ')); process.exit(1); }
console.log('✅ Tidak ada tag HTML/entitas mentah yang akan tampil sebagai teks.');
