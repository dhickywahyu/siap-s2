/* Siap S2 — penilaian sesuai aturan tiap tes.
 *
 * Ringkasan aturan yang dipakai (lihat content/analisis-ujian.md bagian "Cara skor dihitung"):
 * - TOEFL ITP / ELPT-like : jumlah benar per bagian → skor bagian (tabel konversi), rentang ETS Level 1
 *                           Listening 31–68, Structure 31–68, Reading 31–67; total = (L+S+R) × 10 ÷ 3 (310–677).
 * - PAPs UGM              : skor ternorma 500 + 100 × Z per subtes (Buku Manual PAPs, UPAP Psikologi UGM).
 * - TPA Bappenas          : skor subtes 20–80; total = (V + N + P) ÷ 3 × 10 (rentang 200–800).
 * - UPDA ITB              : skala 200–800; skor akhir = rata-rata tiga kelompok (verbal, kuantitatif, logika).
 * - SIMAK UI              : TPA +4 benar, −1 salah, 0 kosong; Bahasa Inggris tanpa nilai minus. UI tidak
 *                           memublikasikan skor maupun bobot, jadi aplikasi menampilkan skor mentah + indeks.
 * - SBS/TBS LPDP          : benar 5 poin, salah/kosong 0; 60 soal → maksimal 300. Ambang ditetapkan per periode.
 * - AcEPT UGM             : skala ±0–426, setiap butir berbobot sama (format lama: 170 butir × 2,5 poin).
 *
 * Norma populasi asli (rata-rata & simpangan baku) tidak dipublikasikan. Untuk skor ternorma, aplikasi
 * memakai asumsi rata-rata peserta 50% benar dan simpangan baku 16,7% (setara rumus 200 + 600 × proporsi).
 */
(function (S) {
  'use strict';
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const NORM = { mean: 0.5, sd: 1 / 6 };
  const normed = (p) => clamp(Math.round(500 + 100 * ((p - NORM.mean) / NORM.sd)), 200, 800);
  const prop = (b, n) => (n ? b / n : 0);

  // Tabel konversi jumlah benar → skor bagian (pendekatan tabel Longman/Phillips yang lazim dipakai
  // untuk tes TOEFL-like seperti ProTEFL). ETS menyetarakan per formulir, jadi skor asli bisa berbeda ±10–20 poin.
  const T_LIST = [24, 25, 26, 27, 28, 29, 30, 31, 32, 32, 33, 35, 37, 38, 39, 41, 41, 42, 43, 44, 45, 45, 46, 47, 47, 48, 48, 49, 49, 50, 51, 51, 52, 52, 53, 54, 54, 55, 56, 57, 57, 58, 59, 60, 61, 62, 63, 65, 66, 67, 68];
  const T_STRU = [20, 20, 21, 22, 23, 25, 26, 27, 29, 31, 33, 35, 36, 37, 38, 40, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 63, 65, 67, 68];
  const T_READ = [21, 22, 23, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 43, 44, 45, 46, 46, 47, 48, 48, 49, 50, 51, 52, 52, 53, 54, 54, 55, 56, 57, 58, 59, 60, 61, 63, 65, 66, 67];
  const toeflSection = (b, n, table, max) => {
    const full = table.length - 1;
    const raw = Math.round(prop(b, n) * full);
    return clamp(table[raw], 31, max);
  };
  S.toeflSection = toeflSection;
  S.TOEFL_TABLES = { listening: T_LIST, structure: T_STRU, reading: T_READ };

  const sec = (res, i) => res.sections[i] || { b: 0, n: 0, s: 0, k: 0, raw: 0, max: 0 };

  const SCORERS = {
    toefl(sess, res, exam) {
      const L = toeflSection(sec(res, 0).b, sec(res, 0).n, T_LIST, 68);
      const St = toeflSection(sec(res, 1).b, sec(res, 1).n, T_STRU, 68);
      const R = toeflSection(sec(res, 2).b, sec(res, 2).n, T_READ, 67);
      const total = Math.round(((L + St + R) * 10) / 3);
      return {
        value: total, unit: '', min: 310, max: 677, target: exam.target,
        label: 'Estimasi skor TOEFL ITP (310–677)',
        parts: [['Listening', L, '31–68'], ['Structure & written expression', St, '31–68'], ['Reading', R, '31–67']],
        rule: 'Jumlah benar tiap bagian dikonversi ke skor bagian, lalu total = (L + S + R) × 10 ÷ 3. Jumlah soal simulasi diskalakan ke panjang tes asli (50/40/50).',
      };
    },
    paps(sess, res, exam) {
      const parts = res.sections.map((s) => [s.name, normed(prop(s.b, s.n)), '200–800']);
      const total = Math.round(S.sum(parts.map((p) => p[1])) / (parts.length || 1));
      return {
        value: total, unit: '', min: 200, max: 800, target: exam.target, label: 'Estimasi skor PAPs (ternorma, rata-rata 500)', parts,
        rule: 'Skor ternorma 500 + 100 × Z per subtes, lalu dirata-rata. Norma asli tidak dipublikasikan; asumsi rata-rata peserta 50% benar.',
      };
    },
    bappenas(sess, res, exam) {
      const parts = res.sections.map((s) => [s.name, Math.round(normed(prop(s.b, s.n)) / 10), '20–80']);
      const total = Math.round((S.sum(parts.map((p) => p[1])) / (parts.length || 1)) * 10);
      return {
        value: total, unit: '', min: 200, max: 800, target: exam.target, label: 'Estimasi skor TPA Bappenas (200–800)', parts,
        rule: 'Skor tiap subtes 20–80, total = (verbal + numerik + penalaran) ÷ 3 × 10.',
      };
    },
    upda(sess, res, exam) {
      const groups = {};
      res.sections.forEach((s, i) => {
        const g = (sess.sections[i] && sess.sections[i].group) || s.name;
        groups[g] = groups[g] || { b: 0, n: 0 };
        groups[g].b += s.b; groups[g].n += s.n;
      });
      const parts = Object.entries(groups).map(([g, x]) => [g, normed(prop(x.b, x.n)), '200–800']);
      const total = Math.round(S.sum(parts.map((p) => p[1])) / (parts.length || 1));
      return {
        value: total, unit: '', min: 200, max: 800, target: exam.target, label: 'Estimasi skor UPDA ITB (200–800)', parts,
        rule: 'Sembilan subtes dikelompokkan menjadi verbal, kuantitatif, dan logika; skor akhir = rata-rata skor ketiga kelompok.',
      };
    },
    simak(sess, res, exam) {
      const tpa = res.sections.filter((s) => s.pen), eng = res.sections.filter((s) => !s.pen);
      const raw = S.sum(tpa.map((s) => s.raw)), max = S.sum(tpa.map((s) => s.max));
      const engB = S.sum(eng.map((s) => s.b)), engN = S.sum(eng.map((s) => s.n));
      const tpaPct = max ? Math.max(0, raw) / max : 0, engPct = prop(engB, engN);
      const index = Math.round(((tpaPct + engPct) / 2) * 100);
      return {
        value: index, unit: '', min: 0, max: 100, target: exam.target, label: 'Indeks SIMAK (0–100, TPA dan Bahasa Inggris sama bobot)',
        parts: [...tpa.map((s) => [s.name, s.raw, `maks ${s.max}`]), ['Skor mentah TPA', raw, `maks ${max}`], ['Bahasa Inggris (benar)', engB, `dari ${engN}`]],
        rule: 'TPA: +4 benar, −1 salah, 0 kosong. Bahasa Inggris tanpa nilai minus. UI tidak memublikasikan skor dan bobot; indeks hanya untuk memantau kemajuan.',
      };
    },
    tbs(sess, res, exam) {
      const total = Math.round(prop(res.b, res.total) * 60) * 5;
      const parts = res.sections.map((s) => [s.name, Math.round(prop(s.b, s.n) * 20) * 5, 'maks 100']);
      return {
        value: total, unit: '', min: 0, max: 300, target: exam.target, label: 'Estimasi skor Tes Bakat Skolastik (0–300)', parts,
        rule: 'Benar 5 poin, salah/kosong 0, setara 60 soal (maks 300). Ambang reguler menurut catatan publik: 150 (2023), 125 (2024 tahap 1), 165 (2025 tahap 2).',
      };
    },
    acept(sess, res, exam) {
      const total = Math.round(prop(res.b, res.total) * 426);
      return {
        value: total, unit: '', min: 0, max: 426, target: exam.target, label: 'Estimasi skor AcEPT (±0–426)',
        parts: res.sections.map((s) => [s.name, `${s.b}/${s.n}`, `${S.pct(s.b, s.n)}%`]),
        rule: 'Setiap butir berbobot sama; skala dilaporkan ±0–426. Bobot resmi per bagian tidak dipublikasikan.',
      };
    },
    pct(sess, res, exam) {
      return { value: res.pct, unit: '%', min: 0, max: 100, target: exam ? exam.target || 70 : 70, label: 'Persentase jawaban benar', parts: [], rule: 'Latihan: persentase benar. Target 70% adalah margin aman latihan.' };
    },
  };

  S.scoreSession = function (sess, res) {
    const exam = sess.examId ? S.examById(sess.examId) : null;
    const kind = exam && SCORERS[exam.scale] ? exam.scale : 'pct';
    return SCORERS[kind](sess, res, exam || {});
  };
  S.normedScore = normed;
})((window.SiapS2 = window.SiapS2 || {}));
