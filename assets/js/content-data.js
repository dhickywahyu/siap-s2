/* Siap S2 — data pendukung widget: pertanyaan wawancara, checklist dokumen, linimasa */
(function (S) {
  'use strict';

  S.INTERVIEW = [
    { cat: 'Diri & motivasi', q: 'Ceritakan tentang diri Anda dalam dua menit.', hint: 'Bukan riwayat hidup kronologis. Pakai benang merah: siapa Anda → apa yang sudah dikerjakan → kenapa studi ini langkah berikutnya.' },
    { cat: 'Diri & motivasi', q: 'Mengapa Anda layak menerima beasiswa ini dibanding pelamar lain?', hint: 'Tunjukkan bukti (prestasi, dampak, rekam jejak), bukan klaim. Kaitkan dengan nilai LPDP: integritas, profesional, sinergi, pelayanan, kesempurnaan.' },
    { cat: 'Diri & motivasi', q: 'Apa kelemahan terbesar Anda dan apa yang sudah Anda lakukan untuk memperbaikinya?', hint: 'Pilih kelemahan nyata yang tidak fatal untuk studi, lalu ceritakan langkah konkret dan hasilnya (misalnya bahasa Inggris: dari skor X ke Y).' },
    { cat: 'Diri & motivasi', q: 'Apa pencapaian yang paling Anda banggakan?', hint: 'Gunakan STAR: Situation, Task, Action, Result. Sebut angka hasil.' },
    { cat: 'Rencana studi', q: 'Mengapa memilih program studi ini?', hint: 'Hubungkan masalah yang ingin diselesaikan → kompetensi yang belum dimiliki → mata kuliah/laboratorium prodi yang menjawabnya.' },
    { cat: 'Rencana studi', q: 'Mengapa memilih kampus ini dan bukan kampus lain?', hint: 'Sebut hal spesifik: laboratorium, pusat studi, dosen, kurikulum, jejaring industri, akreditasi. Hindari jawaban "karena terbaik".' },
    { cat: 'Rencana studi', q: 'Jelaskan rencana penelitian atau tesis Anda.', hint: 'Masalah → pertanyaan penelitian → metode singkat → manfaat. Siapkan versi 30 detik dan versi 2 menit.' },
    { cat: 'Rencana studi', q: 'Siapa calon pembimbing yang Anda incar dan mengapa?', hint: 'Sebut nama dan riset terkait yang sudah Anda baca. Lebih kuat jika Anda sudah berkorespondensi.' },
    { cat: 'Rencana studi', q: 'Bagaimana Anda memastikan lulus tepat waktu?', hint: 'Rencana per semester, target publikasi, manajemen waktu, pengalaman menyelesaikan skripsi.' },
    { cat: 'Rencana studi', q: 'Apa rencana Anda jika topik penelitian ternyata tidak bisa dilanjutkan?', hint: 'Tunjukkan fleksibilitas: rencana cadangan yang masih satu payung dengan tujuan kontribusi.' },
    { cat: 'Kontribusi', q: 'Apa kontribusi konkret Anda untuk Indonesia setelah lulus?', hint: 'Bagi tiga lapis: jangka pendek (1–2 tahun), menengah (5 tahun), panjang (10 tahun). Sebut sektor, lokasi, dan indikator dampak.' },
    { cat: 'Kontribusi', q: 'Masalah apa di bidang Anda yang paling mendesak di Indonesia saat ini?', hint: 'Sertakan data atau fakta terbaru, lalu posisikan diri Anda sebagai bagian dari solusinya.' },
    { cat: 'Kontribusi', q: 'Di mana Anda melihat diri Anda 10 tahun lagi?', hint: 'Konsisten dengan esai. Panel akan membandingkan jawaban dengan dokumen Anda.' },
    { cat: 'Kontribusi', q: 'Bagaimana hasil studi Anda berdampak bagi daerah asal atau komunitas Anda?', hint: 'Contoh program kecil yang bisa langsung dijalankan, bukan hanya cita-cita besar.' },
    { cat: 'Kepemimpinan', q: 'Ceritakan pengalaman memimpin tim dalam situasi sulit.', hint: 'STAR. Tekankan keputusan Anda dan cara menggerakkan orang lain.' },
    { cat: 'Kepemimpinan', q: 'Ceritakan kegagalan terbesar Anda. Apa pelajarannya?', hint: 'Akui dengan jujur, jelaskan perubahan perilaku setelahnya. Hindari menyalahkan orang lain.' },
    { cat: 'Kepemimpinan', q: 'Bagaimana Anda menangani konflik dalam tim?', hint: 'Contoh nyata: dengarkan, cari kepentingan bersama, putuskan, evaluasi.' },
    { cat: 'Kebangsaan & integritas', q: 'Apa arti nasionalisme bagi Anda?', hint: 'Turunkan ke tindakan sehari-hari dan rencana kontribusi, bukan definisi buku.' },
    { cat: 'Kebangsaan & integritas', q: 'Apa yang Anda lakukan jika melihat kecurangan di tempat kerja atau kampus?', hint: 'Integritas adalah nilai inti LPDP. Jawab tegas dengan langkah yang sesuai prosedur.' },
    { cat: 'Kebangsaan & integritas', q: 'Dana beasiswa berasal dari uang rakyat. Bagaimana Anda memaknainya?', hint: 'Akuntabilitas: studi serius, lulus tepat waktu, kembali berkontribusi.' },
    { cat: 'Kebangsaan & integritas', q: 'Isu nasional apa yang sedang Anda ikuti? Bagaimana pendapat Anda?', hint: 'Baca berita 2–3 bulan terakhir di bidang Anda. Jawab berimbang: data, dua sisi, posisi Anda.' },
    { cat: 'Situasional', q: 'Bagaimana jika Anda tidak lolos tahun ini?', hint: 'Tunjukkan rencana tetap berjalan (mendaftar lagi, beasiswa lain, biaya sendiri). Komitmen pada tujuan, bukan pada beasiswanya.' },
    { cat: 'Situasional', q: 'Jika setelah lulus Anda ditawari kerja bergaji tinggi di luar negeri, apa keputusan Anda?', hint: 'Konsisten dengan komitmen kembali dan berkontribusi. Bisa sebut kolaborasi internasional yang tetap berbasis di Indonesia.' },
    { cat: 'Situasional', q: 'Mengapa tidak kuliah dengan biaya sendiri atau kantor?', hint: 'Jujur soal kebutuhan, tetapi tekankan nilai tambah beasiswa (jejaring, pembinaan, kewajiban kontribusi).' },
    { cat: 'Situasional', q: 'Bagaimana Anda membagi waktu antara kuliah, keluarga, dan pekerjaan?', hint: 'Terutama bagi pelamar yang sudah bekerja atau berkeluarga: rencana konkret dan dukungan yang sudah disiapkan.' },
    { cat: 'English', q: 'Could you briefly introduce yourself and your study plan in English?', hint: 'Siapkan 5–6 kalimat hafalan yang fleksibel. Bicara pelan dan jelas lebih baik daripada cepat dan salah.' },
    { cat: 'English', q: 'Why is your research important for Indonesia?', hint: 'Pola: "Indonesia faces …; my research addresses … by …; the expected impact is …".' },
    { cat: 'English', q: 'What will you do if you face difficulties during your study?', hint: 'Pola: "First, I will … Second, … Finally, …". Tunjukkan proaktif.' },
  ];

  S.CHECKLIST = [
    { g: 'Dokumen akademik', items: ['Ijazah dan transkrip S1 (scan berwarna dari dokumen asli/legalisir)', 'Sertifikat TPA yang masih berlaku (PAPs, UPDA, TPA Bappenas, atau setara)', 'Sertifikat bahasa Inggris sesuai syarat prodi (AcEPT, ELPT, TOEFL ITP, IELTS)', 'Rencana studi / proposal penelitian singkat', 'CV satu–dua halaman dengan prestasi terukur'] },
    { g: 'Dokumen beasiswa', items: ['Akun portal beasiswa aktif dan email profesional', 'Esai kontribusi & rencana studi sesuai template terbaru', 'Surat rekomendasi (akademisi, atasan, atau tokoh) sesuai format', 'Surat pernyataan sesuai template resmi', 'LoA (jika sudah ada) atau bukti pendaftaran kampus', 'Surat izin atasan bagi pegawai (PNS/TNI/Polri/swasta) bila disyaratkan'] },
    { g: 'Identitas & pendukung', items: ['KTP dan Kartu Keluarga', 'Pas foto formal latar polos', 'Sertifikat organisasi, kepemimpinan, atau prestasi pendukung', 'Semua file PDF dengan nama rapi, misalnya NAMA_Ijazah.pdf'] },
    { g: 'Persiapan tes', items: ['Diagnostik TPA dan bahasa Inggris (kerjakan simulasi mini)', 'Jadwal tes resmi TPA dan bahasa Inggris (sisakan waktu untuk tes ulang)', 'Latihan simulasi penuh minimal 3× sebelum tes resmi', 'Daftar 30 pertanyaan wawancara dan jawaban poin-poin', 'Simulasi wawancara dengan teman atau alumni'] },
  ];

  S.TIMELINE = [
    ['T−12 bulan', 'Pilih bidang, prodi, dan 2–3 kampus. Catat syarat TPA, bahasa Inggris, dan dokumen dari laman resmi prodi.'],
    ['T−10 bulan', 'Kerjakan simulasi mini di aplikasi ini untuk diagnosis. Mulai rutinitas English Booster harian.'],
    ['T−9 s.d. T−6', 'Ikuti tes resmi TPA dan bahasa Inggris. Jika skor kurang, masih ada waktu tes ulang (sertifikat berlaku ±2 tahun).'],
    ['T−6 bulan', 'Hubungi calon pembimbing, susun rencana studi/proposal, kumpulkan surat rekomendasi.'],
    ['T−5 bulan', 'Tulis draf esai beasiswa, minta masukan dari alumni penerima, revisi minimal 3×.'],
    ['T−4 bulan', 'Daftar kampus gelombang awal. Kampus yang memberi LoA lebih dulu memperkuat posisi beasiswa.'],
    ['T−3 bulan', 'Daftar beasiswa sesuai jadwal (LPDP umumnya punya dua tahap pendaftaran per tahun).'],
    ['T−2 bulan', 'Seleksi Bakat Skolastik: kerjakan simulasi Tes Bakat Skolastik minimal 2× per minggu.'],
    ['T−1 bulan', 'Seleksi substansi: latihan wawancara, diskusi kelompok, dan esai on-the-spot.'],
    ['T', 'Pengumuman. Siapkan rencana cadangan (gelombang berikutnya atau beasiswa lain) sejak awal.'],
  ];
})((window.SiapS2 = window.SiapS2 || {}));
