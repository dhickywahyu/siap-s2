/* Siap S2 — konfigurasi simulasi ujian.
 * Komposisi disusun dari kisi-kisi publik (situs kampus, panduan prodi, rangkuman lembaga persiapan) 2019–2026.
 * Format resmi bisa berubah setiap gelombang: selalu cek pengumuman resmi sebelum ujian.
 * draw: [subtopik, jumlah soal]. scoring: [benar, salah, kosong].
 */
(function (S) {
  'use strict';

  S.CATS = { verbal: 'Verbal', kuantitatif: 'Kuantitatif', penalaran: 'Penalaran', english: 'Bahasa Inggris' };
  S.SUBS = {
    sinonim: ['Sinonim', 'verbal'], antonim: ['Antonim', 'verbal'], analogi: ['Analogi / padanan hubungan', 'verbal'],
    pengelompokan: ['Pengelompokan kata', 'verbal'], bacaan: ['Pemahaman bacaan', 'verbal'],
    deret: ['Deret angka', 'kuantitatif'], aritmetika: ['Aritmetika', 'kuantitatif'], operasi: ['Operasi & hitung cepat', 'kuantitatif'],
    aljabar: ['Aljabar', 'kuantitatif'], 'soal-cerita': ['Soal cerita', 'kuantitatif'], 'perbandingan-kuantitatif': ['Perbandingan kuantitatif (P vs Q)', 'kuantitatif'],
    geometri: ['Geometri', 'kuantitatif'], bisnis: ['Kuantitatif bisnis & data (MBA/MM)', 'kuantitatif'], statistika: ['Statistika & data', 'kuantitatif'], peluang: ['Peluang & kombinatorik', 'kuantitatif'],
    silogisme: ['Silogisme', 'penalaran'], 'logika-proposisi': ['Ingkaran & ekuivalensi', 'penalaran'], analitis: ['Penalaran analitis', 'penalaran'],
    urutan: ['Urutan & posisi', 'penalaran'], figural: ['Figural / spasial', 'penalaran'], 'deret-huruf': ['Deret huruf', 'penalaran'],
    'penalaran-logis': ['Penalaran logis (wacana)', 'penalaran'],
    structure: ['Structure', 'english'], 'written-expression': ['Written expression', 'english'], vocabulary: ['Vocabulary', 'english'],
    reading: ['Reading comprehension', 'english'], listening: ['Listening', 'english'], composing: ['Composing / sentence order', 'english'],
  };
  S.subLabel = (s) => (S.SUBS[s] ? S.SUBS[s][0] : s);
  S.subCat = (s) => (S.SUBS[s] ? S.SUBS[s][1] : 'verbal');

  const TPA = [4, -1, 0];
  S.EXAMS = [
    {
      id: 'simak-ui', kampus: 'UI', name: 'SIMAK UI Magister', timing: 'section', scale: 'simak',
      blurb: 'TPA (verbal, kuantitatif, logika) lalu Bahasa Inggris. TPA dinilai +4 benar, −1 salah, 0 kosong.',
      note: 'Pada SIMAK 2022, peserta mendapat jeda 30 menit antara TPA dan Bahasa Inggris. Sumber berbeda menyebut 90–150 soal TPA; simulasi ini memakai 90 soal TPA + 60 soal Bahasa Inggris.',
      sections: [
        { name: 'TPA · Verbal', min: 30, scoring: TPA, draw: [['sinonim', 8], ['antonim', 8], ['analogi', 7], ['bacaan', 7]] },
        { name: 'TPA · Kuantitatif', min: 50, scoring: TPA, draw: [['deret', 7], ['aritmetika', 6], ['soal-cerita', 8], ['aljabar', 3], ['perbandingan-kuantitatif', 3], ['geometri', 3]] },
        { name: 'TPA · Logika', min: 40, scoring: TPA, draw: [['silogisme', 8], ['logika-proposisi', 5], ['analitis', 8], ['urutan', 4], ['penalaran-logis', 5]] },
        { name: 'Bahasa Inggris', min: 90, scoring: [1, 0, 0], draw: [['structure', 15], ['written-expression', 15], ['vocabulary', 10], ['reading', 20]] },
      ],
    },
    {
      id: 'paps-ugm', kampus: 'UGM', name: 'PAPs UGM', timing: 'section', scale: 'tpa', target: 500,
      blurb: 'Potensi Akademik Pascasarjana: 120 soal dalam 100 menit, tiap subtes punya waktu sendiri.',
      note: 'Skor minimal umumnya 500 untuk magister, tetapi prodi boleh menetapkan lebih tinggi. Sertifikat berlaku 2 tahun.',
      sections: [
        { name: 'Verbal', min: 20, draw: [['sinonim', 10], ['antonim', 10], ['analogi', 10], ['bacaan', 10]] },
        { name: 'Kuantitatif', min: 40, draw: [['deret', 10], ['aritmetika', 8], ['soal-cerita', 10], ['aljabar', 4], ['perbandingan-kuantitatif', 4], ['statistika', 4]] },
        { name: 'Penalaran', min: 40, draw: [['silogisme', 10], ['analitis', 10], ['urutan', 6], ['logika-proposisi', 6], ['figural', 4], ['penalaran-logis', 4]] },
      ],
    },
    {
      id: 'acept-ugm', kampus: 'UGM', name: 'AcEPT UGM', timing: 'global', scale: 'acept', target: 209,
      blurb: 'Academic English Proficiency Test: listening, vocabulary, grammar, reading, composing. 120 soal, 100 menit.',
      note: 'Skor minimal magister yang sering dipakai 209 (beberapa prodi lebih tinggi, misalnya 230). Skala resmi ±0–426; skor di sini estimasi.',
      sections: [
        { name: 'Listening', min: 15, draw: [['listening', 20]] },
        { name: 'Vocabulary', min: 10, draw: [['vocabulary', 15]] },
        { name: 'Grammar', min: 25, draw: [['structure', 15], ['written-expression', 15]] },
        { name: 'Reading', min: 30, draw: [['reading', 25]] },
        { name: 'Composing', min: 20, draw: [['composing', 30]] },
      ],
    },
    {
      id: 'upda-itb', kampus: 'ITB', name: 'UPDA ITB', timing: 'section', scale: 'tpa', target: 475,
      blurb: '9 subtes masing-masing 15 menit: sinonim, antonim, padanan, pemahaman teks, aritmetika, deret, operasi, analisis, logika formal.',
      note: 'Syarat umum magister ITB: UPDA/TPA Bappenas minimal 475 (beberapa prodi lebih tinggi, misalnya MSM SBM 525). Skala skor 200–800.',
      sections: [
        { name: 'Sinonim', min: 15, draw: [['sinonim', 25]] },
        { name: 'Antonim', min: 15, draw: [['antonim', 25]] },
        { name: 'Padanan hubungan', min: 15, draw: [['analogi', 25]] },
        { name: 'Pemahaman teks', min: 15, draw: [['bacaan', 15]] },
        { name: 'Aritmetika', min: 15, draw: [['aritmetika', 25]] },
        { name: 'Deret', min: 15, draw: [['deret', 20], ['deret-huruf', 5]] },
        { name: 'Operasi matematika', min: 15, draw: [['operasi', 15], ['aljabar', 10]] },
        { name: 'Analisis', min: 15, draw: [['soal-cerita', 8], ['perbandingan-kuantitatif', 4], ['statistika', 3]] },
        { name: 'Logika formal', min: 15, draw: [['silogisme', 10], ['logika-proposisi', 5]] },
      ],
    },
    {
      id: 'tpa-bappenas', kampus: 'UGM · ITB · umum', name: 'TPA Bappenas', timing: 'section', scale: 'tpa', target: 500,
      blurb: 'TPA versi Bappenas (dulu OTO Bappenas): verbal, numerik, penalaran. Diterima UGM, ITB, dan banyak kampus lain.',
      note: 'Jumlah soal dan durasi resmi tidak dipublikasikan secara konsisten; simulasi memakai 120 soal/2 jam. Skor berlaku 2 tahun.',
      sections: [
        { name: 'Verbal', min: 30, draw: [['sinonim', 10], ['antonim', 10], ['analogi', 10], ['pengelompokan', 5], ['bacaan', 5]] },
        { name: 'Numerik', min: 45, draw: [['deret', 12], ['aritmetika', 10], ['soal-cerita', 12], ['aljabar', 3], ['perbandingan-kuantitatif', 3]] },
        { name: 'Penalaran', min: 45, draw: [['silogisme', 10], ['penalaran-logis', 6], ['analitis', 12], ['figural', 8], ['urutan', 4]] },
      ],
    },
    {
      id: 'lpdp-tbs', kampus: 'LPDP', name: 'Tes Bakat Skolastik LPDP', timing: 'global', scale: 'pct', target: 70,
      blurb: 'Seleksi Bakat Skolastik: verbal, kuantitatif, penalaran/pemecahan masalah, berbasis komputer.',
      note: 'Satu sumber menyebut 60 soal/90 menit pada 2026. Kelulusan ditetapkan per kelompok pendaftar; target 70% di sini hanyalah margin aman latihan, bukan angka resmi.',
      sections: [
        { name: 'Verbal', min: 30, draw: [['sinonim', 4], ['antonim', 3], ['analogi', 5], ['bacaan', 8]] },
        { name: 'Kuantitatif', min: 30, draw: [['deret', 5], ['aritmetika', 4], ['soal-cerita', 7], ['perbandingan-kuantitatif', 2], ['statistika', 2]] },
        { name: 'Penalaran', min: 30, draw: [['silogisme', 6], ['analitis', 6], ['penalaran-logis', 4], ['figural', 2], ['urutan', 2]] },
      ],
    },
    {
      id: 'toefl-itp', kampus: 'ITB · UI · LPDP', name: 'ELPT ITB / TOEFL ITP', timing: 'section', scale: 'toefl', target: 500,
      blurb: 'Format TOEFL ITP: Listening, Structure & Written Expression, Reading. Dipakai juga untuk latihan ELPT ITB.',
      note: 'TOEFL ITP asli: 140 soal (50 listening, 40 structure, 50 reading) dalam ±115 menit; simulasi ini sedikit dipersingkat. ELPT ITB punya skala sendiri (syarat yang tercantum: 77).',
      sections: [
        { name: 'Listening comprehension', min: 25, scoring: [1, 0, 0], draw: [['listening', 25]] },
        { name: 'Structure & written expression', min: 25, scoring: [1, 0, 0], draw: [['structure', 15], ['written-expression', 25]] },
        { name: 'Reading comprehension', min: 45, scoring: [1, 0, 0], draw: [['reading', 30]] },
      ],
    },
  ];
  S.examById = (id) => S.EXAMS.find((e) => e.id === id);

  S.DRILLS = [
    { id: 'kilat-deret', title: 'Kilat deret angka', subs: ['deret'], n: 20, min: 10, why: 'Deret muncul di hampir semua TPA. Target: < 30 detik per soal.' },
    { id: 'kilat-silogisme', title: 'Silogisme & logika formal', subs: ['silogisme', 'logika-proposisi'], n: 15, min: 12, why: 'Latih pola modus ponens, tollens, dan jebakan konvers.' },
    { id: 'kilat-verbal', title: 'Sinonim–antonim cepat', subs: ['sinonim', 'antonim'], n: 30, min: 10, why: 'UPDA ITB memberi 25 soal sinonim dalam 15 menit: kecepatan adalah kunci.' },
    { id: 'kilat-analogi', title: 'Analogi', subs: ['analogi'], n: 15, min: 10, why: 'Bangun "kalimat jembatan" untuk setiap pasangan kata.' },
    { id: 'kilat-cerita', title: 'Soal cerita', subs: ['soal-cerita', 'perbandingan-kuantitatif'], n: 15, min: 20, why: 'Kecepatan, pekerjaan, persen, campuran: pakai rumus cepat.' },
    { id: 'kilat-bisnis', title: 'Kuantitatif bisnis & data', subs: ['bisnis', 'perbandingan-kuantitatif'], n: 15, min: 20, why: 'BEP, markup vs margin, pertumbuhan, laba, tabel data: bekal MBA/MM dan wawancara kasus.' },
    { id: 'kilat-analitis', title: 'Penalaran analitis', subs: ['analitis', 'urutan'], n: 12, min: 15, why: 'Gambar tabel/garis posisi sebelum menjawab.' },
    { id: 'kilat-structure', title: 'Structure + written expression', subs: ['structure', 'written-expression'], n: 25, min: 15, why: 'Bagian paling cepat naik skornya untuk pemula.' },
    { id: 'kilat-reading', title: 'Reading (2–3 teks)', subs: ['reading'], n: 12, min: 18, why: 'Latih skimming, scanning, dan main idea.' },
    { id: 'kilat-listening', title: 'Listening lab', subs: ['listening'], n: 10, min: 10, why: 'Audio dibacakan mesin teks-ke-suara browser.' },
    { id: 'kilat-vocab', title: 'Vocabulary', subs: ['vocabulary'], n: 20, min: 8, why: 'Diambil dari daftar kosakata akademik di English Booster.' },
  ];
})((window.SiapS2 = window.SiapS2 || {}));
