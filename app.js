/* Cake Heavan: content from the admin dashboard, product carousel and order form. */
(function () {
  'use strict';
  var boot = JSON.parse(document.getElementById('boot').textContent);
  var S = boot.settings, PRODUCTS = boot.products;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- WhatsApp + Instagram (one source of truth: the Settings in the admin dashboard) ---------- */
  var waNum = String(S.whatsapp_number).replace(/\D/g, '');
  function waUrl(msg) { return 'https://wa.me/' + waNum + (msg ? '?text=' + encodeURIComponent(msg) : ''); }
  function prettyPhone(d) { return d.length === 12 && d.indexOf('91') === 0 ? '+91 ' + d.slice(2) : '+' + d; }
  $$('[data-wa]').forEach(function (a) {
    a.href = a.getAttribute('data-wa') === 'plain' ? waUrl() : waUrl(S.wa_general_message);
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-wa-text]').forEach(function (n) { n.textContent = prettyPhone(waNum); });
  $$('[data-ig]').forEach(function (a) { a.href = S.instagram_url; a.target = '_blank'; a.rel = 'noopener'; });
  var m = /instagram\.com\/([^/?#]+)/i.exec(S.instagram_url || '');
  $$('.handle a').forEach(function (a) { if (m) a.textContent = '@' + m[1]; });

  /* ---------- editable text ---------- */
  var CANDLE = '<span class="candle" aria-hidden="true"><svg viewBox="0 0 24 90"><defs><clipPath id="cb"><rect x="5" y="40" width="14" height="50" rx="3"/></clipPath></defs><rect x="5" y="40" width="14" height="50" rx="3" fill="#EC6F93"/><g clip-path="url(#cb)" stroke="#fff" stroke-width="3.2" opacity=".85"><path d="M2 52 22 44M2 66 22 58M2 80 22 72M2 94 22 86"/></g><path d="M12 31v9" stroke="#3A1D16" stroke-width="1.7" stroke-linecap="round"/><g class="flame"><path d="M12 4C17.5 12 19 19.5 12 30 5 19.5 6.5 12 12 4Z" fill="#F7A83A"/><path d="M12 15c3 4.5 2.4 9.5 0 12-2.4-2.5-3-7.5 0-12Z" fill="#FFE9A8"/></g></svg></span><span class="sr">i</span>';
  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  $$('[data-s]').forEach(function (el) {
    var k = el.getAttribute('data-s'), v = S[k]; if (typeof v !== 'string') return;
    if (k === 'hero_title') {
      var html = esc(v), rx = /Celebrat(i)on/;
      el.innerHTML = rx.test(html) ? html.replace(rx, function () { return '<span class="nb">Celebrat' + CANDLE + 'on</span>'; }) : html;
    } else if (k === 'make_heading') {
      el.innerHTML = esc(v).replace(/WhatsApp/, '<span class="wa">WhatsApp</span>');
    } else if (k === 'order_body') {
      el.innerHTML = esc(v).replace(/\n/g, '<br>');
    } else el.textContent = v;
  });

  /* ---------- products ---------- */
  var rail = $('#rail'), gridAll = $('#gridAll');
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function productMsg(name) { return "Hello Cake Heavan! I'm interested in ordering " + name + '. Could you please share more details?'; }
  function orderLink(p) { var a = el('a', 'order', 'Customize & Order'); a.href = waUrl(productMsg(p.name)); a.target = '_blank'; a.rel = 'noopener'; a.draggable = false; return a; }
  function photo(p, wrapCls) { var w = el('div', 'ph'), i = new Image(); i.src = p.image; i.alt = p.name; i.draggable = false; i.decoding = 'async'; i.loading = 'lazy'; w.appendChild(i); return w; }
  PRODUCTS.forEach(function (p, i) {
    var c = el('article', 'card'); c.setAttribute('aria-label', p.name);
    c.appendChild(photo(p)); c.appendChild(el('h3', '', p.name)); c.appendChild(el('p', '', p.description)); c.appendChild(orderLink(p));
    rail.appendChild(c);
    var g = el('article', 'gcard'); g.appendChild(photo(p)); g.appendChild(el('h3', '', p.name)); g.appendChild(orderLink(p)); gridAll.appendChild(g);
  });
  if (!PRODUCTS.length) { var empty = el('p', 'sub-t', 'New creations are coming soon. Message us on WhatsApp to order a custom cake.'); rail.parentNode.replaceChild(empty, rail); $('.car-ui').hidden = true; $('.all-wrap').hidden = true; }

  /* close the mobile menu after choosing a link */
  var menuEl = $('#menu'), burgerEl = $('#burger');
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menuEl.classList.remove('open'); burgerEl.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- carousel ---------- */
  var car = $('#car'), cards = [].slice.call(rail.children), n = cards.length, idx = Math.min(2, Math.max(0, n - 1));
  var prev = $('#prev'), next = $('#next'), count = $('#count'), bar = $('#bar');
  if (n) {
    var xFor = function (i) { var c = cards[i]; return car.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2); };
    var pad = function (v) { return (v < 10 ? '0' : '') + v; };
    var go = function (i, anim) {
      idx = clamp(i, 0, n - 1);
      rail.style.transition = (anim === false || reduce) ? 'none' : 'transform .8s cubic-bezier(.22,1,.36,1)';
      rail.style.transform = 'translate3d(' + xFor(idx) + 'px,0,0)';
      cards.forEach(function (c, k) { c.classList.toggle('on', k === idx); c.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
      prev.disabled = idx === 0; next.disabled = idx === n - 1;
      count.textContent = pad(idx + 1) + ' / ' + pad(n); bar.style.width = ((idx + 1) / n * 100) + '%';
    };
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    car.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(idx + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(idx - 1); e.preventDefault(); } });
    var down = false, moved = false, sx = 0, sy = 0, base = 0, dx = 0, t0 = 0, pid = null, lock = null;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sy = e.clientY; dx = 0; lock = null; base = xFor(idx); t0 = performance.now(); pid = e.pointerId;
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      var mx = e.clientX - sx, my = e.clientY - sy;
      if (lock === null && (Math.abs(mx) > 7 || Math.abs(my) > 7)) { lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'; if (lock === 'x') { try { rail.setPointerCapture(pid); } catch (_) {} rail.classList.add('drag'); } }
      if (lock !== 'x') return;
      moved = true; dx = mx; rail.style.transition = 'none'; rail.style.transform = 'translate3d(' + (base + dx) + 'px,0,0)';
    });
    var end = function () {
      if (!down) return; down = false; rail.classList.remove('drag');
      if (!moved) return;
      var v = dx / Math.max(1, performance.now() - t0), centre = car.clientWidth / 2 - (base + dx), best = idx, bd = 1e9;
      cards.forEach(function (c, k) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centre); if (d < bd) { bd = d; best = k; } });
      if (Math.abs(v) > .45 && best === idx) best = idx + (v < 0 ? 1 : -1);
      go(best);
    };
    rail.addEventListener('pointerup', end); rail.addEventListener('pointercancel', end);
    rail.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
      if (e.target.closest('a')) return;
      var c = e.target.closest('.card'); if (c) { var k = cards.indexOf(c); if (k !== idx) go(k); }
    }, true);
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
    window.addEventListener('resize', function () { go(idx, false); });
    go(idx, false); window.addEventListener('load', function () { go(idx, false); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { go(idx, false); });
  }

  /* explore all desserts */
  var allBtn = $('#allBtn');
  allBtn.addEventListener('click', function () {
    var o = gridAll.classList.toggle('open'); allBtn.setAttribute('aria-expanded', o);
    $('#allTxt').textContent = o ? 'Show less' : 'Explore all desserts'; $('#allArr').textContent = o ? '↑' : '→';
    if (o) setTimeout(function () { gridAll.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 60);
  });

  /* ---------- reveal on scroll + count-up ---------- */
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .15, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(function (x) { io.observe(x); });
  } else rv.forEach(function (x) { x.classList.add('in'); });
  var nums = $$('[data-count]');
  function run(node) {
    var to = +node.getAttribute('data-count'), suf = node.getAttribute('data-suffix') || '', t0 = null, D = 1700;
    function step(ts) { if (!t0) t0 = ts; var k = clamp((ts - t0) / D, 0, 1), e = 1 - Math.pow(1 - k, 3); node.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    nums.forEach(function (x) { x.textContent = '0' + (x.getAttribute('data-suffix') || ''); });
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io2.unobserve(e.target); } }); }, { threshold: .5 });
    nums.forEach(function (x) { io2.observe(x); });
  }

  /* ---------- order form ---------- */
  var form = $('#orderForm'); if (!form) return;
  var btn = $('#ofBtn'), btnTxt = $('#ofBtnTxt'), status = $('#ofStatus');
  function opt(sel, val, label, disabled) { var o = document.createElement('option'); o.value = val; o.textContent = label || val; if (disabled) { o.disabled = true; o.selected = true; } sel.appendChild(o); }
  var selP = $('#of-product'), selO = $('#of-occasion'), selS = $('#of-size');
  opt(selP, '', 'Choose a cake', true); PRODUCTS.forEach(function (p) { opt(selP, p.name); }); opt(selP, 'Custom design (not listed)');
  opt(selO, '', 'Choose an occasion', true); boot.occasions.forEach(function (o) { opt(selO, o); });
  opt(selS, '', 'Choose a size', true); boot.sizes.forEach(function (o) { opt(selS, o); });
  var d = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); $('#of-date').min = d;
  function uuid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }
  var uid = uuid(), submitting = false, submitted = false;

  $$('.card .order').forEach(function () {}); // product buttons already open WhatsApp directly
  function showErrors(f) { $$('[data-err]', form).forEach(function (p) { var k = p.getAttribute('data-err'); p.textContent = f && f[k] ? f[k] : ''; var i = p.parentNode.querySelector('[name="' + k + '"]'); if (i) i.setAttribute('aria-invalid', f && f[k] ? 'true' : 'false'); }); }
  function clientCheck(v) {
    var e = {}, digits = v.phone.replace(/\D/g, '');
    if (v.name.trim().length < 2) e.name = 'Please enter your name.';
    if (digits.length < 8 || digits.length > 15) e.phone = 'Enter a valid phone number (8 to 15 digits).';
    if (!v.product) e.product = 'Please choose a cake.';
    if (!v.occasion) e.occasion = 'Please choose an occasion.';
    if (!v.delivery_date) e.delivery_date = 'Please choose a delivery date.'; else if (v.delivery_date < d) e.delivery_date = 'The delivery date cannot be in the past.';
    if (!v.size) e.size = 'Please choose a cake size.';
    var q = parseInt(v.quantity, 10); if (!(q >= 1 && q <= 50)) e.quantity = 'Quantity must be between 1 and 50.';
    return e;
  }
  function say(kind, html) { status.className = 'full status ' + kind; status.innerHTML = html; status.focus({ preventScroll: false }); }
  form.addEventListener('input', function (ev) { var k = ev.target.name; var p = form.querySelector('[data-err="' + k + '"]'); if (p) { p.textContent = ''; ev.target.setAttribute('aria-invalid', 'false'); } });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); if (submitting) return;
    var fd = new FormData(form), v = {}; fd.forEach(function (val, k) { v[k] = String(val); });
    var errs = clientCheck(v); showErrors(errs);
    if (Object.keys(errs).length) { var first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); say('bad', 'Please fix the highlighted fields and try again.'); return; }
    v.uid = uid; submitting = true; btn.disabled = true; btnTxt.textContent = 'Sending…'; status.className = 'full'; status.textContent = '';
    var message = [
      'Hello Cake Heavan! I would like to place a cake order.',
      '',
      'Name: ' + v.name.trim(),
      'Phone: ' + v.phone.trim(),
      'Cake: ' + v.product,
      'Occasion: ' + v.occasion,
      'Delivery date: ' + v.delivery_date,
      'Size: ' + v.size,
      'Quantity: ' + (v.quantity || '1'),
      'Design requirements: ' + (v.design.trim() || 'Not specified'),
      'Additional message: ' + (v.message.trim() || 'None')
    ].join('\n');
    var link = waUrl(message);
    submitted = true;
    submitting = false;
    btn.disabled = false;
    btnTxt.textContent = 'Open WhatsApp to send order';
    say('ok', '<strong>Your order details are ready!</strong> WhatsApp will open with your message. Please review it and press <b>Send</b> in WhatsApp. Your order is not submitted until you send that message.<div class="again"><a class="btn-u fill" href="' + link + '" target="_blank" rel="noopener">Open WhatsApp to send <span aria-hidden="true">→</span></a><button type="button" class="btn-u" id="ofAgain">Place another order</button></div>');
    var waWindow = null;
    try { waWindow = window.open(link, '_blank', 'noopener'); } catch (_) {}
    var again = $('#ofAgain');
    if (again) again.addEventListener('click', function () {
      form.reset(); showErrors(null); uid = uuid(); submitting = false; submitted = false;
      btn.disabled = false; btnTxt.textContent = 'Send order on WhatsApp';
      status.className = 'full'; status.textContent = ''; $('#of-qty').value = 1;
    });
  });
  /* choosing "Customize & Order" on a cake also pre-selects it in the form for people who prefer the form */
})();
