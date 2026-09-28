const CONFIG = {
  invitationLetter: `Mình viết vài dòng này\nvới rất nhiều chân thành.\n\nTuổi mới sắp tới —\nmình muốn được ngồi cùng\nnhững người quan trọng,\nuống một ly, kể vài câu chuyện,\nvà cảm ơn vì đã ở bên.\n\nKhông cần mang gì cầu kỳ.\nChỉ cần bạn tới là đủ\nđể buổi tối ấy trở nên đặc biệt.\n\nHẹn gặp bạn\nvào tối thứ Bảy tại Tà Vẹt.`,
  senderName: 'Việt Nam',
  eventDate: '03/10/2026',
  eventDow: 'Thứ Bảy',
  eventTime: 'Từ 18:00',
  eventPlace: 'Tà Vẹt Coffee & Pub',
  eventAddress: '11 Võ Thị Sáu, Huế',
  eventMapsUrl: 'https://maps.google.com/?q=Tà+Vẹt+Coffee+Pub+11+Võ+Thị+Sáu+Huế',
  eventDateISO: '2026-10-03',
  wishlistNormal: ['Một bó hoa nhỏ', 'Một cuốn sách hay', 'Cà phê / trà'],
  wishlistSpecial: ['Sự có mặt của bạn tại bữa tiệc'],
  gasEndpoint: ''
};

const state = { name: '', role: '', wishlist: [], attending: true };
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const scenes = {
  horses: $('#scene-horses'),
  envelope: $('#scene-envelope'),
  intro: $('#scene-intro'),
  letter: $('#scene-letter'),
  info: $('#scene-info'),
  wishlist: $('#scene-wishlist'),
  confirm: $('#scene-confirm'),
  thanks: $('#scene-thanks')
};

function showScene(name) {
  const cur = document.querySelector('.scene.active');
  const next = scenes[name];
  if (!next || cur === next) return;
  const tl = gsap.timeline({
    onComplete: function () {
      if (cur) {
        cur.classList.remove('active');
        gsap.set(cur, { clearProps: 'all' });
      }
      next.classList.add('active');
    }
  });
  if (cur) {
    tl.to(cur, { opacity: 0, y: -16, duration: 0.4, ease: 'power2.inOut' });
  }
  gsap.set(next, { opacity: 0, y: 24 });
  next.classList.add('active');
  tl.to(next, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, cur ? '-=0.12' : 0);
}

function horseSVG(color) {
  return (
    '<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="' + color + '">' +
    '<ellipse cx="62" cy="48" rx="36" ry="18"/>' +
    '<path d="M92 42c8-6 14-18 12-26-1-3-4-5-7-4-5 2-9 10-12 18-2 4-2 8 0 10 3 2 5 3 7 2z"/>' +
    '<ellipse cx="108" cy="18" rx="9" ry="8"/>' +
    '<path d="M104 10l-2-8 6 4z"/>' +
    '<path d="M94 28c-2-8 0-14 4-18 1 5 2 10 0 16-1 2-3 3-4 2z" opacity="0.7"/>' +
    '<path d="M28 44c-10 2-18 10-20 18 6-2 14-6 20-12 2-2 2-5 0-6z" opacity="0.85"/>' +
    '<g class="leg-front">' +
    '<path d="M78 58c1 8 2 16 1 22h5c1-8 0-16-1-22z"/>' +
    '<path d="M88 56c2 9 3 17 2 24h5c1-9 0-17-2-24z" opacity="0.9"/>' +
    '</g>' +
    '<g class="leg-hind">' +
    '<path d="M42 58c-1 9-2 17-1 24h5c0-8 1-16 1-24z"/>' +
    '<path d="M52 56c0 10-1 18 0 24h5c0-8 1-16 0-24z" opacity="0.9"/>' +
    '</g></g>' +
    '<circle cx="111" cy="16" r="1.5" fill="#2a1c10" opacity="0.6"/>' +
    '</svg>'
  );
}

function initHorses() {
  var sky = $('#sky-stars');
  for (var i = 0; i < 48; i++) {
    var s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 58 + '%';
    s.style.animationDelay = Math.random() * 2.8 + 's';
    s.style.width = s.style.height = 1 + Math.random() * 2.2 + 'px';
    sky.appendChild(s);
  }
  gsap.to('#moon', { scale: 1.06, opacity: 0.95, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  var track = $('#horse-track');
  var dustEl = $('#dust');
  var colors = ['#c4a574', '#a89070', '#8b7355', '#d4b896', '#9a8060', '#bba07a', '#c9b08a'];
  var herd = [
    { layer: 'far', scale: 0.55, bottom: 28, speed: 3.6, count: 3, stagger: 0.35 },
    { layer: 'mid', scale: 0.78, bottom: 12, speed: 2.8, count: 3, stagger: 0.28 },
    { layer: 'near', scale: 1.05, bottom: 0, speed: 2.2, count: 3, stagger: 0.22 }
  ];
  var allHorses = [];
  var idx = 0;
  herd.forEach(function (band) {
    for (var i = 0; i < band.count; i++) {
      var el = document.createElement('div');
      el.className = 'horse ' + band.layer;
      el.innerHTML = horseSVG(colors[idx % colors.length]);
      el.style.left = '-120px';
      el.style.bottom = band.bottom + (Math.random() * 8 - 2) + 'px';
      el.style.width = 88 * band.scale + 'px';
      el.style.height = 64 * band.scale + 'px';
      track.appendChild(el);
      allHorses.push({ el: el, band: band, i: i });
      idx++;
    }
  });
  gsap.to('#horses-caption', { opacity: 1, duration: 1.1, delay: 0.25, ease: 'power2.out' });
  function screenW() {
    return ($('#app') ? $('#app').clientWidth : window.innerWidth) || 400;
  }
  var master = gsap.timeline({
    delay: 0.5,
    onComplete: function () {
      setTimeout(function () {
        showScene('envelope');
        initEnvelopeIdle();
      }, 500);
    }
  });
  allHorses.forEach(function (item) {
    var el = item.el;
    var band = item.band;
    var i = item.i;
    var startX = -140 - i * 50 - Math.random() * 30;
    var endX = screenW() + 100 + i * 40;
    var dur = band.speed + Math.random() * 0.35;
    var delay = i * band.stagger + (band.layer === 'far' ? 0.15 : band.layer === 'mid' ? 0.05 : 0);
    master.fromTo(el, { x: startX, opacity: 0 }, { x: endX, opacity: 1, duration: dur, ease: 'none', delay: delay }, 0);
    var bobAmt = band.layer === 'near' ? 7 : band.layer === 'mid' ? 5 : 3.5;
    gsap.to(el, { y: -bobAmt, duration: 0.16 + Math.random() * 0.04, yoyo: true, repeat: Math.ceil(dur / 0.32) * 2, ease: 'sine.inOut', delay: 0.5 + delay });
    gsap.to(el, { rotation: band.layer === 'near' ? 3 : 2, duration: 0.32, yoyo: true, repeat: Math.ceil(dur / 0.64), ease: 'sine.inOut', delay: 0.5 + delay });
    var front = el.querySelector('.leg-front');
    var hind = el.querySelector('.leg-hind');
    if (front) {
      gsap.to(front, { rotation: 22, transformOrigin: '50% 0%', duration: 0.15, yoyo: true, repeat: Math.ceil(dur / 0.3) * 2, ease: 'sine.inOut', delay: 0.5 + delay });
    }
    if (hind) {
      gsap.to(hind, { rotation: -20, transformOrigin: '50% 0%', duration: 0.15, yoyo: true, repeat: Math.ceil(dur / 0.3) * 2, ease: 'sine.inOut', delay: 0.58 + delay });
    }
  });
  for (var d = 0; d < 18; d++) {
    var speck = document.createElement('i');
    dustEl.appendChild(speck);
    var dustDelay = 0.9 + d * 0.12;
    gsap.set(speck, { left: 8 + d * 5 + '%', bottom: Math.random() * 12, scale: 0.4 + Math.random() * 0.8 });
    gsap.to(speck, { opacity: 0.55, y: -12 - Math.random() * 18, x: (Math.random() - 0.5) * 20, scale: 1.4, duration: 0.7, delay: dustDelay, ease: 'power1.out' });
    gsap.to(speck, { opacity: 0, duration: 0.45, delay: dustDelay + 0.5 });
  }
  master.to('#horses-caption', { opacity: 0, y: -12, duration: 0.55 }, '-=0.9');
  master.to('#moon', { opacity: 0.3, duration: 0.5 }, '-=0.6');
  master.to('#scene-horses', { opacity: 0.25, duration: 0.45 }, '-=0.35');
}

function initEnvelopeIdle() {
  gsap.to('#envelope-wrap', { y: -5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('#envelope-seal', { rotation: 4, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

function openEnvelope() {
  var btn = $('#btn-open-envelope');
  if (btn.disabled) return;
  btn.disabled = true;
  gsap.killTweensOf(['#envelope-wrap', '#envelope-seal']);
  var tl = gsap.timeline({
    onComplete: function () {
      setTimeout(function () { showScene('intro'); }, 250);
    }
  });
  tl.to('#envelope-flap', { rotationX: -170, duration: 0.85, ease: 'power2.inOut', transformOrigin: 'top center' })
    .to('#envelope-seal', { scale: 0.5, opacity: 0, duration: 0.35 }, '-=0.65')
    .to('#envelope-letter-peek', { y: -100, duration: 0.65, ease: 'power2.out' }, '-=0.45')
    .to('#envelope-wrap', { scale: 0.9, opacity: 0, y: -36, duration: 0.45, ease: 'power2.in' }, '-=0.2')
    .to('.envelope-hint, #btn-open-envelope', { opacity: 0, duration: 0.3 }, '-=0.4');
}

function initIntro() {
  $('#btn-open-letter').addEventListener('click', function () {
    var name = $('#input-name').value.trim();
    var role = $('#select-role').value;
    if (!name) {
      $('#input-name').focus();
      gsap.fromTo('#input-name', { x: -5 }, { x: 5, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' });
      return;
    }
    if (!role) {
      $('#select-role').focus();
      gsap.fromTo('#select-role', { x: -5 }, { x: 5, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' });
      return;
    }
    state.name = name;
    state.role = role;
    prepareLetter();
    showScene('letter');
    setTimeout(animateLetter, 350);
  });
}

function prepareLetter() {
  $('#letter-greeting').textContent = state.role + ' ' + state.name + ' thân mến,';
  var body = $('#letter-body');
  body.innerHTML = '';
  CONFIG.invitationLetter.trim().split('\n').forEach(function (line) {
    var span = document.createElement('span');
    var empty = !line.trim();
    span.className = empty ? 'line is-break' : 'line';
    span.textContent = empty ? '\u00A0' : line;
    body.appendChild(span);
  });
}

function animateLetter() {
  var lines = $$('#letter-body .line');
  gsap.fromTo('#letter-greeting', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 });
  gsap.to(lines, { opacity: 1, duration: 0.32, stagger: 0.14, ease: 'power1.out', delay: 0.25 });
  gsap.fromTo('.letter-closing', { opacity: 0 }, { opacity: 1, duration: 0.55, delay: 0.3 + lines.length * 0.14 });
}

function buildWishlist() {
  var normal = $('#wishlist-normal');
  var special = $('#wishlist-special');
  normal.innerHTML = '';
  special.innerHTML = '';
  CONFIG.wishlistNormal.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'wish-item';
    div.dataset.value = item;
    div.innerHTML = '<div class="wish-check">✓</div><span class="wish-label">' + item + '</span>';
    div.addEventListener('click', function () { toggleWish(div, item); });
    normal.appendChild(div);
  });
  CONFIG.wishlistSpecial.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'wish-item special';
    div.dataset.value = item;
    div.innerHTML = '<div class="wish-check">✓</div><span class="wish-label">' + item + '</span>';
    div.addEventListener('click', function () { toggleWish(div, item); });
    special.appendChild(div);
  });
}

function toggleWish(el, val) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (state.wishlist.indexOf(val) === -1) state.wishlist.push(val);
  } else {
    state.wishlist = state.wishlist.filter(function (w) { return w !== val; });
  }
}

function updateSummary() {
  $('#sum-name').textContent = state.name || '—';
  $('#sum-role').textContent = state.role || '—';
  $('#sum-wishlist').textContent = state.wishlist.length ? state.wishlist.join(', ') : 'Chưa chọn';
}

function launchConfetti() {
  var canvas = $('#confetti-canvas');
  var ctx = canvas.getContext('2d');
  var rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  var colors = ['#c9a84c', '#e8c96a', '#8b6f5c', '#f5f0e6', '#fff'];
  var pieces = [];
  for (var i = 0; i < 70; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 40,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 3.5,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10
    });
  }
  var frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 110) requestAnimationFrame(draw);
  }
  draw();
}

function submitRSVP() {
  if (!CONFIG.gasEndpoint) return Promise.resolve();
  return fetch(CONFIG.gasEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      name: state.name,
      role: state.role,
      wishlist: state.wishlist,
      attending: true
    })
  });
}

function prepareThanks() {
  var who = state.role && state.name ? state.role + ' ' + state.name : state.name || 'bạn';
  $('#thanks-title').textContent = 'Cảm ơn ' + who;
  var polite = state.role === 'Anh' || state.role === 'Chị' ? state.role.toLowerCase() : 'bạn';
  $('#thanks-msg').textContent = 'Một chỗ ngồi đã được giữ riêng cho ' + polite + ' tại Tà Vẹt.';
  var target = new Date(CONFIG.eventDateISO + 'T18:00:00');
  $('#countdown-days').textContent = Math.max(0, Math.ceil((target - new Date() - 1) / 86400000));
}

function init() {
  $('#btn-open-envelope').addEventListener('click', openEnvelope);
  $('#envelope-wrap').addEventListener('click', openEnvelope);
  initIntro();
  $('#btn-to-info').addEventListener('click', function () {
    gsap.to('#letter-sheet', {
      opacity: 0,
      x: -24,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: function () {
        gsap.set('#letter-sheet', { clearProps: 'all' });
        showScene('info');
        gsap.fromTo('#info-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55 });
      }
    });
  });
  $('#btn-maps').addEventListener('click', function () {
    window.open(CONFIG.eventMapsUrl, '_blank', 'noopener');
  });
  $('#btn-to-wishlist').addEventListener('click', function () {
    buildWishlist();
    showScene('wishlist');
  });
  $('#btn-to-confirm').addEventListener('click', function () {
    updateSummary();
    showScene('confirm');
  });
  $('#btn-rsvp').addEventListener('click', function () {
    var btn = $('#btn-rsvp');
    btn.disabled = true;
    btn.textContent = 'Đang gửi...';
    launchConfetti();
    submitRSVP().catch(function () {});
    setTimeout(function () {
      prepareThanks();
      showScene('thanks');
      gsap.fromTo('.thanks-content > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 });
    }, 1100);
  });
  initHorses();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
