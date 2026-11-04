# Panduan memakai Siap S2

## Alur belajar yang disarankan

1. **Diagnosis.** Kerjakan satu simulasi mini dari tes yang kamu incar (menu Simulasi ujian).
2. **Baca hasil.** Lihat topik terlemah di tabel "Per topik" dan catatan untuk sesi berikutnya.
3. **Pelajari teknik.** Buka Strategi & rumus cepat untuk topik tersebut.
4. **Latih topik.** Gunakan Latihan per topik atau Latihan kilat dengan timer.
5. **Ulangi soal salah.** Tombol "Ulangi soal salah & kosong" di halaman hasil.
6. **Simulasi penuh** setiap 1–2 minggu, dan lebih sering mendekati hari-H.
7. **Bahasa Inggris setiap hari** lewat English Booster (flashcard + satu aturan grammar + latihan).

## Aturan simulasi

- Timer tidak bisa dijeda dan tetap berjalan walaupun halaman ditutup, seperti ujian sungguhan.
- Tes dengan waktu per bagian (SIMAK, PAPs, UPDA, TPA Bappenas, ELPT/TOEFL) mengunci bagian yang sudah selesai.
- Kunci jawaban dan pembahasan **baru terbuka setelah jawaban dikumpulkan**. Selama ujian, kunci tersimpan dalam bentuk terenkode dan tidak ditampilkan.
- Berpindah tab atau aplikasi dicatat sebagai "keluar halaman", meniru pengawasan ujian daring.
- Soal listening dibacakan oleh fitur suara browser (text-to-speech) dan hanya bisa diputar sekali dalam mode simulasi.

## Pintasan keyboard saat ujian

| Tombol | Fungsi |
|---|---|
| A–E atau 1–5 | Memilih jawaban (tekan lagi untuk membatalkan) |
| ← / → | Soal sebelumnya / berikutnya |
| R | Tandai atau hapus tanda ragu-ragu |
| Esc | Tutup jendela dialog |

## Tentang soal

- **Soal tertulis** disusun orisinal mengikuti gaya dan kisi-kisi tes asli, lengkap dengan pembahasan.
- **Variasi otomatis** untuk deret, aritmetika, soal cerita, peluang, perbandingan kuantitatif, silogisme, ingkaran, urutan, figural, dan vocabulary dibuat oleh generator. Kuncinya dihitung oleh program, jadi soalnya tidak pernah habis.
- Aplikasi memprioritaskan soal yang paling jarang kamu lihat agar latihan tidak berulang.
- Skor skala 200–800, AcEPT, dan TOEFL adalah **estimasi**. Gunakan untuk melihat tren, bukan prediksi pasti.

## Data dan privasi

- Semua riwayat, statistik, flashcard, dan catatan tersimpan di browser perangkatmu (localStorage). Tidak ada data yang dikirim ke server.
- Pindah perangkat: buka Riwayat & progres → Salin cadangan, lalu tempel di perangkat lain.
- Mode penyamaran (incognito) atau menghapus data situs akan menghapus progres.

## Memakai di HP Android

1. Buka situs Siap S2 (alamat GitHub Pages yang diawali https://) di **Google Chrome**.
2. Ketuk tombol **Pasang di HP** di Beranda, atau menu **⋮ → Instal aplikasi / Tambahkan ke layar utama**.
3. Buka dari ikon Siap S2 di layar utama. Aplikasi terbuka layar penuh seperti aplikasi biasa.
4. Setelah dibuka sekali saat online, Siap S2 **tetap bisa dipakai tanpa internet**.

Fitur khusus HP:
- Navigasi bawah (Beranda, Simulasi, Latihan, English, Menu).
- Tombol **Lembar jawaban** membuka LJK dari sisi kanan; ketuk nomor untuk melompat ke soal.
- Layar tetap menyala selama ujian berlangsung.
- Tombol **Back** Android tidak langsung mengeluarkanmu dari ujian; muncul konfirmasi dulu.
- Listening memakai suara bawaan Android. Jika tidak ada suara, buka Setelan → Aksesibilitas/Bahasa → **Output text-to-speech**, lalu pasang data suara bahasa Inggris.

## Memakai tanpa internet

Unduh atau clone repositori, lalu buka `index.html` langsung di browser. Semua fitur berjalan tanpa server. Tanpa internet, huruf akan memakai font cadangan sistem.

## Menambah soal

Soal disimpan di folder `bank/` dalam format yang mudah ditulis. Setelah menambah soal, jalankan `node tools/build.js` untuk memvalidasi dan mengenkode kunci jawaban. Panduan lengkap ada di `CONTRIBUTING.md`.

## Catatan

Aplikasi ini adalah alat latihan mandiri dan tidak berafiliasi dengan UI, UGM, ITB, Bappenas, maupun LPDP. Format dan aturan tes dapat berubah; selalu periksa pengumuman resmi.
