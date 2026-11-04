/* Bank soal KUANTITATIF tertulis (melengkapi generator otomatis).
 * Format ringkas: [stem, JAWABAN BENAR, pengecoh x4, pembahasan]; format penuh untuk urutan opsi tetap.
 */
const PQ = ['P > Q', 'P < Q', 'P = Q', 'Hubungan P dan Q tidak dapat ditentukan'];
const pq = (q, a, e) => ({ q: q + '<br>Manakah hubungan yang benar antara P dan Q?', o: PQ, a, e, f: true });

module.exports = {
  cat: 'kuantitatif',
  sets: [
    {
      sub: 'soal-cerita', level: 2,
      items: [
        ['Harga 3 buku dan 2 pensil Rp27.000. Harga 2 buku dan 3 pensil Rp23.000. Harga 1 buku dan 1 pensil adalah …', 'Rp10.000', 'Rp9.000', 'Rp11.000', 'Rp12.000', 'Rp8.500', 'Jumlahkan kedua persamaan: 5 buku + 5 pensil = Rp50.000, jadi 1 buku + 1 pensil = Rp10.000. Tidak perlu mencari harga masing-masing.'],
        ['Sebuah pekerjaan dapat diselesaikan 12 orang dalam 15 hari. Agar selesai dalam 10 hari, dibutuhkan tambahan pekerja sebanyak … orang.', '6', '18', '8', '4', '3', 'Perbandingan berbalik nilai: 12 × 15 = 180 orang-hari. 180 ÷ 10 = 18 orang, jadi tambahan 18 − 12 = 6 orang. Jebakan: menjawab 18 (total, bukan tambahan).'],
        ['Sebuah mobil menghabiskan 8 liter bensin untuk menempuh 96 km. Untuk menempuh 156 km diperlukan bensin … liter.', '13', '12', '14', '12,5', '15', '96 ÷ 8 = 12 km per liter. 156 ÷ 12 = 13 liter.'],
        ['Usia ayah sekarang 3 kali usia anaknya. Lima tahun lalu, usia ayah 4 kali usia anaknya. Usia anak sekarang adalah … tahun.', '15', '10', '12', '20', '5', 'Misal anak = x, ayah = 3x. 3x − 5 = 4(x − 5) → 3x − 5 = 4x − 20 → x = 15. Cek: ayah 45; lima tahun lalu 40 dan 10 (4 kali).'],
        ['Sebuah kolam dapat diisi penuh oleh pipa A dalam 6 jam, sedangkan pipa B dapat mengurasnya dalam 9 jam. Jika kedua pipa dibuka bersamaan dari keadaan kosong, kolam penuh dalam … jam.', '18', '15', '3', '7,5', '12', 'Laju bersih = 1/6 − 1/9 = 3/18 − 2/18 = 1/18 kolam per jam → 18 jam.'],
        ['Perbandingan kelereng Adi dan Bima 5 : 3. Jika Adi memberi Bima 10 kelereng, perbandingannya menjadi 1 : 1. Jumlah kelereng mereka adalah …', '80', '60', '100', '40', '120', '5k − 10 = 3k + 10 → k = 10. Jumlah = 8k = 80 (jumlah tidak berubah karena hanya dipindah).'],
        ['Pedagang membeli 50 kg jeruk seharga Rp600.000. Sebanyak 5 kg busuk dan sisanya dijual Rp15.000/kg. Persentase keuntungannya adalah …', '12,5%', '25%', '10%', '15%', '11,1%', 'Penjualan 45 × 15.000 = Rp675.000. Untung Rp75.000. Persentase = 75.000/600.000 = 12,5% (selalu terhadap modal).'],
        ['Rata-rata nilai 30 siswa adalah 70. Jika nilai dua siswa, yaitu 40 dan 44, tidak diikutsertakan, rata-ratanya menjadi …', '72', '71', '73', '70', '74', 'Total 30 × 70 = 2.100. Dikurangi 84 → 2.016. Dibagi 28 = 72.'],
        ['Jam dinding menunjukkan pukul 03.40. Besar sudut terkecil antara jarum jam dan jarum menit adalah …', '130°', '120°', '140°', '110°', '150°', 'Jarum menit: 40 × 6° = 240°. Jarum jam: 3 × 30° + 40 × 0,5° = 110°. Selisih 130°. Rumus cepat: |30H − 5,5M| = |90 − 220| = 130°.'],
        ['Gaji seorang karyawan Rp6.000.000 naik 15%, lalu dipotong pajak 10% dari gaji baru. Gaji bersihnya adalah …', 'Rp6.210.000', 'Rp6.300.000', 'Rp6.900.000', 'Rp6.150.000', 'Rp5.400.000', '6.000.000 × 1,15 = 6.900.000; × 0,9 = 6.210.000. Jebakan: 15% − 10% = 5% → Rp6.300.000 (salah).'],
        ['Kecepatan perahu di air tenang 12 km/jam dan kecepatan arus sungai 3 km/jam. Waktu untuk menempuh 45 km melawan arus adalah …', '5 jam', '3 jam', '3 jam 45 menit', '4 jam', '6 jam', 'Melawan arus: 12 − 3 = 9 km/jam. 45 ÷ 9 = 5 jam. Searah arus 15 km/jam → 3 jam (pengecoh).'],
        ['Sebuah tangki berisi 1/4 bagian. Setelah ditambah 30 liter, tangki terisi 5/8 bagian. Kapasitas tangki adalah … liter.', '80', '60', '48', '120', '100', '5/8 − 1/4 = 3/8 bagian = 30 liter → 1 bagian penuh = 80 liter.'],
        ['Di sebuah kelas, 60% siswa menyukai matematika, 50% menyukai fisika, dan 20% menyukai keduanya. Persentase siswa yang tidak menyukai keduanya adalah …', '10%', '20%', '0%', '30%', '15%', 'Gabungan = 60 + 50 − 20 = 90%. Sisanya 10%.'],
        ['Dari 40 pendaftar beasiswa, 25 memiliki sertifikat TOEFL, 18 memiliki sertifikat TPA, dan 7 belum memiliki keduanya. Banyak pendaftar yang memiliki kedua sertifikat adalah …', '10', '7', '3', '15', '8', 'Yang memiliki minimal satu = 40 − 7 = 33 = 25 + 18 − x → x = 10.'],
        ['Harga sebuah laptop setelah diskon 25% adalah Rp7.500.000. Harga sebelum diskon adalah …', 'Rp10.000.000', 'Rp9.375.000', 'Rp9.500.000', 'Rp9.000.000', 'Rp10.500.000', '75% × harga awal = 7.500.000 → harga awal = 7.500.000 ÷ 0,75 = 10.000.000. Jebakan: 7.500.000 + 25% × 7.500.000.'],
        ['Rina mengetik 50 kata per menit dan Sinta 30 kata per menit. Jika mereka bersama-sama mengetik naskah 3.200 kata, waktu yang diperlukan adalah …', '40 menit', '32 menit', '64 menit', '50 menit', '45 menit', 'Kecepatan gabungan 80 kata/menit. 3.200 ÷ 80 = 40 menit.'],
        ['Toko menawarkan promo 3 kaos seharga Rp200.000. Harga normal satu kaos Rp80.000. Persentase penghematan jika membeli dengan promo adalah …', '16⅔%', '20%', '25%', '13⅓%', '33⅓%', 'Harga normal 3 kaos Rp240.000. Hemat Rp40.000 dari Rp240.000 = 1/6 ≈ 16⅔%.'],
        ['Dua bilangan bulat positif berselisih 7 dan hasil kalinya 60. Jumlah kedua bilangan itu adalah …', '17', '13', '19', '23', '15', 'Pasangan faktor 60 yang berselisih 7: 5 dan 12. Jumlah 17.'],
        ['Sebuah kereta sepanjang 200 m melaju 72 km/jam melewati terowongan sepanjang 400 m. Waktu dari ujung depan masuk hingga ujung belakang keluar terowongan adalah …', '30 detik', '20 detik', '10 detik', '33 detik', '25 detik', '72 km/jam = 20 m/detik. Jarak tempuh = panjang terowongan + panjang kereta = 600 m. 600 ÷ 20 = 30 detik.'],
        ['Ani menabung Rp50.000 pada minggu pertama dan setiap minggu berikutnya menabung Rp10.000 lebih banyak daripada minggu sebelumnya. Total tabungannya setelah 10 minggu adalah …', 'Rp950.000', 'Rp1.400.000', 'Rp500.000', 'Rp900.000', 'Rp1.000.000', 'Deret aritmetika: a = 50.000, b = 10.000, n = 10. S = n/2 × (2a + (n−1)b) = 5 × (100.000 + 90.000) = 950.000.'],
      ],
    },
    {
      sub: 'geometri', level: 2,
      items: [
        ['Seseorang berjalan 8 km ke utara, kemudian 6 km ke timur. Jarak terpendek dari titik awal adalah … km.', '10', '14', '12', '7', '9', 'Pythagoras: √(8² + 6²) = √100 = 10 (tripel 6-8-10).'],
        ['Keliling sebuah persegi panjang 48 cm dan panjangnya dua kali lebarnya. Luasnya adalah … cm².', '128', '144', '96', '112', '64', '2(2l + l) = 48 → l = 8, p = 16. Luas = 128.'],
        ['Luas sebuah lingkaran 154 cm². Kelilingnya adalah … cm (π = 22/7).', '44', '22', '88', '49', '154', 'πr² = 154 → r² = 49 → r = 7. Keliling = 2πr = 44.'],
        ['Volume sebuah kubus 343 cm³. Luas permukaannya adalah … cm².', '294', '196', '343', '245', '147', 'Sisi = ∛343 = 7. Luas permukaan = 6 × 49 = 294.'],
        ['Sebuah tabung berjari-jari 7 cm dan tinggi 10 cm. Volumenya adalah … cm³ (π = 22/7).', '1.540', '440', '770', '3.080', '1.078', 'V = πr²t = 22/7 × 49 × 10 = 1.540.'],
        ['Jika panjang sisi sebuah persegi diperbesar 20%, luasnya bertambah …', '44%', '40%', '20%', '24%', '36%', '1,2² = 1,44 → bertambah 44%.'],
        ['Segitiga beralas 12 cm dan bertinggi 9 cm luasnya sama dengan luas persegi panjang yang lebarnya 6 cm. Panjang persegi panjang itu adalah … cm.', '9', '18', '12', '6', '4,5', 'Luas segitiga = ½ × 12 × 9 = 54. Panjang = 54 ÷ 6 = 9.'],
        ['Sudut-sudut sebuah segitiga berbanding 2 : 3 : 4. Besar sudut terbesarnya adalah …', '80°', '60°', '90°', '40°', '100°', 'Jumlah sudut 180°, 9 bagian → 1 bagian = 20°. Terbesar 4 × 20° = 80°.'],
      ],
    },
    {
      sub: 'aljabar', level: 2,
      items: [
        ['Jika 2<sup>x+1</sup> = 32, maka nilai x adalah …', '4', '5', '3', '16', '6', '32 = 2⁵ → x + 1 = 5 → x = 4.'],
        ['Jika x/3 + x/4 = 14, maka nilai x adalah …', '24', '12', '28', '42', '18', 'Samakan penyebut: 7x/12 = 14 → x = 24.'],
        ['Jika a = 3 dan b = −2, nilai a² − 2ab + b² adalah …', '25', '1', '13', '5', '−1', 'a² − 2ab + b² = (a − b)² = (3 − (−2))² = 25.'],
        ['Jika 3x + 2y = 18 dan x − y = 1, nilai x + y adalah …', '7', '5', '6', '8', '9', 'x = y + 1 → 3y + 3 + 2y = 18 → y = 3, x = 4. x + y = 7.'],
        ['Jika x + 1/x = 5, nilai x² + 1/x² adalah …', '23', '25', '27', '24', '21', '(x + 1/x)² = x² + 2 + 1/x² → 25 = x² + 1/x² + 2 → 23.'],
        ['Jika f(x) = 2x² − 3x + 1, nilai f(−2) adalah …', '15', '3', '−1', '11', '9', '2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15.'],
      ],
    },
    {
      sub: 'aritmetika', level: 1,
      items: [
        ['Bilangan yang 20% lebih besar dari 150 adalah …', '180', '170', '165', '120', '300', '150 × 1,2 = 180.'],
        ['(1/2 + 1/3) ÷ (1/2 − 1/3) = …', '5', '1/5', '6', '1', '5/36', '(5/6) ÷ (1/6) = 5.'],
        ['√0,0016 = …', '0,04', '0,4', '0,004', '0,016', '0,0004', '0,0016 = 16/10.000 → √ = 4/100 = 0,04.'],
        ['Jika p = 0,25 dan q = 0,2, maka p/q + q/p = …', '2,05', '1,05', '2,5', '0,45', '1,25', 'p/q = 1,25 dan q/p = 0,8. Jumlah 2,05.'],
        ['2,5% dari 4.000 ditambah 0,4 × 250 adalah …', '200', '110', '1.100', '20', '2.000', '2,5% × 4.000 = 100; 0,4 × 250 = 100. Total 200.'],
        ['Nilai dari (0,5)² × 16 ÷ (1/4) adalah …', '16', '1', '4', '64', '8', '0,25 × 16 = 4; 4 ÷ 1/4 = 16.'],
        ['1/8 dari 2/5 dari 400 adalah …', '20', '40', '10', '80', '25', '2/5 × 400 = 160; 1/8 × 160 = 20.'],
      ],
    },
    {
      sub: 'statistika', level: 2,
      items: [
        ['Penjualan sebuah toko (unit) selama lima bulan: Januari 120, Februari 150, Maret 90, April 180, Mei 160.<br>Kenaikan persentase terbesar dari satu bulan ke bulan berikutnya terjadi pada …', 'Maret ke April', 'Januari ke Februari', 'April ke Mei', 'Februari ke Maret', 'Januari ke Mei', 'Jan→Feb +25%; Feb→Mar −40%; Mar→Apr +100%; Apr→Mei −11%. Kenaikan terbesar Maret ke April.'],
        ['Penjualan sebuah toko (unit) selama lima bulan: Januari 120, Februari 150, Maret 90, April 180, Mei 160.<br>Rata-rata penjualan per bulan adalah … unit.', '140', '150', '135', '145', '160', 'Jumlah 700 ÷ 5 = 140.'],
        ['Median dari data 7, 3, 9, 5, 8, 6, 4, 10 adalah …', '6,5', '6', '7', '6,75', '5,5', 'Urutkan: 3, 4, 5, 6, 7, 8, 9, 10. Median = (6 + 7)/2 = 6,5.'],
        ['Modus dari data 4, 6, 6, 7, 8, 8, 8, 9, 10 adalah …', '8', '6', '7,33', '7', '9', 'Nilai yang paling sering muncul: 8 (tiga kali).'],
        ['Jangkauan dari data 12, 18, 7, 25, 14, 9 adalah …', '18', '14', '13,5', '16', '25', 'Jangkauan = terbesar − terkecil = 25 − 7 = 18.'],
        ['Anggaran sebuah lembaga: pendidikan 35%, kesehatan 25%, infrastruktur 30%, lain-lain sisanya. Jika anggaran lain-lain Rp40 miliar, anggaran infrastruktur adalah …', 'Rp120 miliar', 'Rp100 miliar', 'Rp140 miliar', 'Rp30 miliar', 'Rp400 miliar', 'Lain-lain = 100 − 90 = 10% = Rp40 miliar → total Rp400 miliar. Infrastruktur 30% = Rp120 miliar.'],
      ],
    },
    {
      sub: 'peluang', level: 2,
      items: [
        ['Satu kartu diambil acak dari 52 kartu bridge. Peluang terambil kartu As atau kartu hati adalah …', '4/13', '17/52', '1/4', '1/13', '3/13', 'P(As) + P(hati) − P(As hati) = 4/52 + 13/52 − 1/52 = 16/52 = 4/13.'],
        ['Banyak susunan huruf berbeda yang dapat dibentuk dari kata "MAMA" adalah …', '6', '24', '12', '4', '8', 'Permutasi dengan unsur sama: 4!/(2! × 2!) = 6.'],
        ['Sebuah dadu dilempar 60 kali. Frekuensi harapan munculnya mata dadu bilangan prima adalah …', '30', '20', '10', '40', '36', 'Mata prima: 2, 3, 5 → peluang 3/6. Harapan = 1/2 × 60 = 30.'],
        ['Dari 5 pria dan 4 wanita akan dipilih 3 orang yang terdiri atas 2 pria dan 1 wanita. Banyak cara memilih adalah …', '40', '84', '60', '20', '30', 'C(5,2) × C(4,1) = 10 × 4 = 40.'],
        ['PIN terdiri atas 4 angka (0–9) dan angka boleh berulang. Banyak PIN yang mungkin adalah …', '10.000', '5.040', '9.999', '40', '1.000', 'Setiap posisi 10 pilihan: 10⁴ = 10.000. Jika tidak boleh berulang: 10 × 9 × 8 × 7 = 5.040.'],
      ],
    },
    {
      sub: 'deret', level: 2,
      items: [
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">2, 3, 5, 7, 11, 13, …</span>', '17', '15', '19', '16', '14', 'Deret bilangan prima. Setelah 13 adalah 17.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">1, 4, 27, 256, …</span>', '3.125', '625', '1.024', '3.025', '2.500', 'Pola nⁿ: 1¹, 2², 3³, 4⁴, berikutnya 5⁵ = 3.125.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">100, 95, 85, 70, 50, …</span>', '25', '30', '20', '35', '15', 'Selisih −5, −10, −15, −20, berikutnya −25 → 25.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">3, 6, 4, 8, 6, 12, …</span>', '10', '14', '24', '8', '9', 'Pola ×2 lalu −2 bergantian. 12 − 2 = 10.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">1, 1, 2, 6, 24, …</span>', '120', '48', '96', '72', '144', 'Dikali 1, 2, 3, 4, berikutnya × 5 → 120 (faktorial).'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">4, 7, 13, 25, 49, …</span>', '97', '98', '73', '99', '96', 'Pola ×2 − 1: 49 × 2 − 1 = 97.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">2, 6, 12, 20, 30, …</span>', '42', '40', '36', '44', '48', 'Pola n(n + 1): 1·2, 2·3, 3·4, 4·5, 5·6, berikutnya 6·7 = 42. Atau selisih 4, 6, 8, 10, 12.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">81, 27, 9, 3, …</span>', '1', '0', '1/3', '2', '3', 'Dibagi 3: 3 ÷ 3 = 1.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">1/2, 2/3, 3/4, 4/5, …</span>', '5/6', '6/7', '5/4', '4/6', '6/5', 'Pembilang dan penyebut masing-masing bertambah 1.'],
        ['Bilangan selanjutnya dari deret berikut adalah …<span class="seq">7, 10, 8, 11, 9, 12, …</span>', '10', '13', '11', '14', '9', 'Pola +3, −2 bergantian. 12 − 2 = 10.'],
      ],
    },
    {
      sub: 'perbandingan-kuantitatif', level: 2,
      items: [
        pq('P = 0,2 × 0,3<br>Q = 0,06', 2, '0,2 × 0,3 = 0,06. P = Q.'),
        pq('Diketahui x² = 16.<br>P = x<br>Q = 4', 3, 'x bisa 4 atau −4. Jika x = −4, P < Q; jika x = 4, P = Q. Tidak dapat ditentukan.'),
        pq('P = rata-rata dari 2, 4, 6, 8<br>Q = median dari 1, 5, 6, 9', 1, 'P = 20/4 = 5. Q = (5 + 6)/2 = 5,5. P < Q.'),
        pq('P = 3⁴<br>Q = 4³', 0, 'P = 81, Q = 64. P > Q.'),
        pq('Harga sebuah baju naik 10%, kemudian turun 10%.<br>P = harga akhir<br>Q = harga awal', 1, '1,1 × 0,9 = 0,99 → harga akhir 1% lebih rendah. P < Q.'),
        pq('P = 25% dari 80<br>Q = 80% dari 25', 2, 'a% dari b = b% dari a. Keduanya 20.'),
        pq('Diketahui x > 0 dan y > 0, dengan x > y.<br>P = 1/x<br>Q = 1/y', 1, 'Untuk bilangan positif, yang lebih besar memiliki kebalikan lebih kecil. P < Q.'),
      ],
    },
  ],
};
