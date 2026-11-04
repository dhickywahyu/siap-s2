/* Siap S2 — router, halaman, dan widget */
(function (S) {
  'use strict';
  const C = window.SIAP_CONTENT || {};
  const V = window.SIAP_VOCAB || [];
  const view = () => S.$('#view');
  const LET = 'ABCDE';

  /* ================= util tampilan ================= */
  const examStats = (ex, mini) => {
    const f = mini ? 0.34 : 1;
    const n = S.sum(ex.sections.map((s) => S.sum(s.draw.map(([, k]) => Math.max(1, Math.round(k * f))))));
    const m = S.sum(ex.sections.map((s) => Math.max(3, Math.round(s.min * f))));
    return { n, m };
  };
  function catAccuracy() {
    const stats = S.store.get('stats', {});
    const out = {};
    Object.keys(S.CATS).forEach((c) => (out[c] = { b: 0, n: 0, rb: 0, rn: 0 }));
    Object.entries(stats).forEach(([sub, x]) => {
      const c = S.subCat(sub);
      if (!out[c]) return;
      out[c].b += x.b; out[c].n += x.n;
      (x.recent || []).forEach(([b, n]) => { out[c].rb += b; out[c].rn += n; });
    });
    return out;
  }
  function streak() {
    const days = S.store.get('days', {});
    let n = 0;
    const d = new Date();
    const key = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    if (!days[key(d)]) d.setDate(d.getDate() - 1);
    while (days[key(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function mdPage(key, opts = {}) {
    const src = C[key] || `# Konten belum tersedia\n\nJalankan \`node tools/build.js\` untuk membangun konten.`;
    const html = S.md(src);
    const heads = [...src.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]);
    return `<div class="page doc${opts.cls ? ' ' + opts.cls : ''}">
      ${heads.length > 2 ? `<nav class="toc" aria-label="Daftar isi"><p>Di halaman ini</p>${heads.map((h) => `<a href="#${opts.route}" data-act="toc" data-id="${S.slug(h)}">${S.inline(h)}</a>`).join('')}</nav>` : ''}
      <article class="md">${html}</article></div>`;
  }

  /* ================= halaman ================= */
  const P = {};

  P.beranda = () => {
    const prof = S.store.get('profile', { target: '', date: '' });
    const act = S.active();
    const hist = S.history();
    const acc = catAccuracy();
    const totalQ = S.sum(Object.values(S.store.get('days', {})));
    const days = prof.date ? Math.ceil((new Date(prof.date + 'T00:00:00') - new Date(S.today() + 'T00:00:00')) / 86400000) : null;
    const digits = days != null && days >= 0 ? String(days).padStart(3, '0').split('') : ['–', '–', '–'];
    const weakest = Object.entries(S.store.get('stats', {})).filter(([, x]) => x.n >= 5).map(([s, x]) => ({ s, p: x.b / x.n })).sort((a, b) => a.p - b.p)[0];
    const srsDue = SRS.dueCount();
    const lastAll = hist.length ? Math.round(S.sum(hist.slice(0, 5).map((h) => h.pct)) / Math.min(5, hist.length)) : null;
    view().innerHTML = `
    <div class="page home">
      ${act ? `<div class="resume" role="status"><div><strong>${S.esc(act.title)}</strong> belum selesai. ${act.deadline ? 'Waktu tetap berjalan seperti ujian sungguhan.' : ''}</div><a class="btn btn-primary" href="#ujian">Lanjutkan ujian</a></div>` : ''}
      <section class="hero">
        <div class="hero-text">
          <h1>Tes masuk S2 dan beasiswa, dilatih seperti hari-H.</h1>
          <p class="lede">Simulasi SIMAK UI, PAPs & AcEPT UGM, UPDA & ELPT ITB, TPA Bappenas, dan Tes Bakat Skolastik LPDP, lengkap dengan timer per bagian dan lembar jawaban. Kunci dan pembahasan baru terbuka setelah jawaban dikumpulkan.</p>
          <div class="btn-row"><a class="btn btn-primary" href="#simulasi">Pilih simulasi</a><button type="button" class="btn" data-act="quick">Latihan kilat 15 menit</button></div>
          <p class="muted small">${S.bankTotal.toLocaleString('id-ID')} soal di bank + variasi otomatis tak terbatas untuk deret, aritmetika, soal cerita, logika, dan figural.</p>
        </div>
        <form class="target-card" id="target-form" aria-label="Target ujian">
          <p class="target-label">Hari menuju ujian</p>
          <div class="ljk-digits" aria-label="${days != null && days >= 0 ? days + ' hari lagi' : 'Tanggal belum diatur'}">${digits.map((d) => `<span class="cell"><b>${d}</b>${'0123456789'.split('').map((x) => `<i class="${x === d ? 'on' : ''}"></i>`).join('')}</span>`).join('')}</div>
          <label for="tg-name">Target</label>
          <select id="tg-name" name="target">${['', 'LPDP + MM FEB UI (SIMAK)', 'LPDP + MBA FEB UGM', 'LPDP + MBA/MSM SBM ITB', 'LPDP + Magister Teknik & Manajemen Industri ITB', 'LPDP + Magister Teknik Industri UI', 'LPDP + Magister Teknik UGM', 'LPDP + SIMAK UI', 'LPDP + UGM (PAPs & AcEPT)', 'LPDP + ITB (UPDA & ELPT)', 'SIMAK UI', 'Pascasarjana UGM', 'Pascasarjana ITB', 'Tes Bakat Skolastik LPDP'].map((t) => `<option ${t === prof.target ? 'selected' : ''} value="${S.esc(t)}">${t || 'Pilih target…'}</option>`).join('')}</select>
          <label for="tg-date">Tanggal ujian / seleksi</label>
          <input id="tg-date" name="date" type="date" value="${S.esc(prof.date)}">
          <button class="btn btn-small" type="submit">Simpan target</button>
          ${days != null && days >= 0 ? `<p class="small">${planFor(days)}</p>` : ''}
        </form>
      </section>

      ${isStandalone() ? '' : `<section class="install-card only-touch"><div><strong>Pakai seperti aplikasi di HP</strong><p class="small">Pasang Siap S2 ke layar utama Android agar terbuka layar penuh dan tetap bisa dipakai tanpa internet.</p></div><button type="button" class="btn btn-primary btn-small" data-act="install">Pasang di HP</button></section>`}
      <section class="home-grid">
        <div class="panel">
          <h2>Kesiapan per kemampuan</h2>
          ${Object.entries(S.CATS).map(([c, label]) => {
            const x = acc[c];
            const p = x.rn ? Math.round((x.rb / x.rn) * 100) : null;
            return `<div class="ready"><div class="ready-top"><span>${label}</span><span>${p == null ? '<span class="muted">belum ada data</span>' : p + '%'}</span></div><div class="ready-bar"><i class="${p == null ? '' : p >= 70 ? 'ok' : p >= 50 ? 'mid' : 'bad'}" style="width:${p || 0}%"></i><b style="left:70%" title="Target 70%"></b></div></div>`;
          }).join('')}
          <p class="muted small">Dihitung dari 8 sesi terakhir per topik. Garis tipis = target aman 70% benar.</p>
        </div>
        <div class="panel">
          <h2>Ringkasan</h2>
          <dl class="kv">
            <div><dt>Soal dikerjakan</dt><dd>${totalQ.toLocaleString('id-ID')}</dd></div>
            <div><dt>Sesi selesai</dt><dd>${hist.length}</dd></div>
            <div><dt>Rata-rata 5 sesi terakhir</dt><dd>${lastAll == null ? '–' : lastAll + '%'}</dd></div>
            <div><dt>Hari beruntun</dt><dd>${streak()}</dd></div>
          </dl>
          ${hist.length ? '<p class="small"><a href="#riwayat">Lihat grafik perkembangan →</a></p>' : ''}
        </div>
        <div class="panel">
          <h2>Rekomendasi hari ini</h2>
          <ol class="todo">
            ${weakest ? `<li>Topik terlemahmu <b>${S.esc(S.subLabel(weakest.s))}</b> (${Math.round(weakest.p * 100)}%). <button type="button" class="linklike" data-act="drill" data-sub="${weakest.s}">Latih 15 soal</button></li>` : `<li>Kerjakan satu <a href="#simulasi">simulasi mini</a> untuk mengukur kemampuan awal.</li>`}
            <li>${srsDue ? `<b>${srsDue}</b> kartu kosakata menunggu.` : 'Kosakata baru siap dipelajari.'} <a href="#english" data-act="tab-english" data-tab="flash">Buka flashcard</a></li>
            ${/MBA|MM |Manajemen|Teknik/.test(prof.target) ? `<li>Target ${S.esc(prof.target.replace('LPDP + ', ''))}: buka <a href="#jalur">Jalur MBA & Teknik</a> untuk syarat, selisih skor bahasa Inggris, dan rencana 12 minggu.</li>` : ''}
            <li>Baca satu teknik di <a href="#strategi">Strategi & rumus cepat</a>, lalu langsung coba latihan kilatnya.</li>
            ${hist.length >= 5 && Date.now() - S.store.get('lastBackup', 0) > 14 * 86400000 ? '<li>Progresmu sudah ' + hist.length + ' sesi. <a href="#riwayat" data-act="goto-data">Unduh file cadangan</a> agar tidak hilang saat ganti HP.</li>' : ''}
          </ol>
        </div>
      </section>

      <section>
        <h2 class="section-title">Simulasi per kampus</h2>
        <div class="exam-mini-grid">${S.EXAMS.map((ex) => { const st = examStats(ex); return `<a class="exam-mini" href="#simulasi" data-act="goto-exam" data-id="${ex.id}"><span class="kampus">${S.esc(ex.kampus)}</span><strong>${S.esc(ex.name)}</strong><span class="muted small">${st.n} soal · ${st.m} menit</span></a>`; }).join('')}</div>
      </section>
    </div>`;
  };
  function planFor(days) {
    if (days <= 14) return 'Fase final: 1 simulasi penuh tiap 2 hari, sisanya ulang soal salah dan istirahat cukup.';
    if (days <= 45) return 'Fase intensif: 3 simulasi per minggu, latihan kilat topik lemah setiap hari, flashcard 20 menit.';
    if (days <= 120) return 'Fase bangun fondasi: pelajari Strategi & Rumus, latihan topik 45 menit per hari, 1 simulasi mini per minggu.';
    return 'Waktu masih panjang: rapikan dasar bahasa Inggris dan TPA, jadwalkan tes resmi lebih awal agar ada kesempatan tes ulang.';
  }

  P.simulasi = () => {
    const act = S.active();
    view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <h1>Simulasi ujian</h1>
        <p class="lede">Setiap simulasi meniru struktur tes aslinya: jumlah bagian, waktu per bagian, dan sistem nilai. Timer tidak bisa dijeda, bagian yang sudah diakhiri terkunci, dan kunci jawaban baru terbuka setelah kamu mengumpulkan.</p>
        <p class="muted small">Format disusun dari informasi publik 2019–2026 dan bisa berubah. Lihat <a href="#analisis">Analisis soal</a> untuk sumber dan catatan perbedaan.</p>
      </header>
      ${act ? `<div class="resume"><div>Ada sesi yang belum selesai: <strong>${S.esc(act.title)}</strong>.</div><a class="btn btn-primary" href="#ujian">Lanjutkan</a></div>` : ''}
      <div class="exam-list">${S.EXAMS.map((ex) => {
        const full = examStats(ex), mini = examStats(ex, true);
        return `<article class="exam-card" id="exam-${ex.id}">
          <div class="exam-card-head"><span class="kampus">${S.esc(ex.kampus)}</span><h2>${S.esc(ex.name)}</h2></div>
          <p>${S.esc(ex.blurb)}</p>
          <ol class="sec-list">${ex.sections.map((s) => `<li><span>${S.esc(s.name)}</span><span class="muted">${S.sum(s.draw.map((d) => d[1]))} soal · ${s.min} mnt${s.scoring && s.scoring[1] < 0 ? ' · nilai minus' : ''}</span></li>`).join('')}</ol>
          <p class="muted small">${S.esc(ex.note)}</p>
          <div class="btn-row">
            <button type="button" class="btn btn-primary" data-act="start-exam" data-id="${ex.id}" data-mini="0">Penuh · ${full.n} soal · ${full.m} mnt</button>
            <button type="button" class="btn" data-act="start-exam" data-id="${ex.id}" data-mini="1">Mini · ${mini.n} soal · ${mini.m} mnt</button>
          </div>
        </article>`;
      }).join('')}</div>
    </div>`;
  };

  /* ---------- latihan per topik ---------- */
  const builder = Object.assign({ cat: 'kuantitatif', subs: ['deret'], n: 20, t: 60, diff: 'campuran' }, S.store.get('builder', {}));
  if (!S.DIFFS[builder.diff]) builder.diff = 'campuran';
  const DIFF_HELP = {
    campuran: 'Campuran mudah sampai sangat sulit, kira-kira seperti sebaran tes aslinya.',
    sulit: 'Hanya soal tingkat Sulit dan Sangat sulit. Cocok setelah akurasimu di mode campuran stabil di atas 70%.',
    sangat: 'Hanya soal tingkat Sangat sulit: langkah berlapis, pengecoh halus, waktu terasa sempit. Jangan berkecil hati bila akurasi di bawah 50%.',
  };
  const diffTag = (d) => (d && d !== 'campuran' ? ` <span class="lv lv-${d === 'sangat' ? 4 : 3}">${d === 'sangat' ? 'Sangat sulit' : 'Sulit+'}</span>` : '');
  P.latihan = () => {
    const subsOf = (c) => Object.keys(S.SUBS).filter((s) => S.SUBS[s][1] === c);
    const avail = (s) => S.bankCount(s) + (S.hasGen(s) ? 1 : 0) > 0;
    const stats = S.store.get('stats', {});
    view().innerHTML = `
    <div class="page">
      <header class="page-head"><h1>Latihan per topik</h1><p class="lede">Pilih topik, jumlah soal, dan batas waktu. Cocok untuk menambal kelemahan yang terlihat di hasil simulasi.</p></header>
      <section class="panel builder">
        <div class="field"><span class="field-label">Kategori</span><div class="chips">${Object.entries(S.CATS).map(([c, l]) => `<button type="button" class="chip${builder.cat === c ? ' on' : ''}" data-act="b-cat" data-c="${c}">${l}</button>`).join('')}</div></div>
        <div class="field"><span class="field-label">Topik (boleh lebih dari satu)</span><div class="chips">${subsOf(builder.cat).filter(avail).map((s) => {
          const n = S.bankCount(s);
          return `<button type="button" class="chip${builder.subs.includes(s) ? ' on' : ''}" data-act="b-sub" data-s="${s}" aria-pressed="${builder.subs.includes(s)}">${S.esc(S.subLabel(s))} <span>${S.hasGen(s) ? (n ? n + ' + ∞' : '∞') : n}</span></button>`;
        }).join('')}</div></div>
        <div class="field"><span class="field-label">Jumlah soal</span><div class="chips">${[10, 20, 30, 50].map((n) => `<button type="button" class="chip${builder.n === n ? ' on' : ''}" data-act="b-n" data-n="${n}">${n}</button>`).join('')}</div></div>
        <div class="field"><span class="field-label">Tingkat kesulitan</span><div class="chips">${Object.entries(S.DIFFS).map(([k, [l]]) => `<button type="button" class="chip${builder.diff === k ? ' on' : ''}" data-act="b-diff" data-d="${k}" aria-pressed="${builder.diff === k}">${S.esc(l)}</button>`).join('')}</div>
          <p class="muted small field-help">${DIFF_HELP[builder.diff]}${builder.diff !== 'campuran' && builder.subs.length ? ' ' + hardNote(builder.subs, S.DIFFS[builder.diff][1]) : ''}</p></div>
        <div class="field"><span class="field-label">Waktu</span><div class="chips">${[[0, 'Tanpa batas'], [90, '90 dtk/soal'], [60, '60 dtk/soal'], [40, '40 dtk/soal (ketat)']].map(([t, l]) => `<button type="button" class="chip${builder.t === t ? ' on' : ''}" data-act="b-t" data-t="${t}">${l}</button>`).join('')}</div></div>
        <div class="btn-row"><button type="button" class="btn btn-primary" data-act="b-go" ${builder.subs.length ? '' : 'disabled'}>Mulai latihan</button><span class="muted small">${builder.subs.length ? builder.subs.map(S.subLabel).join(', ') : 'Pilih minimal satu topik'}</span></div>
      </section>
      <h2 class="section-title">Latihan kilat</h2>
      <div class="drill-grid">${S.DRILLS.map(drillCard).join('')}</div>
      <h2 class="section-title">Isi bank soal</h2>
      <p class="muted small">${S.bankTotal.toLocaleString('id-ID')} soal tertulis: ${[1, 2, 3, 4].map((l) => `${S.bankLevels()[l]} ${S.LEVELS[l].toLowerCase()}`).join(' · ')}. Topik bertanda "Ya" juga punya variasi otomatis tak terbatas di keempat tingkat.</p>
      <div class="table-wrap"><table class="bank-table"><thead><tr><th>Topik</th><th>Kategori</th>${[1, 2, 3, 4].map((l) => `<th class="num"><span class="lv lv-${l}">${S.LEVELS[l]}</span></th>`).join('')}<th>Variasi otomatis</th><th>Akurasimu</th></tr></thead><tbody>
        ${Object.keys(S.SUBS).map((s) => { const x = stats[s]; const lv = S.bankLevels(s); return `<tr><td>${S.esc(S.subLabel(s))}</td><td class="muted">${S.CATS[S.subCat(s)]}</td>${[1, 2, 3, 4].map((l) => `<td class="num">${lv[l] || '<span class="muted">–</span>'}</td>`).join('')}<td>${S.hasGen(s) ? 'Ya' : '–'}</td><td>${x && x.n ? `${S.pct(x.b, x.n)}% <span class="muted small">(${x.n})</span>` : '–'}</td></tr>`; }).join('')}
      </tbody></table></div>
    </div>`;
  };
  function hardNote(subs, minL) {
    const n = S.sum(subs.map((s) => { const lv = S.bankLevels(s); return minL >= 4 ? lv[4] : lv[3] + lv[4]; }));
    const gen = subs.filter(S.hasGen).length;
    return `Tersedia ${n} soal tertulis di tingkat ini${gen ? ` + variasi otomatis untuk ${gen === subs.length ? 'semua' : gen} topik terpilih` : ''}.${!gen && n < builder.n ? ' Jika kurang, soal dilengkapi dari tingkat di bawahnya.' : ''}`;
  }
  const drillCard = (d) => `<article class="drill"><strong>${S.esc(d.title)}${diffTag(d.diff)}</strong><span class="muted small">${d.n} soal · ${d.min} menit</span><p class="small">${S.esc(d.why)}</p><button type="button" class="btn btn-small" data-act="drill-id" data-id="${d.id}">Mulai</button></article>`;

  /* ---------- English Booster ---------- */
  let engTab = S.store.get('engTab', 'mulai');
  P.english = () => {
    const tabs = [['mulai', 'Mulai di sini'], ['flash', 'Flashcard kosakata'], ['grammar', '25 aturan grammar'], ['log', 'Catatan salahku']];
    let body = '';
    if (engTab === 'mulai') body = S.md(C['english-booster'] || '') + `<h2 id="latihan-english">Latihan bahasa Inggris</h2><div class="drill-grid">${S.DRILLS.filter((d) => /structure|reading|listening|vocab/.test(d.id)).map(drillCard).join('')}</div>`;
    if (engTab === 'flash') body = '<div class="widget" data-widget="flashcards"></div>';
    if (engTab === 'grammar') body = S.md(C['english-grammar'] || '');
    if (engTab === 'log') body = '<div class="widget" data-widget="error-log"></div>';
    view().innerHTML = `
    <div class="page doc">
      <header class="page-head"><h1>English Booster</h1><p class="lede">Jalur cepat untuk yang merasa lemah di bahasa Inggris: rencana 8 minggu, kosakata dengan pengulangan berjarak, aturan grammar yang paling sering diuji, dan latihan listening bersuara.</p></header>
      <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" class="tab${engTab === k ? ' on' : ''}" aria-selected="${engTab === k}" data-act="eng-tab" data-tab="${k}">${l}</button>`).join('')}</div>
      <article class="md">${body}</article>
    </div>`;
  };

  P.strategi = () => { view().innerHTML = mdPage('strategi-rumus', { route: 'strategi' }); };
  P.analisis = () => { view().innerHTML = mdPage('analisis-ujian', { route: 'analisis' }); };
  P.beasiswa = () => { view().innerHTML = mdPage('tips-beasiswa', { route: 'beasiswa' }); };
  P.penting = () => { view().innerHTML = mdPage('hal-penting', { route: 'penting' }); };
  P.panduan = () => { view().innerHTML = mdPage('panduan', { route: 'panduan' }); };
  P.jalur = () => { view().innerHTML = mdPage('jalur-mba-teknik', { route: 'jalur' }); };

  /* ---------- Riwayat & progres: dasbor perkembangan ---------- */
  const DAY = 86400000;
  const SER = ['verbal', 'kuantitatif', 'penalaran', 'english']; // urutan warna tetap: --s1..--s4
  const dkey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const monday = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
  const accOf = (arr) => { const n = S.sum(arr.map((h) => h.n || 0)); return n ? Math.round((S.sum(arr.map((h) => h.b || 0)) / n) * 100) : null; };
  const fmtKB = (b) => (b >= 1048576 ? (b / 1048576).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
  let rw = { exam: null, filter: 'all', show: 20 };

  P.riwayat = () => {
    const hist = S.history();
    const now = Date.now();
    const days = S.store.get('days', {});
    const stats = S.store.get('stats', {});
    const d30 = hist.filter((h) => h.date >= now - 30 * DAY), dPrev = hist.filter((h) => h.date >= now - 60 * DAY && h.date < now - 30 * DAY);
    const a30 = accOf(d30), aPrev = accOf(dPrev);
    const qIn = (from) => S.sum(Object.entries(days).filter(([k]) => new Date(k + 'T00:00:00').getTime() >= from).map(([, v]) => v));
    const today0 = new Date(); today0.setHours(0, 0, 0, 0);
    const active30 = Object.entries(days).filter(([k, v]) => v > 0 && new Date(k + 'T00:00:00').getTime() > today0.getTime() - 30 * DAY).length;
    const delta = (a, b) => (a == null || b == null ? '<span class="muted">belum ada pembanding</span>' : a === b ? 'sama dengan 30 hari sebelumnya' : `<span class="delta ${a > b ? 'up' : 'down'}">${a > b ? '▲ naik' : '▼ turun'} ${Math.abs(a - b)} poin</span> dari 30 hari sebelumnya`);
    const durable = S.store.durable();
    const lastBk = S.store.get('lastBackup', 0);

    view().innerHTML = `
    <div class="page dash">
      <header class="page-head"><h1>Riwayat & progres</h1><p class="lede">Setiap sesi yang selesai tersimpan otomatis di perangkat ini, jadi perkembanganmu bisa dipantau dari minggu ke minggu tanpa akun dan tanpa internet.</p></header>
      ${durable ? '' : '<div class="callout-inline warn-box" role="alert"><b>Penyimpanan browser tidak tersedia.</b> Kemungkinan kamu memakai mode samaran atau halaman pratinjau. Progres hanya bertahan sampai halaman ditutup. Buka aplikasi di tab biasa (atau pasang di HP) agar riwayat tersimpan.</div>'}
      <section class="kpi-row" aria-label="Ringkasan">
        <div class="kpi"><span class="kpi-label">Sesi selesai</span><strong>${hist.length.toLocaleString('id-ID')}</strong><span class="small muted">${hist.filter((h) => h.date >= now - 7 * DAY).length} dalam 7 hari terakhir</span></div>
        <div class="kpi"><span class="kpi-label">Soal dikerjakan</span><strong>${S.sum(Object.values(days)).toLocaleString('id-ID')}</strong><span class="small muted">${qIn(today0.getTime() - 6 * DAY).toLocaleString('id-ID')} dalam 7 hari terakhir</span></div>
        <div class="kpi"><span class="kpi-label">Akurasi 30 hari</span><strong>${a30 == null ? '–' : a30 + '%'}</strong><span class="small">${delta(a30, aPrev)}</span></div>
        <div class="kpi"><span class="kpi-label">Hari aktif (30 hari)</span><strong>${active30}</strong><span class="small muted">${streak()} hari beruntun</span></div>
      </section>
      ${hist.length ? '' : '<section class="panel empty-state"><h2>Belum ada sesi yang selesai</h2><p>Grafik perkembangan muncul otomatis setelah kamu menyelesaikan simulasi atau latihan. Mulai dengan satu simulasi mini untuk mengukur titik awal.</p><div class="btn-row"><a class="btn btn-primary" href="#simulasi">Pilih simulasi</a><a class="btn" href="#latihan">Latihan per topik</a></div></section>'}
      ${hist.length ? `
      <section class="panel"><div class="panel-head"><h2>Skor simulasi dari waktu ke waktu</h2></div>${scorePanel(hist)}</section>
      <section class="panel"><div class="panel-head"><h2>Akurasi mingguan per kemampuan</h2><span class="muted small">12 minggu terakhir · % jawaban benar</span></div><div class="chart-slot" id="ch-week"></div></section>
      <div class="dash-grid">
        <section class="panel"><div class="panel-head"><h2>Kalender latihan</h2><span class="muted small">jumlah soal per hari, 12 minggu</span></div><div class="chart-slot" id="ch-cal"></div></section>
        <section class="panel"><div class="panel-head"><h2>Akurasi per tingkat kesulitan</h2></div>${levelPanel(hist)}</section>
      </div>
      <section class="panel"><div class="panel-head"><h2>Akurasi per topik</h2><span class="muted small">diurutkan dari yang paling lemah · "terbaru" = 8 sesi terakhir topik itu</span></div>${topicPanel(stats)}</section>
      <section class="panel"><div class="panel-head"><h2>Semua sesi</h2>
        <div class="chips" role="group" aria-label="Saring sesi">${[['all', 'Semua'], ['sim', 'Simulasi'], ['latihan', 'Latihan']].map(([k, l]) => `<button type="button" class="chip${rw.filter === k ? ' on' : ''}" data-act="rw-filter" data-f="${k}" aria-pressed="${rw.filter === k}">${l}</button>`).join('')}</div></div>
        ${sessionTable(hist)}
      </section>` : ''}
      <section class="panel" id="data-panel"><div class="panel-head"><h2>Penyimpanan & cadangan</h2></div>
        <ul class="store-facts">
          <li>Disimpan di: <b>browser perangkat ini</b>${durable ? ` · ±${fmtKB(S.store.size())} terpakai` : ' · <b>tidak aktif</b>'}</li>
          <li>Penyimpanan permanen: <span id="persist-state" class="muted">memeriksa…</span></li>
          <li>Riwayat ringkas disimpan sampai 500 sesi (untuk grafik). Soal, jawaban, dan pembahasan lengkap disimpan untuk 30 sesi terakhir.</li>
          <li>Cadangan terakhir: <b>${lastBk ? S.fmtDateTime(lastBk) : 'belum pernah'}</b>${hist.length >= 5 && (!lastBk || now - lastBk > 14 * DAY) ? ' · <span class="delta down">sebaiknya cadangkan sekarang</span>' : ''}</li>
        </ul>
        <p class="small">Data bisa hilang bila kamu menghapus data situs/riwayat browser, memakai browser lain, atau ganti HP. Unduh file cadangan secara berkala dan pulihkan di perangkat mana pun.</p>
        <div class="btn-row">
          <button type="button" class="btn btn-primary" data-act="export-file">Unduh file cadangan</button>
          <label class="btn file-btn">Pulihkan dari file<input type="file" id="import-file" accept=".json,application/json,text/plain" data-act-change="import-file"></label>
          <button type="button" class="btn" data-act="persist">Aktifkan penyimpanan permanen</button>
        </div>
        <details class="alt-backup"><summary>Cara lain: salin & tempel teks cadangan</summary>
          <p class="small">Berguna untuk mengirim progres lewat chat ke perangkat lain.</p>
          <div class="btn-row"><button type="button" class="btn btn-small" data-act="backup">Salin teks cadangan</button></div>
          <label for="restore-box" class="small">Tempel teks cadangan</label>
          <textarea id="restore-box" rows="3" placeholder="Tempel teks yang diawali SIAPS2: di sini"></textarea>
          <button type="button" class="btn btn-small" data-act="restore">Pulihkan dari teks</button>
        </details>
        <div class="btn-row danger-row"><button type="button" class="btn btn-danger" data-act="wipe-ask">Hapus semua data</button></div>
      </section>
    </div>`;
    drawDash();
    persistLabel();
  };

  function persistLabel() {
    const el = S.$('#persist-state');
    if (!el) return;
    if (!navigator.storage || !navigator.storage.persisted) { el.textContent = 'tidak didukung browser ini (data tetap tersimpan biasa)'; return; }
    navigator.storage.persisted().then((ok) => {
      el.className = ok ? 'delta up' : '';
      el.innerHTML = ok ? '✓ aktif, browser tidak akan menghapusnya otomatis' : 'belum aktif. Browser bisa menghapus data saat memori HP hampir penuh. Pasang aplikasi ke layar utama lalu tekan "Aktifkan penyimpanan permanen".';
    }, () => { el.textContent = 'tidak dapat diperiksa'; });
  }

  /* --- panel skor per ujian --- */
  function scorePanel(hist) {
    const sims = hist.filter((h) => h.examId && h.scaled && typeof h.scaled.value === 'number');
    if (!sims.length) return '<p class="muted">Belum ada simulasi yang selesai. Skor skala tes (misalnya 500 PAPs atau 450 TOEFL ITP) muncul di sini setelah kamu menyelesaikan simulasi.</p>';
    const ids = [...new Set(sims.map((h) => h.examId))].filter((id) => S.examById(id));
    if (!ids.includes(rw.exam)) rw.exam = sims[0].examId;
    return `<div class="chips" role="group" aria-label="Pilih ujian">${ids.map((id) => `<button type="button" class="chip${rw.exam === id ? ' on' : ''}" data-act="rw-exam" data-id="${id}" aria-pressed="${rw.exam === id}">${S.esc(S.examById(id).name)} <span>${sims.filter((h) => h.examId === id).length}</span></button>`).join('')}</div>
      <div class="chart-slot" id="ch-score"></div>`;
  }
  function levelPanel(hist) {
    const tot = { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0] };
    hist.forEach((h) => Object.entries(h.lv || {}).forEach(([l, [b, n]]) => { if (tot[l]) { tot[l][0] += b; tot[l][1] += n; } }));
    if (!S.sum(Object.values(tot).map((x) => x[1]))) return '<p class="muted">Data tingkat kesulitan tercatat untuk sesi yang selesai setelah pembaruan ini.</p>';
    return `<div class="lv-bars">${[1, 2, 3, 4].map((l) => { const [b, n] = tot[l]; const p = n ? Math.round((b / n) * 100) : null; return `<div class="tb"><span><span class="lv lv-${l}">${S.LEVELS[l]}</span></span><div class="ready-bar"><i class="${p == null ? '' : p >= 70 ? 'ok' : p >= 50 ? 'mid' : 'bad'}" style="width:${p || 0}%"></i><b style="left:70%"></b></div><span class="small">${p == null ? '<span class="muted">belum ada</span>' : `${p}% · ${b}/${n}`}</span></div>`; }).join('')}</div>
      <p class="muted small">Garis tipis = 70%. Wajar bila akurasi turun di tingkat lebih tinggi; yang penting trennya naik dari minggu ke minggu. Latih tingkat Sulit lewat pilihan "Sulit ke atas" di Latihan per topik.</p>`;
  }
  function topicPanel(stats) {
    const rows = Object.entries(stats).filter(([, x]) => x.n).map(([s, x]) => {
      const rb = S.sum((x.recent || []).map((r) => r[0])), rn = S.sum((x.recent || []).map((r) => r[1]));
      return { s, n: x.n, p: S.pct(x.b, x.n), rp: rn ? S.pct(rb, rn) : null, avg: Math.round(x.t / x.n) };
    }).sort((a, b) => (a.rp ?? a.p) - (b.rp ?? b.p));
    if (!rows.length) return '<p class="muted">Belum ada data.</p>';
    return `<div class="table-wrap"><table class="topic-table"><thead><tr><th>Topik</th><th class="num">Terbaru</th><th class="num hide-sm">Semua waktu</th><th class="num">Soal</th><th class="num hide-sm">Rata-rata waktu</th><th></th></tr></thead><tbody>
      ${rows.map((x) => { const tr = x.rp == null ? '' : x.rp - x.p >= 5 ? '<span class="delta up" title="membaik">▲</span>' : x.p - x.rp >= 5 ? '<span class="delta down" title="menurun">▼</span>' : ''; const v = x.rp ?? x.p; return `<tr><td>${S.esc(S.subLabel(x.s))}</td><td class="num nowrap"><span class="pill ${v >= 70 ? 'ok' : v >= 50 ? 'mid' : 'bad'}">${v}%</span> ${tr}</td><td class="num hide-sm">${x.p}%</td><td class="num">${x.n}</td><td class="num hide-sm">${x.avg} dtk</td><td><button type="button" class="btn btn-small" data-act="drill" data-sub="${x.s}">Latih</button></td></tr>`; }).join('')}
    </tbody></table></div>`;
  }
  function sessionTable(hist) {
    const have = new Set(S.store.keys().filter((k) => k.startsWith('sess:')).map((k) => k.slice(5)));
    const rows = hist.filter((h) => rw.filter === 'all' || (rw.filter === 'sim' ? h.kind === 'sim' : h.kind !== 'sim'));
    if (!rows.length) return '<p class="muted">Tidak ada sesi untuk saringan ini.</p>';
    const sc = (h) => {
      if (!h.examId || !h.scaled || h.scaled.value == null) return ''; // latihan: skor = persen benar, sudah tampil di kolom Benar
      const t = h.scaled.target;
      const reach = t != null && h.scaled.value >= t;
      return `${h.scaled.value}${h.scaled.unit || ''}${t != null && h.examId ? ` <span class="pill ${reach ? 'ok' : 'mid'}" title="Target ${t}">${reach ? '≥ target' : '< ' + t}</span>` : ''}`;
    };
    return `<div class="table-wrap"><table class="hist-table"><thead><tr><th>Tanggal</th><th>Sesi</th><th class="num">Benar</th><th>Skor</th><th class="num">Durasi</th><th></th></tr></thead><tbody>
      ${rows.slice(0, rw.show).map((h) => `<tr><td class="small nowrap">${S.fmtDateTime(h.date)}</td><td>${S.esc(h.title)}${h.blur ? ` <span class="muted small" title="Berpindah tab/aplikasi saat ujian">· keluar ${h.blur}×</span>` : ''}</td><td class="num nowrap">${h.b}/${h.n} <span class="muted small">(${h.pct}%)</span></td><td class="nowrap">${sc(h)}</td><td class="num small">${S.clock(h.dur || 0)}</td><td>${have.has(h.id) ? `<button type="button" class="btn btn-small" data-act="open-result" data-id="${h.id}">Pembahasan</button>` : '<span class="muted small" title="Detail soal hanya disimpan untuk 30 sesi terakhir">ringkasan</span>'}</td></tr>`).join('')}
    </tbody></table></div>
    ${rows.length > rw.show ? `<div class="btn-row"><button type="button" class="btn btn-small" data-act="rw-more">Tampilkan ${Math.min(20, rows.length - rw.show)} sesi lagi</button><span class="muted small">${rows.length - rw.show} sesi lebih lama</span></div>` : ''}`;
  }

  /* --- grafik (SVG + tooltip) --- */
  const CH = {};
  function slotW(id) { const el = document.getElementById(id); return el ? Math.max(280, Math.floor(el.clientWidth)) : 0; }
  function drawDash() {
    const hist = S.history();
    if (!hist.length) return;
    const sEl = S.$('#ch-score');
    if (sEl) sEl.innerHTML = scoreChart(hist, slotW('ch-score'));
    const wEl = S.$('#ch-week');
    if (wEl) wEl.innerHTML = weekChart(hist, slotW('ch-week'));
    const cEl = S.$('#ch-cal');
    if (cEl) cEl.innerHTML = calendar(hist, slotW('ch-cal'));
    if (!S._tipOutside) {
      S._tipOutside = true;
      document.addEventListener('pointerdown', (e) => {
        if (e.target.closest && e.target.closest('.chart-box')) return;
        S.$$('.chart-tip').forEach((t) => { t.hidden = true; });
        S.$$('.chart2 .xhair').forEach((x) => x.setAttribute('visibility', 'hidden'));
      });
    }
    S.$$('.chart-box').forEach((box) => {
      box.addEventListener('pointermove', chartHover);
      box.addEventListener('pointerdown', chartHover);
      box.addEventListener('pointerleave', chartLeave);
    });
  }
  function niceTicks(lo, hi, count = 4) {
    const span = hi - lo || 1;
    const raw = span / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || raw;
    const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step;
    const out = [];
    for (let v = a; v <= b + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
    return out;
  }
  /** o: { id, w, h, xs:[label], series:[{label, cls, v:[num|null]}], ticks:[num], target, targetLabel, tips:[html], endLabels } */
  function lineSvg(o) {
    const W = o.w, H = o.h || 240;
    const many = o.series.length > 1;
    const L = 40, R = many ? Math.min(118, Math.round(W * 0.26)) : 18, T = 14, B = 28;
    const n = o.xs.length;
    const lo = o.ticks[0], hi = o.ticks[o.ticks.length - 1];
    const x = (i) => L + (n === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (n - 1));
    const y = (v) => T + ((hi - v) * (H - T - B)) / (hi - lo || 1);
    const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor((W - L - R) / 70))));
    let svg = '';
    o.ticks.forEach((t) => { svg += `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text class="axis" x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${t.toLocaleString('id-ID')}</text>`; });
    if (o.target != null && o.target >= lo && o.target <= hi) svg += `<line class="target" x1="${L}" x2="${W - R}" y1="${y(o.target)}" y2="${y(o.target)}"/><text class="axis target-t" x="${L + 4}" y="${y(o.target) - 6}">${S.esc(o.targetLabel || 'target')}</text>`;
    o.xs.forEach((lab, i) => { if (i % every === 0 || i === n - 1) { if (i === n - 1 && i % every !== 0 && (i % every) < every / 2) return; svg += `<text class="axis" x="${x(i)}" y="${H - 8}" text-anchor="${n === 1 ? 'middle' : i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${S.esc(lab)}</text>`; } });
    const ends = [];
    o.series.forEach((s) => {
      let seg = [];
      const segs = [];
      s.v.forEach((v, i) => { if (v == null) { if (seg.length) segs.push(seg); seg = []; } else seg.push([x(i), y(v)]); });
      if (seg.length) segs.push(seg);
      segs.forEach((g) => { if (g.length > 1) svg += `<polyline class="ln ${s.cls}" points="${g.map((p) => p.map((c) => c.toFixed(1)).join(',')).join(' ')}"/>`; });
      s.v.forEach((v, i) => { if (v != null) svg += `<circle class="mk ${s.cls}" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4"/>`; });
      let li = -1; s.v.forEach((v, i) => { if (v != null) li = i; });
      if (li >= 0) ends.push({ s, i: li, y: y(s.v[li]), v: s.v[li] });
    });
    if (many) {
      // label langsung di ujung garis, digeser agar tidak bertumpuk
      ends.sort((a, b) => a.y - b.y);
      for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 14) ends[k].y = ends[k - 1].y + 14;
      const over = ends.length ? ends[ends.length - 1].y - (H - B) : 0;
      if (over > 0) ends.forEach((e) => (e.y -= over));
      ends.forEach((e) => { svg += `<text class="end-label" x="${W - R + 8}" y="${(e.y + 4).toFixed(1)}"><tspan class="sw ${e.s.cls}">●</tspan> ${S.esc(e.s.short || e.s.label)} ${e.v}%</text>`; });
    } else if (ends.length) {
      const e = ends[0];
      svg += `<text class="end-label strong" x="${Math.min(x(e.i), W - R - 2)}" y="${(e.y - 10).toFixed(1)}" text-anchor="${n === 1 ? 'middle' : 'end'}">${e.v.toLocaleString('id-ID')}</text>`;
    }
    svg += `<line class="xhair" x1="0" x2="0" y1="${T}" y2="${H - B}" visibility="hidden"/>`;
    svg += `<rect class="hit" x="${L - 10}" y="0" width="${W - L - R + 20}" height="${H}" fill="transparent"/>`;
    CH[o.id] = { xs: o.xs.map((_, i) => x(i)), tips: o.tips, W };
    return `<div class="chart-box" data-chart="${o.id}"><svg class="chart2" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${S.esc(o.aria || '')}">${svg}</svg><div class="chart-tip" role="status" hidden></div></div>`;
  }
  function scoreChart(hist, w) {
    const exam = S.examById(rw.exam);
    const rows = hist.filter((h) => h.examId === rw.exam && h.scaled && typeof h.scaled.value === 'number').slice(0, 30).reverse();
    if (!rows.length || !exam) return '';
    const last = rows[rows.length - 1].scaled;
    const vmin = last.min != null ? last.min : Math.min(...rows.map((h) => h.scaled.value));
    const vmax = last.max != null ? last.max : Math.max(...rows.map((h) => h.scaled.value));
    const target = exam.target != null ? exam.target : last.target;
    const vals = rows.map((h) => h.scaled.value);
    const pad = (vmax - vmin) * 0.08;
    const lo = Math.max(vmin, Math.min(...vals, target ?? Infinity) - pad), hi = Math.min(vmax, Math.max(...vals, target ?? -Infinity) + pad);
    const ticks = niceTicks(lo, hi, 4).filter((t, i, a) => (t >= vmin - 1e-9 && t <= vmax + 1e-9) || i === 0 || i === a.length - 1);
    const unit = last.unit || '';
    const best = Math.max(...vals);
    const first = vals[0], lastV = vals[vals.length - 1];
    const svg = lineSvg({
      id: 'score', w, h: 250, xs: rows.map((h) => S.fmtDate(h.date).replace(/ \d{4}$/, '')),
      series: [{ label: exam.name, cls: 's1', v: vals }], ticks, target, targetLabel: target != null ? `target ${target}${unit}` : '',
      aria: `Skor ${exam.name} dari ${rows.length} simulasi, terakhir ${lastV}${unit}`,
      tips: rows.map((h) => `<b>${h.scaled.value.toLocaleString('id-ID')}${S.esc(h.scaled.unit || '')}</b> <span class="muted">· ${h.pct}% benar</span><br>${S.esc(h.title)}<br><span class="muted">${S.fmtDateTime(h.date)}</span>`),
    });
    const tbl = `<details class="table-view"><summary>Lihat sebagai tabel</summary><div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Sesi</th><th class="num">Skor</th><th class="num">Benar</th></tr></thead><tbody>${rows.slice().reverse().map((h) => `<tr><td class="small">${S.fmtDateTime(h.date)}</td><td>${S.esc(h.title)}</td><td class="num">${h.scaled.value}${S.esc(h.scaled.unit || '')}</td><td class="num">${h.pct}%</td></tr>`).join('')}</tbody></table></div></details>`;
    const sum = rows.length > 1
      ? `<p class="small">Terakhir <b>${lastV}${unit}</b>, terbaik <b>${best}${unit}</b>, ${lastV > first ? `naik <b>${Math.round((lastV - first) * 10) / 10}</b>` : lastV < first ? `turun <b>${Math.round((first - lastV) * 10) / 10}</b>` : 'sama'} dibanding simulasi pertama.${target != null ? ` ${lastV >= target ? 'Sudah di atas target.' : `Kurang <b>${Math.round((target - lastV) * 10) / 10}</b> dari target.`}` : ''}</p>`
      : `<p class="small">Skor <b>${lastV}${unit}</b>. Selesaikan simulasi ini lagi untuk melihat trennya.</p>`;
    return sum + svg + `<p class="muted small">Skor simulasi adalah perkiraan berdasarkan aturan penilaian tiap tes (lihat "Cara skor dihitung" di halaman hasil). Sesi mini dan mode sulit ikut ditampilkan; arahkan kursor atau ketuk titik untuk detail.</p>` + tbl;
  }
  function weekChart(hist, w) {
    const start = monday(Date.now() - 11 * 7 * DAY).getTime();
    const weeks = Array.from({ length: 12 }, (_, i) => start + i * 7 * DAY);
    const agg = weeks.map(() => Object.fromEntries(SER.map((c) => [c, [0, 0]])));
    hist.forEach((h) => {
      if (h.date < start || !h.cats) return;
      const wi = Math.min(11, Math.floor((monday(h.date).getTime() - start) / (7 * DAY) + 0.01));
      if (wi < 0) return;
      Object.entries(h.cats).forEach(([c, [b, n]]) => { if (agg[wi][c]) { agg[wi][c][0] += b; agg[wi][c][1] += n; } });
    });
    const val = (wi, c) => (agg[wi][c][1] ? Math.round((agg[wi][c][0] / agg[wi][c][1]) * 100) : null);
    const SHORT = { verbal: 'Verbal', kuantitatif: 'Kuant.', penalaran: 'Nalar', english: 'Inggris' };
    const series = SER.map((c, k) => ({ label: S.CATS[c], short: SHORT[c], cls: 's' + (k + 1), v: weeks.map((_, wi) => val(wi, c)) })).filter((s) => s.v.some((v) => v != null));
    if (!series.length) return '<p class="muted">Belum ada sesi dalam 12 minggu terakhir yang memiliki rincian kategori.</p>';
    const lab = (ts) => new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const legend = `<div class="legend" aria-hidden="true">${series.map((s) => `<span><i class="sw-dot ${s.cls}"></i>${S.esc(s.label)}</span>`).join('')}</div>`;
    const svg = lineSvg({
      id: 'week', w, h: 250, xs: weeks.map(lab), series, ticks: [0, 25, 50, 75, 100], target: 70, targetLabel: '70%',
      aria: 'Akurasi mingguan per kemampuan selama 12 minggu',
      tips: weeks.map((ts, wi) => `<b>Minggu ${lab(ts)}</b>${series.map((s) => { const c = SER[+s.cls.slice(1) - 1]; const [b, n] = agg[wi][c]; return `<br><i class="sw-dot ${s.cls}"></i> ${S.esc(s.label)}: ${n ? `<b>${Math.round((b / n) * 100)}%</b> <span class="muted">(${b}/${n})</span>` : '<span class="muted">tidak berlatih</span>'}`; }).join('')}`),
    });
    const tbl = `<details class="table-view"><summary>Lihat sebagai tabel</summary><div class="table-wrap"><table><thead><tr><th>Minggu mulai</th>${series.map((s) => `<th class="num">${S.esc(s.label)}</th>`).join('')}</tr></thead><tbody>${weeks.map((ts, wi) => `<tr><td>${lab(ts)}</td>${series.map((s) => { const c = SER[+s.cls.slice(1) - 1]; const [b, n] = agg[wi][c]; return `<td class="num">${n ? `${Math.round((b / n) * 100)}% <span class="muted small">(${n})</span>` : '–'}</td>`; }).join('')}</tr>`).reverse().join('')}</tbody></table></div></details>`;
    return legend + svg + '<p class="muted small">Titik tanpa garis penghubung berarti ada minggu tanpa latihan di kemampuan itu. Garis putus-putus = target aman 70%.</p>' + tbl;
  }
  function calendar(hist, w) {
    const days = S.store.get('days', {});
    const sessBy = {};
    hist.forEach((h) => { const k = dkey(new Date(h.date)); sessBy[k] = (sessBy[k] || 0) + 1; });
    const first = monday(Date.now() - 11 * 7 * DAY);
    const cols = 12;
    const lw = 30, th = 18;
    const cell = Math.max(12, Math.min(22, Math.floor((w - lw) / cols) - 3)), gap = 3;
    const W = lw + cols * (cell + gap), H = th + 7 * (cell + gap) + 30;
    const lvl = (n) => (!n ? 0 : n <= 10 ? 1 : n <= 25 ? 2 : n <= 50 ? 3 : 4);
    let svg = '';
    ['Sen', '', 'Rab', '', 'Jum', '', 'Min'].forEach((d, r) => { if (d) svg += `<text class="axis" x="0" y="${th + r * (cell + gap) + cell - 2}">${d}</text>`; });
    const tips = [], xs = [];
    let lastMonth = -1;
    const today = dkey(new Date());
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 7; r++) {
        const d = new Date(first); d.setDate(first.getDate() + c * 7 + r);
        const k = dkey(d);
        if (r === 0 && d.getMonth() !== lastMonth) { svg += `<text class="axis" x="${lw + c * (cell + gap)}" y="11">${d.toLocaleDateString('id-ID', { month: 'short' })}</text>`; lastMonth = d.getMonth(); }
        if (k > today) continue;
        const n = days[k] || 0;
        const L = lvl(n);
        const idx = tips.length;
        tips.push(`<b>${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</b><br>${n ? `${n} soal · ${sessBy[k] || 0} sesi` : '<span class="muted">tidak berlatih</span>'}`);
        xs.push(lw + c * (cell + gap) + cell / 2);
        svg += `<rect class="cal-cell c${L}${k === today ? ' today' : ''}" data-i="${idx}" x="${lw + c * (cell + gap)}" y="${th + r * (cell + gap)}" width="${cell}" height="${cell}" rx="3"><title>${d.toLocaleDateString('id-ID')}: ${n} soal</title></rect>`;
      }
    }
    const ly = th + 7 * (cell + gap) + 14;
    svg += `<text class="axis" x="${lw}" y="${ly + 9}">Sedikit</text>${[0, 1, 2, 3, 4].map((L, i) => `<rect class="cal-cell c${L}" x="${lw + 46 + i * 15}" y="${ly}" width="11" height="11" rx="2"/>`).join('')}<text class="axis" x="${lw + 46 + 5 * 15 + 4}" y="${ly + 9}">Banyak</text>`;
    CH.cal = { tips, cells: true };
    const tot = S.sum(Object.entries(days).filter(([k]) => k >= dkey(first)).map(([, v]) => v));
    return `<div class="chart-box" data-chart="cal"><svg class="chart2 cal" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Kalender latihan 12 minggu, total ${tot} soal">${svg}</svg><div class="chart-tip" role="status" hidden></div></div>
      <p class="muted small">${tot.toLocaleString('id-ID')} soal dalam 12 minggu. Skala: 1–10, 11–25, 26–50, lebih dari 50 soal per hari. Konsistensi harian lebih penting daripada sesi panjang sesekali.</p>`;
  }
  function chartHover(e) {
    const box = e.target.closest && e.target.closest('.chart-box');
    if (!box) return;
    const c = CH[box.dataset.chart];
    if (!c) return;
    const tip = box.querySelector('.chart-tip');
    const svg = box.querySelector('svg');
    const rect = svg.getBoundingClientRect();
    const bRect = box.getBoundingClientRect();
    let i, px;
    if (c.cells) {
      const cellEl = e.target.closest('.cal-cell[data-i]');
      if (!cellEl) { tip.hidden = true; return; }
      i = +cellEl.dataset.i;
      const r2 = cellEl.getBoundingClientRect();
      px = r2.left + r2.width / 2 - bRect.left;
      tip.style.top = (r2.top - bRect.top - 8) + 'px';
      tip.classList.add('above');
    } else {
      const vx = ((e.clientX - rect.left) * c.W) / rect.width;
      i = 0; let best = Infinity;
      c.xs.forEach((xx, k) => { const d = Math.abs(xx - vx); if (d < best) { best = d; i = k; } });
      const xh = svg.querySelector('.xhair');
      xh.setAttribute('x1', c.xs[i]); xh.setAttribute('x2', c.xs[i]); xh.setAttribute('visibility', 'visible');
      px = (c.xs[i] * rect.width) / c.W + (rect.left - bRect.left);
      tip.style.top = '6px';
      tip.classList.remove('above');
    }
    tip.innerHTML = c.tips[i];
    tip.hidden = false;
    const tw = tip.offsetWidth;
    const left = Math.max(0, Math.min(box.clientWidth - tw, px - tw / 2));
    tip.style.left = left + 'px';
    if (!c.cells) tip.style.left = (px + 14 + tw > box.clientWidth ? Math.max(0, px - 14 - tw) : px + 14) + 'px';
  }
  function chartLeave(e) {
    if (e.pointerType === 'touch') return; // di layar sentuh, tooltip tetap terlihat sampai mengetuk di luar grafik
    const box = e.target.closest && e.target.closest('.chart-box');
    if (!box) return;
    const tip = box.querySelector('.chart-tip'); if (tip) tip.hidden = true;
    const xh = box.querySelector('.xhair'); if (xh) xh.setAttribute('visibility', 'hidden');
  }

  /* --- impor/ekspor file --- */
  function exportData() {
    const data = {};
    S.store.keys().forEach((k) => { if (k !== 'active') data[k] = S.store.get(k); });
    return { app: 'siap-s2', format: 1, exported: new Date().toISOString(), sessions: (data.hist || []).length, data };
  }
  let pendingImport = null;
  function askImport(obj) {
    const data = obj && obj.app === 'siap-s2' && obj.data ? obj.data : obj;
    if (!data || typeof data !== 'object' || !('hist' in data || 'stats' in data || 'days' in data || 'srs' in data)) { S.toast('File ini bukan cadangan Siap S2.', 'warn'); return; }
    pendingImport = data;
    const n = (data.hist || []).length;
    const cur = S.history().length;
    const when = obj.exported ? S.fmtDateTime(obj.exported) : 'tidak diketahui';
    S.modal(`<h3>Pulihkan cadangan?</h3><p>Cadangan dibuat: <b>${S.esc(when)}</b><br>Berisi <b>${n}</b> sesi. Perangkat ini sekarang menyimpan <b>${cur}</b> sesi.</p>
      <ul class="rules"><li><b>Gabungkan</b>: riwayat sesi dari kedua sumber disatukan (sesi yang sama tidak dobel). Statistik topik, flashcard, dan pengaturan memakai nilai dari cadangan.</li><li><b>Ganti</b>: semua data di perangkat ini diganti persis dengan isi cadangan.</li></ul>
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-act="modal-close">Batal</button><button type="button" class="btn" data-act="import-go" data-mode="replace">Ganti</button><button type="button" class="btn btn-primary" data-act="import-go" data-mode="merge">Gabungkan</button></div>`);
  }
  function applyImport(mode) {
    const data = pendingImport; pendingImport = null;
    if (!data) return;
    if (mode === 'replace') S.store.keys().forEach((k) => { if (k !== 'active') S.store.del(k); });
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'active') return;
      if (mode === 'merge' && k === 'hist') {
        const map = new Map();
        [...(v || []), ...S.history()].forEach((h) => { if (h && h.id && !map.has(h.id)) map.set(h.id, h); });
        S.store.set('hist', [...map.values()].sort((a, b) => b.date - a.date).slice(0, 500));
        return;
      }
      if (mode === 'merge' && k === 'days') {
        const cur = S.store.get('days', {});
        Object.entries(v || {}).forEach(([d, n]) => { cur[d] = Math.max(cur[d] || 0, n); });
        S.store.set('days', cur);
        return;
      }
      S.store.set(k, v);
    });
    S.migrateHistory();
    S.closeModal();
    S.toast(mode === 'merge' ? 'Cadangan digabungkan.' : 'Data dipulihkan dari cadangan.');
    P.riwayat(); mountWidgets();
  }

  P.ujian = () => {
    const a = S.active();
    if (!a) { view().innerHTML = `<div class="page"><h1>Tidak ada ujian yang sedang berjalan</h1><p>Pilih simulasi atau latihan untuk memulai.</p><div class="btn-row"><a class="btn btn-primary" href="#simulasi">Simulasi ujian</a><a class="btn" href="#latihan">Latihan per topik</a></div></div>`; return; }
    S.runExam(a);
  };
  let rFilter = 'all';
  P.hasil = () => { S.renderResult(S.loadSession(S.store.get('viewResult', '')), rFilter); };

  /* ================= widget ================= */
  const W = {};
  W.heatmap = (el) => {
    const exams = S.EXAMS;
    const share = exams.map((ex) => { const tot = S.sum(ex.sections.map((s) => S.sum(s.draw.map((d) => d[1])))); const m = {}; ex.sections.forEach((s) => s.draw.forEach(([sub, n]) => (m[sub] = (m[sub] || 0) + n))); Object.keys(m).forEach((k) => (m[k] = Math.round((m[k] / tot) * 100))); return m; });
    const rows = Object.keys(S.SUBS).filter((s) => share.some((m) => m[s]));
    el.innerHTML = `<div class="table-wrap"><table class="heat"><thead><tr><th>Topik</th>${exams.map((e) => `<th>${S.esc(e.name)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((s) => `<tr><td>${S.esc(S.subLabel(s))}</td>${share.map((m) => `<td style="--h:${Math.min(1, (m[s] || 0) / 30)}" class="${m[s] ? '' : 'zero'}">${m[s] ? m[s] + '%' : '·'}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div><p class="muted small">Persentase = porsi topik dalam simulasi aplikasi ini, disusun dari kisi-kisi publik. Warna lebih pekat = porsi lebih besar.</p>`;
  };
  W.drills = (el) => { el.innerHTML = `<div class="drill-grid">${S.DRILLS.map(drillCard).join('')}</div>`; };
  W['exam-cards'] = (el) => { el.innerHTML = `<div class="exam-mini-grid">${S.EXAMS.map((ex) => { const st = examStats(ex); return `<a class="exam-mini" href="#simulasi" data-act="goto-exam" data-id="${ex.id}"><span class="kampus">${S.esc(ex.kampus)}</span><strong>${S.esc(ex.name)}</strong><span class="muted small">${st.n} soal · ${st.m} menit</span></a>`; }).join('')}</div>`; };
  S.DRILLS.forEach((d) => { W['drill-' + d.id] = (el) => { el.innerHTML = `<div class="drill inline-drill"><div><strong>Coba sekarang: ${S.esc(d.title)}</strong><span class="muted small"> · ${d.n} soal · ${d.min} menit</span></div><button type="button" class="btn btn-small btn-primary" data-act="drill-id" data-id="${d.id}">Mulai latihan</button></div>`; }; });

  W.checklist = (el) => {
    const st = S.store.get('checklist', {});
    el.innerHTML = S.CHECKLIST.map((g, gi) => `<div class="check-group"><h4>${S.esc(g.g)}</h4>${g.items.map((it, ii) => { const id = `c${gi}-${ii}`; return `<label class="check-item"><input type="checkbox" id="${id}" data-act="check" data-id="${id}" ${st[id] ? 'checked' : ''}><span>${S.esc(it)}</span></label>`; }).join('')}</div>`).join('') +
      `<p class="muted small">${Object.values(st).filter(Boolean).length} dari ${S.sum(S.CHECKLIST.map((g) => g.items.length))} selesai · tersimpan di browser ini.</p>`;
  };
  const ENG_TARGETS = [
    ['MBA FEB UGM (Reguler)', 475, 'TOEFL ITP 475 · AcEPT 216 · IELTS 5.0'],
    ['Patokan aman umum (ITB, Magister Teknik UGM)', 500, 'ITB memakai ELPT ITB (skala sendiri); 500 setara ITP sebagai patokan'],
    ['International MBA FEB UGM', 525, 'TOEFL ITP 525 · AcEPT 276 · IELTS 6.0'],
    ['Magister Manajemen FEB UI', 550, 'Diuji di SIMAK; laman FEB menyebut 500–550 (pakai 550 agar aman)'],
  ];
  W['skor-gap'] = (el) => {
    const prof = S.store.get('profile', {});
    const sc = +prof.eng || null;
    el.innerHTML = `<div class="gap">
      <form class="gap-form" id="gap-form">
        <label for="eng-score">Skor terakhir (TOEFL ITP, ProTEFL, atau tes setara, skala 310–677)</label>
        <div class="gap-row"><input id="eng-score" name="eng" type="number" min="310" max="677" inputmode="numeric" placeholder="misalnya 427" value="${sc || ''}"><button class="btn btn-primary btn-small" type="submit">Hitung selisih</button></div>
      </form>
      ${sc ? `<div class="table-wrap"><table><thead><tr><th>Target</th><th>Syarat</th><th>Selisih</th><th>Perkiraan latihan</th></tr></thead><tbody>
        ${ENG_TARGETS.map(([n, t, d]) => { const g = t - sc; return `<tr><td>${S.esc(n)}<br><span class="muted small">${S.esc(d)}</span></td><td>${t}</td><td><span class="pill ${g <= 0 ? 'ok' : g <= 50 ? 'mid' : 'bad'}">${g <= 0 ? 'terpenuhi' : '+' + g}</span></td><td class="small">${g <= 0 ? 'Pertahankan, naikkan lagi untuk bersaing' : `±${Math.ceil(g / 10)}–${Math.ceil(g / 5)} minggu`}</td></tr>`; }).join('')}
      </tbody></table></div>
      <p class="muted small">Perkiraan kasar dengan asumsi kenaikan 5–10 poin per minggu bila berlatih 60–90 menit setiap hari. Hasil tiap orang berbeda; pantau lewat simulasi mini ELPT/TOEFL ITP setiap 2 minggu.</p>` : '<p class="muted small">Masukkan skor untuk melihat selisih terhadap syarat program.</p>'}
    </div>`;
  };
  W.timeline = (el) => { el.innerHTML = `<ol class="timeline">${S.TIMELINE.map(([t, d]) => `<li><b>${S.esc(t)}</b><span>${S.esc(d)}</span></li>`).join('')}</ol>`; };

  let iv = { i: null, cat: 'Semua', t0: null, timer: null };
  W.interview = (el) => {
    const cats = ['Semua', ...new Set(S.INTERVIEW.map((x) => x.cat))];
    const notes = S.store.get('ivNotes', {});
    const q = iv.i != null ? S.INTERVIEW[iv.i] : null;
    el.innerHTML = `<div class="iv">
      <div class="chips">${cats.map((c) => `<button type="button" class="chip${iv.cat === c ? ' on' : ''}" data-act="iv-cat" data-c="${S.esc(c)}">${S.esc(c)}</button>`).join('')}</div>
      <div class="iv-card">${q ? `<p class="iv-cat">${S.esc(q.cat)}</p><p class="iv-q">${S.esc(q.q)}</p>
        <details><summary>Apa yang dinilai panel?</summary><p>${S.esc(q.hint)}</p></details>
        <div class="iv-timer"><span id="iv-clock">${iv.t0 ? S.clock((Date.now() - iv.t0) / 1000) : '00:00'}</span><button type="button" class="btn btn-small" data-act="iv-time">${iv.t0 ? 'Berhenti' : 'Mulai jawab (target 2 menit)'}</button></div>
        <label for="iv-note" class="small">Poin jawabanmu (tersimpan otomatis)</label>
        <textarea id="iv-note" rows="4" data-act-input="iv-note" placeholder="Tulis poin-poin: situasi, tindakan, hasil, kaitan dengan rencana studi…">${S.esc(notes[iv.i] || '')}</textarea>`
        : '<p class="iv-q">Tekan tombol di bawah untuk mendapat pertanyaan acak, lalu jawab dengan suara keras sambil diberi waktu.</p>'}
        <div class="btn-row"><button type="button" class="btn btn-primary" data-act="iv-next">${q ? 'Pertanyaan lain' : 'Beri saya pertanyaan'}</button></div>
      </div>
      <p class="muted small">${S.INTERVIEW.length} pertanyaan yang sering muncul dalam wawancara beasiswa. ${Object.keys(notes).length} sudah kamu siapkan jawabannya.</p>
    </div>`;
  };

  /* ---------- flashcard SRS (sistem Leitner) ---------- */
  const SRS = {
    INT: [0, 1, 2, 4, 7, 15, 30],
    st: () => S.store.get('srs', {}),
    newToday() { const x = S.store.get('srsNew', { d: 0, n: 0 }); return x.d === S.dayNum() ? x.n : 0; },
    limit: () => S.store.get('srsLimit', 15),
    dueCount() { const st = this.st(); const d = S.dayNum(); return V.filter((w) => st[w[0]] && st[w[0]].d <= d).length; },
    queue() {
      const st = this.st(); const d = S.dayNum();
      const due = V.filter((w) => st[w[0]] && st[w[0]].d <= d);
      const fresh = V.filter((w) => !st[w[0]]).slice(0, Math.max(0, this.limit() - this.newToday()));
      return [...due, ...fresh];
    },
    grade(word, g) {
      const st = this.st(); const d = S.dayNum();
      const isNew = !st[word];
      const b = st[word] ? st[word].b : 0;
      const nb = g === 'lupa' ? 1 : g === 'ragu' ? Math.max(1, b) : Math.min(6, b + 1);
      st[word] = { b: nb, d: d + (g === 'lupa' ? 0 : g === 'ragu' ? 1 : this.INT[nb]) };
      S.store.set('srs', st);
      if (isNew) S.store.set('srsNew', { d, n: this.newToday() + 1 });
    },
  };
  let fc = { flip: false, skip: [] };
  W.flashcards = (el) => {
    const st = SRS.st();
    const q = SRS.queue().filter((w) => !fc.skip.includes(w[0]));
    const learned = Object.values(st).filter((x) => x.b >= 3).length;
    const w = q[0];
    const hi = (ex, word) => S.esc(ex).replace(new RegExp(`\\b(${word}\\w*)`, 'i'), '<b>$1</b>');
    el.innerHTML = `<div class="fc">
      <div class="fc-stats"><span><b>${q.length}</b> kartu hari ini</span><span><b>${learned}</b> dikuasai</span><span><b>${Object.keys(st).length}</b>/${V.length} pernah dipelajari</span>
        <label class="small">Kata baru per hari <select id="srs-limit" data-act-change="srs-limit">${[10, 15, 25, 40].map((n) => `<option ${n === SRS.limit() ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
      ${w ? `<div class="fc-card${fc.flip ? ' flipped' : ''}">
          <div class="fc-word"><span>${S.esc(w[0])}</span><em>${S.esc(w[1])}</em>${S.tts.ok ? `<button type="button" class="btn btn-small" data-act="say" data-text="${S.esc(w[0])}" aria-label="Dengarkan pelafalan">Dengar</button>` : ''}</div>
          <p class="fc-ex">"${hi(w[4], w[0])}"</p>
          ${fc.flip ? `<div class="fc-back"><p><b>Arti:</b> ${S.esc(w[3])}</p><p><b>Sinonim:</b> ${S.esc(w[2])}</p>${S.tts.ok ? `<button type="button" class="linklike" data-act="say" data-text="${S.esc(w[4])}">Dengar kalimat contoh</button>` : ''}</div>
            <div class="btn-row fc-grade"><button type="button" class="btn btn-danger-soft" data-act="srs" data-g="lupa" data-w="${S.esc(w[0])}">Lupa</button><button type="button" class="btn" data-act="srs" data-g="ragu" data-w="${S.esc(w[0])}">Ragu</button><button type="button" class="btn btn-primary" data-act="srs" data-g="hafal" data-w="${S.esc(w[0])}">Hafal</button></div>`
            : `<div class="btn-row"><button type="button" class="btn btn-primary" data-act="fc-flip">Tampilkan arti</button></div><p class="muted small">Tebak artinya dulu dalam hati, baru buka.</p>`}
        </div>`
        : `<div class="fc-card done"><p><b>Kartu hari ini selesai.</b> Kembali besok: kata yang "hafal" akan muncul lagi dengan jarak makin panjang (1, 2, 4, 7, 15, 30 hari).</p><button type="button" class="btn" data-act="drill-id" data-id="kilat-vocab">Uji dengan 20 soal vocabulary</button></div>`}
    </div>`;
  };
  W['error-log'] = (el) => {
    const out = [];
    for (const h of S.history().slice(0, 30)) {
      const s = S.loadSession(h.id);
      if (!s || !s.res) continue;
      s.q.forEach((q, i) => { if (q.c === 'english' && s.res.correct[i] !== true && out.length < 40) out.push({ q, a: s.ans[i], key: S.dec(q.k), date: h.date }); });
      if (out.length >= 40) break;
    }
    if (!out.length) { el.innerHTML = '<p class="muted">Belum ada catatan. Soal bahasa Inggris yang salah atau kosong dari simulasi dan latihan akan terkumpul di sini sebagai bahan ulangan.</p>'; return; }
    el.innerHTML = `<p class="small">${out.length} soal bahasa Inggris terakhir yang salah/kosong. Baca pembahasannya, lalu ulangi sebagai latihan.</p>
      <div class="btn-row"><button type="button" class="btn btn-primary" data-act="retry-english">Ulangi semua sebagai latihan</button></div>
      ${out.map((x) => `<article class="rev bad"><div class="rev-head"><span class="muted small">${S.esc(S.subLabel(x.q.s))} · ${S.fmtDate(x.date)}</span></div><div class="qstem en">${x.q.qh || x.q.gen ? x.q.q : S.rich(x.q.q)}</div>
        <p class="small">Jawabanmu: <b>${x.a == null ? 'kosong' : LET[x.a] + '. ' + S.esc(x.q.o[x.a].replace(/<[^>]+>/g, ''))}</b> · Kunci: <b>${LET[x.key.a]}. ${S.esc(String(x.q.o[x.key.a]).replace(/<[^>]+>/g, ''))}</b></p>
        <div class="explain">${S.rich(x.key.e)}</div></article>`).join('')}`;
    S._retryEnglish = out.map((x) => x.q);
  };
  function mountWidgets(root = view()) {
    S.$$('.widget[data-widget]', root).forEach((el) => { const f = W[el.dataset.widget]; if (f) f(el); else el.innerHTML = ''; });
  }
  const remount = (name) => S.$$(`.widget[data-widget="${name}"]`).forEach((el) => W[name](el));

  /* ================= aksi ================= */
  function startExamAsk(id, mini) {
    const ex = S.examById(id);
    const st = examStats(ex, mini);
    const pen = ex.sections.some((s) => s.scoring && s.scoring[1] < 0);
    const act = S.active();
    S.modal(`<h3>${S.esc(ex.name)}${mini ? ' (mini)' : ''}</h3>
      <p>${st.n} soal · ${st.m} menit · ${ex.sections.length} bagian</p>
      <ul class="rules">
        <li>${ex.timing === 'section' ? 'Setiap bagian punya waktu sendiri. Saat waktu bagian habis, kamu otomatis pindah ke bagian berikutnya dan bagian sebelumnya terkunci.' : 'Satu timer untuk seluruh tes. Kamu bebas berpindah antarbagian.'}</li>
        <li>Timer tidak bisa dijeda dan tetap berjalan walau halaman ditutup.</li>
        ${pen ? '<li>Bagian TPA memakai nilai <b>+4 benar, −1 salah, 0 kosong</b>.</li>' : '<li>Tidak ada nilai minus.</li>'}
        <li>Berpindah tab atau aplikasi akan tercatat, seperti pengawasan ujian daring.</li>
        <li>Kunci jawaban dan pembahasan hanya terbuka setelah jawaban dikumpulkan.</li>
        ${ex.sections.some((s) => s.draw.some((d) => d[0] === 'listening')) ? '<li>Bagian listening memakai suara browser. Siapkan earphone; audio hanya bisa diputar sekali.</li>' : ''}
      </ul>
      <fieldset class="diff-pick"><legend>Tingkat kesulitan</legend>
        ${Object.entries(S.DIFFS).map(([k, [l]], i) => `<label class="radio"><input type="radio" name="exam-diff" value="${k}" ${i === 0 ? 'checked' : ''}><span><b>${S.esc(l)}</b><br><span class="muted small">${DIFF_HELP[k]}</span></span></label>`).join('')}
      </fieldset>
      ${act ? `<p class="callout-inline">Sesi "<b>${S.esc(act.title)}</b>" yang belum selesai akan dibatalkan.</p>` : ''}
      <div class="modal-actions"><button type="button" class="btn btn-ghost" data-act="modal-close">Nanti saja</button><button type="button" class="btn btn-primary" data-act="start-exam-go" data-id="${id}" data-mini="${mini ? 1 : 0}">Mulai sekarang</button></div>`);
  }
  function startPractice(o) {
    S.discardActive();
    const sess = S.createPractice(o);
    if (!sess.q.length) { S.toast('Soal untuk topik ini belum tersedia.', 'warn'); return; }
    S.store.set('active', sess);
    if (location.hash === '#ujian') S.route(); else location.hash = '#ujian';
  }
  const ACT = {
    'modal-close': () => S.closeModal(),
    'start-exam': (el) => startExamAsk(el.dataset.id, el.dataset.mini === '1'),
    'start-exam-go': (el) => {
      const pick = S.$('input[name="exam-diff"]:checked');
      S.closeModal();
      S.discardActive();
      const sess = S.createExam(S.examById(el.dataset.id), { mini: el.dataset.mini === '1', diff: pick ? pick.value : 'campuran' });
      S.store.set('active', sess);
      if (location.hash === '#ujian') S.route(); else location.hash = '#ujian';
    },
    'goto-exam': (el) => { S._scrollTo = 'exam-' + el.dataset.id; },
    'goto-data': () => { S._scrollTo = 'data-panel'; },
    quick: () => startPractice({ title: 'Latihan kilat campuran', subs: ['deret', 'sinonim', 'silogisme', 'soal-cerita', 'analogi', 'structure'], n: 18, min: 15 }),
    drill: (el) => startPractice({ title: 'Latihan: ' + S.subLabel(el.dataset.sub), subs: [el.dataset.sub], n: 15, min: 15 }),
    'drill-id': (el) => { const d = S.DRILLS.find((x) => x.id === el.dataset.id); if (d) startPractice({ title: d.title, subs: d.subs, n: d.n, min: d.min, diff: d.diff || 'campuran' }); },
    'retry-wrong': () => {
      const s = S.loadSession(S.store.get('viewResult', ''));
      if (!s) return;
      const qs = s.q.filter((_, i) => s.res.correct[i] !== true);
      startPractice({ title: 'Ulang soal salah: ' + s.title, questions: qs, min: Math.max(5, Math.round(qs.length * 1.2)) });
    },
    'retry-english': () => { if (S._retryEnglish && S._retryEnglish.length) startPractice({ title: 'Ulang catatan salah bahasa Inggris', questions: S._retryEnglish, min: Math.round(S._retryEnglish.length * 1.2) }); },
    rfilter: (el) => { rFilter = el.dataset.f; P.hasil(); const r = S.$('.review-head'); r && r.scrollIntoView({ block: 'start' }); },
    jump: (el) => {
      let t = S.$('#rev-' + el.dataset.i);
      if (!t) { rFilter = 'all'; P.hasil(); t = S.$('#rev-' + el.dataset.i); }
      t && t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    replay: (el) => { const s = S.loadSession(S.store.get('viewResult', '')); const q = s && s.q[+el.dataset.i]; if (q && q.au) S.tts.speak([...q.au, ['N', q.q.replace(/<[^>]+>/g, ' ')]], 1); },
    'open-result': (el) => { S.store.set('viewResult', el.dataset.id); rFilter = 'all'; location.hash = '#hasil'; },
    toc: (el, e) => { const t = document.getElementById(el.dataset.id); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    'b-cat': (el) => { builder.cat = el.dataset.c; builder.subs = []; saveB(); P.latihan(); },
    'b-sub': (el) => { const s = el.dataset.s; builder.subs = builder.subs.includes(s) ? builder.subs.filter((x) => x !== s) : [...builder.subs, s]; saveB(); P.latihan(); },
    'b-n': (el) => { builder.n = +el.dataset.n; saveB(); P.latihan(); },
    'b-t': (el) => { builder.t = +el.dataset.t; saveB(); P.latihan(); },
    'b-diff': (el) => { builder.diff = el.dataset.d; saveB(); P.latihan(); },
    'b-go': () => startPractice({
      title: 'Latihan: ' + builder.subs.map(S.subLabel).join(', ') + (builder.diff !== 'campuran' ? ` · ${builder.diff === 'sangat' ? 'sangat sulit' : 'sulit'}` : ''),
      subs: builder.subs, n: builder.n, min: builder.t ? (builder.n * builder.t) / 60 : 0, timed: !!builder.t, diff: builder.diff,
    }),
    'eng-tab': (el) => { engTab = el.dataset.tab; S.store.set('engTab', engTab); P.english(); mountWidgets(); },
    'tab-english': (el) => { engTab = el.dataset.tab; S.store.set('engTab', engTab); },
    'fc-flip': () => { fc.flip = true; remount('flashcards'); },
    srs: (el) => { SRS.grade(el.dataset.w, el.dataset.g); if (el.dataset.g === 'lupa') fc.skip.push(el.dataset.w); fc.flip = false; remount('flashcards'); },
    say: (el) => S.tts.say(el.dataset.text),
    'iv-cat': (el) => { iv.cat = el.dataset.c; ACT['iv-next'](); },
    'iv-next': () => {
      const pool = S.INTERVIEW.map((x, i) => ({ x, i })).filter(({ x, i }) => (iv.cat === 'Semua' || x.cat === iv.cat) && i !== iv.i);
      iv.i = pool[Math.floor(Math.random() * pool.length)].i;
      clearInterval(iv.timer); iv.t0 = null;
      remount('interview');
    },
    'iv-time': () => {
      if (iv.t0) { clearInterval(iv.timer); const secs = Math.round((Date.now() - iv.t0) / 1000); iv.t0 = null; remount('interview'); S.toast(`Durasi jawaban ${S.clock(secs)}. ${secs > 150 ? 'Terlalu panjang: ringkas jadi 2 menit.' : secs < 45 ? 'Terlalu singkat: tambahkan contoh konkret.' : 'Durasi pas.'}`); return; }
      iv.t0 = Date.now();
      iv.timer = setInterval(() => { const c = S.$('#iv-clock'); if (c) c.textContent = S.clock((Date.now() - iv.t0) / 1000); else clearInterval(iv.timer); }, 1000);
      remount('interview');
    },
    check: (el) => { const st = S.store.get('checklist', {}); st[el.dataset.id] = el.checked; S.store.set('checklist', st); remount('checklist'); },
    theme: () => {
      const order = ['system', 'light', 'dark'];
      const curT = S.store.get('theme', 'system');
      const next = order[(order.indexOf(curT) + 1) % 3];
      S.store.set('theme', next); applyTheme();
      S.toast(`Tema: ${next === 'system' ? 'ikuti sistem' : next === 'light' ? 'terang' : 'gelap'}`);
    },
    menu: () => document.body.classList.toggle('menu-open'),
    'leave-exam': (el) => { S.closeModal(); S._allowLeave = true; location.hash = '#' + el.dataset.to; },
    install: async () => {
      if (installPrompt) {
        installPrompt.prompt();
        try { const c = await installPrompt.userChoice; if (c.outcome === 'accepted') S.toast('Memasang Siap S2…'); } catch (e) { /* abaikan */ }
        installPrompt = null; document.body.classList.remove('can-install');
        return;
      }
      S.modal(`<h3>Pasang Siap S2 di HP Android</h3><ol class="rules"><li>Buka situs ini di <b>Google Chrome</b>.</li><li>Ketuk menu <b>⋮</b> di kanan atas.</li><li>Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.</li><li>Buka Siap S2 dari ikon di layar utama. Setelah dibuka sekali saat online, aplikasi tetap bisa dipakai tanpa internet.</li></ol><p class="muted small">Jika menu tersebut tidak muncul, pastikan alamatnya diawali https:// (misalnya situs GitHub Pages), bukan dibuka dari halaman pratinjau.</p><div class="modal-actions"><button type="button" class="btn btn-primary" data-act="modal-close">Mengerti</button></div>`);
    },
    'rw-filter': (el) => { rw.filter = el.dataset.f; rw.show = 20; P.riwayat(); },
    'rw-exam': (el) => { rw.exam = el.dataset.id; P.riwayat(); },
    'rw-more': () => { rw.show += 20; P.riwayat(); },
    persist: async () => {
      const ok = await S.persistStorage();
      persistLabel();
      S.toast(ok ? 'Penyimpanan permanen aktif.' : ok === null ? 'Browser ini tidak mendukung penyimpanan permanen; data tetap tersimpan biasa.' : 'Browser belum mengizinkan. Pasang aplikasi ke layar utama lalu coba lagi.', ok ? '' : 'warn');
    },
    'export-file': () => {
      const obj = exportData();
      const name = `siap-s2-cadangan-${S.today()}.json`;
      try {
        const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob); link.download = name; link.rel = 'noopener';
        document.body.appendChild(link); link.click();
        setTimeout(() => { URL.revokeObjectURL(link.href); link.parentNode && link.parentNode.removeChild(link); }, 1500);
        S.store.set('lastBackup', Date.now());
        S.toast(`File ${name} diunduh. Simpan di Google Drive atau kirim ke diri sendiri.`);
        setTimeout(() => { if (document.body.dataset.route === 'riwayat') { const y = window.scrollY; P.riwayat(); window.scrollTo(0, y); } }, 300);
      } catch (e) { S.toast('Unduhan diblokir di halaman ini. Pakai "Salin teks cadangan".', 'warn'); }
    },
    'import-go': (el) => applyImport(el.dataset.mode),
    backup: () => {
      const data = exportData().data;
      const txt = 'SIAPS2:' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
      const done = () => { S.store.set('lastBackup', Date.now()); S.toast('Cadangan disalin. Tempel di perangkat lain.'); };
      const fallback = () => { const t = S.$('#restore-box'); t.value = txt; t.select(); S.toast('Cadangan ditampilkan di kotak. Salin manual (Ctrl/Cmd + C).'); };
      try { navigator.clipboard.writeText(txt).then(done, fallback); } catch (e) { fallback(); }
    },
    restore: () => {
      const t = S.$('#restore-box').value.trim();
      if (!t.startsWith('SIAPS2:')) { S.toast('Teks cadangan tidak dikenali. Pastikan diawali "SIAPS2:".', 'warn'); return; }
      try { askImport(JSON.parse(decodeURIComponent(escape(atob(t.slice(7)))))); }
      catch (e) { S.toast('Cadangan rusak atau terpotong. Salin ulang dari perangkat asal.', 'warn'); }
    },
    'wipe-ask': () => S.modal('<h3>Hapus semua data?</h3><p>Riwayat, statistik, flashcard, catatan wawancara, dan checklist di browser ini akan dihapus permanen.</p><div class="modal-actions"><button type="button" class="btn btn-ghost" data-act="modal-close">Batal</button><button type="button" class="btn btn-danger" data-act="wipe">Hapus semua</button></div>'),
    wipe: () => { S.store.keys().forEach((k) => S.store.del(k)); S.closeModal(); S.toast('Semua data dihapus.'); location.hash = '#beranda'; S.route(); },
  };
  const saveB = () => S.store.set('builder', builder);

  /* ================= router ================= */
  const NAV = ['beranda', 'simulasi', 'latihan', 'english', 'strategi', 'analisis', 'beasiswa', 'penting', 'riwayat', 'panduan'];
  S.route = function () {
    let r = (location.hash || '#beranda').slice(1);
    if (!P[r]) r = 'beranda';
    if (r !== 'ujian' && S.examRunning()) {
      if (!S._allowLeave) {
        // Tombol Back di Android/browser: jangan langsung keluar dari ujian.
        try { history.replaceState(null, '', '#ujian'); } catch (e) { /* abaikan */ }
        S.modal(`<h3>Keluar dari ujian?</h3><p>Jawabanmu tersimpan, tetapi <b>timer tetap berjalan</b> seperti ujian sungguhan. Kamu bisa melanjutkan dari Beranda.</p><div class="modal-actions"><button type="button" class="btn btn-primary" data-act="modal-close">Tetap di ujian</button><button type="button" class="btn btn-ghost" data-act="leave-exam" data-to="${r}">Keluar sementara</button></div>`);
        return;
      }
      S._allowLeave = false;
      S.leaveExam();
    }
    S.closeModal();
    document.body.classList.remove('menu-open');
    document.body.dataset.route = r;
    S.$$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === r || (r === 'hasil' && a.dataset.nav === 'riwayat')));
    P[r]();
    mountWidgets();
    const to = S._scrollTo; S._scrollTo = null;
    if (to && document.getElementById(to)) document.getElementById(to).scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
    document.title = r === 'beranda' ? 'Siap S2' : `${(S.$(`[data-nav="${r}"]`) || {}).textContent || (r === 'ujian' ? 'Ujian' : 'Hasil')} · Siap S2`;
  };
  const hostTheme = document.documentElement.getAttribute('data-theme'); // tema dari halaman induk (jika ada)
  function applyTheme() {
    const t = S.store.get('theme', 'system');
    const root = document.documentElement;
    if (t !== 'system') root.setAttribute('data-theme', t);
    else if (hostTheme) root.setAttribute('data-theme', hostTheme);
    else root.removeAttribute('data-theme');
    const b = S.$('#theme-btn'); if (b) b.textContent = t === 'system' ? 'Tema: sistem' : t === 'light' ? 'Tema: terang' : 'Tema: gelap';
  }

  /* ================= PWA (Android) ================= */
  let installPrompt = null;
  function isStandalone() {
    try { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch (e) { return false; }
  }
  function setupPwa() {
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; document.body.classList.add('can-install'); });
    window.addEventListener('appinstalled', () => { installPrompt = null; document.body.classList.remove('can-install'); S.toast('Siap S2 terpasang di layar utama.'); });
    if (isStandalone()) document.body.classList.add('standalone');
    const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    let framed = false;
    try { framed = window.self !== window.top; } catch (e) { framed = true; }
    if ('serviceWorker' in navigator && secure && !framed) {
      try { navigator.serviceWorker.register('sw.js').catch(() => { /* abaikan: hosting tanpa sw.js */ }); } catch (e) { /* abaikan */ }
    }
  }

  /* ================= boot ================= */
  function boot() {
    try { S.migrateHistory(); } catch (e) { /* riwayat lama tetap dipakai apa adanya */ }
    S.tts.init();
    setupPwa();
    applyTheme();
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]');
      if (!el) return;
      const a = el.dataset.act;
      if (a === 'check') { ACT.check(el); return; }
      if (S.examRunning() && S.examActions[a]) { e.preventDefault(); S.examActions[a](el); return; }
      if (ACT[a]) {
        const follow = el.tagName === 'A' && (a === 'goto-exam' || a === 'tab-english' || a === 'goto-data');
        if (!follow) e.preventDefault();
        ACT[a](el, e);
        if (follow && location.hash === el.getAttribute('href')) S.route();
      }
    });
    document.addEventListener('input', (e) => {
      if (e.target.dataset.actInput === 'iv-note') { const n = S.store.get('ivNotes', {}); n[iv.i] = e.target.value; S.store.set('ivNotes', n); }
    });
    document.addEventListener('change', (e) => {
      if (e.target.dataset.actChange === 'srs-limit') { S.store.set('srsLimit', +e.target.value); remount('flashcards'); }
      if (e.target.dataset.actChange === 'import-file') {
        const f = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!f) return;
        if (f.size > 20 * 1048576) { S.toast('File terlalu besar untuk cadangan Siap S2.', 'warn'); return; }
        f.text().then((txt) => {
          txt = txt.trim();
          try { askImport(txt.startsWith('SIAPS2:') ? JSON.parse(decodeURIComponent(escape(atob(txt.slice(7))))) : JSON.parse(txt)); }
          catch (err) { S.toast('File tidak bisa dibaca. Pastikan memilih file .json dari tombol "Unduh file cadangan".', 'warn'); }
        }, () => S.toast('File tidak bisa dibuka.', 'warn'));
      }
    });
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'gap-form') {
        e.preventDefault();
        const v = Math.round(+new FormData(e.target).get('eng'));
        if (!(v >= 310 && v <= 677)) { S.toast('Masukkan skor antara 310 dan 677.', 'warn'); return; }
        const prof = S.store.get('profile', {}); prof.eng = v; S.store.set('profile', prof);
        remount('skor-gap');
        return;
      }
      if (e.target.id === 'target-form') {
        e.preventDefault();
        const f = new FormData(e.target);
        S.store.set('profile', Object.assign(S.store.get('profile', {}), { target: f.get('target') || '', date: f.get('date') || '' }));
        S.toast('Target disimpan.');
        P.beranda();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { S.closeModal(); document.body.classList.remove('menu-open'); }
      if (document.body.dataset.route === 'ujian' && S.examKey(e)) e.preventDefault();
    });
    document.addEventListener('visibilitychange', () => S.examBlur());
    window.addEventListener('hashchange', S.route);
    let lastW = window.innerWidth, rz = null;
    window.addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => { if (Math.abs(window.innerWidth - lastW) > 40 && document.body.dataset.route === 'riwayat') drawDash(); lastW = window.innerWidth; }, 200);
    });
    S.route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})((window.SiapS2 = window.SiapS2 || {}));
