// Tap Talk insights portal. No libraries, no data of its own: every number comes
// from the password-protected summary function. The password lives in this tab only.
(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);
  const weekLabel = (w) => new Date(`${w}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const KEY = 'tt-portal-pw';
  let summaryUrl = null;

  const tip = $('tip');
  function showTip(text, x, y) {
    tip.textContent = text;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    tip.style.left = `${Math.min(window.innerWidth - r.width - 8, Math.max(8, x - r.width / 2))}px`;
    tip.style.top = `${Math.max(8, y - r.height - 10)}px`;
  }
  const hideTip = () => (tip.hidden = true);
  function wireTips(root) {
    root.querySelectorAll('[data-tip]').forEach((el) => {
      const show = (e) => {
        const b = el.getBoundingClientRect();
        showTip(el.getAttribute('data-tip'), e && e.clientX ? e.clientX : b.left + b.width / 2, b.top);
      };
      el.addEventListener('mousemove', show);
      el.addEventListener('focus', () => show());
      el.addEventListener('mouseleave', hideTip);
      el.addEventListener('blur', hideTip);
    });
  }

  function table(head, rows) {
    return `<details><summary>Show as a table</summary><table><thead><tr>${head.map((h, i) => `<th${i ? ' class="n"' : ''}>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ''}>${esc(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody></table></details>`;
  }

  /** Vertical bars over weeks; each bar is a stack of segments [{value, color, name}]. */
  function weekBars(weeks, segments, caption) {
    const W = 760, H = 240, L = 40, B = 28, T = 14;
    const totals = weeks.map((_, i) => segments.reduce((s, seg) => s + seg.values[i], 0));
    const max = Math.max(1, ...totals);
    const step = Math.pow(10, Math.floor(Math.log10(max)));
    const top = Math.ceil(max / step) * step;
    const y = (v) => T + (H - T - B) * (1 - v / top);
    const bw = Math.min(44, ((W - L) / weeks.length) * 0.62);
    const x = (i) => L + ((W - L) / weeks.length) * (i + 0.5);
    let svg = '';
    for (let k = 0; k <= 4; k++) {
      const v = (top / 4) * k;
      svg += `<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="var(--grid)" stroke-width="1"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${fmt(Math.round(v))}</text>`;
    }
    weeks.forEach((w, i) => {
      let base = 0;
      const parts = segments.map((s) => `${s.name}: ${fmt(s.values[i])}`).join(' · ');
      segments.forEach((seg, si) => {
        const v = seg.values[i];
        if (v <= 0) return;
        const y0 = y(base + v), h = y(base) - y(base + v) - (si > 0 ? 2 : 0);
        svg += `<rect x="${x(i) - bw / 2}" y="${y0}" width="${bw}" height="${Math.max(1, h)}" rx="3" fill="${seg.color}"/>`;
        base += v;
      });
      svg += `<rect class="bar" tabindex="0" role="img" aria-label="Week of ${weekLabel(w)}: ${parts}" data-tip="Week of ${weekLabel(w)} · ${parts}" x="${x(i) - bw / 2 - 4}" y="${T}" width="${bw + 8}" height="${H - T - B}" fill="transparent"/>`;
      if (i % Math.ceil(weeks.length / 7) === 0 || i === weeks.length - 1) svg += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${weekLabel(w)}</text>`;
    });
    const last = weeks.length - 1;
    if (last >= 0) svg += `<text class="value-label" x="${x(last)}" y="${y(totals[last]) - 6}" text-anchor="middle">${fmt(totals[last])}</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(caption)}">${svg}<line x1="${L}" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-width="1"/></svg>`;
  }

  /** Horizontal bars for shares or counts: [{label, value, total}]. HTML, so text stays readable at any width. */
  function hBars(items, unit) {
    if (!items.length) return '<p class="empty">No reports in this period yet.</p>';
    const max = Math.max(1, ...items.map((i) => (unit === '%' ? 100 : i.value)));
    return `<div class="hbars">${items
      .map((it) => {
        const v = unit === '%' ? pct(it.value, it.total) : it.value;
        const label = unit === '%' ? `${v}% (${fmt(it.value)} of ${fmt(it.total)})` : fmt(v);
        return `<div class="hrow" tabindex="0" role="img" aria-label="${esc(it.label)}: ${esc(label)}" data-tip="${esc(it.label)}: ${esc(label)}"><span class="hlabel">${esc(it.label)}</span><span class="htrack"><span class="hfill" data-w="${((v / max) * 100).toFixed(1)}"></span></span><span class="hval">${unit === '%' ? `${v}%` : fmt(v)}</span></div>`;
      })
      .join('')}</div>`;
  }

  const LABELS = {
    'en-US': 'English', 'es-ES': 'Spanish', phone: 'Phone', tablet: 'Tablet', desktop: 'Computer',
    medium: 'Medium', large: 'Large', 'x-large': 'Extra large', '0': 'None', '1-5': '1 to 5', '6-20': '6 to 20', '21+': '21 or more',
  };
  const ORDER = { tenure: ['first week', '1-3 weeks', '1-3 months', '3+ months'], custom_tiles: ['0', '1-5', '6-20', '21+'], text_size: ['medium', 'large', 'x-large'] };

  function render(data) {
    const weekly = data.weekly || [];
    const dims = data.dimensions || [];
    $('generated').textContent = `Updated ${new Date(data.generatedAt).toLocaleString('en-US')}.`;
    if (!weekly.length) {
      $('stats').innerHTML = '';
      $('chart-devices').innerHTML = '<h2>No reports yet</h2><p class="empty">Once people switch on “Help improve Tap Talk”, each device reports after the week ends. Check back next week.</p>';
      ['chart-messages', 'chart-features', 'breakdowns', 'refs'].forEach((id) => ($(id).innerHTML = ''));
      return;
    }
    const last = weekly[weekly.length - 1];
    const prev = weekly[weekly.length - 2];
    const delta = (a, b) => (b ? `${a - b >= 0 ? '+' : ''}${fmt(a - b)} vs the week before` : 'First week of data');
    const stat = (label, value, sub) => `<div class="stat"><p class="label">${esc(label)}</p><p class="value">${esc(value)}</p><p class="delta">${esc(sub)}</p></div>`;
    $('stats').innerHTML = [
      stat('Active devices', fmt(last.devices), delta(last.devices, prev && prev.devices)),
      stat('New devices', fmt(last.new_devices), delta(last.new_devices, prev && prev.new_devices)),
      stat('Messages spoken', fmt(last.messages_spoken), `${last.devices ? (last.messages_spoken / last.devices).toFixed(1) : 0} per device`),
      stat('On the home screen', `${pct(last.installed, last.devices)}%`, 'installed as an app'),
      stat('Opened Help', `${pct(last.used_help, last.devices)}%`, `${fmt(last.alerts_started)} alerts started`),
    ].join('');
    const lastLabel = `Week of ${weekLabel(last.week)}`;
    $('stats').setAttribute('aria-label', `${lastLabel}, the last finished week`);

    const weeks = weekly.map((w) => w.week);
    $('chart-devices').innerHTML = `<div class="chart-head"><h2>Weekly active devices</h2><ul class="legend"><li><span class="sw s1"></span>Returning</li><li><span class="sw s2"></span>New this week</li></ul></div>
      <p class="muted note">Growth and retention: new devices are in their first week of use.</p>
      ${weekBars(weeks, [
        { name: 'Returning', color: 'var(--series-1)', values: weekly.map((w) => w.devices - w.new_devices) },
        { name: 'New', color: 'var(--series-2)', values: weekly.map((w) => w.new_devices) },
      ], 'Weekly active devices, returning and new')}
      ${table(['Week', 'Devices', 'New', 'Returning'], weekly.map((w) => [weekLabel(w.week), fmt(w.devices), fmt(w.new_devices), fmt(w.devices - w.new_devices)]))}`;

    $('chart-messages').innerHTML = `<h2>Messages spoken per week</h2><p class="muted note">How much people talk with Tap Talk, across all opted-in devices.</p>
      ${weekBars(weeks, [{ name: 'Messages', color: 'var(--series-1)', values: weekly.map((w) => w.messages_spoken) }], 'Messages spoken per week')}
      ${table(['Week', 'Messages', 'Tiles tapped', 'Times opened', 'Help phrases', 'Tiles added'], weekly.map((w) => [weekLabel(w.week), fmt(w.messages_spoken), fmt(w.tiles_tapped), fmt(w.sessions), fmt(w.help_phrases_spoken), fmt(w.custom_tiles_added)]))}`;

    const feats = [
      { label: 'Opened Help', value: last.used_help, total: last.devices },
      { label: 'Started an alert', value: last.used_alert, total: last.devices },
      { label: 'Has own tiles', value: last.has_custom_tiles, total: last.devices },
      { label: 'Saved a phrase', value: last.used_save, total: last.devices },
      { label: 'Typed a word', value: last.used_typing, total: last.devices },
    ];
    $('chart-features').innerHTML = `<h2>Features used · ${esc(lastLabel)}</h2><p class="muted note">Share of active devices that used each feature.</p>${hBars(feats, '%')}${table(['Feature', 'Devices', 'Share'], feats.map((f) => [f.label, fmt(f.value), `${pct(f.value, f.total)}%`]))}`;

    // Breakdowns over the last four reported weeks (device-weeks).
    const recent = new Set(weeks.slice(-4));
    const sum = (dim) => {
      const m = new Map();
      dims.filter((d) => d.dimension === dim && recent.has(d.week)).forEach((d) => m.set(d.key, (m.get(d.key) || 0) + d.devices));
      const total = [...m.values()].reduce((a, b) => a + b, 0);
      const keys = ORDER[dim] ? ORDER[dim].filter((k) => m.has(k)) : [...m.keys()].sort((a, b) => m.get(b) - m.get(a));
      return keys.map((k) => ({ label: LABELS[k] || k.charAt(0).toUpperCase() + k.slice(1), value: m.get(k), total }));
    };
    const block = (title, dim) => `<section class="card"><h2>${esc(title)}</h2>${hBars(sum(dim), '%')}</section>`;
    $('breakdowns').innerHTML = [
      block('Language', 'language'), block('Device', 'screen'), block('Where it runs', 'installed'),
      block('Text size', 'text_size'), block('How long they have used it', 'tenure'), block('Own tiles', 'custom_tiles'),
    ].join('');

    // Marketing: which link tags brought new devices (?ref=... on links you share).
    const refs = new Map();
    dims.filter((d) => d.dimension === 'ref_new').forEach((d) => refs.set(d.key, (refs.get(d.key) || 0) + d.devices));
    const refRows = [...refs.entries()].sort((a, b) => b[1] - a[1]);
    $('refs').innerHTML = `<h2>Where new devices came from</h2><p class="muted note">Add <code>?ref=your-tag</code> to links you share (letters, numbers and dashes). Counted once, in a device’s first week, last 13 weeks.</p>
      ${refRows.length ? hBars(refRows.map(([k, v]) => ({ label: k, value: v })), 'n') + table(['Link tag', 'New devices'], refRows.map(([k, v]) => [k, fmt(v)])) : '<p class="empty">No new devices reported yet.</p>'}`;

    $('dash').querySelectorAll('.hfill[data-w]').forEach((el) => (el.style.width = `${el.getAttribute('data-w')}%`));
    wireTips($('dash'));
  }

  async function load(pw) {
    const err = $('login-error');
    err.hidden = true;
    let res;
    try {
      res = await fetch(summaryUrl, { headers: { Authorization: `Bearer ${pw}` }, cache: 'no-store', credentials: 'omit' });
    } catch {
      err.textContent = 'Could not reach the summary. Check your connection and try again.';
      err.hidden = false;
      return false;
    }
    if (res.status === 401) {
      sessionStorage.removeItem(KEY);
      err.textContent = 'That password did not work.';
      err.hidden = false;
      $('login').hidden = false;
      $('dash').hidden = true;
      return false;
    }
    if (!res.ok) {
      err.textContent = `The summary returned an error (${res.status}).`;
      err.hidden = false;
      return false;
    }
    sessionStorage.setItem(KEY, pw);
    render(await res.json());
    $('login').hidden = true;
    $('dash').hidden = false;
    $('signout').hidden = false;
    return true;
  }

  $('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    void load($('pw').value);
  });
  $('signout').addEventListener('click', () => {
    sessionStorage.removeItem(KEY);
    location.reload();
  });

  fetch('config.json', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : { summaryUrl: null }))
    .catch(() => ({ summaryUrl: null }))
    .then((cfg) => {
      summaryUrl = cfg.summaryUrl;
      if (!summaryUrl) {
        $('setup').hidden = false;
        return;
      }
      const saved = sessionStorage.getItem(KEY);
      $('login').hidden = false;
      if (saved) void load(saved);
      else $('pw').focus();
    });
})();
