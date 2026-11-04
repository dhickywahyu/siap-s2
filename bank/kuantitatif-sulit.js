/* Bank soal KUANTITATIF tingkat SULIT (3) dan SANGAT SULIT (4).
 * Melengkapi generator otomatis dengan soal bertahap ganda, jebakan umum, dan konsep yang jarang dilatih.
 * Format ringkas: [stem, JAWABAN BENAR, pengecoh x4, pembahasan]. Semua jawaban sudah dihitung ulang.
 */
const PQ = ['P > Q', 'P < Q', 'P = Q', 'Hubungan P dan Q tidak dapat ditentukan'];
const pq = (q, a, e) => ({ q: q + '<br>Manakah hubungan yang benar antara P dan Q?', o: PQ, a, e, f: true });

module.exports = {
  cat: 'kuantitatif',
  prefix: 'kuant-sulit',
  sets: [
    {
      sub: 'soal-cerita', level: 3,
      items: [
        ['A dan B dapat menyelesaikan sebuah pekerjaan dalam 12 hari, B dan C dalam 15 hari, serta A dan C dalam 20 hari. Jika ketiganya bekerja bersama, pekerjaan selesai dalam … hari.', '10', '8', '12', '15', '9', 'Jumlahkan ketiga laju: 2(A + B + C) = 1/12 + 1/15 + 1/20 = (5 + 4 + 3)/60 = 1/5. Jadi A + B + C = 1/10 pekerjaan per hari → 10 hari.'],
        ['Harga sebuah barang dinaikkan 25%, kemudian diberi diskon 20% dari harga baru. Dibandingkan harga awal, harga akhirnya …', 'sama dengan harga awal', 'naik 5%', 'turun 5%', 'naik 45%', 'turun 2%', 'Kalikan faktornya: 1,25 × 0,80 = 1,00. Jebakan: 25% − 20% = 5%.'],
        ['Dua kereta berangkat bersamaan dari kota A dan B yang berjarak 360 km dan saling mendekat dengan kecepatan 70 km/jam dan 50 km/jam. Seekor burung terbang bolak-balik di antara kedua kereta dengan kecepatan 90 km/jam sampai kedua kereta bertemu. Jarak total yang ditempuh burung adalah … km.', '270', '360', '180', '210', '240', 'Kunci: hitung waktunya, bukan lintasannya. Kereta bertemu setelah 360 ÷ (70 + 50) = 3 jam. Burung terbang 3 × 90 = 270 km.'],
        ['Sebuah barang dijual Rp1.380.000 dengan keuntungan 15%. Agar keuntungannya 25%, barang itu harus dijual seharga …', 'Rp1.500.000', 'Rp1.518.000', 'Rp1.725.000', 'Rp1.495.000', 'Rp1.480.000', 'Modal = 1.380.000 ÷ 1,15 = 1.200.000. Harga jual baru = 1.200.000 × 1,25 = 1.500.000. Jebakan: menghitung 25% dari harga jual lama.'],
        ['Larutan 40 liter mengandung 15% garam. Agar kadar garamnya menjadi 25%, air yang harus diuapkan sebanyak … liter.', '16', '10', '24', '12', '8', 'Garam tetap 0,15 × 40 = 6 liter. Volume akhir = 6 ÷ 0,25 = 24 liter. Air yang diuapkan = 40 − 24 = 16 liter.'],
        ['Jika berangkat dengan kecepatan 40 km/jam, Dani terlambat 15 menit tiba di kantor. Jika dengan kecepatan 60 km/jam, ia tiba 5 menit lebih awal. Jarak rumah ke kantor adalah … km.', '40', '20', '60', '30', '50', 'Selisih waktu = 20 menit = 1/3 jam. d/40 − d/60 = d/120 = 1/3 → d = 40 km.'],
        ['Perbandingan umur A dan B adalah 3 : 5. Delapan tahun lagi perbandingannya menjadi 5 : 7. Jumlah umur mereka sekarang adalah … tahun.', '32', '24', '40', '48', '36', '(3k + 8)/(5k + 8) = 5/7 → 21k + 56 = 25k + 40 → k = 4. Jumlah = 8k = 32 (A = 12, B = 20).'],
        ['Uang Rp20.000.000 didepositokan dengan bunga majemuk 10% per tahun. Nilainya setelah 3 tahun adalah …', 'Rp26.620.000', 'Rp26.000.000', 'Rp26.200.000', 'Rp24.200.000', 'Rp29.282.000', '20.000.000 × 1,1³ = 20.000.000 × 1,331 = 26.620.000. Rp26.000.000 adalah bunga tunggal (jebakan).'],
        ['Pipa A dapat mengisi kolam dalam 4 jam dan pipa B dalam 6 jam. Keduanya dibuka bersamaan, tetapi setelah 1 jam pipa A ditutup dan sisanya diisi pipa B saja. Waktu total pengisian adalah …', '4 jam 30 menit', '3 jam 30 menit', '2 jam 24 menit', '5 jam', '4 jam', 'Jam pertama terisi 1/4 + 1/6 = 5/12. Sisa 7/12 diisi B (1/6 per jam) → 3,5 jam. Total 4,5 jam. 2 jam 24 menit = jika keduanya terus dibuka.'],
        ['Ali dan Budi berlari searah dari titik yang sama mengelilingi lintasan 400 m dengan kecepatan 5 m/detik dan 3 m/detik. Ali pertama kali menyusul Budi setelah … detik.', '200', '50', '80', '100', '133', 'Searah → kecepatan relatif 5 − 3 = 2 m/detik. Ali menyusul saat unggul satu putaran: 400 ÷ 2 = 200 detik. Jika berlawanan arah, 400 ÷ 8 = 50 detik (pengecoh).'],
        ['Harga 2 kg apel dan 3 kg jeruk Rp86.000, sedangkan 3 kg apel dan 2 kg jeruk Rp94.000. Selisih harga 1 kg apel dan 1 kg jeruk adalah …', 'Rp8.000', 'Rp4.000', 'Rp18.000', 'Rp36.000', 'Rp10.000', 'Kurangkan persamaan kedua dengan pertama: apel − jeruk = 94.000 − 86.000 = 8.000. Tidak perlu mencari harga masing-masing. Rp36.000 adalah jumlahnya.'],
        ['Harga tiket naik 20%, sedangkan jumlah penonton turun 10%. Perubahan pendapatan tiket adalah …', 'naik 8%', 'naik 10%', 'naik 30%', 'turun 2%', 'naik 12%', 'Pendapatan = harga × jumlah. 1,2 × 0,9 = 1,08 → naik 8%.'],
        ['Harga label sebuah barang Rp500.000. Toko memberi diskon bertingkat 20% + 10%, lalu mengenakan PPN 11% dari harga setelah diskon. Yang dibayar pembeli adalah …', 'Rp399.600', 'Rp350.000', 'Rp388.500', 'Rp360.000', 'Rp405.000', '500.000 × 0,8 = 400.000; × 0,9 = 360.000; × 1,11 = 399.600. Diskon bertingkat 20% + 10% bukan 30%.'],
        ['Sebuah mobil pergi dengan kecepatan rata-rata 60 km/jam dan pulang melalui jalan yang sama dengan 40 km/jam. Kecepatan rata-rata seluruh perjalanan adalah … km/jam.', '48', '50', '45', '52', '46', 'Jarak sama → rata-rata harmonik: 2 × 60 × 40 ÷ (60 + 40) = 4.800 ÷ 100 = 48. Jebakan: (60 + 40)/2 = 50.'],
        ['Jumlah tiga bilangan genap berurutan adalah 162. Hasil kali bilangan terkecil dan terbesar adalah …', '2.912', '2.916', '2.808', '3.024', '2.860', 'Bilangan tengah = 162 ÷ 3 = 54, jadi 52, 54, 56. 52 × 56 = (54 − 2)(54 + 2) = 2.916 − 4 = 2.912.'],
      ],
    },
    {
      sub: 'soal-cerita', level: 4,
      items: [
        ['Sekelompok pekerja direncanakan menyelesaikan proyek dalam 30 hari. Setelah 10 hari bekerja, 5 pekerja dipindahkan sehingga proyek selesai 10 hari lebih lambat dari rencana. Banyak pekerja semula adalah … orang.', '15', '10', '20', '25', '30', 'Misal n pekerja; total kerja 30n orang-hari. Sisa kerja setelah 10 hari = 20n, dikerjakan (n − 5) orang selama 30 hari (20 sisa rencana + 10 terlambat). 20n = 30(n − 5) → n = 15.'],
        ['Sebuah perahu menempuh 36 km searah arus lalu kembali melawan arus, total waktu 5 jam. Jika kecepatan arus 3 km/jam, kecepatan perahu di air tenang adalah … km/jam.', '15', '12', '18', '9', '14,4', '36/(v + 3) + 36/(v − 3) = 5 → 72v = 5(v² − 9) → 5v² − 72v − 45 = 0 → (v − 15)(5v + 3) = 0 → v = 15. Cek: 36/18 + 36/12 = 2 + 3 = 5 jam.'],
        ['Keran A mengisi bak dalam 6 jam, keran B dalam 8 jam, dan keran C menguras bak penuh dalam 12 jam. A dan B dibuka 2 jam, kemudian C juga dibuka. Waktu total sampai bak penuh adalah …', '4 jam', '2 jam', '3 jam 26 menit', '4 jam 48 menit', '5 jam', '2 jam pertama: 2 × (1/6 + 1/8) = 7/12. Sisa 5/12 dengan laju 1/6 + 1/8 − 1/12 = 5/24 → 2 jam lagi. Total 4 jam.'],
        ['Modal usaha Rina dan Sari berbanding 2 : 3. Rina menanam modal selama 12 bulan, sedangkan Sari baru bergabung pada bulan ke-5 sampai akhir tahun (8 bulan). Jika keuntungan setahun Rp24.000.000 dibagi menurut modal × lama, bagian Rina adalah …', 'Rp12.000.000', 'Rp9.600.000', 'Rp14.400.000', 'Rp10.000.000', 'Rp8.000.000', 'Bobot Rina = 2 × 12 = 24; Sari = 3 × 8 = 24. Perbandingan 1 : 1 → Rina Rp12.000.000. Rp9.600.000 muncul jika hanya memakai rasio modal 2 : 3.'],
        ['Seorang pedagang mencampur beras seharga Rp12.000/kg dan Rp15.000/kg sehingga diperoleh 60 kg campuran. Campuran dijual Rp15.600/kg dengan keuntungan 20%. Banyak beras Rp12.000/kg dalam campuran adalah … kg.', '40', '20', '30', '36', '24', 'Harga beli campuran = 15.600 ÷ 1,2 = 13.000/kg. Alligation: (15.000 − 13.000) : (13.000 − 12.000) = 2 : 1 → beras murah 2/3 × 60 = 40 kg.'],
        ['Jarum jam dan jarum menit tepat berimpit untuk pertama kalinya setelah pukul 02.00 pada pukul 2 lewat … menit.', '10 10/11', '10', '11', '12', '10 5/11', 'Sudut jarum = |30H − 5,5M|. Berimpit berarti 0: 5,5M = 30 × 2 = 60 → M = 60/5,5 = 120/11 = 10 10/11 menit. Jebakan: menjawab 10 karena lupa jarum jam ikut bergerak 0,5° per menit.'],
      ],
    },
    {
      sub: 'aljabar', level: 3,
      items: [
        ['Jika x − 1/x = 4, nilai x² + 1/x² adalah …', '18', '16', '14', '20', '12', 'Kuadratkan: (x − 1/x)² = x² − 2 + 1/x² = 16 → x² + 1/x² = 18. Jebakan: lupa tanda −2 sehingga menjawab 14.'],
        ['Jika 2^(x + 2) − 2^x = 48, nilai x adalah …', '4', '3', '5', '6', '2', 'Faktorkan: 2^x(2² − 1) = 3 × 2^x = 48 → 2^x = 16 → x = 4.'],
        ['Jika a − b = 4 dan a² + b² = 40, nilai ab adalah …', '12', '24', '6', '18', '10', '(a − b)² = a² + b² − 2ab → 16 = 40 − 2ab → ab = 12.'],
        ['Jika (a + b)² = 49 dan ab = 10, nilai a² + b² adalah …', '29', '39', '69', '19', '59', 'a² + b² = (a + b)² − 2ab = 49 − 20 = 29.'],
        ['Jika f(x) = 2x + 3 dan (f ∘ g)(x) = 6x − 1, nilai g(2) adalah …', '4', '11', '8', '5', '2', '2·g(x) + 3 = 6x − 1 → g(x) = 3x − 2 → g(2) = 4.'],
        ['Diketahui x + y = 7, y + z = 11, dan x + z = 10. Nilai xyz adalah …', '84', '70', '77', '96', '60', 'Jumlahkan ketiganya: 2(x + y + z) = 28 → x + y + z = 14. Maka z = 14 − 7 = 7, x = 14 − 11 = 3, y = 14 − 10 = 4. xyz = 84.'],
      ],
    },
    {
      sub: 'aljabar', level: 4,
      items: [
        ['Jika x + 1/x = 3, nilai x³ + 1/x³ adalah …', '18', '27', '24', '9', '21', '(x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x) → 27 = x³ + 1/x³ + 9 → x³ + 1/x³ = 18.'],
        ['Nilai dari √(12 + √(12 + √(12 + …))) adalah …', '4', '3', '2√3', '6', '12', 'Misal nilainya y. Maka y = √(12 + y) → y² − y − 12 = 0 → (y − 4)(y + 3) = 0. Karena akar positif, y = 4.'],
        ['Akar-akar persamaan x² − 7x + k = 0 berselisih 3. Nilai k adalah …', '10', '12', '7', '21', '6', 'Jumlah akar 7 dan selisih 3 → akarnya 5 dan 2. k = hasil kali akar = 10.'],
        ['Jika 3^a = 5 dan 5^b = 9, nilai ab adalah …', '2', '3', '5/9', '9/5', '1', '3^(ab) = (3^a)^b = 5^b = 9 = 3² → ab = 2.'],
        ['Jika p dan q adalah akar-akar x² − 5x + 3 = 0, nilai p² + q² adalah …', '19', '25', '22', '31', '16', 'p + q = 5, pq = 3. p² + q² = (p + q)² − 2pq = 25 − 6 = 19.'],
        ['Himpunan penyelesaian |2x − 5| < 7 untuk x bilangan bulat memiliki … anggota.', '6', '7', '5', '8', '12', '−7 < 2x − 5 < 7 → −2 < 2x < 12 → −1 < x < 6. Bilangan bulat: 0, 1, 2, 3, 4, 5 → 6 anggota.'],
      ],
    },
    {
      sub: 'aritmetika', level: 3,
      items: [
        ['Nilai dari 1 − 2 + 3 − 4 + … + 99 − 100 adalah …', '−50', '50', '−100', '0', '−49', 'Kelompokkan berpasangan: (1 − 2) + (3 − 4) + … ada 50 pasang, masing-masing −1 → −50.'],
        ['Nilai dari 999² − 1 adalah …', '998.000', '999.000', '997.002', '998.001', '1.000.000', 'Selisih kuadrat: 999² − 1² = (999 − 1)(999 + 1) = 998 × 1.000 = 998.000.'],
        ['Bilangan dua angka terkecil yang jika dibagi 4, 5, dan 6 selalu bersisa 3 adalah …', '63', '33', '60', '23', '43', 'KPK(4, 5, 6) = 60, maka bilangannya berbentuk 60k + 3. Dua angka terkecil: 63.'],
        ['Hasil dari 2¹⁰ + 2¹⁰ + 2¹⁰ + 2¹⁰ adalah …', '2¹²', '2⁴⁰', '8¹⁰', '2¹⁴', '4⁴⁰', '4 × 2¹⁰ = 2² × 2¹⁰ = 2¹². Jebakan: menjumlahkan pangkat (2⁴⁰).'],
        ['Angka satuan dari 7²⁰²⁶ adalah …', '9', '7', '3', '1', '6', 'Angka satuan pangkat 7 berulang 7, 9, 3, 1 (siklus 4). 2026 ÷ 4 bersisa 2 → angka kedua dalam siklus = 9.'],
        ['Nilai dari (0,25 × 0,48) ÷ 0,06 adalah …', '2', '0,2', '20', '0,02', '1,2', '0,25 × 0,48 = 0,12. 0,12 ÷ 0,06 = 2. Trik: 0,25 × 0,48 = 0,48/4.'],
      ],
    },
    {
      sub: 'aritmetika', level: 4,
      items: [
        ['Banyak faktor positif dari 360 adalah …', '24', '18', '20', '36', '12', '360 = 2³ × 3² × 5. Banyak faktor = (3 + 1)(2 + 1)(1 + 1) = 24.'],
        ['Dua lampu berkedip setiap 12 detik dan 18 detik. Keduanya berkedip bersamaan pukul 20.00.00. Banyak kedipan bersamaan dari pukul 20.00.00 sampai 20.05.00 (termasuk pukul 20.00.00) adalah …', '9', '8', '10', '25', '16', 'KPK(12, 18) = 36 detik. Dalam 300 detik: 0, 36, 72, …, 288 → ⌊300/36⌋ + 1 = 8 + 1 = 9 kali.'],
        ['Nilai dari 1/(1×2) + 1/(2×3) + 1/(3×4) + … + 1/(99×100) adalah …', '99/100', '1', '1/100', '100/99', '49/50', 'Deret teleskopik: 1/(n(n + 1)) = 1/n − 1/(n + 1). Semua suku tengah saling menghapus → 1 − 1/100 = 99/100.'],
        ['Bentuk pecahan paling sederhana dari 0,272727… (angka 27 berulang terus) adalah …', '3/11', '27/100', '27/90', '9/33', '1/4', 'Dua angka berulang → 27/99 = 3/11. 9/33 sama nilainya tetapi belum paling sederhana.'],
      ],
    },
    {
      sub: 'peluang', level: 3,
      items: [
        ['Dua dadu dilempar bersamaan. Peluang jumlah mata dadu 7 atau 11 adalah …', '2/9', '1/6', '1/18', '5/18', '7/36', 'Jumlah 7: 6 pasang; jumlah 11: 2 pasang. (6 + 2)/36 = 8/36 = 2/9.'],
        ['Sebuah kotak berisi 5 bola merah dan 3 bola biru. Diambil 2 bola sekaligus secara acak. Peluang terambil 1 merah dan 1 biru adalah …', '15/28', '15/64', '3/8', '5/14', '1/2', 'Banyak cara: C(5,1) × C(3,1) = 15. Total C(8,2) = 28. Peluang 15/28. 15/64 = pengambilan dengan pengembalian dan urutan tertentu.'],
        ['Banyak cara memilih ketua, sekretaris, dan bendahara dari 8 calon (satu orang satu jabatan) adalah …', '336', '56', '512', '168', '24', 'Jabatan berbeda → permutasi: 8 × 7 × 6 = 336. 56 = C(8,3) bila jabatan tidak dibedakan.'],
        ['Sebuah koin dilempar 4 kali. Peluang muncul minimal satu sisi angka adalah …', '15/16', '1/16', '3/4', '1/2', '7/8', 'Komplemen: 1 − P(tidak ada angka) = 1 − (1/2)⁴ = 15/16.'],
      ],
    },
    {
      sub: 'peluang', level: 4,
      items: [
        ['Banyak susunan huruf berbeda yang dapat dibentuk dari kata SARJANA adalah …', '840', '5.040', '2.520', '420', '210', 'Ada 7 huruf dengan A muncul 3 kali: 7!/3! = 5.040/6 = 840.'],
        ['Peluang Andi lulus tes 0,7 dan peluang Budi lulus 0,6, saling bebas. Peluang tepat satu dari mereka lulus adalah …', '0,46', '0,42', '0,88', '0,54', '0,12', 'Andi lulus & Budi gagal: 0,7 × 0,4 = 0,28. Andi gagal & Budi lulus: 0,3 × 0,6 = 0,18. Total 0,46.'],
        ['Peserta wajib mengerjakan 7 dari 10 soal, dan soal nomor 1 serta 2 wajib dikerjakan. Banyak pilihan soal yang mungkin adalah …', '56', '120', '36', '70', '28', 'Dua soal sudah pasti, tinggal memilih 5 dari 8 soal sisanya: C(8,5) = 56.'],
        ['Dari 6 pria dan 4 wanita akan dibentuk panitia 4 orang dengan sedikitnya 2 wanita. Banyak cara membentuk panitia adalah …', '115', '90', '210', '95', '120', '2 wanita: C(4,2)·C(6,2) = 6·15 = 90. 3 wanita: C(4,3)·C(6,1) = 24. 4 wanita: 1. Total 115.'],
      ],
    },
    {
      sub: 'statistika', level: 3,
      items: [
        ['Rata-rata nilai 30 siswa kelas A adalah 72 dan rata-rata 20 siswa kelas B adalah 77. Rata-rata gabungan kedua kelas adalah …', '74', '74,5', '75', '73', '76', '(30 × 72 + 20 × 77)/50 = (2.160 + 1.540)/50 = 74. Jebakan: (72 + 77)/2 = 74,5.'],
        ['Data 3, 7, 5, x, 9, 4 memiliki rata-rata 6. Median data tersebut adalah …', '6', '7', '5', '6,5', '5,5', 'Jumlah = 36 → x = 8. Urutkan: 3, 4, 5, 7, 8, 9. Median = (5 + 7)/2 = 6.'],
        ['Rata-rata 5 bilangan adalah 12. Setelah satu bilangan dihapus, rata-ratanya menjadi 10. Bilangan yang dihapus adalah …', '20', '2', '12', '22', '10', 'Total awal 60, total baru 4 × 10 = 40. Bilangan yang dihapus = 20.'],
        ['Rata-rata gaji 20 karyawan Rp5 juta. Seorang karyawan bergaji Rp4 juta keluar dan seorang manajer bergaji Rp15 juta masuk. Rata-rata gaji sekarang adalah …', 'Rp5,55 juta', 'Rp5,5 juta', 'Rp5,29 juta', 'Rp5,45 juta', 'Rp6 juta', 'Total 100 − 4 + 15 = 111 juta untuk 20 orang → 5,55 juta.'],
      ],
    },
    {
      sub: 'statistika', level: 4,
      items: [
        ['Setiap nilai pada sebuah data dikalikan 2 lalu ditambah 5. Jika rata-rata dan simpangan baku data awal 40 dan 6, rata-rata dan simpangan baku data baru adalah …', '85 dan 12', '85 dan 17', '80 dan 12', '45 dan 6', '85 dan 6', 'Rata-rata ikut semua operasi: 2 × 40 + 5 = 85. Simpangan baku hanya terpengaruh perkalian: 2 × 6 = 12 (penambahan tidak mengubah sebaran).'],
        ['Rata-rata 10 data adalah 15. Jika dua data, yaitu a dan 2a, ditambahkan, rata-ratanya menjadi 16. Nilai a adalah …', '14', '7', '21', '16', '12', 'Total baru 12 × 16 = 192, total lama 150 → 3a = 42 → a = 14.'],
        ['Median dan jangkauan data 4, 9, 6, 12, x (x bilangan bulat) berturut-turut 6 dan 9. Nilai x adalah …', '3', '5', '13', '6', '2', 'Jangkauan 9: jika x terkecil, 12 − x = 9 → x = 3; urutan 3, 4, 6, 9, 12 → median 6 ✔. Jika x terbesar, x − 4 = 9 → x = 13, urutan 4, 6, 9, 12, 13 → median 9 ✘.'],
      ],
    },
    {
      sub: 'geometri', level: 3,
      items: [
        ['Panjang diagonal sebuah persegi 10 cm. Luas persegi tersebut adalah … cm².', '50', '100', '25', '40', '70,7', 'Luas persegi = d²/2 = 100/2 = 50 cm² (sisi = 5√2).'],
        ['Tabung berjari-jari 7 cm dan tinggi 10 cm penuh berisi air. Seluruh air dituang ke wadah balok beralas 22 cm × 10 cm. Tinggi air dalam balok adalah … cm (π = 22/7).', '7', '10', '14', '3,5', '5', 'Volume = 22/7 × 49 × 10 = 1.540 cm³. Tinggi = 1.540 ÷ 220 = 7 cm.'],
        ['Sudut-sudut sebuah segitiga berbanding 2 : 3 : 4. Selisih sudut terbesar dan terkecil adalah …', '40°', '20°', '60°', '80°', '30°', '180° ÷ 9 = 20°. Sudutnya 40°, 60°, 80°. Selisih 80° − 40° = 40°.'],
        ['Besar satu sudut dalam segi-12 beraturan adalah …', '150°', '144°', '135°', '160°', '120°', 'Jumlah sudut dalam (12 − 2) × 180° = 1.800° → 1.800° ÷ 12 = 150°. Cara cepat: 180° − 360°/12 = 150°.'],
      ],
    },
    {
      sub: 'geometri', level: 4,
      items: [
        ['Panjang rusuk sebuah kubus diperbesar 50%. Volumenya bertambah …', '237,5%', '150%', '50%', '337,5%', '125%', 'Faktor volume 1,5³ = 3,375 → bertambah 2,375 = 237,5%. 337,5% adalah volume baru terhadap lama, bukan pertambahannya.'],
        ['Sebuah lingkaran berada tepat di dalam persegi bersisi 14 cm (menyinggung keempat sisi). Luas daerah persegi di luar lingkaran adalah … cm² (π = 22/7).', '42', '154', '196', '56', '28', 'Luas persegi 196, luas lingkaran (r = 7) = 154. Selisih 42 cm².'],
        ['Sebuah tangga 5 m bersandar pada dinding dengan ujung bawah 3 m dari dinding. Jika ujung bawah digeser menjauh sehingga berjarak 4 m dari dinding, ujung atas tangga turun sejauh … m.', '1', '0,5', '2', '1,5', '0,8', 'Tinggi awal √(25 − 9) = 4 m. Tinggi baru √(25 − 16) = 3 m. Turun 1 m.'],
      ],
    },
    {
      sub: 'deret', level: 3,
      items: [
        ['1, 1, 2, 6, 24, 120, …', '720', '240', '600', '144', '360', 'Faktorial: setiap suku dikali 1, 2, 3, 4, 5, lalu 6 → 120 × 6 = 720.'],
        ['Suku ke-3 sebuah barisan aritmetika adalah 11 dan suku ke-8 adalah 31. Suku ke-20 adalah …', '79', '83', '75', '80', '71', 'b = (31 − 11)/5 = 4, a = 11 − 2 × 4 = 3. U₂₀ = 3 + 19 × 4 = 79.'],
        ['Jumlah 20 suku pertama barisan 5, 9, 13, … adalah …', '860', '840', '880', '81', '900', 'a = 5, b = 4. S₂₀ = 20/2 × (2 × 5 + 19 × 4) = 10 × 86 = 860. 81 adalah U₂₀.'],
      ],
    },
    {
      sub: 'deret', level: 4,
      items: [
        ['3, 4, 8, 17, 33, …', '58', '49', '50', '65', '57', 'Selisihnya bilangan kuadrat: 1, 4, 9, 16, lalu 25 → 33 + 25 = 58.'],
        ['2, 6, 12, 20, 30, 42, …', '56', '54', '52', '60', '49', 'Suku ke-n = n(n + 1): 1×2, 2×3, …, 6×7 = 42, lalu 7×8 = 56.'],
        ['Suku pertama barisan geometri 3 dan suku keempat 81. Jumlah lima suku pertamanya adalah …', '363', '243', '121', '364', '360', 'r³ = 81/3 = 27 → r = 3. S₅ = 3(3⁵ − 1)/(3 − 1) = 3 × 242/2 = 363.'],
      ],
    },
    {
      sub: 'perbandingan-kuantitatif', level: 3,
      items: [
        pq('Diketahui −1 < x < 0.<br>P = x²<br>Q = x³', 0, 'Untuk −1 < x < 0, x² positif dan x³ negatif, jadi P > Q. Contoh x = −0,5: P = 0,25, Q = −0,125.'),
        pq('x² = 16<br>P = x<br>Q = 4', 3, 'x bisa 4 atau −4. Jika x = 4, P = Q; jika x = −4, P < Q. Tidak dapat ditentukan.'),
        pq('P = 1/√2<br>Q = √2/2', 2, 'Rasionalkan: 1/√2 = √2/2. P = Q.'),
      ],
    },
    {
      sub: 'perbandingan-kuantitatif', level: 4,
      items: [
        pq('P = jumlah bilangan ganjil dari 1 sampai 99<br>Q = jumlah bilangan genap dari 2 sampai 98', 0, 'P = 50² = 2.500. Q = 2 × (1 + 2 + … + 49) = 49 × 50 = 2.450. P > Q.'),
        pq('P = 2³⁰<br>Q = 3²⁰', 1, 'Samakan pangkat: 2³⁰ = (2³)¹⁰ = 8¹⁰, sedangkan 3²⁰ = (3²)¹⁰ = 9¹⁰. Jadi P < Q.'),
        pq('Diketahui a > b > 0.<br>P = a/b<br>Q = (a + 1)/(b + 1)', 0, 'P − Q = (a − b)/(b(b + 1)) > 0 karena a > b. Menambah angka yang sama pada pembilang dan penyebut mendekatkan pecahan ke 1, jadi Q lebih kecil.'),
        pq('x dan y bilangan bulat positif dengan xy = 12.<br>P = x + y<br>Q = 7', 3, 'Pasangan (3, 4) memberi P = Q = 7, sedangkan (2, 6) memberi P = 8 > Q. Tidak dapat ditentukan.'),
      ],
    },
  ],
};
