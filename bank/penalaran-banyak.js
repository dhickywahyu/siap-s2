/* Bank soal PENALARAN tambahan.
 * 1) Silogisme kategoris berkonteks: bentuk sah (Barbara, Celarent, Darii, Ferio) dan tidak sah
 *    (term tengah tidak tersebar, dua premis negatif/partikular). Kunci diturunkan dari bentuk logikanya.
 * 2) Silogisme hipotetis & disjungtif: modus ponens, modus tollens, rantai, serta dua kekeliruan klasik
 *    (membenarkan akibat, mengingkari sebab).
 * 3) Ingkaran & ekuivalensi: konjungsi, disjungsi, implikasi, biimplikasi, dan kalimat berkuantor.
 * 4) Penalaran logis wacana (ditulis manual): memperkuat, melemahkan, asumsi, kekeliruan, simpulan.
 */
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const TD = 'Tidak dapat ditarik kesimpulan yang pasti.';
const uniq = (arr) => [...new Set(arr)];
const item = (q, ans, ds, e) => { const d = uniq(ds).filter((x) => x !== ans).slice(0, 4); return [q, ans, ...d, e]; };

/* ---------- 1) silogisme kategoris ---------- */
// [S (kelompok kecil), M (kelompok tengah), P (predikat yang bisa diberi "tidak")]
const KAT = [
  ['karyawan bagian keuangan', 'pegawai tetap', 'mendapat asuransi kesehatan'],
  ['mahasiswa magister manajemen', 'peserta kelas malam', 'bekerja penuh waktu'],
  ['penerima beasiswa itu', 'mahasiswa tahun pertama', 'wajib melapor tiap semester'],
  ['dosen tamu', 'pembicara seminar', 'menerima honorarium'],
  ['petani di desa itu', 'anggota koperasi', 'memakai pupuk organik'],
  ['peneliti senior', 'anggota tim ahli', 'menandatangani laporan akhir'],
  ['startup binaan', 'peserta inkubator', 'memiliki mentor bisnis'],
  ['kendaraan dinas', 'kendaraan bermotor di kota itu', 'wajib uji emisi'],
  ['atlet nasional', 'peserta pelatnas', 'menjalani tes doping'],
  ['siswa kelas akselerasi', 'peserta olimpiade', 'mengikuti karantina'],
  ['apoteker', 'tenaga kesehatan', 'memiliki surat tanda registrasi'],
  ['manajer cabang', 'pejabat struktural', 'menyerahkan laporan harta kekayaan'],
  ['relawan bencana', 'anggota organisasi itu', 'mengikuti pelatihan P3K'],
  ['pengemudi ojek daring', 'mitra aplikasi itu', 'memiliki asuransi kecelakaan'],
];
const katForms = (S, M, P) => {
  const all = `Semua ${S} ${P}.`, none = `Tidak ada ${S} yang ${P}.`, some = `Sebagian ${S} ${P}.`, someNot = `Sebagian ${S} tidak ${P}.`;
  const conv = `Semua yang ${P} adalah ${S}.`, conv2 = `Sebagian yang ${P} bukan ${S}.`;
  const pre = (a, b) => `${a}<br>${b}<br>Kesimpulan yang tepat adalah …`;
  return {
    barbara: item(pre(`Semua ${M} ${P}.`, `Semua ${S} adalah ${M}.`), all, [conv, none, someNot, conv2], `Pola sah (Barbara): semua M bersifat P dan semua S termasuk M, maka semua S bersifat P. "${conv}" adalah konversi yang keliru.`),
    celarent: item(pre(`Tidak ada ${M} yang ${P}.`, `Semua ${S} adalah ${M}.`), none, [all, some, `Sebagian yang ${P} adalah ${S}.`, TD], `Pola sah (Celarent): tidak ada M yang P, dan S seluruhnya bagian dari M, maka tidak ada S yang P.`),
    darii: item(pre(`Semua ${M} ${P}.`, `Sebagian ${S} adalah ${M}.`), some, [all, none, someNot, conv], `Pola sah (Darii): sebagian S termasuk M, dan semua M bersifat P, maka sebagian S bersifat P. "Semua S" terlalu kuat; "sebagian S tidak P" mungkin benar tetapi tidak pasti.`),
    ferio: item(pre(`Tidak ada ${M} yang ${P}.`, `Sebagian ${S} adalah ${M}.`), someNot, [none, some, all, TD], `Pola sah (Ferio): S yang termasuk M pasti tidak P, jadi sebagian S tidak P. S lainnya tidak diketahui, sehingga "tidak ada S yang P" terlalu kuat.`),
    tengah: item(pre(`Semua ${S} adalah ${M}.`, `Sebagian ${M} ${P}.`), TD, [some, all, none, someNot], `Tidak sah: term tengah (${M}) tidak tersebar. Bagian M yang ${P} belum tentu mencakup ${S}.`),
    negatif: item(pre(`Tidak ada ${M} yang ${P}.`, `Sebagian ${S} bukan ${M}.`), TD, [some, someNot, none, all], `Tidak sah: kedua premis negatif. ${cap(S)} yang bukan ${M} tidak diketahui sifatnya.`),
  };
};

/* ---------- 2) silogisme hipotetis & disjungtif ---------- */
// [p, ~p, q, ~q, r, ~r]
const HIP = [
  ['harga BBM naik', 'harga BBM tidak naik', 'ongkos angkut naik', 'ongkos angkut tidak naik', 'harga sayur naik', 'harga sayur tidak naik'],
  ['Rina lulus seleksi berkas', 'Rina tidak lulus seleksi berkas', 'Rina mengikuti tes skolastik', 'Rina tidak mengikuti tes skolastik', 'Rina diundang wawancara', 'Rina tidak diundang wawancara'],
  ['curah hujan tinggi', 'curah hujan tidak tinggi', 'sungai meluap', 'sungai tidak meluap', 'sawah terendam', 'sawah tidak terendam'],
  ['suku bunga naik', 'suku bunga tidak naik', 'kredit rumah melambat', 'kredit rumah tidak melambat', 'penjualan semen turun', 'penjualan semen tidak turun'],
  ['server kampus gangguan', 'server kampus tidak gangguan', 'ujian daring ditunda', 'ujian daring tidak ditunda', 'jadwal wisuda mundur', 'jadwal wisuda tidak mundur'],
  ['proposal disetujui', 'proposal tidak disetujui', 'dana penelitian cair', 'dana penelitian tidak cair', 'survei lapangan dimulai', 'survei lapangan tidak dimulai'],
  ['permintaan ekspor naik', 'permintaan ekspor tidak naik', 'pabrik menambah giliran kerja', 'pabrik tidak menambah giliran kerja', 'penyerapan tenaga kerja meningkat', 'penyerapan tenaga kerja tidak meningkat'],
  ['Budi rajin berlatih', 'Budi tidak rajin berlatih', 'skor TOEFL Budi naik', 'skor TOEFL Budi tidak naik', 'Budi memenuhi syarat beasiswa', 'Budi tidak memenuhi syarat beasiswa'],
  ['rupiah melemah', 'rupiah tidak melemah', 'harga barang impor naik', 'harga barang impor tidak naik', 'inflasi meningkat', 'inflasi tidak meningkat'],
  ['lampu lalu lintas mati', 'lampu lalu lintas tidak mati', 'persimpangan macet', 'persimpangan tidak macet', 'bus kota terlambat', 'bus kota tidak terlambat'],
  ['pemerintah memberi subsidi pupuk', 'pemerintah tidak memberi subsidi pupuk', 'biaya tanam turun', 'biaya tanam tidak turun', 'keuntungan petani meningkat', 'keuntungan petani tidak meningkat'],
];
const hipForms = ([p, np, q, nq, r, nr]) => {
  const K = (s) => cap(s) + '.';
  const pre = (...xs) => `${xs.map((x) => cap(x)).join('<br>')}<br>Kesimpulan yang tepat adalah …`;
  return {
    mp: item(pre(`jika ${p}, maka ${q}.`, `${p}.`), K(q), [K(nq), K(np), TD, `Jika ${q}, maka ${p}.`], 'Modus ponens: p → q, p, maka q.'),
    mt: item(pre(`jika ${p}, maka ${q}.`, `${nq}.`), K(np), [K(p), K(q), TD, `${cap(np)} dan ${q}.`], 'Modus tollens: p → q, ~q, maka ~p.'),
    rantai: item(`${cap(`jika ${p}, maka ${q}.`)}<br>${cap(`jika ${q}, maka ${r}.`)}<br>Kesimpulan yang tepat adalah …`, `Jika ${p}, maka ${r}.`, [`Jika ${r}, maka ${p}.`, `Jika ${np}, maka ${nr}.`, `Jika ${p}, maka ${nr}.`, TD], 'Silogisme hipotetis: p → q, q → r, maka p → r. Konvers (r → p) dan invers (~p → ~r) tidak sah.'),
    rantaiMt: item(pre(`jika ${p}, maka ${q}.`, `jika ${q}, maka ${r}.`, `${nr}.`), K(np), [K(p), K(q), K(r), TD], 'Rantai p → q → r dengan ~r: modus tollens dua kali → ~q, lalu ~p.'),
    akibat: item(pre(`jika ${p}, maka ${q}.`, `${q}.`), TD, [K(p), K(np), K(nq), `Jika ${q}, maka ${p}.`], `Kekeliruan membenarkan akibat: q terjadi bisa karena sebab lain, jadi "${p}" belum pasti.`),
    sebab: item(pre(`jika ${p}, maka ${q}.`, `${np}.`), TD, [K(nq), K(q), K(p), `Jika ${np}, maka ${nq}.`], `Kekeliruan mengingkari sebab: tanpa p, q masih mungkin terjadi karena hal lain.`),
    disjungtif: item(pre(`${p} atau ${q}.`, `${np}.`), K(q), [K(nq), K(p), TD, `${cap(np)} dan ${nq}.`], 'Silogisme disjungtif: p ∨ q, ~p, maka q.'),
  };
};

/* ---------- 3) ingkaran & ekuivalensi ---------- */
const negForms = ([p, np, q, nq]) => {
  const Q = (s) => `Ingkaran dari pernyataan "${s}" adalah …`;
  const E = (s) => `Pernyataan yang setara (ekuivalen) dengan "${s}" adalah …`;
  return {
    and: item(Q(`${cap(p)} dan ${q}`), `${cap(np)} atau ${nq}.`, [`${cap(np)} dan ${nq}.`, `${cap(p)} dan ${nq}.`, `${cap(np)} atau ${q}.`, `Jika ${np}, maka ${nq}.`], '~(p ∧ q) ≡ ~p ∨ ~q (De Morgan): "dan" menjadi "atau".'),
    or: item(Q(`${cap(p)} atau ${q}`), `${cap(np)} dan ${nq}.`, [`${cap(np)} atau ${nq}.`, `${cap(p)} dan ${q}.`, `${cap(np)} dan ${q}.`, `Jika ${np}, maka ${q}.`], '~(p ∨ q) ≡ ~p ∧ ~q (De Morgan): "atau" menjadi "dan".'),
    imp: item(Q(`Jika ${p}, maka ${q}`), `${cap(p)} dan ${nq}.`, [`Jika ${np}, maka ${nq}.`, `Jika ${q}, maka ${p}.`, `${cap(np)} dan ${q}.`, `${cap(np)} atau ${q}.`], '~(p → q) ≡ p ∧ ~q. Opsi "~p atau q" justru setara dengan pernyataan awal.'),
    kontra: item(E(`Jika ${p}, maka ${q}`), `Jika ${nq}, maka ${np}.`, [`Jika ${q}, maka ${p}.`, `Jika ${np}, maka ${nq}.`, `${cap(p)} dan ${nq}.`, `${cap(p)} atau ${nq}.`], 'Kontraposisi: p → q ≡ ~q → ~p. Konvers dan invers tidak setara.'),
    disj: item(`Pernyataan berbentuk "… atau …" yang setara dengan "Jika ${p}, maka ${q}" adalah …`, `${cap(np)} atau ${q}.`, [`${cap(p)} atau ${nq}.`, `${cap(np)} dan ${q}.`, `Jika ${q}, maka ${p}.`, `${cap(p)} dan ${q}.`], 'p → q ≡ ~p ∨ q.'),
    bi: item(Q(`${cap(p)} jika dan hanya jika ${q}`), `${cap(p)} jika dan hanya jika ${nq}.`, [`${cap(np)} jika dan hanya jika ${nq}.`, `${cap(p)} dan ${nq}.`, `Jika ${p}, maka ${nq}.`, `${cap(np)} atau ${nq}.`], '~(p ↔ q) ≡ p ↔ ~q. Opsi "~p ↔ ~q" justru setara dengan pernyataan awal.'),
  };
};
const kuantor = (S, P) => ({
  semua: item(`Ingkaran dari pernyataan "Semua ${S} ${P}" adalah …`, `Ada ${S} yang tidak ${P}.`, [`Semua ${S} tidak ${P}.`, `Tidak ada ${S} yang ${P}.`, `Ada ${S} yang ${P}.`, `Semua yang ${P} adalah ${S}.`], 'Ingkaran "semua" adalah "ada/beberapa … tidak". "Semua … tidak" terlalu kuat.'),
  ada: item(`Ingkaran dari pernyataan "Ada ${S} yang ${P}" adalah …`, `Semua ${S} tidak ${P}.`, [`Ada ${S} yang tidak ${P}.`, `Semua ${S} ${P}.`, `Beberapa yang ${P} bukan ${S}.`, `Tidak semua ${S} ${P}.`], 'Ingkaran "ada" adalah "semua … tidak" (tidak ada satu pun).'),
});

/* ---------- 4) penalaran logis wacana (manual) ---------- */
const WACANA3 = [
  ['Sebuah kafe di Bandung menaikkan harga kopi 15%, tetapi jumlah pembelinya justru bertambah. Pemilik menyimpulkan bahwa pelanggannya tidak peduli harga.<br>Pernyataan yang paling <b>melemahkan</b> kesimpulan itu adalah …', 'Pada periode yang sama, kafe itu baru dipromosikan oleh seorang pemengaruh terkenal.', 'Harga kopi di kafe lain juga naik.', 'Kafe itu menyediakan Wi-Fi gratis sejak dibuka.', 'Sebagian pelanggan membeli kopi untuk dibawa pulang.', 'Pemilik kafe pernah bekerja di hotel.', 'Ada penyebab lain (promosi) yang menaikkan pembeli, sehingga kenaikan pembeli tidak membuktikan pelanggan tidak peduli harga.'],
  ['Sekolah yang menerapkan sarapan gratis mencatat kenaikan kehadiran siswa 8%. Dinas pendidikan menyimpulkan program sarapan meningkatkan kehadiran.<br>Pernyataan yang paling <b>memperkuat</b> kesimpulan itu adalah …', 'Di sekolah serupa tanpa program sarapan, kehadiran tidak berubah pada periode yang sama.', 'Menu sarapan disusun oleh ahli gizi.', 'Sebagian siswa lebih suka sarapan di rumah.', 'Program itu didanai pemerintah daerah.', 'Kehadiran guru juga dicatat setiap hari.', 'Kelompok pembanding menyingkirkan penjelasan alternatif.'],
  ['Kota X menurunkan batas kecepatan menjadi 40 km/jam. Setahun kemudian, kecelakaan fatal turun 30%. Wali kota menyimpulkan bahwa kebijakan itu menyelamatkan nyawa.<br>Asumsi yang diperlukan agar kesimpulan itu sahih adalah …', 'Tidak ada perubahan lain yang berarti di kota itu yang dapat menurunkan kecelakaan pada periode yang sama.', 'Semua pengemudi mematuhi batas kecepatan.', 'Kecelakaan nonfatal juga menurun.', 'Kota lain akan meniru kebijakan itu.', 'Batas kecepatan 40 km/jam adalah yang terendah di Indonesia.', 'Kesimpulan sebab-akibat hanya bertahan jika faktor lain (misalnya perbaikan jalan) tidak berperan. "Semua pengemudi patuh" tidak diperlukan.'],
  ['"Semua orang sukses yang saya kenal bangun pukul empat pagi. Jadi, jika ingin sukses, bangunlah pukul empat pagi."<br>Kelemahan utama penalaran ini adalah …', 'Hanya melihat orang yang sukses dan mengabaikan orang yang bangun pagi tetapi tidak sukses.', 'Menggunakan bahasa yang terlalu emosional.', 'Mengandalkan pendapat seorang ahli.', 'Menyerang pribadi orang yang tidak setuju.', 'Mengulang kesimpulan sebagai premis.', 'Bias penyintas dan generalisasi dari sampel yang dipilih.'],
  ['Survei daring sebuah portal berita menunjukkan 85% responden mendukung pembangunan jalan tol baru. Redaksi menyimpulkan bahwa mayoritas warga provinsi mendukung proyek tersebut.<br>Kelemahan utama kesimpulan itu adalah …', 'Responden survei daring portal itu belum tentu mewakili seluruh warga provinsi.', 'Persentase 85% terlalu tinggi untuk dipercaya.', 'Jalan tol tidak dibutuhkan oleh warga.', 'Survei seharusnya dilakukan oleh pemerintah.', 'Redaksi tidak menyebutkan nama responden.', 'Sampel yang memilih sendiri (self-selected) tidak representatif.'],
  ['Data menunjukkan daerah dengan lebih banyak toko buku memiliki angka melek huruf lebih tinggi. Seorang politisi mengusulkan membangun toko buku untuk menaikkan angka melek huruf.<br>Pernyataan yang paling <b>melemahkan</b> usulan itu adalah …', 'Toko buku cenderung dibuka di daerah yang penduduknya sudah banyak membaca.', 'Harga buku di toko buku cukup mahal.', 'Sebagian warga membeli buku secara daring.', 'Toko buku juga menjual alat tulis.', 'Angka melek huruf diukur setiap lima tahun.', 'Arah sebab-akibat mungkin terbalik: melek huruf yang tinggi menarik toko buku.'],
  ['Kementerian menyatakan bahwa program pelatihan wirausaha berhasil karena 70% pesertanya kini memiliki usaha.<br>Informasi yang paling diperlukan untuk menilai klaim tersebut adalah …', 'Berapa persen peserta yang sudah memiliki usaha sebelum mengikuti pelatihan.', 'Berapa lama pelatihan berlangsung.', 'Siapa saja instruktur pelatihannya.', 'Di kota mana pelatihan diadakan.', 'Berapa jumlah modul pelatihan.', 'Tanpa angka awal, kenaikan karena pelatihan tidak dapat diketahui.'],
  ['Sebuah perusahaan memindahkan kantornya ke pinggir kota untuk menghemat sewa. Manajer keuangan yakin laba akan naik.<br>Asumsi yang mendasari keyakinan itu adalah …', 'Penghematan sewa tidak akan habis oleh biaya tambahan seperti transportasi karyawan atau kehilangan klien.', 'Semua karyawan tinggal di pinggir kota.', 'Harga sewa di pusat kota akan terus naik.', 'Pesaing juga akan pindah ke pinggir kota.', 'Kantor baru lebih luas daripada kantor lama.', 'Laba naik hanya jika penghematan tidak terimbangi biaya baru.'],
  ['"Profesor Lim adalah ahli kimia terkemuka. Karena itu, pendapatnya tentang kebijakan moneter pasti benar."<br>Kekeliruan penalaran ini adalah …', 'Mengandalkan otoritas di luar bidang keahliannya.', 'Generalisasi dari satu contoh.', 'Menyerang pribadi lawan.', 'Menganggap korelasi sebagai sebab-akibat.', 'Memberikan dua pilihan palsu.', 'Keahlian kimia tidak menjamin kebenaran pendapat tentang ekonomi.'],
  ['"Kita harus memilih: menaikkan pajak secara besar-besaran atau membiarkan sekolah ditutup."<br>Kekeliruan penalaran pernyataan ini adalah …', 'Menyajikan dua pilihan seolah-olah tidak ada alternatif lain.', 'Mengandalkan otoritas yang tidak relevan.', 'Generalisasi tergesa-gesa.', 'Menyerang pribadi lawan bicara.', 'Lingkaran setan (penalaran berputar).', 'Dilema palsu: ada pilihan lain, misalnya efisiensi anggaran.'],
  ['Studi menemukan karyawan yang bekerja dari rumah dua hari seminggu melaporkan kepuasan kerja lebih tinggi. Perusahaan menyimpulkan bahwa kebijakan kerja dari rumah meningkatkan kepuasan.<br>Pernyataan yang paling <b>melemahkan</b> kesimpulan itu adalah …', 'Hanya karyawan dengan penilaian kinerja terbaik yang diizinkan bekerja dari rumah.', 'Karyawan yang bekerja dari rumah menghemat biaya transportasi.', 'Kepuasan kerja diukur dengan kuesioner.', 'Kantor perusahaan berada di pusat kota.', 'Kebijakan itu berlaku sejak tahun lalu.', 'Bias seleksi: kelompok yang bekerja dari rumah sudah berbeda sejak awal.'],
  ['"Jika kita mengizinkan mahasiswa terlambat lima menit, besok mereka akan terlambat sepuluh menit, lalu satu jam, dan akhirnya tidak datang sama sekali."<br>Kekeliruan penalaran ini adalah …', 'Lereng licin: menganggap satu langkah kecil pasti berujung pada akibat ekstrem.', 'Menganggap korelasi sebagai sebab-akibat.', 'Mengandalkan otoritas.', 'Generalisasi dari sampel kecil.', 'Dilema palsu.', 'Tidak ada bukti bahwa rantai akibat itu pasti terjadi.'],
  ['Penjualan payung di sebuah toko naik tajam pada bulan Desember. Pemilik toko menyimpulkan bahwa iklan radionya pada bulan itu sangat efektif.<br>Pernyataan yang paling <b>melemahkan</b> kesimpulan itu adalah …', 'Desember adalah puncak musim hujan di kota itu.', 'Iklan radio disiarkan pada pagi hari.', 'Toko itu juga menjual jas hujan.', 'Harga payung tidak berubah.', 'Pemilik toko baru pertama kali beriklan.', 'Musim hujan adalah penjelasan alternatif kenaikan penjualan.'],
  ['Universitas A memiliki rata-rata skor TOEFL lulusan tertinggi di provinsi. Seorang calon mahasiswa menyimpulkan bahwa kuliah di sana akan menaikkan skor TOEFL-nya paling banyak.<br>Kelemahan utama penalaran itu adalah …', 'Skor tinggi lulusan mungkin karena universitas itu menerima mahasiswa yang sejak awal sudah mahir berbahasa Inggris.', 'Skor TOEFL tidak penting untuk bekerja.', 'Universitas A terlalu mahal.', 'Rata-rata skor bisa berubah setiap tahun.', 'Calon mahasiswa belum pernah mengunjungi kampus itu.', 'Hasil akhir tinggi belum tentu karena "nilai tambah" kampus; bisa karena seleksi masuk.'],
  ['Sebuah aplikasi belajar mengklaim penggunanya naik skor rata-rata 50 poin dalam tiga bulan.<br>Pernyataan yang paling <b>memperkuat</b> klaim bahwa aplikasi itu yang menyebabkan kenaikan adalah …', 'Pelajar yang dipilih acak untuk tidak memakai aplikasi hanya naik 10 poin pada periode yang sama.', 'Aplikasi itu diunduh lebih dari satu juta kali.', 'Penggunanya kebanyakan mahasiswa.', 'Aplikasi itu memiliki fitur kuis harian.', 'Tampilan aplikasi itu menarik.', 'Kelompok kontrol acak menunjukkan efek tambahan aplikasi.'],
];
const WACANA4 = [
  ['Negara P memperpanjang cuti melahirkan menjadi enam bulan. Lima tahun kemudian, persentase perempuan yang menduduki posisi manajer turun. Seorang pengamat menyimpulkan bahwa cuti panjang merugikan karier perempuan.<br>Pernyataan yang paling <b>melemahkan</b> kesimpulan itu adalah …', 'Pada periode yang sama, jumlah posisi manajer di negara itu menyusut akibat resesi, dan penurunannya serupa pada laki-laki.', 'Sebagian perempuan tidak mengambil cuti penuh.', 'Cuti melahirkan juga diberikan kepada ayah selama dua minggu.', 'Negara tetangga memiliki cuti tiga bulan.', 'Perempuan lebih banyak bekerja di sektor jasa.', 'Jika laki-laki juga turun serupa, penyebabnya resesi, bukan cuti melahirkan.'],
  ['Para peneliti menemukan bahwa orang yang minum teh hijau setiap hari memiliki risiko penyakit jantung lebih rendah. Mereka menyarankan semua orang minum teh hijau.<br>Agar saran itu kuat, peneliti perlu menunjukkan bahwa …', 'Peminum teh hijau tidak berbeda dari bukan peminum dalam hal olahraga, pola makan, dan kebiasaan merokok.', 'Teh hijau tersedia di semua toko.', 'Teh hijau lebih murah daripada kopi.', 'Sebagian peserta penelitian tidak suka teh hijau.', 'Teh hijau sudah diminum sejak ribuan tahun lalu.', 'Faktor pengganggu (gaya hidup) harus disingkirkan sebelum menyimpulkan sebab-akibat.'],
  ['"Kebijakan ini didukung oleh sebagian besar warga. Karena itu, kebijakan ini pasti adil."<br>Kekeliruan penalaran ini adalah …', 'Menganggap sesuatu benar atau adil hanya karena banyak orang mendukungnya.', 'Generalisasi dari satu contoh.', 'Menyerang pribadi pengkritik.', 'Menganggap urutan waktu sebagai sebab.', 'Mengandalkan otoritas yang tidak relevan.', 'Argumentum ad populum: popularitas tidak membuktikan keadilan.'],
  ['Seorang direktur menolak usulan kerja hibrida dengan alasan, "Usulan itu datang dari karyawan yang sering terlambat, jadi pasti hanya akal-akalan."<br>Kekeliruan penalaran sang direktur adalah …', 'Menolak gagasan karena menilai pribadi pengusulnya, bukan isi usulannya.', 'Menarik generalisasi dari sampel yang terlalu besar.', 'Menggunakan dua pilihan palsu.', 'Mengandalkan pendapat ahli.', 'Menganggap korelasi sebagai sebab.', 'Ad hominem: menyerang pribadi, bukan argumen.'],
  ['Sebuah kota memasang kamera tilang elektronik di persimpangan utama. Pelanggaran lampu merah di persimpangan tersebut turun 60%. Kepala dinas menyimpulkan disiplin berlalu lintas warga kota meningkat.<br>Pernyataan yang paling <b>melemahkan</b> kesimpulan itu adalah …', 'Pelanggaran lampu merah di persimpangan tanpa kamera tidak berubah.', 'Kamera tilang mahal dipasang.', 'Sebagian warga tidak mengetahui lokasi kamera.', 'Tilang elektronik dikirim melalui pos.', 'Persimpangan utama paling padat pada sore hari.', 'Jika di tempat tanpa kamera tidak berubah, yang terjadi adalah penyesuaian lokal terhadap pengawasan, bukan peningkatan disiplin umum.'],
  ['Desa A dan desa B sama-sama menerima dana desa. Desa A menggunakannya untuk irigasi, desa B untuk gapura. Dua tahun kemudian, pendapatan petani desa A naik lebih tinggi.<br>Kesimpulan yang paling hati-hati adalah …', 'Penggunaan dana untuk irigasi mungkin berperan, tetapi perbedaan lain antardesa perlu diperiksa.', 'Gapura tidak berguna sama sekali.', 'Semua desa harus membangun irigasi.', 'Pendapatan petani desa B pasti turun.', 'Dana desa sebaiknya dihapus.', 'Perbandingan dua desa belum cukup untuk memastikan sebab; simpulan yang hati-hati mengakui faktor lain.'],
  ['"Hantu pasti ada karena tidak ada yang bisa membuktikan bahwa hantu tidak ada."<br>Pernyataan berikut yang memiliki kekeliruan penalaran <b>sejenis</b> adalah …', 'Obat herbal ini pasti manjur karena belum ada penelitian yang membuktikan obat ini tidak manjur.', 'Obat ini manjur karena uji klinis acak menunjukkan hasil positif.', 'Obat ini mungkin manjur, tetapi perlu diuji lebih lanjut.', 'Obat ini tidak manjur karena dokter saya berkata demikian.', 'Obat ini manjur karena banyak orang membelinya.', 'Argumentum ad ignorantiam: ketiadaan bukti sebaliknya dianggap bukti.'],
  ['Sebuah startup mengklaim produknya "dipercaya 1 juta pengguna" dan karena itu paling aman di pasaran.<br>Kelemahan utama klaim itu adalah …', 'Jumlah pengguna tidak menunjukkan tingkat keamanan produk.', 'Satu juta pengguna terlalu sedikit.', 'Startup belum lama berdiri.', 'Pengguna tidak membayar produk itu.', 'Produk itu dijual secara daring.', 'Popularitas berbeda dengan keamanan; dibutuhkan bukti keamanan seperti audit.'],
  ['Pemerintah daerah membebaskan pajak kendaraan listrik. Setahun kemudian, penjualan kendaraan listrik naik tiga kali lipat. Kepala daerah menyebut pembebasan pajak sebagai penyebab utama.<br>Pernyataan yang paling <b>memperkuat</b> klaim itu adalah …', 'Di daerah tetangga dengan kondisi serupa tetapi tanpa pembebasan pajak, penjualan kendaraan listrik hanya naik sedikit.', 'Harga kendaraan listrik secara nasional turun tajam pada tahun itu.', 'Jumlah stasiun pengisian daya bertambah pesat di daerah itu.', 'Kendaraan listrik lebih senyap.', 'Sebagian pembeli adalah perusahaan taksi.', 'Pembanding dengan daerah serupa menyingkirkan penyebab nasional. Opsi B dan C justru penjelasan alternatif.'],
  ['Data 20 tahun menunjukkan bahwa negara dengan konsumsi cokelat per kapita tertinggi menghasilkan paling banyak peraih Nobel per kapita. Kesimpulan yang paling tepat adalah …', 'Hubungan itu bisa dijelaskan oleh faktor ketiga seperti tingkat kemakmuran negara.', 'Makan cokelat meningkatkan kecerdasan.', 'Peraih Nobel gemar makan cokelat.', 'Negara miskin tidak menyukai cokelat.', 'Cokelat sebaiknya diwajibkan di sekolah.', 'Korelasi tingkat negara tidak membuktikan sebab-akibat; kemakmuran dapat memengaruhi keduanya.'],
];

const katItems = (form) => KAT.map(([S, M, P]) => katForms(S, M, P)[form]);
const hipItems = (form) => HIP.map((h) => hipForms(h)[form]);
const negItems = (form) => HIP.slice(0, 9).map((h) => negForms(h)[form]);

module.exports = {
  cat: 'penalaran',
  prefix: 'penalaran-x',
  sets: [
    { sub: 'silogisme', level: 2, items: [...katItems('barbara'), ...katItems('celarent'), ...hipItems('mp')] },
    { sub: 'silogisme', level: 3, items: [...katItems('darii'), ...katItems('ferio'), ...katItems('tengah'), ...hipItems('mt'), ...hipItems('rantai'), ...hipItems('disjungtif')] },
    { sub: 'silogisme', level: 4, items: [...katItems('negatif'), ...hipItems('rantaiMt'), ...hipItems('akibat'), ...hipItems('sebab')] },
    { sub: 'logika-proposisi', level: 2, items: [...negItems('and'), ...negItems('or'), ...KAT.map(([S, , P]) => kuantor(S, P).semua)] },
    { sub: 'logika-proposisi', level: 3, items: [...negItems('imp'), ...negItems('kontra'), ...KAT.map(([S, , P]) => kuantor(S, P).ada)] },
    { sub: 'logika-proposisi', level: 4, items: [...negItems('disj'), ...negItems('bi')] },
    { sub: 'penalaran-logis', level: 3, items: WACANA3 },
    { sub: 'penalaran-logis', level: 4, items: WACANA4 },
  ],
};
