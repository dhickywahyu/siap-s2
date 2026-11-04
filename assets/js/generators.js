/* Siap S2 — generator soal otomatis.
 * Setiap generator menerima rng dan mengembalikan soal {c,s,l,q,o,a,e} dengan kunci yang DIHITUNG,
 * sehingga variasi soal tak terbatas dan kuncinya selalu konsisten.
 */
(function (S) {
  'use strict';
  const GEN = {};
  const add = (sub, fn) => (GEN[sub] = GEN[sub] || []).push(fn);
  const K = 'kuantitatif', P = 'penalaran', E = 'english';

  const nf = (n) => (typeof n === 'number' ? n.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : String(n));
  const rp = (n) => 'Rp' + n.toLocaleString('id-ID');
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const lcm = (a, b) => (a / gcd(a, b)) * b;
  const frac = (n, d) => { const g = gcd(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : `${n}/${d}`; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const hhmm = (min) => { min = ((Math.round(min) % 1440) + 1440) % 1440; return `${String(Math.floor(min / 60)).padStart(2, '0')}.${String(min % 60).padStart(2, '0')}`; };
  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const NAMA = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hana', 'Indra', 'Joko', 'Kirana', 'Lestari', 'Maya', 'Nadia', 'Oki', 'Putri', 'Raka', 'Sari', 'Tono', 'Wulan'];

  /** Rangkai opsi: nilai benar + kandidat pengecoh (diambil yang unik setelah dirender). */
  function build(r, base, correct, cands, render = nf, nOpt = 5) {
    const ck = render(correct);
    const seen = new Set([ck]);
    const ds = [];
    for (const c of cands) {
      if (c == null || (typeof c === 'number' && !isFinite(c))) continue;
      const k = render(c);
      if (!seen.has(k)) { seen.add(k); ds.push(k); }
      if (ds.length === nOpt - 1) break;
    }
    if (ds.length < nOpt - 1) throw new Error('pengecoh kurang');
    const o = r.shuffle([ck, ...ds]);
    return Object.assign({ l: 2 }, base, { o, a: o.indexOf(ck) });
  }
  function near(r, x, step, count = 12, allowNeg = false) {
    const out = [];
    for (let d = 1; d <= count; d++) out.push(x + d * step, x - d * step);
    return r.shuffle(out.filter((v) => allowNeg || v > 0));
  }
  const seqQ = (arr, tail = ', …') => `Bilangan selanjutnya dari deret berikut adalah …<span class="seq">${arr.map(nf).join(', ')}${tail}</span>`;

  /* =====================  DERET ANGKA  ===================== */
  add('deret', (r) => { // aritmetika
    const d = r.pick([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15, 17, -3, -4, -6, -7, -9]);
    const a = d > 0 ? r.int(2, 45) : r.int(90, 160);
    const s = [0, 1, 2, 3, 4, 5].map((i) => a + i * d);
    return build(r, { c: K, s: 'deret', l: 1, q: seqQ(s.slice(0, 5)), e: `Selisih tetap ${d > 0 ? '+' : '−'}${Math.abs(d)}. Suku berikutnya: ${s[4]} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${s[5]}.` },
      s[5], [s[5] + d, s[5] + 1, s[5] - 1, s[5] + 2, ...near(r, s[5], 3)]);
  });
  add('deret', (r) => { // geometri
    let s, e;
    if (r.chance(0.65)) {
      const q = r.pick([2, 3]);
      const a = q === 2 ? r.int(1, 9) : r.int(1, 4);
      s = [0, 1, 2, 3, 4, 5].map((i) => a * q ** i);
      e = `Setiap suku dikali ${q}. ${nf(s[4])} × ${q} = ${nf(s[5])}.`;
    } else {
      const last = r.int(2, 9);
      s = [32, 16, 8, 4, 2, 1].map((m) => last * m);
      e = `Setiap suku dibagi 2. ${s[4]} ÷ 2 = ${s[5]}.`;
    }
    const diff = s[4] - s[3];
    return build(r, { c: K, s: 'deret', l: 1, q: seqQ(s.slice(0, 5)), e }, s[5], [s[4] + diff, s[5] + s[0], s[5] * 2, s[5] - 1, ...near(r, s[5], Math.max(1, Math.round(s[5] / 6)))]);
  });
  add('deret', (r) => { // bertingkat
    const a = r.int(1, 25), d0 = r.int(1, 6), dd = r.int(1, 4);
    const s = [a];
    const diffs = [];
    for (let i = 0; i < 5; i++) { diffs.push(d0 + i * dd); s.push(s[i] + d0 + i * dd); }
    return build(r, { c: K, s: 'deret', l: 2, q: seqQ(s.slice(0, 5)), e: `Selisih antarsuku: ${diffs.slice(0, 4).join(', ')} (bertambah ${dd}). Selisih berikutnya ${diffs[4]}, jadi ${s[4]} + ${diffs[4]} = ${s[5]}.` },
      s[5], [s[4] + diffs[3], s[5] + dd, s[5] - dd, s[5] + 1, ...near(r, s[5], 2)]);
  });
  add('deret', (r) => { // selang-seling dua deret
    const a1 = r.int(1, 20), d1 = r.pick([2, 3, 4, 5]), a2 = r.int(20, 60), d2 = r.pick([-2, -3, -4, 3, 5, 6]);
    const s1 = [0, 1, 2, 3].map((i) => a1 + i * d1), s2 = [0, 1, 2, 3].map((i) => a2 + i * d2);
    const seq = [s1[0], s2[0], s1[1], s2[1], s1[2], s2[2], s1[3]];
    const ans = s2[3];
    return build(r, { c: K, s: 'deret', l: 2, q: seqQ(seq), e: `Dua deret selang-seling. Suku ganjil: ${s1.join(', ')} (${d1 > 0 ? '+' : ''}${d1}); suku genap: ${s2.slice(0, 3).join(', ')} (${d2 > 0 ? '+' : ''}${d2}). Suku berikutnya adalah suku genap: ${s2[2]} ${d2 > 0 ? '+' : '−'} ${Math.abs(d2)} = ${ans}.` },
      ans, [s1[3] + d1, s1[3] + d2, ans + d2, ans - d2, ...near(r, ans, 1)]);
  });
  add('deret', (r) => { // fibonacci
    const a = r.int(1, 6), b = r.int(a, 9);
    const s = [a, b];
    while (s.length < 7) s.push(s[s.length - 1] + s[s.length - 2]);
    return build(r, { c: K, s: 'deret', l: 2, q: seqQ(s.slice(0, 6)), e: `Setiap suku = jumlah dua suku sebelumnya. ${s[4]} + ${s[5]} = ${s[6]}.` },
      s[6], [s[5] * 2, s[5] + (s[5] - s[4]), s[6] + 1, s[6] - 1, ...near(r, s[6], 2)]);
  });
  add('deret', (r) => { // kuadrat / kubik
    if (r.chance(0.7)) {
      const k = r.int(1, 9), c = r.pick([0, 0, 1, -1, 2, 3]);
      const s = [0, 1, 2, 3, 4, 5].map((i) => (k + i) ** 2 + c);
      const cs = c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`;
      return build(r, { c: K, s: 'deret', l: 2, q: seqQ(s.slice(0, 5)), e: `Pola n²${cs} dengan n = ${k}, ${k + 1}, … Suku berikutnya ${k + 5}²${cs} = ${s[5]}.` },
        s[5], [s[4] + (s[4] - s[3]), s[5] + 1, s[5] - 1, s[5] + 2, ...near(r, s[5], 3)]);
    }
    const k = r.int(1, 3);
    const s = [0, 1, 2, 3, 4, 5].map((i) => (k + i) ** 3);
    return build(r, { c: K, s: 'deret', l: 2, q: seqQ(s.slice(0, 5)), e: `Bilangan kubik: ${k}³, ${k + 1}³, … Suku berikutnya ${k + 5}³ = ${s[5]}.` },
      s[5], [s[4] + (s[4] - s[3]), (k + 5) ** 2, s[5] + 1, s[5] - 1, ...near(r, s[5], 7)]);
  });
  add('deret', (r) => { // operasi bergantian
    const pats = [
      [['×', 2], ['+', 1]], [['×', 2], ['−', 1]], [['+', 3], ['×', 2]], [['×', 3], ['−', 2]],
      [['+', 4], ['×', 2]], [['×', 2], ['+', 3]], [['+', 5], ['−', 2]], [['×', 2], ['−', 3]],
    ];
    const pat = r.pick(pats);
    const ap = (x, [op, v]) => (op === '×' ? x * v : op === '+' ? x + v : x - v);
    const s = [r.int(2, 9)];
    for (let i = 0; i < 5; i++) s.push(ap(s[i], pat[i % 2]));
    const last = pat[4 % 2];
    return build(r, { c: K, s: 'deret', l: 3, q: seqQ(s.slice(0, 5)), e: `Pola operasi bergantian: ${pat[0].join('')} lalu ${pat[1].join('')}. Langkah berikutnya ${last.join('')}: ${s[4]} ${last[0]} ${last[1]} = ${s[5]}.` },
      s[5], [ap(s[4], pat[1]), s[5] + 1, s[5] - 1, s[5] + 2, ...near(r, s[5], 3)]);
  });
  add('deret', (r) => { // suku hilang di tengah
    const d = r.pick([4, 5, 6, 7, 8, 9, 12, 15]), a = r.int(3, 40);
    const s = [0, 1, 2, 3, 4].map((i) => a + i * d);
    const q = `Bilangan yang tepat untuk mengisi titik-titik adalah …<span class="seq">${s[0]}, ${s[1]}, …, ${s[3]}, ${s[4]}</span>`;
    return build(r, { c: K, s: 'deret', l: 1, q, e: `Selisih tetap +${d}: ${s[1]} + ${d} = ${s[2]} (cek: ${s[2]} + ${d} = ${s[3]}).` }, s[2], [s[2] + 1, s[2] - 1, s[2] + 2, s[2] - 2, ...near(r, s[2], 3)]);
  });

  /* =====================  DERET HURUF  ===================== */
  const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = (i) => AB[((i % 26) + 26) % 26];
  add('deret-huruf', (r) => {
    const start = r.int(0, 8);
    const steps = r.pick([[2], [3], [4], [5], [1, 2], [2, 3], [3, 1], [1, 3]]);
    const idx = [start];
    for (let i = 0; i < 5; i++) idx.push(idx[i] + steps[i % steps.length]);
    const ans = L(idx[5]);
    const q = `Huruf selanjutnya dari deret berikut adalah …<span class="seq">${idx.slice(0, 5).map(L).join(', ')}, …</span>`;
    const e = `Ubah ke urutan abjad: ${idx.slice(0, 5).map((i) => `${L(i)}(${(i % 26) + 1})`).join(', ')}. Lompatan ${steps.join(', ')}${steps.length > 1 ? ' bergantian' : ''}. Huruf berikutnya ${ans}(${(idx[5] % 26) + 1}).`;
    return build(r, { c: P, s: 'deret-huruf', l: 1, q, e }, ans, [L(idx[5] + 1), L(idx[5] - 1), L(idx[5] + 2), L(idx[5] - 2), L(idx[5] + 3)], String);
  });
  add('deret-huruf', (r) => {
    const a = r.int(0, 5), b = 25 - r.int(0, 4), da = r.pick([1, 2]), db = r.pick([1, 2]);
    const seq = [];
    for (let i = 0; i < 4; i++) { seq.push(a + i * da); seq.push(b - i * db); }
    const ans = L(seq[6]);
    const q = `Huruf selanjutnya dari deret berikut adalah …<span class="seq">${seq.slice(0, 6).map(L).join(', ')}, …</span>`;
    const e = `Dua pola selang-seling: dari depan abjad ${[0, 2, 4].map((i) => L(seq[i])).join(', ')} (+${da}) dan dari belakang ${[1, 3, 5].map((i) => L(seq[i])).join(', ')} (−${db}). Berikutnya giliran pola depan: ${ans}.`;
    return build(r, { c: P, s: 'deret-huruf', l: 2, q, e }, ans, [L(seq[7]), L(seq[6] + 1), L(seq[6] - 1), L(seq[7] - 1), L(seq[6] + 2)], String);
  });

  /* =====================  ARITMETIKA & OPERASI  ===================== */
  const PCT = [[12.5, 8, '1/8'], [25, 4, '1/4'], [37.5, 8, '3/8'], [62.5, 8, '5/8'], [75, 4, '3/4'], [20, 5, '1/5'], [40, 5, '2/5'], [60, 5, '3/5'], [15, 20, '3/20'], [5, 20, '1/20'], [87.5, 8, '7/8']];
  const DEC = [[0.25, 4, '1/4'], [0.75, 4, '3/4'], [0.125, 8, '1/8'], [0.5, 2, '1/2'], [0.2, 5, '1/5'], [0.4, 5, '2/5']];
  add('aritmetika', (r) => {
    const [p, pd, pf] = r.pick(PCT), [d, dd, df] = r.pick(DEC);
    const b = pd * r.int(3, 30), c = dd * r.int(3, 30);
    const x = (p * b) / 100, y = d * c, ans = x + y;
    const q = `Hasil dari ${nf(p)}% × ${b} + ${nf(d)} × ${c} = …`;
    const e = `${nf(p)}% = ${pf} → ${pf} × ${b} = ${nf(x)}. ${nf(d)} = ${df} → ${df} × ${c} = ${nf(y)}. Total ${nf(ans)}. Trik: ubah persen/desimal ke pecahan agar bisa dicoret.`;
    return build(r, { c: K, s: 'aritmetika', l: 1, q, e }, ans, [x + c, b + y, ans + 1, ans - 1, x * 2 + y, ...near(r, ans, 2)]);
  });
  add('aritmetika', (r) => {
    const n = r.int(12, 48), m = r.int(11, 25), k = r.int(10, 99);
    const ans = n + m * m - k;
    return build(r, { c: K, s: 'aritmetika', l: 1, q: `Nilai dari √${(n * n).toLocaleString('id-ID')} + ${m}² − ${k} = …`, e: `√${n * n} = ${n} (karena ${n}² = ${n * n}); ${m}² = ${m * m}. Jadi ${n} + ${m * m} − ${k} = ${ans}.` },
      ans, [ans + 10, ans - 10, ans + 1, ans - 1, n * 2 + m * m - k, ...near(r, ans, 4, 12, true)]);
  });
  add('aritmetika', (r) => {
    const t = r.int(0, 5);
    let q, ans, e;
    if (t === 0) { const k = r.int(3, 39); ans = 25 * 4 * k; q = `25 × ${4 * k} = …`; e = `25 × 4 = 100, jadi 25 × ${4 * k} = 100 × ${k} = ${nf(ans)}.`; }
    else if (t === 1) { const k = r.int(2, 19); ans = 125 * 8 * k; q = `125 × ${8 * k} = …`; e = `125 × 8 = 1.000, jadi 125 × ${8 * k} = 1.000 × ${k} = ${nf(ans)}.`; }
    else if (t === 2) { const n = r.int(13, 97); ans = 99 * n; q = `99 × ${n} = …`; e = `99 × ${n} = 100 × ${n} − ${n} = ${nf(100 * n)} − ${n} = ${nf(ans)}.`; }
    else if (t === 3) { const n = r.int(13, 97); ans = 101 * n; q = `101 × ${n} = …`; e = `101 × ${n} = 100 × ${n} + ${n} = ${nf(ans)}.`; }
    else if (t === 4) { const a = r.int(1, 9), b = r.int(0, 9 - a < 0 ? 0 : 9 - a); const n = 10 * a + b; ans = 11 * n; q = `11 × ${n} = …`; e = `Trik ×11 untuk dua digit ab: a(a+b)b → ${a}(${a + b})${b} = ${ans}.`; }
    else { const n = r.int(11, 59) * 2; ans = 15 * n; q = `15 × ${n} = …`; e = `15 × ${n} = 10 × ${n} + ½ × 10 × ${n} = ${10 * n} + ${5 * n} = ${nf(ans)}.`; }
    return build(r, { c: K, s: 'operasi', l: 1, q: `Hasil perhitungan berikut adalah …<span class="seq">${q}</span>`, e }, ans, [ans + 10, ans - 10, ans + 100, ans - 100, ans + 1, ...near(r, ans, 11)]);
  });
  add('aritmetika', (r) => { // pecahan
    const ds = [2, 3, 4, 5, 6, 8, 9, 10, 12];
    let b = r.pick(ds), d = r.pick(ds);
    if (b === d) d = b === 12 ? 8 : 12;
    const a = r.int(1, b - 1 || 1), c = r.int(1, d - 1 || 1);
    const op = r.pick(['+', '−', '×']);
    let n, m;
    if (op === '+') { n = a * d + c * b; m = b * d; } else if (op === '−') { n = a * d - c * b; m = b * d; } else { n = a * c; m = b * d; }
    const ans = frac(n, m);
    const wrong = [frac(a + c, b + d), frac(a * c, b * d), frac(a * d + c * b, b * d + 1), frac(n + 1, m), frac(n - 1, m), frac(a * d, b * c), frac(n * 2, m), frac(Math.abs(a - c), Math.abs(b - d) || 1)];
    const e = op === '×' ? `Kalikan pembilang dengan pembilang, penyebut dengan penyebut: ${a * c}/${b * d} = ${ans}.` : `Samakan penyebut (${b} × ${d} = ${b * d} atau KPK ${lcm(b, d)}): ${a}/${b} ${op} ${c}/${d} = ${n}/${m} = ${ans}.`;
    return build(r, { c: K, s: 'operasi', l: 2, q: `Hasil dari ${a}/${b} ${op} ${c}/${d} = …`, e }, ans, wrong.filter((w) => w !== ans), String);
  });
  add('aritmetika', (r) => { // terbesar
    for (let tries = 0; tries < 20; tries++) {
      const vals = [];
      const used = new Set();
      while (vals.length < 5) {
        const kind = r.int(0, 2);
        let v, s;
        if (kind === 0) { const d = r.int(5, 19), n = r.int(Math.ceil(d * 0.3), Math.floor(d * 0.8)); v = n / d; s = `${n}/${d}`; }
        else if (kind === 1) { v = r.int(30, 80) / 100 + r.pick([0, 0.005]); s = v.toLocaleString('id-ID', { maximumFractionDigits: 3 }); }
        else { const p = r.int(30, 80); v = p / 100; s = `${p}%`; }
        const key = Math.round(v * 10000);
        if ([...used].some((u) => Math.abs(u - key) < 15)) continue;
        used.add(key); vals.push({ v, s });
      }
      const max = vals.reduce((m, x) => (x.v > m.v ? x : m));
      const sorted = vals.slice().sort((x, y) => y.v - x.v);
      if (sorted[0].v - sorted[1].v < 0.004) continue;
      const o = vals.map((x) => x.s);
      return { c: K, s: 'operasi', l: 2, q: 'Di antara bilangan berikut, yang <b>terbesar</b> adalah …', o, a: o.indexOf(max.s),
        e: `Ubah semua ke desimal: ${vals.map((x) => `${x.s} ≈ ${x.v.toLocaleString('id-ID', { maximumFractionDigits: 3 })}`).join('; ')}. Terbesar: ${max.s}.` };
    }
    throw new Error('retry');
  });
  add('aritmetika', (r) => { // x% dari y = z% dari ?
    for (let t = 0; t < 40; t++) {
      const A = r.int(2, 30) * 10, z = r.pick([15, 20, 25, 30, 40, 45, 60, 75]), x = r.pick([10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
      const y = (z * A) / x;
      if (!Number.isInteger(y) || y === A || y > 2000) continue;
      const v = (x * y) / 100;
      return build(r, { c: K, s: 'aritmetika', l: 2, q: `${x}% dari ${y} sama dengan ${z}% dari …`, e: `${x}% × ${y} = ${nf(v)}. Bilangan yang ${z}%-nya ${nf(v)} adalah ${nf(v)} ÷ ${z}% = ${nf(v)} × 100/${z} = ${A}.` },
        A, [(v * z) / 100, y, A + 10, A - 10, A * 2, ...near(r, A, 5)]);
    }
    throw new Error('retry');
  });
  add('operasi', (r) => { // operasi simbol
    const ops = [
      ['2a + b²', (a, b) => 2 * a + b * b], ['a² − 2b', (a, b) => a * a - 2 * b], ['ab − a − b', (a, b) => a * b - a - b],
      ['(a + b)(a − b)', (a, b) => (a + b) * (a - b)], ['3a − 2b + ab', (a, b) => 3 * a - 2 * b + a * b], ['a² + b² − ab', (a, b) => a * a + b * b - a * b],
    ];
    const sym = r.pick(['⊕', '⊗', '◇', '★', '#']);
    const [txt, f] = r.pick(ops);
    if (r.chance(0.5)) {
      const a = r.int(2, 9), b = r.int(1, 8);
      const ans = f(a, b);
      return build(r, { c: K, s: 'operasi', l: 2, q: `Jika a ${sym} b = ${txt}, maka ${a} ${sym} ${b} = …`, e: `Substitusi a = ${a}, b = ${b} ke ${txt} → ${ans}.` }, ans, [f(b, a), ans + 1, ans - 1, ans + 2, ...near(r, ans, 3, 12, true)]);
    }
    const a = r.int(1, 4), b = r.int(1, 3), c = r.int(1, 3);
    const inner = f(a, b), ans = f(inner, c);
    return build(r, { c: K, s: 'operasi', l: 3, q: `Jika a ${sym} b = ${txt}, maka (${a} ${sym} ${b}) ${sym} ${c} = …`, e: `Kerjakan kurung dulu: ${a} ${sym} ${b} = ${inner}. Lalu ${inner} ${sym} ${c} = ${ans}.` },
      ans, [f(a, f(b, c)), f(c, inner), ans + 1, ans - 1, ...near(r, ans, 2, 12, true)]);
  });

  /* =====================  ALJABAR  ===================== */
  add('aljabar', (r) => {
    const x = r.int(-6, 15) || 4, a = r.int(3, 9), c = r.int(1, a - 1), b = r.int(-20, 20), d = a * x + b - c * x;
    const ans = x;
    const lhs = `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, rhs = `${c}x ${d < 0 ? '−' : '+'} ${Math.abs(d)}`;
    return build(r, { c: K, s: 'aljabar', l: 1, q: `Jika ${lhs} = ${rhs}, maka nilai x adalah …`, e: `Pindahkan suku x ke kiri dan konstanta ke kanan: (${a} − ${c})x = ${d} − (${b}) → ${a - c}x = ${d - b} → x = ${ans}.` },
      ans, [ans + 1, ans - 1, -ans, ans + 2, (d + b) / (a - c), ...near(r, ans, 3, 12, true)].map((v) => (Number.isInteger(v) ? v : null)));
  });
  add('aljabar', (r) => {
    const x = r.int(3, 20), y = r.int(1, x - 1);
    const s = x + y, d = x - y;
    const ask = r.pick(['xy', 'x2y2']);
    const ans = ask === 'xy' ? x * y : x * x - y * y;
    const q = `Diketahui x + y = ${s} dan x − y = ${d}. Nilai ${ask === 'xy' ? 'xy' : 'x² − y²'} adalah …`;
    const e = ask === 'xy' ? `Jumlahkan: 2x = ${s + d} → x = ${x}; y = ${y}. xy = ${ans}.` : `x² − y² = (x + y)(x − y) = ${s} × ${d} = ${ans}. Tidak perlu mencari x dan y!`;
    return build(r, { c: K, s: 'aljabar', l: 2, q, e }, ans, [s * d + 1, x * y === ans ? s * d : x * y, ans + s, ans - d, ...near(r, ans, 3)]);
  });

  /* =====================  SOAL CERITA  ===================== */
  add('soal-cerita', (r) => { // kecepatan rata-rata PP
    const [v1, v2] = r.pick([[40, 60], [30, 60], [60, 90], [40, 120], [45, 90], [50, 75], [36, 45], [20, 30], [60, 40], [60, 30], [80, 120], [35, 140]]);
    const ans = (2 * v1 * v2) / (v1 + v2);
    const n = r.pick(NAMA);
    return build(r, { c: K, s: 'soal-cerita', l: 2, q: `${n} berkendara dari kota A ke kota B dengan kecepatan ${v1} km/jam dan kembali melalui jalan yang sama dengan kecepatan ${v2} km/jam. Kecepatan rata-rata perjalanan pulang-pergi tersebut adalah … km/jam.`,
      e: `Jarak sama → pakai rata-rata harmonik: 2·v₁·v₂/(v₁+v₂) = 2·${v1}·${v2}/${v1 + v2} = ${nf(ans)}. Jebakan: rata-rata biasa (${(v1 + v2) / 2}) salah karena waktu tempuhnya berbeda.` },
      ans, [(v1 + v2) / 2, ans + 2, ans - 2, Math.abs(v1 - v2), ...near(r, ans, 4)]);
  });
  add('soal-cerita', (r) => { // pekerjaan bersama
    const [a, b] = r.pick([[6, 12], [10, 15], [12, 24], [20, 30], [8, 24], [3, 6], [4, 12], [10, 40], [18, 9], [21, 42], [30, 60], [12, 6], [15, 10], [24, 8]]);
    const ans = (a * b) / (a + b);
    const [n1, n2] = r.shuffle(NAMA).slice(0, 2);
    const job = r.pick(['mengecat sebuah pagar', 'menyelesaikan laporan', 'memanen sepetak sawah', 'merakit sebuah lemari', 'mengetik sebuah naskah']);
    const unit = r.pick(['jam', 'hari']);
    return build(r, { c: K, s: 'soal-cerita', l: 2, q: `${n1} dapat ${job} sendirian dalam ${a} ${unit}, sedangkan ${n2} dalam ${b} ${unit}. Jika bekerja bersama, pekerjaan itu selesai dalam … ${unit}.`,
      e: `Kecepatan kerja: 1/${a} + 1/${b} = ${frac(a + b, a * b)} bagian per ${unit}. Waktu = ${a}·${b}/(${a}+${b}) = ${nf(ans)} ${unit}.` },
      ans, [(a + b) / 2, a + b, Math.abs(a - b), ans + 1, ans - 1, ...near(r, ans, 1)]);
  });
  add('soal-cerita', (r) => { // berpapasan
    const v1 = r.int(8, 14) * 5, v2 = r.int(6, 12) * 5, t = r.pick([1.5, 2, 2.5, 3, 4]);
    const D = (v1 + v2) * t;
    if (!Number.isInteger(D)) throw new Error('retry');
    const start = r.int(6, 9) * 60 + r.pick([0, 15, 30]);
    const ans = hhmm(start + t * 60);
    const q = `Mobil P berangkat dari kota A ke kota B dengan kecepatan ${v1} km/jam, dan pada saat yang sama mobil Q berangkat dari B ke A dengan kecepatan ${v2} km/jam. Jarak A–B ${D} km. Jika keduanya berangkat pukul ${hhmm(start)}, mereka berpapasan pukul …`;
    const e = `Saling mendekat → kecepatan dijumlah: ${v1} + ${v2} = ${v1 + v2} km/jam. Waktu = ${D}/${v1 + v2} = ${nf(t)} jam. ${hhmm(start)} + ${nf(t)} jam = ${ans}.`;
    return build(r, { c: K, s: 'soal-cerita', l: 2, q, e }, ans, [hhmm(start + (D / v1) * 60), hhmm(start + t * 60 + 30), hhmm(start + t * 60 - 30), hhmm(start + (D / v2) * 60), hhmm(start + t * 60 + 60), hhmm(start + t * 60 - 15), hhmm(start + t * 60 + 15)].map((x) => (/NaN/.test(x) ? null : x)), String);
  });
  add('soal-cerita', (r) => { // diskon bertingkat
    const Pr = r.int(10, 90) * 10000, d1 = r.pick([10, 20, 25, 30, 40, 50]), d2 = r.pick([10, 20, 25]);
    const ans = (Pr * (100 - d1) * (100 - d2)) / 10000;
    const item = r.pick(['tas', 'sepatu', 'jaket', 'kemeja', 'kamus', 'headset']);
    return build(r, { c: K, s: 'soal-cerita', l: 2, q: `Sebuah ${item} berharga ${rp(Pr)} mendapat diskon ${d1}% + ${d2}%. Harga yang harus dibayar adalah …`,
      e: `Diskon bertingkat dihitung berurutan, bukan dijumlah: ${rp(Pr)} × ${100 - d1}% = ${rp((Pr * (100 - d1)) / 100)}; lalu × ${100 - d2}% = ${rp(ans)}. Jebakan: diskon ${d1 + d2}% langsung → ${rp((Pr * (100 - d1 - d2)) / 100)}.` },
      ans, [(Pr * (100 - d1 - d2)) / 100, (Pr * (100 - d1)) / 100, ans + 5000, ans - 5000, ans + 10000, (Pr * d1 * d2) / 10000], rp);
  });
  add('soal-cerita', (r) => { // untung rugi
    const B = r.int(4, 60) * 5000, p = r.pick([10, 12, 15, 20, 25, 30, 40]);
    const J = (B * (100 + p)) / 100;
    if (r.chance(0.5)) {
      return build(r, { c: K, s: 'soal-cerita', l: 1, q: `Seorang pedagang membeli barang seharga ${rp(B)} dan ingin untung ${p}%. Harga jualnya adalah …`, e: `Harga jual = ${100 + p}% × ${rp(B)} = ${rp(J)}.` },
        J, [(B * p) / 100, (B * (100 - p)) / 100, J + 5000, J - 5000, J + 10000], rp);
    }
    return build(r, { c: K, s: 'soal-cerita', l: 2, q: `Sebuah barang dijual ${rp(J)} dengan keuntungan ${p}% dari harga beli. Harga belinya adalah …`,
      e: `Harga jual = ${100 + p}% × harga beli → harga beli = ${rp(J)} × 100/${100 + p} = ${rp(B)}. Jebakan: ${rp(J)} − ${p}% × ${rp(J)} = ${rp(Math.round((J * (100 - p)) / 100))} (salah, persen dihitung dari harga beli).` },
      B, [Math.round((J * (100 - p)) / 100), B + 5000, B - 5000, J - (B * p) / 50, B + 10000], rp);
  });
  add('soal-cerita', (r) => { // rata-rata siswa baru
    for (let t = 0; t < 30; t++) {
      const n = r.int(4, 30), m1 = r.int(60, 80), m2 = m1 + r.pick([1, 2, 3]);
      const nw = (n + 1) * m2 - n * m1;
      if (nw > 100) continue;
      return build(r, { c: K, s: 'soal-cerita', l: 2, q: `Rata-rata nilai ${n} siswa adalah ${m1}. Setelah satu siswa baru bergabung, rata-ratanya menjadi ${m2}. Nilai siswa baru tersebut adalah …`,
        e: `Total awal ${n} × ${m1} = ${n * m1}. Total baru ${n + 1} × ${m2} = ${(n + 1) * m2}. Nilai siswa baru = ${(n + 1) * m2} − ${n * m1} = ${nw}. Cepat: ${m2} + ${n} × (${m2} − ${m1}) = ${nw}.` },
        nw, [m2 + (m2 - m1), m2, nw + 1, nw - 1, nw + (m2 - m1), ...near(r, nw, 2)]);
    }
    throw new Error('retry');
  });
  add('soal-cerita', (r) => { // rata-rata gabungan
    const nA = r.int(2, 8) * 5, nB = r.int(2, 8) * 5, mA = r.int(60, 85), mB = r.int(60, 85);
    if (mA === mB) throw new Error('retry');
    const ans = Math.round(((nA * mA + nB * mB) / (nA + nB)) * 100) / 100;
    return build(r, { c: K, s: 'statistika', l: 2, q: `Kelas A terdiri dari ${nA} siswa dengan rata-rata ${mA}, dan kelas B terdiri dari ${nB} siswa dengan rata-rata ${mB}. Rata-rata gabungan kedua kelas adalah …`,
      e: `Rata-rata gabungan = (${nA}·${mA} + ${nB}·${mB})/(${nA} + ${nB}) = ${nA * mA + nB * mB}/${nA + nB} ≈ ${nf(ans)}. Bukan (${mA}+${mB})/2 karena jumlah siswa berbeda.` },
      ans, [(mA + mB) / 2, ans + 1, ans - 1, ans + 0.5, ans - 0.5, ans + 2]);
  });
  add('soal-cerita', (r) => { // perbandingan umur / uang
    if (r.chance(0.5)) {
      const pairs = [[2, 3], [3, 5], [2, 5], [3, 4], [4, 7], [5, 8], [3, 7]];
      const [a, b] = r.pick(pairs), k = r.int(2, 9);
      const diff = k * (b - a), ans = k * b;
      const [n1, n2] = r.shuffle(NAMA).slice(0, 2);
      return build(r, { c: K, s: 'soal-cerita', l: 1, q: `Perbandingan umur ${n1} dan ${n2} adalah ${a} : ${b}. Jika selisih umur mereka ${diff} tahun, umur ${n2} adalah … tahun.`,
        e: `Selisih perbandingan ${b} − ${a} = ${b - a} bagian = ${diff} tahun → 1 bagian = ${k}. Umur ${n2} = ${b} × ${k} = ${ans}.` },
        ans, [k * a, k * (a + b), diff * b, ans + k, ans - 1, ...near(r, ans, 2)]);
    }
    const parts = r.shuffle([2, 3, 4, 5, 6, 7]).slice(0, 3), k = r.int(2, 20) * 10000;
    const T = k * (parts[0] + parts[1] + parts[2]), ans = k * parts[2];
    return build(r, { c: K, s: 'soal-cerita', l: 1, q: `Uang sebesar ${rp(T)} dibagikan kepada Ani, Banu, dan Cici dengan perbandingan ${parts.join(' : ')}. Bagian Cici adalah …`,
      e: `Total bagian ${parts.join(' + ')} = ${parts[0] + parts[1] + parts[2]}. 1 bagian = ${rp(T)} ÷ ${parts[0] + parts[1] + parts[2]} = ${rp(k)}. Bagian Cici = ${parts[2]} × ${rp(k)} = ${rp(ans)}.` },
      ans, [k * parts[0], k * parts[1], ans + k, ans - k, T / 3], rp);
  });
  add('soal-cerita', (r) => { // bunga tunggal
    for (let t = 0; t < 40; t++) {
      const M = r.int(2, 20) * 1000000, i = r.pick([6, 8, 9, 10, 12]), b = r.pick([3, 4, 6, 8, 9, 12, 18, 24]);
      const bunga = (M * i * b) / 1200;
      if (!Number.isInteger(bunga)) continue;
      const ans = M + bunga;
      return build(r, { c: K, s: 'soal-cerita', l: 2, q: `Rina menabung ${rp(M)} di bank dengan bunga tunggal ${i}% per tahun. Jumlah tabungannya setelah ${b} bulan adalah …`,
        e: `Bunga = ${rp(M)} × ${i}% × ${b}/12 = ${rp(bunga)}. Tabungan = ${rp(M)} + ${rp(bunga)} = ${rp(ans)}.` },
        ans, [M + (M * i) / 100, bunga, M + bunga * 2, M + bunga / 2, ans + 100000, ans - 100000], rp);
    }
    throw new Error('retry');
  });
  add('soal-cerita', (r) => { // KPK jadwal
    const [a, b] = r.shuffle([10, 12, 15, 18, 20, 24, 30, 45]).slice(0, 2);
    const L2 = lcm(a, b);
    if (L2 > 360 || L2 === a * b) throw new Error('retry');
    const start = r.int(5, 9) * 60;
    const ans = hhmm(start + L2);
    return build(r, { c: K, s: 'soal-cerita', l: 2, q: `Bus jurusan X berangkat setiap ${a} menit dan bus jurusan Y setiap ${b} menit dari terminal yang sama. Jika keduanya berangkat bersamaan pukul ${hhmm(start)}, mereka akan berangkat bersamaan lagi pukul …`,
      e: `Cari KPK(${a}, ${b}) = ${L2} menit. ${hhmm(start)} + ${L2} menit = ${ans}.` },
      ans, [hhmm(start + a * b), hhmm(start + gcd(a, b)), hhmm(start + L2 + a), hhmm(start + L2 - b), hhmm(start + a + b), hhmm(start + L2 * 2)], String);
  });
  add('soal-cerita', (r) => { // hari
    const d0 = r.int(0, 6), n = r.int(20, 500);
    const ans = HARI[(d0 + n) % 7];
    const opts = r.shuffle(HARI.filter((h) => h !== ans)).slice(0, 4);
    return build(r, { c: K, s: 'soal-cerita', l: 1, q: `Hari ini hari ${HARI[d0]}. ${n} hari lagi adalah hari …`, e: `${n} ÷ 7 = ${Math.floor(n / 7)} sisa ${n % 7}. Maju ${n % 7} hari dari ${HARI[d0]} → ${ans}.` }, ans, opts, String);
  });
  add('soal-cerita', (r) => { // campuran harga
    for (let t = 0; t < 60; t++) {
      const m1 = r.int(2, 10), m2 = r.int(2, 10), p1 = r.int(10, 16) * 1000, p2 = r.int(10, 16) * 1000;
      if (p1 === p2) continue;
      const tot = m1 * p1 + m2 * p2;
      if (tot % (m1 + m2) !== 0) continue;
      const ans = tot / (m1 + m2);
      return build(r, { c: K, s: 'soal-cerita', l: 2, q: `Pedagang mencampur ${m1} kg beras seharga ${rp(p1)}/kg dengan ${m2} kg beras seharga ${rp(p2)}/kg. Agar tidak untung maupun rugi, harga beras campuran per kg adalah …`,
        e: `Total harga = ${m1}·${rp(p1)} + ${m2}·${rp(p2)} = ${rp(tot)}. Dibagi ${m1 + m2} kg = ${rp(ans)}/kg.` },
        ans, [(p1 + p2) / 2, ans + 500, ans - 500, ans + 1000, ans - 1000, ans + 250].map((v) => (Number.isInteger(v) ? v : null)), rp);
    }
    throw new Error('retry');
  });
  add('soal-cerita', (r) => { // persen berantai
    const a = r.pick([10, 20, 25, 30, 40, 50]), b = r.pick([10, 20, 25, 30, 40, 50]);
    const upFirst = r.chance(0.6);
    const net = Math.round(((1 + a / 100) * (1 - b / 100) - 1) * 10000) / 100;
    const label = (v) => (v === 0 ? 'tetap (tidak berubah)' : v > 0 ? `naik ${nf(v)}%` : `turun ${nf(-v)}%`);
    const q = upFirst ? `Harga suatu barang naik ${a}%, kemudian turun ${b}%. Dibandingkan harga semula, harga akhirnya …` : `Harga suatu barang turun ${b}%, kemudian naik ${a}%. Dibandingkan harga semula, harga akhirnya …`;
    return build(r, { c: K, s: 'soal-cerita', l: 2, q, e: `Kalikan faktornya: ${nf(1 + a / 100)} × ${nf(1 - b / 100)} = ${nf((1 + a / 100) * (1 - b / 100))} → ${label(net)}. Urutan naik/turun tidak memengaruhi hasil.` },
      label(net), [label(a - b), label(net + 2), label(net - 2), label(0), label(-net), label(net + 5)], String);
  });
  add('geometri', (r) => { // luas berubah
    const a = r.pick([10, 20, 25, 30, 50]), b = r.pick([10, 20, 25, 40]);
    const net = Math.round(((1 + a / 100) * (1 - b / 100) - 1) * 10000) / 100;
    const label = (v) => (v === 0 ? 'tetap' : v > 0 ? `bertambah ${nf(v)}%` : `berkurang ${nf(-v)}%`);
    return build(r, { c: K, s: 'geometri', l: 2, q: `Panjang sebuah persegi panjang diperbesar ${a}% dan lebarnya diperkecil ${b}%. Luasnya …`,
      e: `Luas baru = ${nf(1 + a / 100)}p × ${nf(1 - b / 100)}l = ${nf((1 + a / 100) * (1 - b / 100))} pl → ${label(net)}.` },
      label(net), [label(a - b), label(net + 5), label(net - 5), label(0), label(a), label(-b)], String);
  });
  add('geometri', (r) => {
    const t = r.int(0, 3);
    if (t === 0) { const s = r.int(3, 15) * 2; const d2 = 2 * s * s; return build(r, { c: K, s: 'geometri', l: 2, q: `Keliling sebuah persegi ${4 * s} cm. Luas persegi tersebut adalah … cm².`, e: `Sisi = ${4 * s} ÷ 4 = ${s} cm. Luas = ${s}² = ${s * s} cm².` }, s * s, [4 * s * 2, s * 4, d2, s * s + s, s * s - s]); }
    if (t === 1) { const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]]); return build(r, { c: K, s: 'geometri', l: 1, q: `Segitiga siku-siku memiliki sisi tegak ${a} cm dan ${b} cm. Panjang sisi miringnya adalah … cm.`, e: `Pythagoras: √(${a}² + ${b}²) = √${a * a + b * b} = ${c}. Hafalkan tripel ${a}-${b}-${c}.` }, c, [a + b, c + 1, c - 1, c + 2, Math.abs(b - a)]); }
    if (t === 2) { const rr = r.pick([7, 14, 21, 28, 35]); const L2 = (22 / 7) * rr * rr; return build(r, { c: K, s: 'geometri', l: 2, q: `Luas lingkaran dengan jari-jari ${rr} cm adalah … cm² (π = 22/7).`, e: `L = πr² = 22/7 × ${rr} × ${rr} = ${nf(L2)} cm².` }, L2, [(22 / 7) * 2 * rr, (22 / 7) * rr * rr * 2, L2 / 2, L2 + 22, (22 / 7) * rr]); }
    const p = r.int(4, 15), l = r.int(3, p - 1), tg = r.int(2, 10); const V = p * l * tg;
    return build(r, { c: K, s: 'geometri', l: 1, q: `Balok berukuran ${p} cm × ${l} cm × ${tg} cm. Volumenya adalah … cm³.`, e: `V = p × l × t = ${p} × ${l} × ${tg} = ${V} cm³.` }, V, [2 * (p * l + p * tg + l * tg), V + p, V - l, p + l + tg, V * 2]);
  });

  /* =====================  PELUANG & KOMBINATORIK  ===================== */
  add('peluang', (r) => {
    const t = r.int(0, 5);
    if (t === 0) {
      const k = r.int(3, 11);
      let cnt = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === k) cnt++;
      return build(r, { c: K, s: 'peluang', l: 2, q: `Dua dadu dilempar bersamaan. Peluang muncul mata dadu berjumlah ${k} adalah …`, e: `Ruang sampel 36. Pasangan berjumlah ${k}: ${cnt} pasangan. Peluang = ${cnt}/36 = ${frac(cnt, 36)}.` },
        frac(cnt, 36), [frac(cnt + 1, 36), frac(Math.max(1, cnt - 1), 36), frac(cnt, 12), frac(1, 6), frac(k, 36), frac(cnt, 6), frac(1, 12)], String);
    }
    if (t === 1) {
      const m = r.int(3, 7), n = r.int(2, 6);
      const ans = frac(C(m, 2), C(m + n, 2));
      return build(r, { c: K, s: 'peluang', l: 3, q: `Sebuah kantong berisi ${m} bola merah dan ${n} bola biru. Diambil 2 bola sekaligus secara acak. Peluang terambil keduanya merah adalah …`,
        e: `n(A) = C(${m},2) = ${C(m, 2)}; n(S) = C(${m + n},2) = ${C(m + n, 2)}. Peluang = ${C(m, 2)}/${C(m + n, 2)} = ${ans}.` },
        ans, [frac(m, m + n), frac(m * m, (m + n) * (m + n)), frac(C(m, 2), C(m + n, 2) + 1), frac(2, m + n), frac(m - 1, m + n), frac(C(n, 2) || 1, C(m + n, 2))], String);
    }
    if (t === 2) {
      const which = r.pick(['tepat dua', 'paling sedikit dua']);
      const num = which === 'tepat dua' ? 3 : 4;
      return build(r, { c: K, s: 'peluang', l: 2, q: `Tiga keping uang logam dilempar bersamaan. Peluang muncul ${which} sisi gambar adalah …`,
        e: `Ruang sampel 2³ = 8. ${which === 'tepat dua' ? 'GGA, GAG, AGG = 3' : 'tepat dua (3) + tiga gambar (1) = 4'} kejadian. Peluang = ${frac(num, 8)}.` },
        frac(num, 8), [frac(num === 3 ? 4 : 3, 8), frac(2, 3), frac(1, 4), frac(1, 8), frac(2, 8) === frac(1, 4) ? frac(5, 8) : frac(2, 8)], String);
    }
    if (t === 3) {
      const n = r.int(6, 12), k = r.pick([2, 3]);
      const ans = C(n, k);
      return build(r, { c: K, s: 'peluang', l: 2, q: `Dari ${n} orang kandidat akan dipilih ${k} orang untuk menjadi tim delegasi (tanpa jabatan). Banyak cara memilih adalah …`,
        e: `Urutan tidak penting → kombinasi C(${n},${k}) = ${ans}. Jika ada jabatan berbeda, gunakan permutasi.` }, ans, [ans * fact(k), n * k, ans + n, ans - n, C(n, k + 1)]);
    }
    if (t === 4) {
      const n = r.int(8, 25);
      const ans = (n * (n - 1)) / 2;
      return build(r, { c: K, s: 'peluang', l: 1, q: `Dalam sebuah pertemuan terdapat ${n} orang. Jika setiap orang berjabat tangan tepat satu kali dengan setiap orang lainnya, banyak jabat tangan adalah …`,
        e: `C(${n},2) = ${n}·${n - 1}/2 = ${ans}.` }, ans, [n * (n - 1), n * n, ans + n, ans - n, (n * (n + 1)) / 2]);
    }
    const n = r.int(5, 9), k = r.pick([2, 3]);
    const ans = fact(n) / fact(n - k);
    return build(r, { c: K, s: 'peluang', l: 2, q: `Dari ${n} calon akan dipilih ${k === 2 ? 'ketua dan wakil ketua' : 'ketua, sekretaris, dan bendahara'}. Banyak susunan pengurus yang mungkin adalah …`,
      e: `Jabatan berbeda → permutasi P(${n},${k}) = ${n}!/(${n - k})! = ${ans}.` }, ans, [C(n, k), ans / 2, n * k, ans + n, fact(n)]);
  });
  add('statistika', (r) => {
    const n = r.pick([7, 8, 9]);
    const data = Array.from({ length: n }, () => r.int(4, 10));
    const sorted = data.slice().sort((a, b) => a - b);
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const mean = Math.round((data.reduce((a, b) => a + b, 0) / n) * 100) / 100;
    if (r.chance(0.5)) {
      return build(r, { c: K, s: 'statistika', l: 1, q: `Median dari data berikut adalah …<span class="seq">${data.join(', ')}</span>`,
        e: `Urutkan dulu: ${sorted.join(', ')}. ${n % 2 ? `Data ke-${(n + 1) / 2}` : `Rata-rata data ke-${n / 2} dan ke-${n / 2 + 1}`} = ${nf(med)}.` },
        med, [data[Math.floor(n / 2)], mean, med + 1, med - 1, med + 0.5, med - 0.5]);
    }
    return build(r, { c: K, s: 'statistika', l: 1, q: `Rata-rata dari data berikut adalah …<span class="seq">${data.join(', ')}</span>`,
      e: `Jumlah = ${data.reduce((a, b) => a + b, 0)}, banyak data ${n}. Rata-rata = ${nf(mean)}.` }, mean, [med, mean + 1, mean - 1, mean + 0.5, mean - 0.5, mean + 0.25]);
  });

  /* =====================  PERBANDINGAN KUANTITATIF  ===================== */
  const PQ = ['P > Q', 'P < Q', 'P = Q', 'Hubungan P dan Q tidak dapat ditentukan'];
  const pqItem = (q, rel, e) => ({ c: K, s: 'perbandingan-kuantitatif', l: 2, q: `${q}<br>Manakah hubungan yang benar antara P dan Q?`, o: PQ.slice(), a: rel, f: 1, e });
  const cmp = (p, q) => (Math.abs(p - q) < 1e-9 ? 2 : p > q ? 0 : 1);
  add('perbandingan-kuantitatif', (r) => {
    const t = r.int(0, 6);
    if (t === 0) {
      const a = r.int(2, 9) * 5, b = r.int(2, 18) * 10, same = r.chance(0.4);
      const c = same ? b : b + r.pick([-10, 10, 20]);
      const pv = (a * c) / 100, qv = (b * a) / 100;
      return pqItem(`P = ${a}% dari ${c}<br>Q = ${b}% dari ${a}`, cmp(pv, qv), `P = ${nf(pv)}, Q = ${nf(qv)}. Trik: a% dari b = b% dari a.`);
    }
    if (t === 1) {
      const cond = r.pick([['x > 1', 0, 'Untuk x > 1, x² > x.'], ['0 < x < 1', 1, 'Untuk 0 < x < 1, x² < x (contoh x = ½ → ¼ < ½).'], ['x bilangan real', 3, 'x = 2 → P > Q, tetapi x = ½ → P < Q, x = 1 → P = Q. Tidak dapat ditentukan.']]);
      return pqItem(`Diketahui ${cond[0]}.<br>P = x²<br>Q = x`, cond[1], cond[2]);
    }
    if (t === 2) {
      const a = r.int(1, 9), b = r.int(a + 1, 12), c = r.int(1, 9), d = r.int(c + 1, 12);
      return pqItem(`P = ${a}/${b}<br>Q = ${c}/${d}`, cmp(a / b, c / d), `Kali silang: ${a} × ${d} = ${a * d} dan ${c} × ${b} = ${c * b}. ${a * d > c * b ? 'P > Q' : a * d < c * b ? 'P < Q' : 'P = Q'}.`);
    }
    if (t === 3) {
      const a = r.pick([4, 9, 16, 25, 36]), b = r.pick([9, 16, 25, 49, 64]);
      return pqItem(`P = √${a} + √${b}<br>Q = √${a + b}`, 0, `P = ${Math.sqrt(a)} + ${Math.sqrt(b)} = ${Math.sqrt(a) + Math.sqrt(b)}, Q = √${a + b} ≈ ${nf(Math.sqrt(a + b))}. Secara umum √a + √b > √(a+b) untuk a, b > 0.`);
    }
    if (t === 4) {
      const n = r.int(1, 6);
      return pqItem(`P = 2<sup>${n}</sup><br>Q = ${n}²`, cmp(2 ** n, n * n), `P = 2^${n} = ${2 ** n}, Q = ${n}² = ${n * n}. Hati-hati: untuk n = 2 dan n = 4 keduanya sama.`);
    }
    if (t === 5) {
      const s = r.int(6, 15);
      return pqItem(`x dan y bilangan bulat positif dengan x + y = ${s}.<br>P = x<br>Q = y`, 3, `Banyak pasangan memenuhi: (1, ${s - 1}) → P < Q; (${s - 1}, 1) → P > Q. Tidak dapat ditentukan.`);
    }
    const a = r.int(2, 9), b = r.int(2, 9);
    return pqItem(`a = ${a}, b = ${b}<br>P = (a + b)²<br>Q = a² + b²`, 0, `(a + b)² = a² + 2ab + b² dan 2ab = ${2 * a * b} > 0, jadi P > Q (P = ${(a + b) ** 2}, Q = ${a * a + b * b}).`);
  });

  /* =====================  SILOGISME & LOGIKA  ===================== */
  const TDK = 'Tidak dapat ditarik kesimpulan yang pasti';
  const CAT3 = [
    ['kucing', 'mamalia', 'hewan berdarah panas'], ['mawar', 'bunga', 'tumbuhan'], ['dokter', 'tenaga kesehatan', 'pekerja bersertifikat'],
    ['kropi', 'lemba', 'sutri'], ['laptop kantor', 'aset perusahaan', 'barang yang diasuransikan'], ['zarnik', 'pelop', 'trimu'],
    ['peserta seleksi wawancara', 'pendaftar yang lolos administrasi', 'orang yang mengunggah esai'], ['buku referensi', 'koleksi perpustakaan', 'barang yang tercatat di katalog'],
  ];
  const F2 = [
    ['atlet nasional', 'orang yang berlatih setiap hari', 'mahasiswa'], ['pegawai bank', 'orang yang memakai seragam', 'lulusan ekonomi'],
    ['kropi', 'lemba', 'dorsi'], ['anggota paduan suara', 'orang yang bisa membaca not balok', 'siswa kelas XII'],
    ['penerima beasiswa', 'mahasiswa yang menulis laporan bulanan', 'warga Bandung'], ['peneliti senior', 'penulis artikel jurnal', 'dosen'],
  ];
  const F3 = [
    ['ikan', 'mamalia darat', 'hiu'], ['bilangan ganjil', 'bilangan yang habis dibagi 2', 'bilangan prima yang lebih dari 2'], ['kropi', 'lemba', 'fenu'],
    ['karyawan kontrak', 'penerima tunjangan pensiun', 'staf proyek'], ['kendaraan listrik', 'kendaraan yang mengeluarkan asap knalpot', 'skuter listrik'],
  ];
  const COND = [
    ['hujan turun deras', 'hujan tidak turun deras', 'sungai meluap', 'sungai tidak meluap', 'jalan desa tergenang', 'jalan desa tidak tergenang'],
    ['harga BBM naik', 'harga BBM tidak naik', 'ongkos angkut naik', 'ongkos angkut tidak naik', 'harga sayur naik', 'harga sayur tidak naik'],
    ['Rina rajin berlatih soal', 'Rina tidak rajin berlatih soal', 'skor TPA Rina tinggi', 'skor TPA Rina tidak tinggi', 'Rina lolos seleksi', 'Rina tidak lolos seleksi'],
    ['mesin dirawat rutin', 'mesin tidak dirawat rutin', 'mesin awet', 'mesin tidak awet', 'biaya produksi turun', 'biaya produksi tidak turun'],
    ['server mati', 'server tidak mati', 'aplikasi tidak dapat diakses', 'aplikasi dapat diakses', 'pelanggan mengeluh', 'pelanggan tidak mengeluh'],
    ['permintaan meningkat', 'permintaan tidak meningkat', 'harga naik', 'harga tidak naik', 'inflasi meningkat', 'inflasi tidak meningkat'],
    ['kropi berwarna merah', 'kropi tidak berwarna merah', 'lemba bersuara', 'lemba tidak bersuara', 'sutri bergerak', 'sutri tidak bergerak'],
    ['Doni lulus tepat waktu', 'Doni tidak lulus tepat waktu', 'Doni melamar beasiswa', 'Doni tidak melamar beasiswa', 'Doni mengikuti tes bahasa Inggris', 'Doni tidak mengikuti tes bahasa Inggris'],
  ];
  const silo = (r, prem, correct, wrong, e, l = 2) => {
    const pool = [...wrong.filter((w) => w !== correct)];
    if (correct !== TDK && !pool.includes(TDK)) pool.unshift(TDK);
    const o = r.shuffle([correct, ...r.shuffle(pool).slice(0, 4)]);
    return { c: P, s: 'silogisme', l, q: `${prem.map((x) => cap(x) + '.').join('<br>')}<br><br>Kesimpulan yang sah adalah …`, o, a: o.indexOf(correct), e };
  };
  add('silogisme', (r) => {
    const f = r.int(0, 3);
    if (f === 0) { const [X, Y, Z] = r.pick(CAT3); return silo(r, [`semua ${X} adalah ${Y}`, `semua ${Y} adalah ${Z}`], cap(`semua ${X} adalah ${Z}`), [`Semua ${Z} adalah ${X}`, `Semua ${Y} adalah ${X}`, `Sebagian ${X} bukan ${Z}`, `Tidak ada ${X} yang merupakan ${Z}`], `Rantai himpunan: ${X} ⊂ ${Y} ⊂ ${Z}, maka semua ${X} adalah ${Z}. Kebalikannya (semua ${Z} adalah ${X}) tidak pasti.`, 1); }
    if (f === 1) { const [X, Y, W] = r.pick(F2); return silo(r, [`semua ${X} adalah ${Y}`, `sebagian ${W} adalah ${X}`], cap(`sebagian ${W} adalah ${Y}`), [`Semua ${W} adalah ${Y}`, `Semua ${Y} adalah ${W}`, `Tidak ada ${W} yang merupakan ${Y}`, `Semua ${W} adalah ${X}`], `${W} yang termasuk ${X} pasti juga ${Y}. Karena hanya sebagian, kesimpulannya "sebagian ${W} adalah ${Y}".`); }
    if (f === 2) { const [X, Y, W] = r.pick(F3); return silo(r, [`tidak ada ${X} yang merupakan ${Y}`, `semua ${W} adalah ${X}`], cap(`tidak ada ${W} yang merupakan ${Y}`), [`Sebagian ${W} adalah ${Y}`, `Semua ${Y} adalah ${W}`, `Semua ${W} adalah ${Y}`, `Sebagian ${Y} adalah ${X}`], `${W} ⊂ ${X}, sedangkan ${X} dan ${Y} terpisah. Maka ${W} juga terpisah dari ${Y}.`); }
    const [X, Y, W] = r.pick(F2);
    const o = r.shuffle([TDK, `Sebagian ${X} adalah ${W}`, `Semua ${X} adalah ${W}`, `Sebagian ${W} adalah ${X}`, `Tidak ada ${X} yang merupakan ${W}`]);
    return { c: P, s: 'silogisme', l: 3, q: `${cap(`semua ${X} adalah ${Y}`)}.<br>${cap(`sebagian ${Y} adalah ${W}`)}.<br><br>Kesimpulan yang tepat tentang hubungan ${X} dan ${W} adalah …`, o, a: o.indexOf(TDK),
      e: `Term tengah "${Y}" tidak tersebar: ${W} yang termasuk ${Y} belum tentu termasuk ${X}. Hubungan ${X} dan ${W} tidak dapat dipastikan (gambar diagram Venn untuk membuktikan).` };
  });
  add('silogisme', (r) => {
    const [p, np, q, nq, rr, nr] = r.pick(COND);
    const f = r.int(0, 5);
    if (f === 0) return silo(r, [`jika ${p}, maka ${q}`, p], cap(q), [cap(nq), cap(np), cap(`${p} dan ${nq}`), cap(`jika ${q}, maka ${p}`)], `Modus ponens: p → q, p benar ∴ q.`, 1);
    if (f === 1) return silo(r, [`jika ${p}, maka ${q}`, nq], cap(np), [cap(p), cap(q), cap(`jika ${np}, maka ${nq}`), cap(`${p} dan ${nq}`)], `Modus tollens: p → q, ~q ∴ ~p.`);
    if (f === 2) return silo(r, [`jika ${p}, maka ${q}`, `jika ${q}, maka ${rr}`], cap(`jika ${p}, maka ${rr}`), [cap(`jika ${rr}, maka ${p}`), cap(`jika ${np}, maka ${nr}`), cap(`${p} dan ${nr}`), cap(`jika ${nr}, maka ${p}`)], `Silogisme hipotetis: p → q, q → r ∴ p → r. (Kontraposisinya, jika ${nr} maka ${np}, juga sah.)`);
    if (f === 3) return silo(r, [`jika ${p}, maka ${q}`, `jika ${q}, maka ${rr}`, nr], cap(np), [cap(p), cap(q), cap(rr), cap(`${p} dan ${rr}`)], `Gabungkan: p → r (silogisme), lalu ~r ∴ ~p (modus tollens).`, 3);
    if (f === 4) return silo(r, [`${p} atau ${q}`, np], cap(q), [cap(nq), cap(p), cap(`${p} dan ${q}`), cap(`jika ${q}, maka ${p}`)], `Silogisme disjungtif: p ∨ q, ~p ∴ q.`);
    const which = r.chance(0.5);
    const o = r.shuffle([TDK, ...(which ? [cap(p), cap(np), cap(nq), cap(`jika ${q}, maka ${p}`)] : [cap(nq), cap(q), cap(p), cap(`${p} dan ${q}`)])]);
    return { c: P, s: 'silogisme', l: 3, q: `${cap(`jika ${p}, maka ${q}`)}.<br>${cap(which ? q : np)}.<br><br>Kesimpulan yang sah adalah …`, o, a: o.indexOf(TDK),
      e: which ? `Jebakan "menegaskan konsekuen": q benar tidak menjamin p benar (q bisa terjadi karena sebab lain).` : `Jebakan "menyangkal anteseden": ~p tidak menjamin ~q.` };
  });
  const PRED = [['siswa', 'memakai seragam', 'tidak memakai seragam'], ['pegawai', 'datang tepat waktu', 'tidak datang tepat waktu'], ['peserta', 'membawa kartu ujian', 'tidak membawa kartu ujian'],
    ['pendaftar', 'memiliki sertifikat TOEFL', 'tidak memiliki sertifikat TOEFL'], ['dosen', 'aktif meneliti', 'tidak aktif meneliti']];
  const neg = (r, stem, correct, wrong, e) => { const o = r.shuffle([correct, ...wrong.slice(0, 4)]); return { c: P, s: 'logika-proposisi', l: 2, q: stem, o, a: o.indexOf(correct), e }; };
  add('logika-proposisi', (r) => {
    const f = r.int(0, 6);
    const [p, np, q, nq] = r.pick(COND);
    const [x, y, ny] = r.pick(PRED);
    if (f === 0) return neg(r, `Ingkaran dari pernyataan "Semua ${x} ${y}" adalah …`, `Ada ${x} yang ${ny}`, [`Semua ${x} ${ny}`, `Tidak ada ${x} yang ${ny}`, `Ada ${x} yang ${y}`, `Beberapa ${x} ${y}`], `~(∀x P) ≡ ∃x ~P → "ada/beberapa ${x} yang ${ny}".`);
    if (f === 1) return neg(r, `Ingkaran dari pernyataan "Ada ${x} yang ${ny}" adalah …`, `Semua ${x} ${y}`, [`Ada ${x} yang ${y}`, `Semua ${x} ${ny}`, `Tidak ada ${x} yang ${y}`, `Beberapa ${x} ${ny}`], `~(∃x ~P) ≡ ∀x P → "semua ${x} ${y}".`);
    if (f === 2) return neg(r, `Ingkaran dari "Jika ${p}, maka ${q}" adalah …`, cap(`${p} dan ${nq}`), [cap(`jika ${np}, maka ${nq}`), cap(`${np} dan ${q}`), cap(`jika ${q}, maka ${p}`), cap(`${np} atau ${q}`)], `~(p → q) ≡ p ∧ ~q.`);
    if (f === 3) return neg(r, `Ingkaran dari "${cap(p)} dan ${q}" adalah …`, cap(`${np} atau ${nq}`), [cap(`${np} dan ${nq}`), cap(`${p} atau ${nq}`), cap(`jika ${p}, maka ${q}`), cap(`${np} dan ${q}`)], `De Morgan: ~(p ∧ q) ≡ ~p ∨ ~q.`);
    if (f === 4) return neg(r, `Ingkaran dari "${cap(p)} atau ${q}" adalah …`, cap(`${np} dan ${nq}`), [cap(`${np} atau ${nq}`), cap(`${p} dan ${nq}`), cap(`jika ${np}, maka ${q}`), cap(`${p} dan ${q}`)], `De Morgan: ~(p ∨ q) ≡ ~p ∧ ~q.`);
    if (f === 5) return neg(r, `Pernyataan yang setara (ekuivalen) dengan "Jika ${p}, maka ${q}" adalah …`, cap(`jika ${nq}, maka ${np}`), [cap(`jika ${q}, maka ${p}`), cap(`jika ${np}, maka ${nq}`), cap(`${p} dan ${nq}`), cap(`${np} dan ${q}`)], `Kontraposisi: p → q ≡ ~q → ~p. Konvers (q → p) dan invers (~p → ~q) TIDAK setara.`);
    return neg(r, `Pernyataan yang setara (ekuivalen) dengan "Jika ${p}, maka ${q}" adalah …`, cap(`${np} atau ${q}`), [cap(`${p} atau ${nq}`), cap(`${np} dan ${q}`), cap(`${p} dan ${nq}`), cap(`jika ${q}, maka ${p}`)], `p → q ≡ ~p ∨ q.`);
  });

  /* =====================  URUTAN / PERINGKAT  ===================== */
  const ATTR = [
    ['lebih tinggi daripada', 'lebih pendek daripada', 'paling tinggi', 'paling pendek'], ['lebih tua daripada', 'lebih muda daripada', 'paling tua', 'paling muda'],
    ['lebih cepat daripada', 'lebih lambat daripada', 'paling cepat', 'paling lambat'], ['lebih berat daripada', 'lebih ringan daripada', 'paling berat', 'paling ringan'],
    ['mendapat skor lebih tinggi daripada', 'mendapat skor lebih rendah daripada', 'skornya paling tinggi', 'skornya paling rendah'],
  ];
  add('urutan', (r) => {
    const n = r.pick([5, 6]);
    const ppl = r.shuffle(NAMA).slice(0, n); // urutan dari "paling" teratas
    const [more, less, top, bot] = r.pick(ATTR);
    const clues = r.shuffle(ppl.slice(0, -1).map((p, i) => (r.chance(0.5) ? `${p} ${more} ${ppl[i + 1]}` : `${ppl[i + 1]} ${less} ${p}`)));
    const t = r.int(0, 2);
    let ask, ans;
    if (t === 0) { ask = `Siapakah yang ${top}?`; ans = ppl[0]; }
    else if (t === 1) { ask = `Siapakah yang ${bot}?`; ans = ppl[n - 1]; }
    else { const k = r.int(2, n - 1); ask = `Jika diurutkan dari yang ${top}, siapakah yang berada di urutan ke-${k}?`; ans = ppl[k - 1]; }
    const others = r.shuffle(ppl.filter((p) => p !== ans)).slice(0, 4);
    const o = r.shuffle([ans, ...others]);
    return { c: P, s: 'urutan', l: 2, q: `${clues.map((c) => c + '.').join('<br>')}<br><br>${ask}`, o, a: o.indexOf(ans), e: `Susun rantai dari petunjuk: ${ppl.join(' > ')} (kiri = ${top.replace('paling ', 'paling ')}). Jawaban: ${ans}.` };
  });

  /* =====================  FIGURAL (SVG)  ===================== */
  const svg = (inner) => `<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">${inner}</svg>`;
  const arrow = (ang, fill) => svg(`<circle cx="32" cy="32" r="27" fill="${fill ? 'currentColor' : 'none'}" fill-opacity="${fill ? 0.16 : 0}" stroke="currentColor" stroke-width="2.5"/><g transform="rotate(${ang} 32 32)"><line x1="32" y1="46" x2="32" y2="15" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M23 24 L32 13 L41 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></g>`);
  const poly = (n, fill, dots) => {
    const pts = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return `${(32 + 25 * Math.cos(a)).toFixed(1)},${(33 + 25 * Math.sin(a)).toFixed(1)}`; }).join(' ');
    const d = Array.from({ length: dots }, (_, i) => `<circle cx="${32 - (dots - 1) * 4.5 + i * 9}" cy="34" r="3.2" fill="currentColor"/>`).join('');
    return svg(`<polygon points="${pts}" fill="${fill ? 'currentColor' : 'none'}" fill-opacity="${fill ? 0.18 : 0}" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>${d}`);
  };
  const figStem = (frames) => `Gambar manakah yang melanjutkan pola berikut?<span class="figs">${frames.map((f) => `<span class="fig">${f}</span>`).join('')}<span class="fig fig-q">?</span></span>`;
  add('figural', (r) => {
    const step = r.pick([45, 90, 135, -45, -90]), a0 = r.pick([0, 45, 90, 180, 270]), alt = r.chance(0.5);
    const ang = (i) => (((a0 + i * step) % 360) + 360) % 360;
    const fill = (i) => (alt ? i % 2 === 1 : false);
    const frames = [0, 1, 2, 3].map((i) => arrow(ang(i), fill(i)));
    const ansKey = `${ang(4)}|${fill(4)}`;
    const cands = [[ang(4), fill(4)], [ang(5), fill(4)], [ang(3), fill(4)], [(ang(4) + 180) % 360, fill(4)], [ang(4), !fill(4)], [(ang(4) + 90) % 360, fill(4)], [(ang(4) + 45) % 360, !fill(4)]];
    const seen = new Set(); const opts = [];
    for (const [a, f] of cands) { const k = `${a}|${f}`; if (!seen.has(k) && (alt || !f)) { seen.add(k); opts.push(k); } if (opts.length === 5) break; }
    while (opts.length < 5) { const k = `${(ang(4) + 45 * opts.length) % 360}|${!fill(4)}`; if (!seen.has(k)) { seen.add(k); opts.push(k); } else opts.push(`${(ang(4) + 15 * opts.length) % 360}|true`); }
    const sh = r.shuffle(opts);
    return { c: P, s: 'figural', l: 2, q: figStem(frames), qh: 1, h: 1, o: sh.map((k) => { const [a, f] = k.split('|'); return arrow(+a, f === 'true'); }), a: sh.indexOf(ansKey),
      e: `Panah berputar ${Math.abs(step)}° ${step > 0 ? 'searah' : 'berlawanan arah'} jarum jam setiap langkah${alt ? ', dan lingkaran berselang-seling kosong/berarsir' : ''}. Gambar kelima: panah pada sudut ${ang(4)}°${alt ? (fill(4) ? ', berarsir' : ', kosong') : ''}.` };
  });
  add('figural', (r) => {
    const n0 = r.pick([3, 4]), alt = r.chance(0.6), dotsMode = r.chance(0.5);
    const sides = (i) => n0 + i, fill = (i) => (alt ? i % 2 === 0 : false), dots = (i) => (dotsMode ? 1 + (i % 3) : 0);
    const frames = [0, 1, 2, 3].map((i) => poly(sides(i), fill(i), dots(i)));
    const key = (s, f, d) => `${s}|${f}|${d}`;
    const ansKey = key(sides(4), fill(4), dots(4));
    const cands = [[sides(4), fill(4), dots(4)], [sides(4), !fill(4), dots(4)], [sides(4) + 1, fill(4), dots(4)], [sides(3), fill(4), dots(4)], [sides(4), fill(4), (dots(4) % 3) + 1], [sides(4) - 2, !fill(4), dots(4)], [sides(4) + 1, !fill(4), (dots(4) % 3) + 1]];
    const seen = new Set(); const opts = [];
    for (const c of cands) { if (!dotsMode) c[2] = 0; if (!alt && c[1]) continue; const k = key(...c); if (!seen.has(k)) { seen.add(k); opts.push(c); } if (opts.length === 5) break; }
    for (let s = 3; opts.length < 5 && s <= 9; s++) { const c = [s, false, dotsMode ? 2 : 0]; const k = key(...c); if (!seen.has(k)) { seen.add(k); opts.push(c); } }
    const sh = r.shuffle(opts);
    return { c: P, s: 'figural', l: 2, q: figStem(frames), qh: 1, h: 1, o: sh.map((c) => poly(c[0], c[1], c[2])), a: sh.findIndex((c) => key(...c) === ansKey),
      e: `Jumlah sisi bertambah satu (${[0, 1, 2, 3].map(sides).join(' → ')} → ${sides(4)})${alt ? '; arsiran berselang-seling' : ''}${dotsMode ? '; jumlah titik berulang 1, 2, 3' : ''}. Gambar kelima: segi-${sides(4)}${alt ? (fill(4) ? ' berarsir' : ' kosong') : ''}${dotsMode ? ` dengan ${dots(4)} titik` : ''}.` };
  });

  /* =====================  ENGLISH: VOCABULARY dari daftar kosakata  ===================== */
  add('vocabulary', (r) => {
    const V = window.SIAP_VOCAB || [];
    if (V.length < 10) throw new Error('vocab kosong');
    const w = r.pick(V);
    const same = V.filter((v) => v[1] === w[1] && v[2] !== w[2]);
    const ds = r.shuffle(same.length >= 4 ? same : V.filter((v) => v[2] !== w[2])).slice(0, 4).map((v) => v[2]);
    const o = r.shuffle([w[2], ...ds]);
    const ex = w[4].replace(new RegExp(`\\b(${w[0]}\\w*)`, 'i'), '<b>$1</b>');
    return { c: E, s: 'vocabulary', l: 2, q: `The word <b>${w[0]}</b> in the sentence below is closest in meaning to …<br><i>"${ex}"</i>`, o, a: o.indexOf(w[2]),
      e: `${w[0]} (${w[1]}) = ${w[3]}. Sinonim terdekat: ${w[2]}.` };
  });
  add('vocabulary', (r) => {
    const V = window.SIAP_VOCAB || [];
    if (V.length < 10) throw new Error('vocab kosong');
    const w = r.pick(V);
    const ds = r.shuffle(V.filter((v) => v[0] !== w[0] && v[3] !== w[3])).slice(0, 4).map((v) => v[3]);
    const o = r.shuffle([w[3], ...ds]);
    return { c: E, s: 'vocabulary', l: 1, q: `Arti kata <b>${w[0]}</b> (${w[1]}) yang paling tepat adalah …`, o, a: o.indexOf(w[3]), e: `${w[0]} = ${w[3]}. Contoh: "${w[4]}"` };
  });

  /* ---------- Gabungkan generator yang relevan ke subtopik lain ---------- */
  GEN.operasi.push(GEN.aritmetika[2], GEN.aritmetika[3], GEN.aritmetika[4]);
  GEN.statistika.push(GEN['soal-cerita'][5], GEN['soal-cerita'][6]);

  /* ---------- API ---------- */
  function generate(sub, r) {
    const list = GEN[sub];
    if (!list) return null;
    for (let t = 0; t < 25; t++) {
      try {
        const it = r.pick(list)(r);
        if (it && it.o && it.o.length >= 2 && it.a >= 0) { it.s = sub; return it; }
      } catch (e) { /* coba lagi */ }
    }
    return null;
  }
  S.GEN = GEN;
  S.generate = generate;
  S.hasGen = (sub) => !!GEN[sub];
})((window.SiapS2 = window.SiapS2 || {}));
