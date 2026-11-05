/* Bank soal KUANTITATIF tambahan (soal cerita, bisnis, statistika, peluang, aritmetika, geometri, deret).
 * Konteks dan angka tiap soal ditulis manual (skenario), sedangkan kunci jawaban DIHITUNG oleh kode
 * sehingga bebas salah hitung. Pengecoh diambil dari kesalahan yang paling sering terjadi
 * (misalnya diskon bertingkat dijumlahkan, kecepatan rata-rata dirata-rata biasa, bunga majemuk dihitung tunggal).
 */
const f = (n, d = 2) => Number(Number(n).toFixed(d)).toLocaleString('id-ID', { maximumFractionDigits: d });
const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
const pc = (n) => f(n) + '%';
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (a, b) => { const g = gcd(a, b); return b / g === 1 ? String(a / g) : `${a / g}/${b / g}`; };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => fact(n) / (fact(k) * fact(n - k));
const hm = (t) => { const h = Math.floor(t + 1e-9); const m = Math.round((t - h) * 60); return m ? `${h} jam ${m} menit` : `${h} jam`; };
const clock = (mins) => { const h = Math.floor(mins / 60) % 24, m = Math.round(mins % 60); return `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`; };

/** Susun item ringkas: [stem, BENAR, 4 pengecoh unik, pembahasan]. */
function mk(stem, ans, cands, e, fmt = f) {
  const A = fmt(ans);
  const out = [];
  const push = (v) => { if (v == null || !isFinite(v) || v <= 0) return; const s = fmt(v); if (s !== A && !out.includes(s)) out.push(s); };
  cands.forEach((c) => { if (out.length < 4) push(c); });
  for (let k = 1; out.length < 4 && k < 40; k++) [1 + 0.1 * k, 1 - 0.07 * k].forEach((m) => { if (out.length < 4) push(ans * m); });
  return [stem, A, ...out, e];
}
/** Versi untuk jawaban berupa teks (bukan angka). */
function mkT(stem, ans, cands, e) {
  const out = [];
  cands.forEach((c) => { if (c !== ans && !out.includes(c) && out.length < 4) out.push(c); });
  return [stem, ans, ...out, e];
}

/* ===================== keluarga soal ===================== */
const diskonBertingkat = [['sepatu lari', 800000, 20, 10], ['laptop', 9500000, 15, 10], ['tas kerja', 450000, 30, 20], ['jaket', 600000, 25, 10], ['buku referensi', 320000, 10, 5], ['kursi kantor', 1250000, 20, 15], ['ponsel', 4200000, 10, 10], ['kamera', 6800000, 25, 20]]
  .map(([it, p, a, b]) => { const ans = p * (1 - a / 100) * (1 - b / 100); return mk(`Harga label ${it} ${rp(p)}. Toko memberi diskon ${a}%, lalu diskon tambahan ${b}% dari harga setelah diskon pertama. Harga yang dibayar adalah …`, ans, [p * (1 - (a + b) / 100), p * (1 - a / 100), p * (1 - b / 100), p * (a / 100) * (b / 100) * 10, p - p * (a / 100) * (b / 100)], `${rp(p)} × ${f(1 - a / 100)} × ${f(1 - b / 100)} = ${rp(ans)}. Diskon ${a}% + ${b}% tidak sama dengan diskon ${a + b}%.`, rp); });

const hargaAwal = [['kulkas', 3600000, 25], ['sepeda', 2550000, 15], ['televisi', 4500000, 10], ['meja belajar', 840000, 30], ['printer', 1520000, 20], ['karpet', 975000, 35], ['oven', 1955000, 15], ['koper', 680000, 15]]
  .map(([it, fin, d]) => { const ans = fin / (1 - d / 100); return mk(`Setelah diskon ${d}%, harga sebuah ${it} menjadi ${rp(fin)}. Harga sebelum diskon adalah …`, ans, [fin * (1 + d / 100), fin / (1 + d / 100), fin + d * 10000, fin * (1 - d / 100)], `Harga akhir = (100% − ${d}%) × harga awal, jadi harga awal = ${rp(fin)} ÷ ${f(1 - d / 100)} = ${rp(ans)}. Jebakan: menambahkan ${d}% dari harga akhir.`, rp); });

const untungPersen = [['kain batik', 120000, 150000], ['satu karung beras', 600000, 690000], ['sekilo kopi', 80000, 92000], ['sepasang sepatu', 250000, 325000], ['kerajinan rotan', 160000, 200000], ['sebotol madu', 75000, 90000], ['kaus sablon', 45000, 63000], ['teh kemasan', 32000, 36000]]
  .map(([it, b, j]) => { const ans = ((j - b) / b) * 100; return mk(`Pedagang membeli ${it} seharga ${rp(b)} dan menjualnya ${rp(j)}. Persentase keuntungannya adalah …`, ans, [((j - b) / j) * 100, (j / b) * 100, ans + 5, ans / 2], `Untung = ${rp(j - b)}. Persentase untung dihitung terhadap modal: ${rp(j - b)} ÷ ${rp(b)} × 100% = ${pc(ans)}. Jebakan: membagi dengan harga jual.`, pc); });

const bungaMajemuk = [[10e6, 10, 2], [5e6, 8, 2], [20e6, 5, 3], [8e6, 10, 3], [15e6, 6, 2], [12e6, 4, 2], [25e6, 10, 2], [4e6, 5, 3]]
  .map(([P, r, n]) => { const ans = P * Math.pow(1 + r / 100, n); return mk(`Uang ${rp(P)} didepositokan dengan bunga majemuk ${r}% per tahun. Setelah ${n} tahun, saldonya menjadi …`, ans, [P * (1 + (r * n) / 100), P * Math.pow(1 + r / 100, n - 1), P * Math.pow(1 + r / 100, n + 1), P * (r / 100) * n + P / 10], `${rp(P)} × ${f(1 + r / 100)}^${n} = ${rp(ans)}. Bunga tunggal ${rp(P * (1 + (r * n) / 100))} adalah jebakannya.`, rp); });

const bungaTunggal = [[6e6, 6, 8], [12e6, 5, 6], [9e6, 8, 9], [15e6, 4, 3], [20e6, 6, 18], [7.2e6, 10, 5], [10e6, 7, 12], [4.8e6, 5, 10]]
  .map(([P, r, m]) => { const i = (P * r * m) / 1200; return mk(`Pinjaman koperasi ${rp(P)} dikenai bunga tunggal ${r}% per tahun. Total yang harus dikembalikan setelah ${m} bulan adalah …`, P + i, [P + (P * r * m) / 100, P + (P * r) / 100, i, P + i / 2, P * Math.pow(1 + r / 100, m / 12) + 1000], `Bunga = ${rp(P)} × ${r}% × ${m}/12 = ${rp(i)}. Total = ${rp(P + i)}. Jangan lupa membagi 12 karena suku bunga per tahun.`, rp); });

const rataHarmonik = [[40, 60, 'Malang', 'Batu'], [30, 60, 'Bogor', 'Puncak'], [60, 90, 'Semarang', 'Solo'], [50, 75, 'Medan', 'Pematangsiantar'], [45, 90, 'Bandung', 'Garut'], [36, 54, 'Makassar', 'Maros'], [80, 120, 'Jakarta', 'Cirebon'], [20, 30, 'kampus', 'perpustakaan kota']]
  .map(([a, b, x, y]) => { const ans = (2 * a * b) / (a + b); return mk(`Seorang pengemudi pergi dari ${x} ke ${y} dengan kecepatan rata-rata ${a} km/jam dan pulang melalui jalan yang sama dengan ${b} km/jam. Kecepatan rata-rata seluruh perjalanan adalah … km/jam.`, ans, [(a + b) / 2, Math.sqrt(a * b), (a + b) / 2 + 2, b - a], `Jarak pergi = jarak pulang, jadi pakai rata-rata harmonik: 2 × ${a} × ${b} ÷ (${a} + ${b}) = ${f(ans)}. Jebakan: (${a} + ${b}) ÷ 2 = ${f((a + b) / 2)}.`); });

const bertemu = [[210, 40, 30], [225, 50, 40], [330, 60, 50], [180, 45, 45], [405, 75, 60], [275, 55, 55], [390, 70, 60], [300, 65, 55]]
  .map(([d, a, b]) => { const t = d / (a + b); return mk(`Dua mobil berangkat bersamaan dari dua kota yang berjarak ${d} km dan saling mendekat dengan kecepatan ${a} km/jam dan ${b} km/jam. Keduanya bertemu setelah …`, t, [d / a, d / b, a === b ? t * 2 : d / Math.abs(a - b), t + 0.5], `Saling mendekat → kecepatan dijumlahkan: ${d} ÷ (${a} + ${b}) = ${hm(t)}.`, hm); });

const menyusul = [[40, 60, 1], [30, 45, 2], [50, 75, 1], [36, 48, 1], [45, 60, 2], [40, 50, 0.5], [60, 80, 1], [24, 32, 1]]
  .map(([a, b, t0]) => { const start = 7 * 60; const t = (a * t0) / (b - a); const ans = start + (t0 + t) * 60; return mkT(`Andi berangkat pukul 07.00 dengan kecepatan ${a} km/jam. ${t0 === 0.5 ? 'Setengah jam' : t0 + ' jam'} kemudian Budi menyusul dari tempat yang sama melalui jalan yang sama dengan kecepatan ${b} km/jam. Budi menyusul Andi pukul …`, clock(ans), [clock(start + t * 60), clock(start + (t0 + (a * t0) / (b + a)) * 60), clock(ans + 60), clock(ans - 30), clock(start + (t0 + t + 0.5) * 60)], `Saat Budi berangkat, Andi sudah unggul ${a * t0} km. Selisih kecepatan ${b - a} km/jam → Budi butuh ${f(t)} jam. Pukul 07.00 + ${f(t0)} jam + ${f(t)} jam = ${clock(ans)}.`); });

const kerjaBersama = [[6, 12, 'mengecat pagar'], [10, 15, 'menyusun laporan'], [12, 24, 'memanen kebun'], [20, 30, 'memasang keramik'], [9, 18, 'menginput data survei'], [8, 24, 'mengetik naskah'], [14, 35, 'merenovasi ruang'], [24, 40, 'menerjemahkan buku']]
  .map(([a, b, job]) => { const ans = (a * b) / (a + b); return mk(`Rina dapat ${job} sendirian dalam ${a} hari, sedangkan Sari dalam ${b} hari. Jika bekerja bersama, pekerjaan itu selesai dalam … hari.`, ans, [(a + b) / 2, a + b, Math.abs(b - a), ans + 1], `Laju gabungan = 1/${a} + 1/${b}, jadi waktu = ${a} × ${b} ÷ (${a} + ${b}) = ${f(ans)} hari.`); });

const kerjaTinggal = [[12, 18, 4], [10, 15, 3], [8, 24, 3], [20, 30, 6], [6, 12, 2], [15, 30, 5], [9, 18, 3], [12, 36, 6]]
  .map(([a, b, k]) => { const rem = 1 - k * (1 / a + 1 / b); const ans = k + rem * b; return mk(`Tukang A dapat menyelesaikan sebuah pekerjaan dalam ${a} hari dan tukang B dalam ${b} hari. Mereka bekerja bersama selama ${k} hari, lalu A berhenti dan B menyelesaikan sisanya sendirian. Seluruh pekerjaan selesai dalam … hari.`, ans, [(a * b) / (a + b), rem * b, k + rem * a, ans + 2], `${k} hari bersama menyelesaikan ${k} × (1/${a} + 1/${b}) = ${f(1 - rem, 3)} bagian. Sisa ${f(rem, 3)} dikerjakan B: ${f(rem, 3)} × ${b} = ${f(rem * b)} hari. Total ${f(ans)} hari.`); });

const pipa = [[4, 6], [3, 5], [6, 10], [4, 12], [6, 9], [2, 3], [8, 12], [10, 15]]
  .map(([a, b]) => { const ans = (a * b) / (b - a); return mk(`Keran P dapat mengisi penuh sebuah tangki dalam ${a} jam, sedangkan lubang di dasar tangki dapat menguras tangki penuh dalam ${b} jam. Jika tangki kosong diisi dengan lubang terbuka, tangki penuh setelah … jam.`, ans, [(a * b) / (a + b), b - a, (a + b) / 2, a + b], `Laju bersih = 1/${a} − 1/${b}, jadi waktu = ${a} × ${b} ÷ (${b} − ${a}) = ${f(ans)} jam.`); });

const campuran = [['larutan gula', 2, 10, 3, 20], ['larutan garam', 4, 5, 6, 15], ['cairan disinfektan', 3, 30, 2, 10], ['sirup', 5, 12, 5, 8], ['larutan pupuk', 6, 20, 4, 5], ['cairan pembersih', 1, 40, 3, 8], ['larutan cuka', 8, 25, 2, 10], ['larutan alkohol', 3, 15, 1, 35]]
  .map(([nm, x, a, y, b]) => { const ans = (x * a + y * b) / (x + y); return mk(`${x} liter ${nm} berkadar ${a}% dicampur dengan ${y} liter ${nm} berkadar ${b}%. Kadar campurannya adalah …`, ans, [(a + b) / 2, a + b, (x * a + y * b) / (x * y), ans + 2], `Zat terlarut = ${x} × ${a}% + ${y} × ${b}% = ${f((x * a + y * b) / 100)} liter dari ${x + y} liter → ${pc(ans)}. Rata-rata biasa salah karena volumenya berbeda.`, pc); });

const penguapan = [[30, 10, 15], [50, 8, 20], [60, 5, 12], [24, 15, 20], [40, 12, 16], [45, 20, 30], [80, 6, 10], [36, 10, 24]]
  .map(([V, a, b]) => { const ans = V - (V * a) / b; return mk(`Sebanyak ${V} liter larutan mengandung ${a}% garam. Agar kadarnya menjadi ${b}%, air yang harus diuapkan sebanyak … liter.`, ans, [(V * (b - a)) / 100, (V * a) / b, (V * (b - a)) / b + 2, V * (b - a) / a], `Garam tetap ${f((V * a) / 100)} liter. Volume akhir = ${f((V * a) / 100)} ÷ ${b}% = ${f((V * a) / b)} liter. Diuapkan ${V} − ${f((V * a) / b)} = ${f(ans)} liter.`); });

const rataGabung = [[20, 70, 30, 80, 'Kelas A', 'Kelas B'], [25, 64, 15, 72, 'peserta pagi', 'peserta sore'], [40, 75, 10, 85, 'karyawan pria', 'karyawan wanita'], [12, 80, 18, 70, 'tim Jakarta', 'tim Surabaya'], [30, 68, 20, 73, 'angkatan 2023', 'angkatan 2024'], [15, 90, 35, 80, 'kelompok A', 'kelompok B'], [24, 60, 16, 70, 'cabang utara', 'cabang selatan'], [10, 88, 40, 78, 'program reguler', 'program kerja sama']]
  .map(([n1, a1, n2, a2, g1, g2]) => { const ans = (n1 * a1 + n2 * a2) / (n1 + n2); return mk(`Nilai rata-rata ${n1} orang ${g1} adalah ${a1}, sedangkan nilai rata-rata ${n2} orang ${g2} adalah ${a2}. Rata-rata gabungannya adalah …`, ans, [(a1 + a2) / 2, ans + 1, ans - 1, (a1 * n2 + a2 * n1) / (n1 + n2)], `(${n1} × ${a1} + ${n2} × ${a2}) ÷ ${n1 + n2} = ${f(ans)}. Rata-rata biasa (${f((a1 + a2) / 2)}) salah karena jumlah anggota berbeda.`); });

const nilaiMinimal = [[4, 78, 80], [3, 72, 75], [5, 80, 82], [2, 65, 70], [4, 85, 86], [6, 70, 72], [3, 90, 88], [5, 74, 76]]
  .map(([n, a, t]) => { const ans = t * (n + 1) - a * n; return mk(`Rata-rata nilai ${n} ujian pertama Dewi adalah ${a}. Agar rata-rata ${n + 1} ujian menjadi ${t}, nilai ujian berikutnya harus …`, ans, [t, t + (t - a), t * n - a * (n - 1), ans + 2], `Total yang dibutuhkan ${n + 1} × ${t} = ${t * (n + 1)}; total sekarang ${n} × ${a} = ${a * n}. Selisih ${ans}.`); });

const umur = [[2, 5, 10, 1, 2], [3, 4, 6, 5, 6], [1, 3, 10, 1, 2], [4, 7, 5, 3, 5], [2, 3, 8, 3, 4], [5, 8, 4, 2, 3], [3, 5, 6, 2, 3], [1, 4, 12, 2, 5]]
  .map(([a, b, t, c, d]) => { const k = (t * (c - d)) / (d * a - c * b); const ans = (a + b) * k; return mk(`Perbandingan umur Tono dan ayahnya sekarang ${a} : ${b}. ${t} tahun lagi perbandingannya menjadi ${c} : ${d}. Jumlah umur mereka sekarang adalah … tahun.`, ans, [ans + 2 * t, (c + d) * k, ans + t, (a + b) * (k + 1)], `Misal umur ${a}k dan ${b}k. (${a}k + ${t}) : (${b}k + ${t}) = ${c} : ${d} → k = ${f(k)}. Umur ${a * k} dan ${b * k}, jumlah ${ans}.`); });

const pekerjaHari = [[10, 12, 8, 'membangun pos ronda'], [8, 15, 10, 'menggali saluran'], [12, 20, 15, 'merenovasi sekolah'], [6, 10, 4, 'membersihkan pantai'], [15, 8, 6, 'memanen padi'], [9, 16, 12, 'mengecat gedung'], [20, 9, 6, 'memasang paving'], [14, 12, 8, 'menanam bibit mangrove']]
  .map(([w, d, d2, job]) => { const tot = (w * d) / d2; return mk(`${w} pekerja dapat ${job} dalam ${d} hari. Agar selesai dalam ${d2} hari, dibutuhkan tambahan … pekerja.`, tot - w, [tot, (w * d2) / d, d - d2, tot - w + 1], `Pekerjaan = ${w} × ${d} = ${w * d} orang-hari. Butuh ${w * d} ÷ ${d2} = ${tot} pekerja, jadi tambahan ${tot - w}. Jebakan: menjawab ${tot} (jumlah total).`); });

const naikTurun = [[20, 20, 'harga cabai'], [25, 20, 'harga saham'], [10, 10, 'jumlah pengunjung'], [30, 10, 'tarif sewa'], [50, 40, 'penjualan'], [40, 25, 'harga emas'], [20, 25, 'produksi'], [15, 20, 'ongkos kirim']]
  .map(([a, b, x]) => { const net = ((1 + a / 100) * (1 - b / 100) - 1) * 100; const w = (v) => (Math.abs(v) < 1e-9 ? 'tetap' : v > 0 ? `naik ${f(v)}%` : `turun ${f(-v)}%`); return mkT(`${x[0].toUpperCase() + x.slice(1)} naik ${a}% pada bulan pertama, lalu turun ${b}% pada bulan kedua. Dibandingkan keadaan awal, ${x} …`, w(net), [w(a - b), w(a - b === 0 ? 1 : -(a - b)), w(net + (net === 0 ? 2 : net > 0 ? -2 : 2)), w(a + b), w(-net === 0 ? -1 : -net)], `Kalikan faktornya: ${f(1 + a / 100)} × ${f(1 - b / 100)} = ${f((1 + a / 100) * (1 - b / 100), 4)} → ${w(net)}. Persentase tidak boleh dijumlah-kurangkan langsung.`); });

const bep = [[60e6, 50000, 30000, 'kopi kemasan'], [24e6, 15000, 9000, 'roti'], [45e6, 120000, 75000, 'tas anyaman'], [18e6, 8000, 5000, 'es teh'], [100e6, 250000, 150000, 'sepatu kulit'], [36e6, 40000, 28000, 'sabun herbal'], [72e6, 90000, 60000, 'kaus batik'], [30e6, 25000, 13000, 'keripik']]
  .map(([FC, P, VC, it]) => { const ans = FC / (P - VC); return mk(`Usaha ${it} memiliki biaya tetap ${rp(FC)} per bulan. Harga jual ${rp(P)} per unit dan biaya variabel ${rp(VC)} per unit. Titik impas tercapai pada penjualan … unit.`, ans, [FC / P, FC / VC, FC / (P + VC), ans * 1.5], `BEP = biaya tetap ÷ (harga − biaya variabel) = ${rp(FC)} ÷ ${rp(P - VC)} = ${f(ans)} unit.`, (v) => Math.round(v).toLocaleString('id-ID')); });

const targetLaba = [[40e6, 100000, 60000, 20e6], [30e6, 50000, 30000, 10e6], [90e6, 200000, 140000, 30e6], [15e6, 25000, 15000, 5e6], [60e6, 80000, 50000, 15e6], [48e6, 120000, 80000, 12e6], [20e6, 40000, 24000, 4e6], [75e6, 150000, 100000, 25e6]]
  .map(([FC, P, VC, T]) => { const ans = (FC + T) / (P - VC); return mk(`Sebuah UMKM memiliki biaya tetap ${rp(FC)}, harga jual ${rp(P)} per unit, dan biaya variabel ${rp(VC)} per unit. Agar laba ${rp(T)}, jumlah unit yang harus terjual adalah …`, ans, [FC / (P - VC), T / (P - VC), (FC + T) / P, (FC - T) / (P - VC)], `Unit = (biaya tetap + target laba) ÷ margin kontribusi = ${rp(FC + T)} ÷ ${rp(P - VC)} = ${f(ans)} unit.`, (v) => Math.round(v).toLocaleString('id-ID')); });

const markupMargin = [25, 100, 60, 150, 300, 400, 900, 50]
  .map((m) => { const ans = (m / (100 + m)) * 100; return mk(`Seorang pedagang menetapkan harga jual dengan markup ${m}% dari harga pokok. Margin laba terhadap harga jual adalah …`, ans, [m, m / 2, (m / (100 - m)) * 100 > 0 && m < 100 ? (m / (100 - m)) * 100 : m + 10, 100 - m > 0 ? 100 - m : m / 3], `Misal harga pokok 100 → harga jual ${100 + m}, laba ${m}. Margin = ${m} ÷ ${100 + m} = ${pc(ans)}. Markup dihitung dari harga pokok, margin dari harga jual.`, pc); });

const dadu = [['berjumlah 4', (a, b) => a + b === 4], ['berjumlah 5', (a, b) => a + b === 5], ['berjumlah 9', (a, b) => a + b === 9], ['berjumlah 10', (a, b) => a + b === 10], ['berjumlah lebih dari 9', (a, b) => a + b > 9], ['berjumlah kurang dari 5', (a, b) => a + b < 5], ['kembar (angka sama)', (a, b) => a === b], ['hasil kalinya genap', (a, b) => (a * b) % 2 === 0], ['berselisih 2', (a, b) => Math.abs(a - b) === 2], ['berjumlah bilangan prima', (a, b) => [2, 3, 5, 7, 11].includes(a + b)]]
  .map(([lbl, fn]) => { let n = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (fn(a, b)) n++; const ans = frac(n, 36); const ok = (a, b) => (a < b ? frac(a, b) : null); return mkT(`Dua dadu dilempar bersamaan. Peluang mata dadu yang muncul ${lbl} adalah …`, ans, [ok(n + 1, 36), ok(Math.max(1, n - 1), 36), ok(n, 12), ok(n, 21), ok(n + 2, 36), ok(n, 30), ok(36 - n, 36), ok(n + 3, 36)].filter(Boolean), `Ada ${n} pasangan (a, b) yang memenuhi dari 36 kemungkinan → ${n}/36 = ${ans}.`); });

const panitia = [[5, 4, 2, 1], [6, 5, 2, 2], [7, 3, 3, 1], [4, 6, 1, 2], [8, 4, 2, 2], [5, 5, 3, 2], [6, 4, 3, 1], [9, 3, 2, 1]]
  .map(([m, w, r, s]) => { const ans = C(m, r) * C(w, s); return mk(`Dari ${m} pria dan ${w} wanita akan dipilih tim beranggotakan ${r} pria dan ${s} wanita. Banyak cara memilih tim adalah …`, ans, [C(m + w, r + s), C(m, r) + C(w, s), (fact(m) / fact(m - r)) * (fact(w) / fact(w - s)), ans * 2], `C(${m},${r}) × C(${w},${s}) = ${C(m, r)} × ${C(w, s)} = ${ans}. Dikalikan karena pemilihan pria DAN wanita terjadi bersamaan.`); });

const susunHuruf = ['BANDUNG', 'MAKASSAR', 'SURABAYA', 'BOGOR', 'PAPUA', 'JAKARTA', 'MATEMATIKA', 'KALIMANTAN']
  .map((w) => { const cnt = {}; [...w].forEach((ch) => (cnt[ch] = (cnt[ch] || 0) + 1)); const rep = Object.values(cnt).filter((x) => x > 1); const den = rep.reduce((p, x) => p * fact(x), 1); const ans = fact(w.length) / den; const first = rep.length ? fact(rep[0]) : 2; return mk(`Banyak susunan huruf berbeda yang dapat dibentuk dari semua huruf kata ${w} adalah …`, ans, [fact(w.length), fact(w.length) / first, ans * 2, fact(w.length - 1)], `${w.length} huruf dengan huruf berulang ${Object.entries(cnt).filter(([, x]) => x > 1).map(([k, x]) => `${k} (${x}×)`).join(', ')}: ${w.length}! ÷ ${rep.map((x) => x + '!').join(' × ')} = ${ans.toLocaleString('id-ID')}.`, (v) => Math.round(v).toLocaleString('id-ID')); });

const lcm = (a, b) => (a * b) / gcd(a, b);
const sisaSama = [[3, 4, 5, 2], [4, 6, 9, 1], [5, 6, 8, 3], [6, 8, 10, 5], [2, 3, 7, 1], [4, 5, 7, 3], [3, 5, 8, 2], [6, 9, 15, 4]]
  .map(([a, b, c, r]) => { const L = lcm(lcm(a, b), c); const ans = L + r; return mk(`Bilangan bulat positif terkecil yang lebih dari ${r} dan selalu bersisa ${r} jika dibagi ${a}, ${b}, maupun ${c} adalah …`, ans, [L, L - r, a * b * c + r, 2 * L + r], `KPK(${a}, ${b}, ${c}) = ${L}. Bilangan berbentuk ${L}k + ${r}; yang terkecil di atas ${r} adalah ${ans}.`); });

const sudutJam = [[2, 30], [4, 20], [7, 45], [9, 15], [5, 40], [11, 10], [6, 50], [1, 25]]
  .map(([h, m]) => { let a = Math.abs(30 * h - 5.5 * m); if (a > 180) a = 360 - a; let wrong = Math.abs(30 * h - 6 * m); if (wrong > 180) wrong = 360 - wrong; return mk(`Besar sudut terkecil yang dibentuk jarum jam dan jarum menit pada pukul ${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')} adalah …`, a, [wrong, 180 - a, a + 15, Math.abs(a - 30), a + 30], `Rumus |30H − 5,5M| = |${30 * h} − ${f(5.5 * m)}| = ${f(Math.abs(30 * h - 5.5 * m))}°${Math.abs(30 * h - 5.5 * m) > 180 ? `, ambil 360° − hasilnya = ${f(a)}°` : ''}. Jebakan: lupa bahwa jarum jam ikut bergeser 0,5° per menit.`, (v) => f(v) + '°'); });

const digitAkhir = [[3, 2026], [2, 2025], [7, 99], [8, 50], [9, 101], [4, 77], [13, 30], [17, 41]]
  .map(([a, n]) => { const cyc = []; let x = a % 10; while (!cyc.includes(x)) { cyc.push(x); x = (x * a) % 10; } const ans = cyc[(n - 1) % cyc.length]; const pool = [...cyc, (a * 3) % 10, (a + 1) % 10, 1, 5, 6, 0].filter((v) => v !== ans); return mkT(`Angka satuan dari ${a}^${n} adalah …`, String(ans), [...new Set(pool.map(String))], `Angka satuan pangkat ${a} berulang ${cyc.join(', ')} (siklus ${cyc.length}). ${n} dibagi ${cyc.length} bersisa ${n % cyc.length || cyc.length} → ${ans}.`); });

const skala = [[250000, 8], [500000, 6.5], [1000000, 4.2], [200000, 12], [750000, 6], [50000, 15], [2000000, 3.5], [150000, 9]]
  .map(([s, cm]) => { const ans = (s * cm) / 100000; return mk(`Pada peta berskala 1 : ${s.toLocaleString('id-ID')}, jarak dua kota ${f(cm)} cm. Jarak sebenarnya adalah … km.`, ans, [ans * 10, ans / 10, ans * 100, ans + 5], `${f(cm)} cm × ${s.toLocaleString('id-ID')} = ${(s * cm).toLocaleString('id-ID')} cm = ${f(ans)} km (1 km = 100.000 cm).`); });

const ppnMundur = [[1110000, 'jasa desain'], [2220000, 'sewa ruang rapat'], [777000, 'paket katering'], [3330000, 'servis mesin'], [555000, 'langganan perangkat lunak'], [1665000, 'jasa konsultasi'], [4440000, 'sewa alat'], [2775000, 'pelatihan karyawan']]
  .map(([tot, it]) => { const ans = tot / 1.11; return mk(`Tagihan ${it} sebesar ${rp(tot)} sudah termasuk PPN 11%. Harga sebelum PPN adalah …`, ans, [tot * 0.89, tot - 11000, tot / 1.1, tot * 0.9], `Tagihan = 111% × harga dasar → harga dasar = ${rp(tot)} ÷ 1,11 = ${rp(ans)}. Jebakan: mengurangi 11% dari tagihan.`, rp); });

const indeksHarga = [[120, 132], [150, 156], [200, 210], [125, 135], [110, 121], [160, 172], [140, 147], [250, 265]]
  .map(([a, b]) => { const ans = ((b - a) / a) * 100; return mk(`Indeks harga konsumen naik dari ${a} pada tahun lalu menjadi ${b} tahun ini. Laju inflasinya adalah …`, ans, [b - a, ((b - a) / b) * 100, b - 100, ans + 2], `Inflasi = (${b} − ${a}) ÷ ${a} × 100% = ${pc(ans)}. Selisih ${b - a} poin indeks bukan persentase.`, pc); });

const deretJumlah = [[3, 4, 15], [5, 3, 20], [2, 5, 12], [10, 2, 25], [7, 4, 18], [1, 6, 10], [4, 7, 16], [12, 5, 14]]
  .map(([a, b, n]) => { const un = a + (n - 1) * b; const ans = (n * (a + un)) / 2; return mk(`Jumlah ${n} suku pertama barisan ${a}, ${a + b}, ${a + 2 * b}, … adalah …`, ans, [un, n * (a + un), ans - un, ans + a + n * b], `U${n} = ${a} + ${n - 1} × ${b} = ${un}. S${n} = ${n}/2 × (${a} + ${un}) = ${ans}.`); });

const pecahanUang = [[1200000, 3, 4], [900000, 3, 3], [2400000, 4, 3], [1500000, 5, 4], [800000, 4, 2], [3600000, 6, 5], [1000000, 5, 2], [2000000, 4, 5]]
  .map(([M, p, q]) => { const ans = M * (1 - 1 / p) * (1 - 1 / q); return mk(`Uang saku Lina ${rp(M)}. Sebanyak 1/${p} dipakai membeli buku, lalu 1/${q} dari sisanya untuk transportasi. Sisa uangnya adalah …`, ans, [M * (1 - 1 / p - 1 / q), M / p, M * (1 - 1 / p), M * (1 - 1 / p) / q], `Sisa setelah buku ${rp(M * (1 - 1 / p))}; transportasi 1/${q} dari sisa itu = ${rp(M * (1 - 1 / p) / q)}. Sisa akhir ${rp(ans)}.`, rp); });

const kurs = [[250, 15800, 15600], [400, 16100, 15900], [120, 15950, 15750], [300, 16200, 16000], [75, 15700, 15500], [500, 16050, 15850], [180, 15900, 15700], [220, 16300, 16100]]
  .map(([n, j, b]) => { const ans = n * j; return mk(`Kurs jual dolar AS di sebuah bank Rp${j.toLocaleString('id-ID')} dan kurs belinya Rp${b.toLocaleString('id-ID')}. Rupiah yang dibutuhkan untuk membeli ${n} dolar AS di bank tersebut adalah …`, ans, [n * b, (n * (j + b)) / 2, n * (j - b), n * j * 1.01], `Bank MENJUAL dolar kepada kita memakai kurs jual: ${n} × Rp${j.toLocaleString('id-ID')} = ${rp(ans)}. Kurs beli dipakai saat kita menjual dolar ke bank.`, rp); });

const elastisitas = [[10, 20, 'tiket pesawat'], [5, 2, 'beras'], [8, 12, 'kopi kekinian'], [20, 5, 'obat resep'], [6, 9, 'pakaian bermerek'], [16, 4, 'listrik rumah tangga'], [3, 9, 'paket wisata'], [25, 20, 'bensin nonsubsidi']]
  .map(([a, b, it]) => { const ans = b / a; const sifat = ans > 1 ? 'elastis' : ans < 1 ? 'inelastis' : 'elastis uniter'; return mk(`Ketika harga ${it} naik ${a}%, jumlah yang diminta turun ${b}%. Nilai mutlak elastisitas harga permintaannya adalah …`, ans, [a / b, (a * b) / 100, Math.abs(b - a) || 2, ans + 1], `Elastisitas = %ΔQ ÷ %ΔP = ${b}% ÷ ${a}% = ${f(ans)} → ${sifat}.`); });

const tabungBalok = [[7, 12, 22, 14], [14, 5, 44, 20], [7, 6, 11, 14], [3.5, 8, 11, 7], [7, 15, 33, 10], [14, 3, 28, 22], [7, 8, 16, 11], [3.5, 12, 14, 11]]
  .map(([r, t, p, l]) => { const V = (22 / 7) * r * r * t; const ans = V / (p * l); return mk(`Air dalam tabung berjari-jari ${f(r)} cm dan tinggi ${t} cm (penuh) dituang seluruhnya ke wadah balok beralas ${p} cm × ${l} cm. Tinggi air dalam balok adalah … cm (π = 22/7).`, ans, [(3.14 * r * r * t) / (p * l) + 0.5, ((22 / 7) * 4 * r * r * t) / (p * l), ans * 2, ans / 2], `Volume = 22/7 × ${f(r)}² × ${t} = ${f(V)} cm³. Tinggi = ${f(V)} ÷ (${p} × ${l}) = ${f(ans)} cm.`); });

const persegiPanjang = [[60, 3, 2], [48, 5, 3], [84, 4, 3], [70, 4, 1], [90, 2, 1], [56, 5, 2], [72, 7, 5], [100, 3, 2]]
  .map(([K, a, b]) => { const s = K / 2 / (a + b); const p = a * s, l = b * s; const ans = p * l; return mk(`Keliling sebuah lahan persegi panjang ${K} m dan perbandingan panjang : lebarnya ${a} : ${b}. Luas lahan itu adalah … m².`, ans, [(K / 4) * (K / 4), K * s, a * b * s, ans * 2], `Panjang + lebar = ${K / 2} → satuan ${f(s)} m; panjang ${f(p)} m, lebar ${f(l)} m. Luas = ${f(ans)} m².`); });

const keretaTerowongan = [[150, 450, 72], [200, 1000, 90], [120, 480, 54], [180, 720, 108], [250, 350, 72], [100, 500, 36], [160, 640, 72], [220, 880, 99]]
  .map(([Lk, Lt, v]) => { const ms = v / 3.6; const ans = (Lk + Lt) / ms; return mk(`Kereta sepanjang ${Lk} m melaju ${v} km/jam melintasi terowongan sepanjang ${Lt} m. Waktu sejak ujung depan masuk sampai ujung belakang keluar terowongan adalah … detik.`, ans, [Lt / ms, (Lt - Lk) / ms, Lk / ms + 5, (Lk + Lt) / v], `${v} km/jam = ${f(ms)} m/detik. Jarak yang ditempuh = panjang terowongan + panjang kereta = ${Lk + Lt} m. Waktu = ${f(ans)} detik.`); });

module.exports = {
  cat: 'kuantitatif',
  prefix: 'kuant-x',
  sets: [
    { sub: 'soal-cerita', level: 2, items: [...diskonBertingkat, ...bertemu, ...kerjaBersama, ...pekerjaHari, ...pecahanUang] },
    { sub: 'soal-cerita', level: 3, items: [...hargaAwal, ...rataHarmonik, ...menyusul, ...pipa, ...campuran, ...umur, ...naikTurun, ...keretaTerowongan] },
    { sub: 'soal-cerita', level: 4, items: [...kerjaTinggal, ...penguapan] },
    { sub: 'bisnis', level: 2, items: [...untungPersen, ...kurs] },
    { sub: 'bisnis', level: 3, items: [...bungaMajemuk, ...bep, ...ppnMundur, ...indeksHarga] },
    { sub: 'bisnis', level: 4, items: [...targetLaba, ...markupMargin, ...elastisitas] },
    { sub: 'aritmetika', level: 2, items: [...bungaTunggal, ...skala] },
    { sub: 'aritmetika', level: 3, items: [...sisaSama, ...digitAkhir] },
    { sub: 'statistika', level: 2, items: rataGabung },
    { sub: 'statistika', level: 3, items: nilaiMinimal },
    { sub: 'peluang', level: 3, items: [...dadu, ...panitia] },
    { sub: 'peluang', level: 4, items: susunHuruf },
    { sub: 'geometri', level: 2, items: persegiPanjang },
    { sub: 'geometri', level: 3, items: [...tabungBalok, ...sudutJam] },
    { sub: 'deret', level: 2, items: deretJumlah },
  ],
};
