/* Siap S2 — utilitas inti: RNG, codec kunci jawaban, penyimpanan, Markdown */
(function (S) {
  'use strict';

  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- RNG (mulberry32) ---------- */
  function rng(seed) {
    let a = seed >>> 0 || 1;
    const next = () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      shuffle: (arr) => {
        const b = arr.slice();
        for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
        return b;
      },
      chance: (p) => next() < p,
    };
  }
  const newSeed = () => ((Date.now() % 2147483647) ^ Math.floor(Math.random() * 2147483647)) >>> 0;

  /* ---------- Codec kunci jawaban (harus sama dengan tools/build.js) ---------- */
  const KEY = 'LJK-2B-SiapS2';
  function enc(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i] ^ KEY.charCodeAt(i % KEY.length));
    return btoa(bin);
  }
  function dec(str) {
    const bin = atob(str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  /* ---------- Penyimpanan lokal (aman bila localStorage diblokir) ---------- */
  const PFX = 'siaps2:';
  const mem = {};
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem(PFX + k); if (v != null) return JSON.parse(v); } catch (e) { /* pakai memori */ }
      return k in mem ? JSON.parse(mem[k]) : d;
    },
    set(k, v) {
      const s = JSON.stringify(v);
      mem[k] = s;
      try { localStorage.setItem(PFX + k, s); return true; } catch (e) { return false; }
    },
    del(k) {
      delete mem[k];
      try { localStorage.removeItem(PFX + k); } catch (e) { /* abaikan */ }
    },
    /** true bila localStorage bisa dipakai (tidak dalam mode samaran/pratinjau yang memblokir). */
    durable() {
      try { const t = PFX + '__t'; localStorage.setItem(t, '1'); localStorage.removeItem(t); return true; } catch (e) { return false; }
    },
    /** perkiraan ukuran data aplikasi di localStorage, dalam byte (UTF-16). */
    size() {
      let n = 0;
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PFX)) n += k.length + (localStorage.getItem(k) || '').length; } } catch (e) { /* abaikan */ }
      return n * 2;
    },
    keys() {
      const out = new Set(Object.keys(mem));
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PFX)) out.add(k.slice(PFX.length)); } } catch (e) { /* abaikan */ }
      return [...out];
    },
  };

  /* ---------- Waktu & format ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  function clock(sec) {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const dayNum = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  const fmtDate = (ts) => new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDateTime = (ts) => new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /* ---------- Markup ringan di stem soal ---------- */
  // Mendukung **tebal**, *miring*, <u>, <b>, <i>, <br>, <sub>, <sup>, dan [A|teks] untuk written expression.
  const SAFE_TAGS = /&lt;(\/?)(b|i|u|br|sub|sup|em|strong)&gt;/g;
  function rich(s) {
    let t = esc(s).replace(SAFE_TAGS, '<$1$2>')
      .replace(/&lt;span class=&quot;(seq|figs|fig|fig fig-q)&quot;&gt;/g, '<span class="$1">')
      .replace(/&lt;\/span&gt;/g, '</span>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    t = t.replace(/\[([A-D])\|([^\]]+)\]/g, '<span class="we"><u>$2</u><sub>$1</sub></span>');
    return t.replace(/\n/g, '<br>');
  }

  /* ---------- Markdown → HTML (subset GFM + callout GitHub) ---------- */
  function inline(s) {
    s = esc(s);
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+|#[\w-]*)\)/g, (_, t, u) =>
        `<a href="${u}"${u[0] === '#' ? '' : ' target="_blank" rel="noopener"'}>${t}</a>`)
      .replace(/&lt;br&gt;/g, '<br>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
  }
  const slug = (t) => t.toLowerCase().replace(/[`*_[\]()]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  function table(rows) {
    const cells = (r) => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    return `<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body
      .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const ALERT = { NOTE: 'Catatan', TIP: 'Tips', IMPORTANT: 'Penting', WARNING: 'Perhatian', CAUTION: 'Hati-hati' };
  function quote(buf) {
    const m = buf[0] && buf[0].match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/);
    if (m) {
      const rest = [m[2], ...buf.slice(1)].join('\n');
      return `<div class="callout callout-${m[1].toLowerCase()}"><p class="callout-label">${ALERT[m[1]]}</p>${md(rest)}</div>`;
    }
    return `<blockquote>${md(buf.join('\n'))}</blockquote>`;
  }
  function list(buf) {
    const items = [];
    buf.forEach((line) => {
      const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (m) items.push({ ind: m[1].length, ord: /\d/.test(m[2]), text: m[3] });
      else if (items.length) items[items.length - 1].text += ' ' + line.trim();
    });
    let html = '';
    const stack = [];
    items.forEach((it) => {
      const top = stack[stack.length - 1];
      if (!top || it.ind > top.ind) {
        const tag = it.ord ? 'ol' : 'ul';
        stack.push({ ind: it.ind, tag });
        html += `<${tag}>`;
      } else {
        while (stack.length > 1 && it.ind < stack[stack.length - 1].ind) html += `</li></${stack.pop().tag}>`;
        html += '</li>';
      }
      const task = it.text.match(/^\[( |x)\]\s+(.*)$/i);
      html += task ? `<li class="task"><span class="check${task[1].trim() ? ' on' : ''}"></span>${inline(task[2])}` : `<li>${inline(it.text)}`;
    });
    while (stack.length) html += `</li></${stack.pop().tag}>`;
    return html;
  }
  const BLOCK_START = /^(#{1,4}\s|```|>|\||<|\s*([-*]|\d+\.)\s)/;
  function md(src) {
    const lines = String(src).replace(/\r/g, '').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      let m;
      if (/^\s*$/.test(l)) { i++; continue; }
      if ((m = l.match(/^<!--\s*widget:([\w-]+)\s*-->/))) { out.push(`<div class="widget" data-widget="${m[1]}"></div>`); i++; continue; }
      if (/^<!--/.test(l)) { while (i < lines.length && !/-->/.test(lines[i])) i++; i++; continue; }
      if (/^```/.test(l)) {
        const buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++; out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`); continue;
      }
      if ((m = l.match(/^(#{1,4})\s+(.*)$/))) { const lv = m[1].length; out.push(`<h${lv} id="${slug(m[2])}">${inline(m[2])}</h${lv}>`); i++; continue; }
      if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
      if (/^</.test(l)) { out.push(l); i++; continue; }
      if (/^\|/.test(l)) { const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]); out.push(table(rows)); continue; }
      if (/^>/.test(l)) { const buf = []; while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out.push(quote(buf)); continue; }
      if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
        const buf = [];
        while (i < lines.length && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) buf.push(lines[i++]);
        out.push(list(buf)); continue;
      }
      const buf = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !BLOCK_START.test(lines[i])) buf.push(lines[i++]);
      if (!buf.length) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
    return out.join('\n');
  }

  /* ---------- Lain-lain ---------- */
  const groupBy = (arr, key) => arr.reduce((acc, x) => { (acc[x[key]] = acc[x[key]] || []).push(x); return acc; }, {});
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function toast(msg, kind = '') {
    let box = $('#toast');
    if (!box) { box = document.createElement('div'); box.id = 'toast'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  }

  Object.assign(S, { esc, rng, newSeed, enc, dec, store, clock, today, dayNum, fmtDate, fmtDateTime, pct, rich, md, inline, groupBy, sum, uid, $, $$, toast, slug });
})((window.SiapS2 = window.SiapS2 || {}));
