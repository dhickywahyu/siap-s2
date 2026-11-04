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
        </div>
        <div class="panel">
          <h2>Rekomendasi hari ini</h2>
          <ol class="todo">
            ${weakest ? `<li>Topik terlemahmu <b>${S.esc(S.subLabel(weakest.s))}</b> (${Math.round(weakest.p * 100)}%). <button type="button" class="linklike" data-act="drill" data-sub="${weakest.s}">Latih 15 soal</button></li>` : `<li>Kerjakan satu <a href="#simulasi">simulasi mini</a> untuk mengukur kemampuan awal.</li>`}
            <li>${srsDue ? `<b>${srsDue}</b> kartu kosakata menunggu.` : 'Kosakata baru siap dipelajari.'} <a href="#english" data-act="tab-english" data-tab="flash">Buka flashcard</a></li>
            ${/MBA|MM |Manajemen|Teknik/.test(prof.target) ? `<li>Target ${S.esc(prof.target.replace('LPDP + ', ''))}: buka <a href="#jalur">Jalur MBA & Teknik</a> untuk syarat, selisih skor bahasa Inggris, dan rencana 12 minggu.</li>` : ''}
            <li>Baca satu teknik di <a href="#strategi">Strategi & rumus cepat</a>, lalu langsung coba latihan kilatnya.</li>
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
  const builder = Object.assign({ cat: 'kuantitatif', subs: ['deret'], n: 20, t: 60 }, S.store.get('builder', {}));
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
        <div class="field"><span class="field-label">Waktu</span><div class="chips">${[[0, 'Tanpa batas'], [90, '90 dtk/soal'], [60, '60 dtk/soal'], [40, '40 dtk/soal (ketat)']].map(([t, l]) => `<button type="button" class="chip${builder.t === t ? ' on' : ''}" data-act="b-t" data-t="${t}">${l}</button>`).join('')}</div></div>
        <div class="btn-row"><button type="button" class="btn btn-primary" data-act="b-go" ${builder.subs.length ? '' : 'disabled'}>Mulai latihan</button><span class="muted small">${builder.subs.length ? builder.subs.map(S.subLabel).join(', ') : 'Pilih minimal satu topik'}</span></div>
      </section>
      <h2 class="section-title">Latihan kilat</h2>
      <div class="drill-grid">${S.DRILLS.map(drillCard).join('')}</div>
      <h2 class="section-title">Isi bank soal</h2>
      <div class="table-wrap"><table class="bank-table"><thead><tr><th>Topik</th><th>Kategori</th><th>Soal tertulis</th><th>Variasi otomatis</th><th>Akurasimu</th></tr></thead><tbody>
        ${Object.keys(S.SUBS).map((s) => { const x = stats[s]; return `<tr><td>${S.esc(S.subLabel(s))}</td><td class="muted">${S.CATS[S.subCat(s)]}</td><td>${S.bankCount(s) || '–'}</td><td>${S.hasGen(s) ? 'Ya' : '–'}</td><td>${x && x.n ? `${S.pct(x.b, x.n)}% <span class="muted small">(${x.n})</span>` : '–'}</td></tr>`; }).join('')}
      </tbody></table></div>
    </div>`;
  };
  const drillCard = (d) => `<article class="drill"><strong>${S.esc(d.title)}</strong><span class="muted small">${d.n} soal · ${d.min} menit</span><p class="small">${S.esc(d.why)}</p><button type="button" class="btn btn-small" data-act="drill-id" data-id="${d.id}">Mulai</button></article>`;

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

  P.riwayat = () => {
    const hist = S.history();
    const stats = S.store.get('stats', {});
    const subs = Object.entries(stats).map(([s, x]) => ({ s, ...x, p: S.pct(x.b, x.n) })).sort((a, b) => a.p - b.p);
    view().innerHTML = `
    <div class="page">
      <header class="page-head"><h1>Riwayat & progres</h1><p class="lede">Semua data tersimpan di browser ini saja. Gunakan cadangan untuk memindahkan progres ke perangkat lain.</p></header>
      <section class="panel"><h2>Persentase benar per sesi</h2>${hist.length >= 2 ? lineChart(hist.slice(0, 24).reverse()) : '<p class="muted">Grafik muncul setelah minimal dua sesi selesai.</p>'}</section>
      <section class="panel"><h2>Sesi terakhir</h2>
        ${hist.length ? `<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Sesi</th><th>Benar</th><th>Skor</th><th>Durasi</th><th></th></tr></thead><tbody>
        ${hist.map((h) => `<tr><td class="small">${S.fmtDateTime(h.date)}</td><td>${S.esc(h.title)}</td><td>${h.b}/${h.n} <span class="muted small">(${h.pct}%)</span></td><td>${h.scaled ? h.scaled.value + (h.scaled.unit || '') : '–'}</td><td class="small">${S.clock(h.dur || 0)}</td><td><button type="button" class="btn btn-small" data-act="open-result" data-id="${h.id}">Pembahasan</button></td></tr>`).join('')}
        </tbody></table></div>` : '<p class="muted">Belum ada sesi. <a href="#simulasi">Mulai simulasi pertama</a>.</p>'}
      </section>
      <section class="panel"><h2>Akurasi per topik (semua waktu)</h2>
        ${subs.length ? `<div class="topic-bars">${subs.map((x) => `<div class="tb"><span>${S.esc(S.subLabel(x.s))}</span><div class="ready-bar"><i class="${x.p >= 70 ? 'ok' : x.p >= 50 ? 'mid' : 'bad'}" style="width:${x.p}%"></i><b style="left:70%"></b></div><span class="small">${x.p}% · ${x.n} soal · ${Math.round(x.t / x.n)} dtk</span></div>`).join('')}</div>` : '<p class="muted">Belum ada data.</p>'}
      </section>
      <section class="panel"><h2>Cadangan & data</h2>
        <p class="small">Salin cadangan lalu tempel di perangkat lain pada kotak di bawah untuk memulihkan.</p>
        <div class="btn-row"><button type="button" class="btn" data-act="backup">Salin cadangan</button><button type="button" class="btn btn-danger" data-act="wipe-ask">Hapus semua data</button></div>
        <label for="restore-box" class="small">Tempel cadangan</label>
        <textarea id="restore-box" rows="3" placeholder="Tempel teks cadangan di sini"></textarea>
        <button type="button" class="btn btn-small" data-act="restore">Pulihkan dari cadangan</button>
      </section>
    </div>`;
  };
  function lineChart(h) {
    const W = 640, H = 220, L = 36, R = 12, T = 14, B = 30;
    const x = (i) => L + (h.length === 1 ? 0 : (i * (W - L - R)) / (h.length - 1));
    const y = (p) => T + ((100 - p) * (H - T - B)) / 100;
    const pts = h.map((d, i) => `${x(i).toFixed(1)},${y(d.pct).toFixed(1)}`).join(' ');
    const area = `${L},${y(0)} ${pts} ${x(h.length - 1).toFixed(1)},${y(0)}`;
    return `<div class="chart-wrap"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik persentase benar ${h.length} sesi terakhir">
      ${[0, 25, 50, 75, 100].map((g) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}"/><text class="axis" x="${L - 8}" y="${y(g) + 4}" text-anchor="end">${g}</text>`).join('')}
      <line class="target" x1="${L}" x2="${W - R}" y1="${y(70)}" y2="${y(70)}"/><text class="axis target-t" x="${W - R}" y="${y(70) - 6}" text-anchor="end">target 70%</text>
      <polygon class="area" points="${area}"/><polyline class="line" points="${pts}"/>
      ${h.map((d, i) => `<circle class="dot${i === h.length - 1 ? ' last' : ''}" cx="${x(i).toFixed(1)}" cy="${y(d.pct).toFixed(1)}" r="${i === h.length - 1 ? 5 : 3.5}"><title>${S.esc(d.title)}: ${d.pct}%</title></circle>`).join('')}
      <text class="axis" x="${L}" y="${H - 8}">${S.fmtDate(h[0].date)}</text><text class="axis" x="${W - R}" y="${H - 8}" text-anchor="end">${S.fmtDate(h[h.length - 1].date)}</text>
    </svg></div>`;
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
      ${out.map((x) => `<article class="rev bad"><div class="rev-head"><span class="muted small">${S.esc(S.subLabel(x.q.s))} · ${S.fmtDate(x.date)}</span></div><div class="qstem en">${x.q.qh ? x.q.q : S.rich(x.q.q)}</div>
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
      S.closeModal();
      S.discardActive();
      const sess = S.createExam(S.examById(el.dataset.id), { mini: el.dataset.mini === '1' });
      S.store.set('active', sess);
      if (location.hash === '#ujian') S.route(); else location.hash = '#ujian';
    },
    'goto-exam': (el) => { S._scrollTo = 'exam-' + el.dataset.id; },
    quick: () => startPractice({ title: 'Latihan kilat campuran', subs: ['deret', 'sinonim', 'silogisme', 'soal-cerita', 'analogi', 'structure'], n: 18, min: 15 }),
    drill: (el) => startPractice({ title: 'Latihan: ' + S.subLabel(el.dataset.sub), subs: [el.dataset.sub], n: 15, min: 15 }),
    'drill-id': (el) => { const d = S.DRILLS.find((x) => x.id === el.dataset.id); startPractice({ title: d.title, subs: d.subs, n: d.n, min: d.min }); },
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
    'b-go': () => startPractice({ title: 'Latihan: ' + builder.subs.map(S.subLabel).join(', '), subs: builder.subs, n: builder.n, min: builder.t ? (builder.n * builder.t) / 60 : 0, timed: !!builder.t }),
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
    backup: () => {
      const data = {};
      S.store.keys().forEach((k) => { if (k !== 'active') data[k] = S.store.get(k); });
      const txt = 'SIAPS2:' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
      const done = () => S.toast('Cadangan disalin. Tempel di perangkat lain.');
      const fallback = () => { const t = S.$('#restore-box'); t.value = txt; t.select(); S.toast('Cadangan ditampilkan di kotak. Salin manual (Ctrl/Cmd + C).'); };
      try { navigator.clipboard.writeText(txt).then(done, fallback); } catch (e) { fallback(); }
    },
    restore: () => {
      const t = S.$('#restore-box').value.trim();
      if (!t.startsWith('SIAPS2:')) { S.toast('Teks cadangan tidak dikenali. Pastikan diawali "SIAPS2:".', 'warn'); return; }
      try { const data = JSON.parse(decodeURIComponent(escape(atob(t.slice(7))))); Object.entries(data).forEach(([k, v]) => S.store.set(k, v)); S.toast('Data dipulihkan.'); P.riwayat(); }
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
    if (r !== 'ujian' && S.examRunning()) S.leaveExam();
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

  /* ================= boot ================= */
  function boot() {
    S.tts.init();
    applyTheme();
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]');
      if (!el) return;
      const a = el.dataset.act;
      if (a === 'check') { ACT.check(el); return; }
      if (S.examRunning() && S.examActions[a]) { e.preventDefault(); S.examActions[a](el); return; }
      if (ACT[a]) {
        const follow = el.tagName === 'A' && (a === 'goto-exam' || a === 'tab-english');
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
    S.route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})((window.SiapS2 = window.SiapS2 || {}));
