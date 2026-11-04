# Panduan kontribusi

Terima kasih ingin menambah soal atau memperbaiki konten. Semua soal disimpan di folder `bank/` dalam format ringkas, lalu `tools/build.js` memvalidasi, mengacak urutan opsi, dan mengenkode kunci jawaban ke `data/bank.js`.

## Aturan dasar

1. **Soal harus orisinal.** Jangan menyalin soal resmi atau soal dari buku/bimbel berhak cipta. Buat soal baru dengan gaya yang sama.
2. **Setiap soal wajib punya pembahasan** yang menjelaskan alasan, bukan sekadar menyebut kunci.
3. **Pastikan hanya ada satu jawaban benar.** Untuk teka-teki penalaran analitis, verifikasi dengan brute force (contoh di `tools/verify-puzzles.py`).
4. Untuk fakta (sejarah, data, aturan), gunakan informasi yang bisa dicek dan cantumkan sumber di halaman `content/` bila relevan.
5. Jalankan `node tools/build.js && node tools/test.js` sebelum commit. Keduanya harus lolos.

## Format soal

### Format ringkas (jawaban benar di posisi kedua)

```js
{
  sub: 'sinonim', level: 1, stem: 'Sinonim kata **{w}** adalah …',
  items: [
    // [kata/stem, JAWABAN BENAR, pengecoh1, pengecoh2, pengecoh3, pengecoh4, pembahasan]
    ['NOMADEN', 'berpindah-pindah', 'menetap', 'terasing', 'tradisional', 'berkelompok', 'Nomaden = hidup berpindah-pindah.'],
  ],
}
```

- `stem` dengan `{w}` akan diganti oleh elemen pertama. Tanpa `stem`, elemen pertama menjadi teks soal.
- Jumlah opsi bebas 2–5 (soal bahasa Inggris gaya TOEFL memakai 4 opsi).
- Urutan opsi diacak otomatis saat build, jadi tulis jawaban benar selalu di posisi kedua.

### Format penuh

```js
{ p: 'ID01', q: 'Gagasan utama bacaan tersebut adalah …', o: ['benar', 'salah 1', 'salah 2', 'salah 3', 'salah 4'], a: 0, e: 'Pembahasan.' }
```

- `p`: id bacaan (didefinisikan di `passages` pada file yang sama atau file lain).
- `a`: indeks kunci di array `o`.
- `f: true`: urutan opsi tidak diacak (misalnya opsi "P > Q, P < Q, P = Q, tidak dapat ditentukan").
- `au`: skrip audio listening, contoh `[['W', 'Kalimat wanita'], ['M', 'Kalimat pria']]`.

### Written expression

```js
{ sub: 'written-expression', type: 'we', items: [
  ['Each of the [A|participants] [B|are] required to [C|submit] a [D|proposal].', 'B', '"Each of" + jamak → verb tunggal: is.'],
] }
```

Tandai empat bagian bergaris bawah dengan `[A|...]` sampai `[D|...]` secara berurutan, lalu tulis huruf bagian yang salah.

### Bacaan

```js
passages: {
  EN09: { t: 'Judul bacaan', x: 'Paragraf pertama.\n\nParagraf kedua.' },
},
```

### Kosakata (`bank/vocab.js`)

```js
['mitigate', 'v', 'alleviate', 'mengurangi dampak', 'Mangroves help mitigate the impact of storms.'],
```

Kalimat contoh harus memuat kata tersebut (boleh berimbuhan, misalnya *mitigated*).

## Subtopik yang tersedia

`sinonim, antonim, analogi, pengelompokan, bacaan, deret, aritmetika, operasi, aljabar, soal-cerita, perbandingan-kuantitatif, geometri, statistika, peluang, silogisme, logika-proposisi, analitis, urutan, figural, deret-huruf, penalaran-logis, structure, written-expression, vocabulary, reading, listening, composing`

Menambah subtopik baru: daftarkan di `S.SUBS` pada `assets/js/exams.js`.

## Menambah generator

Generator ada di `assets/js/generators.js`. Fungsi menerima objek `rng` dan mengembalikan `{ c, s, l, q, o, a, e }`. Gunakan helper `build()` agar opsi pengecoh unik. `tools/test.js` akan menjalankan setiap generator 200 kali untuk memastikan tidak ada opsi kembar, NaN, atau kunci di luar rentang.

## Mengubah konten belajar

Edit file Markdown di `content/`. Renderer mendukung judul, paragraf, tebal/miring, tautan, tabel, daftar, kode, dan callout GitHub (`> [!TIP]`, `> [!WARNING]`, dll.). Widget interaktif disisipkan dengan komentar, misalnya `<!-- widget:checklist -->`.
