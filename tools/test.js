#!/usr/bin/env node
/*
 * Siap S2 — uji otomatis (dipakai juga di GitHub Actions).
 * 1. Setiap kunci jawaban di data/bank.js bisa didekode dan valid.
 * 2. Setiap generator menghasilkan soal valid (opsi unik, kunci dalam rentang, tanpa NaN).
 * 3. Setiap simulasi ujian bisa disusun dengan jumlah soal sesuai konfigurasi.
 * Jalankan setelah build:  node tools/build.js && node tools/test.js
 */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = global;
global.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
global.atob = (s) => Buffer.from(s, 'base64').toString('binary');

['data/vocab.js', 'data/bank.js', 'data/content.js', 'assets/js/util.js', 'assets/js/exams.js', 'assets/js/scoring.js', 'assets/js/content-data.js', 'assets/js/generators.js', 'assets/js/engine.js']
  .forEach((f) => require(path.join(ROOT, f)));
const S = global.SiapS2;
let fail = 0;
const bad = (msg) => { fail++; if (fail <= 30) console.error('  ✗ ' + msg); };

// 1. bank
const B = global.SIAP_BANK;
B.items.forEach((it) => {
  let k;
  try { k = S.dec(it.k); } catch (e) { bad(`${it.i}: kunci gagal didekode`); return; }
  if (!(k.a >= 0 && k.a < it.o.length)) bad(`${it.i}: kunci di luar rentang`);
  if (!S.SUBS[it.s]) bad(`${it.i}: subtopik "${it.s}" tidak terdaftar di exams.js`);
  if (it.p && !B.passages[it.p]) bad(`${it.i}: passage hilang`);
});
console.log(`✓ Bank: ${B.items.length} soal diperiksa`);

// 2. generator
let gtotal = 0;
for (const [sub, list] of Object.entries(S.GEN)) {
  list.forEach((fn, gi) => {
    let ok = 0;
    for (let t = 0; t < 200; t++) {
      const r = S.rng(t * 7919 + gi * 104729 + sub.length * 13);
      let it;
      try { it = fn(r); } catch (e) { continue; }
      gtotal++;
      if (!it.o || it.o.length < 4) bad(`${sub}[${gi}] opsi < 4`);
      else if (new Set(it.o).size !== it.o.length) bad(`${sub}[${gi}] opsi kembar: ${it.o.join(' | ')}`);
      else if (!(it.a >= 0 && it.a < it.o.length)) bad(`${sub}[${gi}] kunci tidak valid`);
      else if (/NaN|undefined|Infinity/.test(it.q + it.e + it.o.join(''))) bad(`${sub}[${gi}] NaN/undefined`);
      else ok++;
    }
    if (ok < 100) bad(`${sub}[${gi}] terlalu sering gagal (${ok}/200 valid)`);
  });
}
console.log(`✓ Generator: ${gtotal} soal acak diperiksa`);

// 3. simulasi
S.EXAMS.forEach((ex) => {
  [false, true].forEach((mini) => {
    const s = S.createExam(ex, { mini });
    const want = S.sum(ex.sections.map((sec) => S.sum(sec.draw.map(([, n]) => Math.max(1, Math.round(n * (mini ? 0.34 : 1)))))));
    if (s.q.length < want) bad(`${ex.id}${mini ? ' (mini)' : ''}: hanya ${s.q.length}/${want} soal`);
    if (s.q.some((q) => !q.k)) bad(`${ex.id}: ada soal tanpa kunci terenkode`);
    if (JSON.stringify(s).includes('"a":')) bad(`${ex.id}: kunci jawaban polos bocor ke sesi`);
  });
});
console.log(`✓ Simulasi: ${S.EXAMS.length} ujian × 2 varian disusun`);

if (fail) { console.error(`\n❌ ${fail} masalah ditemukan`); process.exit(1); }
console.log('\n✅ Semua uji lolos');
