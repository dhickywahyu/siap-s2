# Siap S2

Aplikasi latihan tes masuk S2 **UI, UGM, ITB** dan **beasiswa LPDP** dengan pengalaman seperti ujian sungguhan: timer per bagian, lembar jawaban ala LJK, nilai minus SIMAK, dan kunci jawaban yang **baru terbuka setelah jawaban dikumpulkan**.

Dibuat untuk belajar mandiri dan bersama teman. Gratis, tanpa akun, tanpa server, dan bisa dipakai offline.

![Beranda Siap S2](docs/img/beranda.png)

## Isi aplikasi

| Fitur | Keterangan |
|---|---|
| **7 simulasi ujian** | SIMAK UI Magister, PAPs UGM, AcEPT UGM, UPDA ITB, TPA Bappenas, Tes Bakat Skolastik LPDP, ELPT ITB / TOEFL ITP. Versi penuh dan mini (±⅓ durasi). |
| **Bank soal** | 620 soal tertulis + 277 kosakata, semuanya dengan pembahasan. |
| **Variasi otomatis** | Generator untuk deret angka/huruf, aritmetika, operasi, aljabar, soal cerita, geometri, statistika, peluang, perbandingan kuantitatif, silogisme, ingkaran, urutan, figural, dan vocabulary. Kunci dihitung program, jadi soal tidak pernah habis. |
| **Kunci terkunci** | Kunci jawaban dan pembahasan disimpan terenkode dan baru didekode setelah sesi selesai. |
| **Rasa ujian asli** | Timer tidak bisa dijeda, bagian terkunci setelah diakhiri, audio listening hanya sekali putar, dan pencatatan "keluar halaman" seperti ujian daring berpengawas. |
| **Hasil & pembahasan** | Estimasi skor (skala 200–800, AcEPT, TOEFL), analisis per bagian dan per topik, catatan strategi otomatis, LJK berwarna, filter salah/kosong/ragu. |
| **Latihan per topik** | Pilih topik, jumlah soal, dan batas waktu. Latihan kilat siap pakai. |
| **Strategi & rumus cepat** | Teknik verbal, 8 pola deret, rumus soal cerita, tabel logika, strategi menebak +4/−1. |
| **English Booster** | Rencana 8 minggu, flashcard dengan pengulangan berjarak (Leitner), 25 aturan grammar, listening dengan suara browser, catatan soal salah. |
| **Beasiswa & aturan** | Syarat UI/UGM/ITB, aturan LPDP, kerangka esai, latihan wawancara bertimer (28 pertanyaan), LGD, esai on the spot, checklist dokumen. |
| **Analisis soal** | Format tiap tes dan perubahannya dari tahun ke tahun, peta topik, jatah waktu per soal, beserta sumbernya. |
| **Riwayat & progres** | Grafik skor, akurasi per topik, cadangan data untuk pindah perangkat. |

| Layar ujian | Pembahasan |
|---|---|
| ![Layar ujian UPDA ITB](docs/img/ujian.png) | ![Pembahasan](docs/img/pembahasan.png) |

## Cara memakai

### Online (paling mudah untuk teman-teman)
Buka tautan GitHub Pages repositori ini: `https://<username-github>.github.io/siap-s2/`. Progres tiap orang tersimpan di browser masing-masing.

### Offline
1. Klik **Code → Download ZIP**, lalu ekstrak.
2. Buka `index.html` dengan Chrome, Edge, atau Firefox.

Tidak perlu instalasi. Tanpa internet, huruf memakai font cadangan sistem.

### Alur belajar yang disarankan
1. Kerjakan **simulasi mini** tes target untuk diagnosis.
2. Lihat **topik terlemah** di halaman hasil.
3. Pelajari tekniknya di **Strategi & rumus cepat**.
4. Latih dengan **Latihan per topik** bertimer.
5. **Ulangi soal salah**, lalu simulasi penuh tiap 1–2 minggu.
6. **English Booster** setiap hari, minimal 10 menit flashcard.

## Menerbitkan di GitHub Pages

Repositori ini sudah berisi workflow `.github/workflows/pages.yml`.

1. Push ke branch `main`.
2. Buka **Settings → Pages**, pilih **Source: GitHub Actions**.
3. Setiap push akan menjalankan validasi bank soal dan uji otomatis, lalu menerbitkan situs.

## Struktur folder

```
siap-s2/
├── index.html              # aplikasi (satu halaman, tanpa build untuk dipakai)
├── assets/
│   ├── css/app.css         # tampilan (token warna terang/gelap)
│   └── js/
│       ├── util.js         # RNG, enkode kunci, penyimpanan, renderer Markdown
│       ├── exams.js        # konfigurasi 7 simulasi + daftar subtopik
│       ├── generators.js   # generator soal otomatis
│       ├── engine.js       # mesin ujian, timer, LJK, penilaian, pembahasan
│       ├── content-data.js # pertanyaan wawancara, checklist, linimasa
│       └── app.js          # router, halaman, widget
├── bank/                   # SUMBER soal (mudah diedit)
├── content/                # SUMBER halaman belajar (Markdown, juga terbaca di GitHub)
├── data/                   # hasil build: bank.js, vocab.js, content.js
├── tools/
│   ├── build.js            # validasi + enkode kunci + gabung konten
│   ├── test.js             # uji otomatis
│   └── verify-puzzles.py   # verifikasi teka-teki penalaran analitis
└── docs/img/               # tangkapan layar
```

## Halaman belajar (bisa dibaca langsung di GitHub)

- [Analisis soal tes masuk S2 dan beasiswa](content/analisis-ujian.md)
- [Strategi & rumus cepat](content/strategi-rumus.md)
- [Beasiswa & aturan masuk S2](content/tips-beasiswa.md)
- [Hal penting yang sering terlewat](content/hal-penting.md)
- [English Booster](content/english-booster.md) dan [25 aturan grammar](content/english-grammar.md)
- [Panduan memakai aplikasi](content/panduan.md)

## Menambah atau memperbaiki soal

```bash
node tools/build.js
```

```bash
node tools/test.js
```

Edit file di `bank/` atau `content/`, lalu jalankan dua perintah di atas (butuh Node.js 18+, tanpa dependensi). Detail format ada di [CONTRIBUTING.md](CONTRIBUTING.md).

> Catatan kejujuran: kunci jawaban di `data/bank.js` terenkode agar tidak terlihat sekilas, tetapi sumber soal di folder `bank/` berupa teks biasa untuk kemudahan kontribusi. Kalau ingin latihan jujur, jangan membuka folder `bank/` sebelum mengerjakan.

## Akurasi informasi

Format tes dan aturan beasiswa dirangkum dari sumber publik per **November 2026** (tautan sumber ada di setiap halaman). Penyelenggara tidak selalu memublikasikan detail resmi dan aturan dapat berubah setiap gelombang. Selalu cek laman resmi kampus, prodi, Bappenas, dan LPDP sebelum mendaftar. Skor di aplikasi adalah estimasi untuk melihat tren.

Soal disusun orisinal mengikuti gaya dan kisi-kisi tes, bukan salinan soal resmi. Aplikasi ini tidak berafiliasi dengan UI, UGM, ITB, Bappenas, maupun LPDP.

## Lisensi

[MIT](LICENSE). Silakan dipakai, dibagikan, dan dikembangkan.
