/* Siap S2 — mesin ujian: susun soal, timer, lembar jawaban (LJK), penilaian, pembahasan.
 * Prinsip: kunci & pembahasan tersimpan terenkode (field k) dan baru didekode saat sesi
 * berstatus "finished". Selama ujian, kunci tidak pernah dirender ke halaman.
 */
(function (S) {
  'use strict';
  const BANK = window.SIAP_BANK || { items: [], passages: {} };
  const ITEMS = BANK.items || [];
  const BY_SUB = S.groupBy(ITEMS, 's');
  const LET = 'ABCDE';
  S.bankCount = (sub) => (BY_SUB[sub] || []).length;
  S.bankTotal = ITEMS.length;
  S.passage = (id) => (BANK.passages || {})[id];

  /* ---------------- pemilihan soal ---------------- */
  let seen = S.store.get('seen', {});
  const seenOf = (id) => seen[id] || 0;
  function pickBank(sub, n, r, excl) {
    const pool = (BY_SUB[sub] || []).filter((x) => !excl.has(x.i));
    if (!pool.length || n <= 0) return [];
    if (pool.some((x) => x.p)) {
      const groups = S.groupBy(pool, 'p');
      const score = (g) => S.sum(g.map((x) => seenOf(x.i))) / g.length;
      const keys = r.shuffle(Object.keys(groups)).sort((a, b) => score(groups[a]) - score(groups[b]));
      const out = [];
      for (const k of keys) {
        if (out.length >= n) break;
        const g = groups[k];
        const room = n - out.length;
        out.push(...(g.length <= room + 1 ? g : g.slice(0, room)));
      }
      return out;
    }
    return r.shuffle(pool).sort((a, b) => seenOf(a.i) - seenOf(b.i)).slice(0, n);
  }
  const fromBank = (x) => {
    const q = { id: x.i, c: x.c, s: x.s, l: x.l, q: x.q, o: x.o, k: x.k };
    ['p', 'f', 'we', 'au', 'h'].forEach((f) => { if (x[f]) q[f] = x[f]; });
    return q;
  };
  const fromGen = (g) => {
    const q = { id: 'g-' + S.uid(), c: g.c, s: g.s, l: g.l || 2, q: g.q, o: g.o, k: S.enc({ a: g.a, e: g.e || '' }), gen: 1 };
    ['f', 'h', 'qh'].forEach((f) => { if (g[f]) q[f] = g[f]; });
    return q;
  };
  function draw(sub, n, r, excl, bankShare = 0.5) {
    const bank = BY_SUB[sub] || [];
    const gen = S.hasGen(sub);
    const nb = bank.length ? (gen ? Math.round(n * bankShare) : n) : 0;
    const out = pickBank(sub, nb, r, excl).map(fromBank);
    out.forEach((q) => excl.add(q.id));
    let guard = 0;
    while (out.length < n && gen && guard++ < n * 4) { const g = S.generate(sub, r); if (g) out.push(fromGen(g)); }
    if (out.length < n && !gen) {
      // bank habis: izinkan pengulangan dari bank (jarang terjadi)
      const more = pickBank(sub, n - out.length, r, new Set(out.map((q) => q.id))).map(fromBank);
      out.push(...more);
    }
    return out;
  }

  /* ---------------- membuat sesi ---------------- */
  function baseSession(o) {
    const n = o.q.length;
    return Object.assign({
      id: S.uid(), created: Date.now(), status: 'running',
      ans: Array(n).fill(null), flag: Array(n).fill(false), spent: Array(n).fill(0), plays: Array(n).fill(0),
      cur: 0, secIdx: 0, deadline: null, paused: false, left: null, blur: 0,
    }, o);
  }
  S.createExam = function (exam, opts = {}) {
    const r = S.rng(S.newSeed());
    const f = opts.mini ? 0.34 : 1;
    const excl = new Set();
    const q = [], sections = [];
    exam.sections.forEach((sec) => {
      const start = q.length;
      sec.draw.forEach(([sub, n]) => q.push(...draw(sub, Math.max(1, Math.round(n * f)), r, excl)));
      sections.push({ name: sec.name, start, end: q.length, secs: Math.max(180, Math.round(sec.min * 60 * f)), sc: sec.scoring || exam.scoring || [1, 0, 0] });
    });
    const sess = baseSession({ kind: 'sim', examId: exam.id, title: exam.name + (opts.mini ? ' (mini)' : ''), mini: !!opts.mini, timing: exam.timing, sections, q, audioLimit: 1, strict: true });
    sess.totalSecs = S.sum(sections.map((s) => s.secs));
    startClock(sess);
    return sess;
  };
  S.createPractice = function ({ title, subs, n, min, questions, timed = true }) {
    const r = S.rng(S.newSeed());
    let q = questions ? questions.map((x) => Object.assign({}, x)) : [];
    if (!questions) {
      const excl = new Set();
      const per = subs.map((_, i) => Math.floor(n / subs.length) + (i < n % subs.length ? 1 : 0));
      subs.forEach((s, i) => q.push(...draw(s, per[i], r, excl, 0.6)));
    }
    const secs = timed && min ? Math.round(min * 60) : 0;
    const sess = baseSession({ kind: 'latihan', title, timing: secs ? 'global' : 'none', sections: [{ name: title, start: 0, end: q.length, secs, sc: [1, 0, 0] }], q, audioLimit: 0, strict: false });
    sess.totalSecs = secs;
    startClock(sess);
    return sess;
  };
  function startClock(sess) {
    if (sess.timing === 'section') sess.deadline = Date.now() + sess.sections[sess.secIdx].secs * 1000;
    else if (sess.timing === 'global') sess.deadline = Date.now() + sess.totalSecs * 1000;
    sess.started = Date.now();
  }

  /* ---------------- penyimpanan sesi ---------------- */
  S.active = () => { const s = S.store.get('active', null); return s && s.status === 'running' ? s : null; };
  const saveActive = (sess) => S.store.set('active', sess);
  S.discardActive = () => S.store.del('active');
  S.loadSession = (id) => S.store.get('sess:' + id, null);
  S.history = () => S.store.get('hist', []);

  /* ---------------- render ujian ---------------- */
  let cur = null, tick = null, saveCounter = 0;
  const secOf = (sess, i) => sess.sections.findIndex((s) => i >= s.start && i < s.end);
  const visibleRange = (sess) => (sess.timing === 'section' ? [sess.sections[sess.secIdx].start, sess.sections[sess.secIdx].end] : [0, sess.q.length]);
  const remaining = (sess) => (sess.paused ? sess.left : sess.deadline ? Math.max(0, (sess.deadline - Date.now()) / 1000) : null);

  S.runExam = function (sess) {
    cur = sess;
    saveActive(sess);
    document.body.classList.add('in-exam');
    document.body.classList.toggle('strict', !!sess.strict);
    if (sess.deadline && remaining(sess) <= 0 && !sess.paused) { onTimeUp(true); return; }
    renderExam();
    clearInterval(tick);
    tick = setInterval(onTick, 1000);
  };
  S.leaveExam = function () {
    clearInterval(tick); tick = null;
    if (cur && cur.status === 'running') saveActive(cur);
    cur = null;
    S.tts.stop();
    document.body.classList.remove('in-exam', 'strict');
  };
  S.examRunning = () => !!(cur && cur.status === 'running');

  function onTick() {
    if (!cur || cur.status !== 'running') return;
    if (!cur.paused) cur.spent[cur.cur] = (cur.spent[cur.cur] || 0) + 1;
    const left = remaining(cur);
    const el = S.$('#timer');
    if (el) {
      if (left == null) { el.textContent = S.clock((Date.now() - cur.started) / 1000); el.dataset.state = 'up'; }
      else {
        el.textContent = S.clock(left);
        el.dataset.state = left <= 60 ? 'crit' : left <= 300 ? 'warn' : 'ok';
      }
    }
    if (++saveCounter % 5 === 0) saveActive(cur);
    if (left != null && left <= 0 && !cur.paused) onTimeUp(false);
  }
  function onTimeUp(silent) {
    const sess = cur;
    if (sess.timing === 'section' && sess.secIdx < sess.sections.length - 1) {
      sess.secIdx++;
      sess.cur = sess.sections[sess.secIdx].start;
      sess.deadline = Date.now() + sess.sections[sess.secIdx].secs * 1000;
      saveActive(sess);
      if (!silent) S.toast(`Waktu habis. Lanjut ke bagian ${sess.sections[sess.secIdx].name}.`, 'warn');
      renderExam();
      return;
    }
    if (!silent) S.toast('Waktu habis. Jawaban dikumpulkan otomatis.', 'warn');
    finish();
  }

  function optHtml(q, i, chosen) {
    const label = q.h ? q.o[i] : S.rich(q.o[i]);
    return `<button type="button" class="opt${chosen === i ? ' on' : ''}" role="radio" aria-checked="${chosen === i}" data-act="pick" data-i="${i}">
      <span class="bubble" aria-hidden="true">${LET[i]}</span><span class="opt-text">${label}</span></button>`;
  }
  function stemHtml(q) {
    return q.qh ? q.q : S.rich(q.q);
  }
  function audioHtml(q, idx) {
    if (!q.au) return '';
    const limited = cur.audioLimit && cur.plays[idx] >= cur.audioLimit;
    if (!S.tts.ok) {
      return `<div class="audio-box"><p class="muted">Browser ini tidak mendukung suara. Baca transkrip berikut sebagai pengganti audio:</p>${transcript(q)}</div>`;
    }
    return `<div class="audio-box">
      <button type="button" class="btn btn-audio" data-act="play" ${limited ? 'disabled' : ''}>${limited ? 'Audio sudah diputar' : 'Putar audio'}</button>
      ${cur.audioLimit ? `<span class="muted small">Seperti tes asli, audio hanya bisa diputar ${cur.audioLimit}×.</span>` : `<label class="small">Kecepatan <select id="tts-rate"><option value="0.8">0,8×</option><option value="1" selected>1×</option><option value="1.15">1,15×</option></select></label>`}
    </div>`;
  }
  const transcript = (q) => `<div class="transcript">${q.au.map(([w, t]) => `<p><b>${w === 'M' ? 'Man' : w === 'W' ? 'Woman' : 'Narrator'}:</b> ${S.esc(t)}</p>`).join('')}</div>`;

  function ljkRows(sess, from, to, mode, res) {
    let html = '';
    for (let i = from; i < to; i++) {
      const q = sess.q[i];
      const a = sess.ans[i];
      let cls = 'row';
      if (mode === 'exam') { if (i === sess.cur) cls += ' cur'; if (sess.flag[i]) cls += ' ragu'; }
      let key = null;
      if (mode === 'review') { key = S.dec(q.k).a; cls += res.correct[i] === true ? ' ok' : res.correct[i] === false ? ' bad' : ' blank'; }
      const bubbles = q.o.map((_, j) => {
        let b = 'b';
        if (a === j) b += ' fill';
        if (mode === 'review' && key === j) b += ' key';
        return `<span class="${b}">${LET[j]}</span>`;
      }).join('');
      html += `<button type="button" class="${cls}" data-act="${mode === 'exam' ? 'goto' : 'jump'}" data-i="${i}" aria-label="Soal ${i + 1}${a != null ? ', terjawab ' + LET[a] : ', belum dijawab'}${sess.flag[i] ? ', ragu-ragu' : ''}"><span class="no">${i + 1}</span><span class="bs">${bubbles}</span></button>`;
    }
    return html;
  }
  S.ljkRows = ljkRows;

  function renderExam() {
    const sess = cur;
    const i = sess.cur;
    const q = sess.q[i];
    const [from, to] = visibleRange(sess);
    const si = secOf(sess, i);
    const sec = sess.sections[si];
    const pas = q.p ? S.passage(q.p) : null;
    const answered = sess.ans.slice(from, to).filter((x) => x != null).length;
    const lastSec = sess.secIdx >= sess.sections.length - 1;
    const left = remaining(sess);
    const secTabs = sess.sections.length > 1
      ? `<ol class="sec-steps">${sess.sections.map((s, k) => `<li class="${k === si ? 'on' : ''}${sess.timing === 'section' && k < sess.secIdx ? ' done' : ''}">${S.esc(s.name)}</li>`).join('')}</ol>` : '';
    const v = S.$('#view');
    v.innerHTML = `
    <div class="exam">
      <header class="exam-bar">
        <div class="exam-title">
          <strong>${S.esc(sess.title)}</strong>
          <span>${S.esc(sec.name)}${sess.sections.length > 1 ? ` · bagian ${si + 1} dari ${sess.sections.length}` : ''}</span>
        </div>
        <div class="exam-timer" id="timer" aria-live="off" title="${left == null ? 'Waktu berjalan' : 'Sisa waktu'}">${left == null ? S.clock((Date.now() - sess.started) / 1000) : S.clock(left)}</div>
        <div class="exam-actions">
          <button type="button" class="btn btn-ghost only-narrow" data-act="toggle-ljk">Lembar jawaban</button>
          ${sess.kind === 'latihan' && sess.deadline || sess.paused ? `<button type="button" class="btn btn-ghost" data-act="pause">${sess.paused ? 'Lanjutkan' : 'Jeda'}</button>` : ''}
          <button type="button" class="btn btn-primary" data-act="finish-ask">${sess.timing === 'section' && !lastSec ? 'Akhiri bagian' : 'Selesai'}</button>
        </div>
      </header>
      ${secTabs}
      ${sess.blur && sess.strict ? `<div class="proctor-warn" role="alert">Kamu meninggalkan halaman ujian ${sess.blur}×. Pada ujian daring berpengawas (proctoring), berpindah tab dapat dianggap pelanggaran.</div>` : ''}
      ${sess.paused ? `<div class="paused"><p>Latihan dijeda. Soal disembunyikan.</p><button type="button" class="btn btn-primary" data-act="pause">Lanjutkan latihan</button></div>` : `
      <div class="exam-body${pas ? ' has-passage' : ''}">
        ${pas ? `<article class="passage" aria-label="Bacaan"><h3>${S.esc(pas.t)}</h3><div class="passage-text">${S.rich(pas.x)}</div></article>` : ''}
        <section class="qpane" aria-label="Soal">
          <div class="qmeta"><span class="qno">Soal ${i + 1}</span><span>${S.esc(S.subLabel(q.s))}</span>${q.gen ? '<span class="tag">variasi otomatis</span>' : ''}</div>
          ${audioHtml(q, i)}
          <div class="qstem ${q.c === 'english' ? 'en' : ''}">${stemHtml(q)}</div>
          <div class="opts${q.h ? ' opts-fig' : ''}" role="radiogroup" aria-label="Pilihan jawaban">${q.o.map((_, j) => optHtml(q, j, sess.ans[i])).join('')}</div>
          <nav class="qnav">
            <button type="button" class="btn btn-ghost" data-act="prev" ${i <= from ? 'disabled' : ''}>Sebelumnya</button>
            <button type="button" class="btn btn-ragu${sess.flag[i] ? ' on' : ''}" data-act="flag" aria-pressed="${sess.flag[i]}">Ragu-ragu</button>
            <button type="button" class="btn btn-ghost" data-act="clear" ${sess.ans[i] == null ? 'disabled' : ''}>Kosongkan</button>
            <button type="button" class="btn btn-ghost" data-act="next" ${i >= to - 1 ? 'disabled' : ''}>Berikutnya</button>
          </nav>
          <p class="kbd-hint">Pintasan: tombol <kbd>A</kbd>–<kbd>E</kbd> memilih jawaban, <kbd>←</kbd> <kbd>→</kbd> berpindah soal, <kbd>R</kbd> tandai ragu.</p>
        </section>
      </div>`}
      <aside class="ljk-panel" id="ljk-panel" aria-label="Lembar jawaban">
        <div class="ljk-head">
          <strong>Lembar jawaban</strong>
          <span>${answered}/${to - from} terisi</span>
          <button type="button" class="btn btn-small only-narrow" data-act="toggle-ljk">Tutup</button>
        </div>
        <div class="ljk-legend"><span><i class="lg fill"></i>Terjawab</span><span><i class="lg ragu"></i>Ragu-ragu</span><span><i class="lg"></i>Kosong</span></div>
        <div class="ljk-sheet">${ljkRows(sess, from, to, 'exam')}</div>
      </aside>
    </div>`;
  }

  /* ---------------- aksi ujian ---------------- */
  function pick(j) {
    const sess = cur;
    sess.ans[sess.cur] = sess.ans[sess.cur] === j ? null : j;
    saveActive(sess);
    renderExam();
  }
  function go(i) {
    const [from, to] = visibleRange(cur);
    if (i < from || i >= to) return;
    S.tts.stop();
    cur.cur = i;
    saveActive(cur);
    renderExam();
    const q = S.$('.qpane');
    if (q && window.innerWidth < 900) q.scrollIntoView({ block: 'start' });
    S.$('#ljk-panel') && S.$('#ljk-panel').classList.remove('open');
  }
  function play() {
    const sess = cur, i = sess.cur, q = sess.q[i];
    if (sess.audioLimit && sess.plays[i] >= sess.audioLimit) return;
    sess.plays[i]++;
    saveActive(sess);
    const rateEl = S.$('#tts-rate');
    const btn = S.$('[data-act="play"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Memutar…'; }
    S.tts.speak([...q.au, ['N', q.q.replace(/<[^>]+>/g, ' ')]], rateEl ? +rateEl.value : 1, () => {
      if (cur === sess && sess.cur === i) renderExam();
    });
  }
  function modal(html) {
    let m = S.$('#modal');
    if (!m) { m = document.createElement('div'); m.id = 'modal'; document.body.appendChild(m); }
    m.innerHTML = `<div class="modal-back" data-act="modal-close"></div><div class="modal-card" role="dialog" aria-modal="true">${html}</div>`;
    m.hidden = false;
    const f = m.querySelector('.btn-primary');
    f && f.focus();
  }
  S.modal = modal;
  S.closeModal = () => { const m = S.$('#modal'); if (m) { m.hidden = true; m.innerHTML = ''; } };
  function finishAsk() {
    const sess = cur;
    const [from, to] = visibleRange(sess);
    const blank = sess.ans.slice(from, to).filter((x) => x == null).length;
    const ragu = sess.flag.slice(from, to).filter(Boolean).length;
    const lastSec = sess.secIdx >= sess.sections.length - 1;
    const sectionMode = sess.timing === 'section' && !lastSec;
    const penalty = sess.sections[secOf(sess, sess.cur)].sc[1] < 0;
    modal(`
      <h3>${sectionMode ? 'Akhiri bagian ini?' : 'Kumpulkan jawaban?'}</h3>
      <p>${blank ? `Masih ada <b>${blank}</b> soal kosong` : 'Semua soal sudah terisi'}${ragu ? ` dan <b>${ragu}</b> soal bertanda ragu-ragu` : ''}.</p>
      ${sectionMode ? '<p class="muted">Seperti ujian berbasis komputer, bagian yang sudah diakhiri tidak bisa dibuka lagi. Sisa waktu bagian ini hangus.</p>' : '<p class="muted">Kunci jawaban dan pembahasan baru terbuka setelah jawaban dikumpulkan.</p>'}
      ${penalty && blank ? '<p class="small">Bagian ini memakai nilai minus untuk jawaban salah. Tebak hanya jika kamu bisa mencoret minimal satu pilihan.</p>' : ''}
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" data-act="modal-close">Kembali mengerjakan</button>
        ${sectionMode ? '<button type="button" class="btn btn-primary" data-act="next-section">Lanjut ke bagian berikutnya</button>' : '<button type="button" class="btn btn-primary" data-act="submit">Kumpulkan sekarang</button>'}
      </div>
      <p class="modal-foot"><button type="button" class="linklike" data-act="abandon-ask">Batalkan ujian tanpa menyimpan</button></p>`);
  }
  function nextSection() {
    S.closeModal();
    cur.deadline = Date.now();
    onTimeUp(true);
  }

  /* ---------------- penilaian ---------------- */
  function scale(sess, res) {
    const exam = sess.examId ? S.examById(sess.examId) : null;
    const kind = exam ? exam.scale : 'pct';
    const f = res.total ? res.b / res.total : 0;
    if (kind === 'tpa') return { value: Math.round(200 + 600 * f), unit: '', label: 'Estimasi skor skala 200–800', target: exam.target, min: 200, max: 800 };
    if (kind === 'acept') return { value: Math.round(426 * f), unit: '', label: 'Estimasi skor AcEPT (skala ±0–426)', target: exam.target, min: 0, max: 426 };
    if (kind === 'toefl') {
      const conv = res.sections.map((s, i) => (s.n ? Math.round(31 + (i === 2 ? 36 : 37) * (s.b / s.n)) : 31));
      return { value: Math.round((S.sum(conv) * 10) / 3), unit: '', label: `Estimasi skor TOEFL ITP (310–677) · L${conv[0]} S${conv[1]} R${conv[2]}`, target: exam.target, min: 310, max: 677 };
    }
    if (kind === 'simak') {
      const tpa = res.sections.filter((s) => s.pen), eng = res.sections.filter((s) => !s.pen);
      const raw = S.sum(tpa.map((s) => s.raw)), max = S.sum(tpa.map((s) => s.max));
      const engPct = eng.length ? S.pct(S.sum(eng.map((s) => s.b)), S.sum(eng.map((s) => s.n))) : 0;
      return { value: max ? Math.round((Math.max(0, raw) / max) * 100) : 0, unit: '%', label: `Skor TPA ${raw} dari ${max} (+4/−1/0) · Bahasa Inggris ${engPct}%`, target: 60, min: 0, max: 100 };
    }
    return { value: Math.round(f * 100), unit: '%', label: 'Persentase jawaban benar', target: exam ? exam.target : 70, min: 0, max: 100 };
  }
  function finish() {
    const sess = cur;
    clearInterval(tick); tick = null;
    S.tts.stop();
    const res = { sections: [], bySub: {}, correct: [], total: sess.q.length, b: 0, s: 0, k: 0 };
    sess.sections.forEach((sec) => {
      const st = { name: sec.name, n: sec.end - sec.start, b: 0, s: 0, k: 0, pen: sec.sc[1] < 0, time: 0 };
      for (let i = sec.start; i < sec.end; i++) {
        const key = S.dec(sess.q[i].k).a;
        const a = sess.ans[i];
        const sub = sess.q[i].s;
        const bs = (res.bySub[sub] = res.bySub[sub] || { n: 0, b: 0, t: 0 });
        bs.n++; bs.t += sess.spent[i] || 0; st.time += sess.spent[i] || 0;
        if (a == null) { st.k++; res.correct[i] = null; }
        else if (a === key) { st.b++; bs.b++; res.correct[i] = true; }
        else { st.s++; res.correct[i] = false; }
      }
      st.raw = st.b * sec.sc[0] + st.s * sec.sc[1] + st.k * sec.sc[2];
      st.max = st.n * sec.sc[0];
      st.pct = S.pct(st.b, st.n);
      res.b += st.b; res.s += st.s; res.k += st.k;
      res.sections.push(st);
    });
    res.pct = S.pct(res.b, res.total);
    res.scaled = scale(sess, res);
    sess.res = res;
    sess.status = 'finished';
    sess.finished = Date.now();
    sess.duration = Math.round(S.sum(sess.spent));

    // statistik global
    const stats = S.store.get('stats', {});
    Object.entries(res.bySub).forEach(([sub, v]) => {
      const t = (stats[sub] = stats[sub] || { n: 0, b: 0, t: 0, recent: [] });
      t.n += v.n; t.b += v.b; t.t += v.t;
      t.recent = [...(t.recent || []), [v.b, v.n]].slice(-8);
    });
    S.store.set('stats', stats);
    const days = S.store.get('days', {});
    days[S.today()] = (days[S.today()] || 0) + sess.q.length;
    S.store.set('days', days);
    sess.q.forEach((q) => { if (!q.gen) seen[q.id] = (seen[q.id] || 0) + 1; });
    S.store.set('seen', seen);

    // simpan riwayat (maks 60 sesi lengkap)
    S.store.set('sess:' + sess.id, sess);
    const hist = S.history();
    hist.unshift({ id: sess.id, title: sess.title, examId: sess.examId || null, kind: sess.kind, date: sess.finished, pct: res.pct, scaled: res.scaled, n: res.total, b: res.b, dur: sess.duration, blur: sess.blur });
    hist.slice(60).forEach((h) => S.store.del('sess:' + h.id));
    S.store.set('hist', hist.slice(0, 60));
    S.discardActive();
    S.store.set('viewResult', sess.id);
    cur = null;
    document.body.classList.remove('in-exam', 'strict');
    S.closeModal();
    if (location.hash === '#hasil') S.route(); else location.hash = '#hasil';
  }

  /* ---------------- halaman hasil & pembahasan ---------------- */
  S.renderResult = function (sess, filter = 'all') {
    const v = S.$('#view');
    if (!sess || sess.status !== 'finished') {
      v.innerHTML = `<div class="page"><h1>Belum ada hasil</h1><p>Hasil dan pembahasan muncul setelah kamu menyelesaikan simulasi atau latihan.</p><a class="btn btn-primary" href="#simulasi">Mulai simulasi</a></div>`;
      return;
    }
    const res = sess.res;
    const sc = res.scaled;
    const exam = sess.examId ? S.examById(sess.examId) : null;
    const reach = sc.target != null ? sc.value >= sc.target : null;
    const subs = Object.entries(res.bySub).map(([s, x]) => ({ s, ...x, p: S.pct(x.b, x.n), avg: x.n ? Math.round(x.t / x.n) : 0 })).sort((a, b) => a.p - b.p);
    const tips = insight(sess, res);
    const counts = { all: res.total, bad: res.s, blank: res.k, ragu: sess.flag.filter(Boolean).length, ok: res.b };
    const fl = { all: 'Semua', bad: 'Salah', blank: 'Kosong', ragu: 'Ragu-ragu', ok: 'Benar' };
    v.innerHTML = `
    <div class="page result">
      <header class="result-head">
        <div>
          <p class="crumb">${sess.kind === 'sim' ? 'Hasil simulasi' : 'Hasil latihan'} · ${S.fmtDateTime(sess.finished)}</p>
          <h1>${S.esc(sess.title)}</h1>
          <p class="muted">${res.total} soal · ${S.clock(sess.duration)} dipakai${sess.blur ? ` · keluar halaman ${sess.blur}×` : ''}</p>
        </div>
        <div class="score-card ${reach === true ? 'reach' : reach === false ? 'miss' : ''}">
          <div class="score-num">${sc.value}<small>${sc.unit}</small></div>
          <div class="score-label">${S.esc(sc.label)}</div>
          ${sc.target != null ? `<div class="score-target">${reach ? 'Mencapai' : 'Belum mencapai'} target ${sc.target}${sc.unit}${exam && exam.scale === 'pct' ? ' (margin aman latihan)' : ''}</div>` : ''}
          ${meter(sc)}
        </div>
      </header>

      <section class="panel">
        <h2>Per bagian</h2>
        <div class="sec-bars">${res.sections.map((s) => `
          <div class="sec-bar">
            <div class="sec-bar-top"><span>${S.esc(s.name)}</span><span>${s.b}/${s.n} benar${s.pen ? ` · skor ${s.raw}` : ''}</span></div>
            <div class="stack" role="img" aria-label="${s.b} benar, ${s.s} salah, ${s.k} kosong">
              <i class="ok" style="width:${(s.b / s.n) * 100}%"></i><i class="bad" style="width:${(s.s / s.n) * 100}%"></i><i class="blank" style="width:${(s.k / s.n) * 100}%"></i>
            </div>
            <div class="sec-bar-sub">${s.s} salah · ${s.k} kosong · rata-rata ${s.n ? Math.round(s.time / s.n) : 0} dtk/soal</div>
          </div>`).join('')}
        </div>
        <div class="legend-inline"><span><i class="lg ok"></i>Benar</span><span><i class="lg bad"></i>Salah</span><span><i class="lg blank"></i>Kosong</span></div>
      </section>

      <div class="grid-2">
        <section class="panel">
          <h2>Per topik, dari yang terlemah</h2>
          <table class="topic-table"><thead><tr><th>Topik</th><th>Benar</th><th>Waktu</th><th></th></tr></thead><tbody>
          ${subs.map((x) => `<tr><td>${S.esc(S.subLabel(x.s))}</td><td><span class="pill ${x.p >= 70 ? 'ok' : x.p >= 50 ? 'mid' : 'bad'}">${x.p}%</span> <span class="muted small">${x.b}/${x.n}</span></td><td class="muted small">${x.avg} dtk</td><td><button type="button" class="btn btn-small" data-act="drill" data-sub="${x.s}">Latih</button></td></tr>`).join('')}
          </tbody></table>
        </section>
        <section class="panel">
          <h2>Catatan untuk sesi berikutnya</h2>
          <ul class="insights">${tips.map((t) => `<li>${t}</li>`).join('')}</ul>
          <div class="btn-row">
            ${res.s + res.k ? '<button type="button" class="btn btn-primary" data-act="retry-wrong">Ulangi soal salah & kosong</button>' : ''}
            ${exam ? `<button type="button" class="btn" data-act="start-exam" data-id="${exam.id}" data-mini="${sess.mini ? 1 : 0}">Simulasi lagi</button>` : ''}
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="review-head">
          <h2>Pembahasan</h2>
          <div class="chips" role="tablist">${Object.keys(fl).map((k) => `<button type="button" class="chip${filter === k ? ' on' : ''}" data-act="rfilter" data-f="${k}">${fl[k]} <span>${counts[k]}</span></button>`).join('')}</div>
        </div>
        <div class="review-layout">
          <div class="ljk-sheet ljk-review">${ljkRows(sess, 0, sess.q.length, 'review', res)}</div>
          <div class="review-list">${reviewList(sess, filter)}</div>
        </div>
      </section>
    </div>`;
  };
  function meter(sc) {
    const span = sc.max - sc.min;
    const pos = Math.max(0, Math.min(100, ((sc.value - sc.min) / span) * 100));
    const t = sc.target != null ? Math.max(0, Math.min(100, ((sc.target - sc.min) / span) * 100)) : null;
    return `<div class="meter" aria-hidden="true"><i style="width:${pos}%"></i>${t != null ? `<b style="left:${t}%"></b>` : ''}</div><div class="meter-scale"><span>${sc.min}</span><span>${sc.max}</span></div>`;
  }
  function insight(sess, res) {
    const out = [];
    const pen = res.sections.some((s) => s.pen);
    if (pen) {
      const s = S.sum(res.sections.filter((x) => x.pen).map((x) => x.s));
      const k = S.sum(res.sections.filter((x) => x.pen).map((x) => x.k));
      if (s > k * 1.5 && s > 5) out.push(`Di bagian bernilai minus kamu salah ${s} soal. Setiap salah memotong 1 poin; jika ragu dan tidak bisa mencoret satu pilihan pun, lebih baik dikosongkan.`);
      if (k > s * 2 && k > 5) out.push(`Kamu mengosongkan ${k} soal di bagian bernilai minus. Jika bisa mencoret 1–2 pilihan, menebak memberi nilai harapan positif.`);
    }
    res.sections.forEach((st, i) => {
      const sec = sess.sections[i];
      if (sec.secs && st.n) {
        const budget = sec.secs / st.n;
        const avg = st.time / st.n;
        if (st.k > st.n * 0.25 && avg > budget * 0.8) out.push(`${S.esc(st.name)}: ${st.k} soal tidak sempat dijawab. Jatah waktu ±${Math.round(budget)} detik per soal; lewati soal yang macet lebih dari ${Math.round(budget * 1.5)} detik.`);
      }
    });
    const weak = Object.entries(res.bySub).filter(([, x]) => x.n >= 3 && x.b / x.n < 0.5).map(([s]) => S.subLabel(s));
    if (weak.length) out.push(`Topik prioritas: <b>${weak.slice(0, 3).join(', ')}</b>. Buka Strategi & Rumus untuk teknik cepatnya, lalu latih 15–20 soal per topik.`);
    if (sess.blur) out.push(`Kamu keluar dari halaman ujian ${sess.blur}×. Biasakan fokus penuh: SIMAK UI dan Tes Bakat Skolastik LPDP diawasi secara daring.`);
    if (res.pct >= 80) out.push('Hasil sangat baik. Naikkan tingkat kesulitan: kerjakan simulasi penuh (bukan mini) dengan batas waktu asli.');
    if (!out.length) out.push('Pertahankan ritme. Ulangi soal yang salah besok untuk mengunci pemahaman (efek pengulangan berjarak).');
    return out;
  }
  function reviewList(sess, filter) {
    const res = sess.res;
    const shown = [];
    sess.q.forEach((q, i) => {
      const c = res.correct[i];
      const okf = filter === 'all' || (filter === 'bad' && c === false) || (filter === 'blank' && c === null) || (filter === 'ok' && c === true) || (filter === 'ragu' && sess.flag[i]);
      if (okf) shown.push(i);
    });
    if (!shown.length) return '<p class="muted">Tidak ada soal pada filter ini.</p>';
    let lastP = null;
    return shown.map((i) => {
      const q = sess.q[i];
      const key = S.dec(q.k);
      const a = sess.ans[i];
      const c = res.correct[i];
      const pas = q.p && q.p !== lastP ? S.passage(q.p) : null;
      lastP = q.p || null;
      return `${pas ? `<details class="rev-passage"><summary>Bacaan: ${S.esc(pas.t)}</summary><div class="passage-text">${S.rich(pas.x)}</div></details>` : ''}
      <article class="rev ${c === true ? 'ok' : c === false ? 'bad' : 'blank'}" id="rev-${i}">
        <div class="rev-head"><span class="qno">${i + 1}</span><span class="rev-state">${c === true ? 'Benar' : c === false ? 'Salah' : 'Kosong'}</span><span class="muted small">${S.esc(S.subLabel(q.s))} · ${sess.spent[i] || 0} dtk${sess.flag[i] ? ' · ragu-ragu' : ''}</span></div>
        ${q.au ? `<div class="audio-box">${S.tts.ok ? '<button type="button" class="btn btn-small" data-act="replay" data-i="' + i + '">Putar ulang audio</button>' : ''}${transcript(q)}</div>` : ''}
        <div class="qstem ${q.c === 'english' ? 'en' : ''}">${stemHtml(q)}</div>
        <ul class="rev-opts${q.h ? ' opts-fig' : ''}">${q.o.map((o, j) => `<li class="${j === key.a ? 'key' : ''}${a === j && j !== key.a ? ' wrong' : ''}"><span class="bubble">${LET[j]}</span><span>${q.h ? o : S.rich(o)}</span>${j === key.a ? '<em>kunci</em>' : a === j ? '<em>jawabanmu</em>' : ''}</li>`).join('')}</ul>
        <div class="explain"><b>Pembahasan.</b> ${S.rich(key.e || 'Belum ada pembahasan.')}</div>
      </article>`;
    }).join('');
  }

  /* ---------------- delegasi event ujian ---------------- */
  S.examActions = {
    pick: (el) => pick(+el.dataset.i),
    goto: (el) => go(+el.dataset.i),
    prev: () => go(cur.cur - 1),
    next: () => go(cur.cur + 1),
    flag: () => { cur.flag[cur.cur] = !cur.flag[cur.cur]; saveActive(cur); renderExam(); },
    clear: () => { cur.ans[cur.cur] = null; saveActive(cur); renderExam(); },
    play,
    'toggle-ljk': () => S.$('#ljk-panel').classList.toggle('open'),
    'finish-ask': finishAsk,
    'next-section': nextSection,
    submit: () => finish(),
    pause: () => {
      if (cur.paused) { cur.deadline = Date.now() + cur.left * 1000; cur.paused = false; cur.left = null; }
      else { cur.left = remaining(cur); cur.paused = true; cur.deadline = null; }
      saveActive(cur); renderExam();
    },
    'abandon-ask': () => modal(`<h3>Batalkan ujian?</h3><p>Semua jawaban pada sesi ini akan dihapus dan tidak masuk riwayat.</p><div class="modal-actions"><button type="button" class="btn btn-ghost" data-act="modal-close">Tidak jadi</button><button type="button" class="btn btn-danger" data-act="abandon">Ya, batalkan</button></div>`),
    abandon: () => { S.closeModal(); clearInterval(tick); S.discardActive(); cur = null; document.body.classList.remove('in-exam', 'strict'); location.hash = '#beranda'; },
  };
  S.examKey = function (e) {
    if (!cur || cur.status !== 'running' || cur.paused || S.$('#modal:not([hidden])')) return false;
    if (/input|select|textarea/i.test(e.target.tagName)) return false;
    const k = e.key.toLowerCase();
    const q = cur.q[cur.cur];
    const li = 'abcde'.indexOf(k);
    const ni = '12345'.indexOf(k);
    if (li >= 0 && li < q.o.length) { pick(li); return true; }
    if (ni >= 0 && ni < q.o.length) { pick(ni); return true; }
    if (k === 'arrowright') { go(cur.cur + 1); return true; }
    if (k === 'arrowleft') { go(cur.cur - 1); return true; }
    if (k === 'r') { S.examActions.flag(); return true; }
    return false;
  };
  S.examBlur = function () {
    if (cur && cur.status === 'running' && cur.strict && document.visibilityState === 'hidden') { cur.blur++; saveActive(cur); }
    else if (cur && cur.status === 'running' && document.visibilityState === 'visible') renderExam();
  };

  /* ---------------- text-to-speech untuk listening ---------------- */
  S.tts = {
    ok: typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined',
    voices: [],
    init() {
      if (!this.ok) return;
      const set = () => { this.voices = speechSynthesis.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang)); };
      set();
      try { speechSynthesis.addEventListener('voiceschanged', set); } catch (e) { speechSynthesis.onvoiceschanged = set; }
    },
    speak(lines, rate = 1, onend) {
      if (!this.ok) { onend && onend(false); return; }
      speechSynthesis.cancel();
      const vs = this.voices;
      const fem = vs.find((v) => /female|samantha|zira|susan|karen|moira|tessa|victoria|aria|jenny|libby|sonia|hazel|serena/i.test(v.name)) || vs[0];
      const mal = vs.find((v) => v !== fem && /male|daniel|david|alex|fred|guy|ryan|george|mark|thomas|arthur|oliver/i.test(v.name)) || vs.find((v) => v !== fem) || vs[0];
      let i = 0;
      const next = () => {
        if (i >= lines.length) { onend && onend(true); return; }
        const [who, text] = lines[i++];
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = rate;
        const vv = who === 'W' ? fem : who === 'M' ? mal : vs.find((x) => /en-GB/i.test(x.lang)) || vs[0];
        if (vv) u.voice = vv;
        u.pitch = who === 'W' ? 1.12 : who === 'M' ? 0.86 : 1;
        u.onend = () => setTimeout(next, who === 'N' ? 0 : 380);
        u.onerror = () => setTimeout(next, 50);
        speechSynthesis.speak(u);
      };
      next();
    },
    say(text, rate = 0.95) { this.speak([['N', text]], rate); },
    stop() { if (this.ok) { try { speechSynthesis.cancel(); } catch (e) { /* abaikan */ } } },
  };
})((window.SiapS2 = window.SiapS2 || {}));
