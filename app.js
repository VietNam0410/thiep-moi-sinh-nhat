/* HORSE_SRC from horse.js */
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
  horses: $('#scene-horses'), envelope: $('#scene-envelope'), intro: $('#scene-intro'),
  letter: $('#scene-letter'), info: $('#scene-info'), wishlist: $('#scene-wishlist'),
  confirm: $('#scene-confirm'), thanks: $('#scene-thanks')
};
var audioCtx = null, gallopTimer = null, ambientNodes = [], musicPlaying = false;
function ensureAudio() {
  if (!audioCtx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; audioCtx = new AC(); }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playHoof() {
  var ctx = ensureAudio(); if (!ctx) return;
  var t = ctx.currentTime;
  var osc = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(95 + Math.random() * 35, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.09);
  filter.type = 'lowpass'; filter.frequency.value = 420;
  gain.gain.setValueAtTime(0.28, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
  osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.12);
  var n = Math.floor(ctx.sampleRate * 0.05);
  var buf = ctx.createBuffer(1, n, ctx.sampleRate);
  var d = buf.getChannelData(0);
  for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.2;
  var src = ctx.createBufferSource(); src.buffer = buf;
  var ng = ctx.createGain();
  ng.gain.setValueAtTime(0.1, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  src.connect(ng); ng.connect(ctx.destination); src.start(t);
}
function startGallopSound() {
  stopGallopSound();
  if (!ensureAudio()) return;
  var beat = 0;
  gallopTimer = setInterval(function () {
    playHoof();
    if (beat % 2 === 1) setTimeout(playHoof, 65);
    beat++;
  }, 260);
}
function stopGallopSound() { if (gallopTimer) { clearInterval(gallopTimer); gallopTimer = null; } }
function startLetterMusic() {
  if (musicPlaying) return;
  var ctx = ensureAudio(); if (!ctx) return;
  musicPlaying = true; ambientNodes = [];
  [220, 277.18, 329.63, 440].forEach(function (f, i) {
    var osc = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle'; osc.frequency.value = f;
    filter.type = 'lowpass'; filter.frequency.value = 900; gain.gain.value = 0;
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.04 - i * 0.006, ctx.currentTime + 1.4);
    ambientNodes.push({ osc: osc, gain: gain });
  });
  var melody = [329.63, 349.23, 392, 440, 392, 349.23, 329.63, 293.66], step = 0;
  var timer = setInterval(function () {
    if (!musicPlaying || !audioCtx) { clearInterval(timer); return; }
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = melody[step % melody.length];
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.12);
    gain.gain.linearRampToValueAtTime(0, t + 1.15);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(t); osc.stop(t + 1.2); step++;
  }, 1350);
  ambientNodes.push({ timer: timer });
}
function stopLetterMusic() {
  musicPlaying = false;
  ambientNodes.forEach(function (n) {
    if (n.timer) clearInterval(n.timer);
    if (n.gain) { try { n.gain.gain.linearRampToValueAtTime(0, (audioCtx && audioCtx.currentTime || 0) + 0.6); } catch (e) {} }
    if (n.osc) { try { n.osc.stop((audioCtx && audioCtx.currentTime || 0) + 0.8); } catch (e) {} }
  });
  ambientNodes = [];
}
function unlockAudioOnce() {
  ensureAudio();
  var hint = $('#sound-hint');
  if (hint) gsap.to(hint, { opacity: 0, duration: 0.35 });
}
function showScene(name) {
  var cur = document.querySelector('.scene.active');
  var next = scenes[name];
  if (!next || cur === next) return;
  var tl = gsap.timeline({
    onComplete: function () {
      if (cur) { cur.classList.remove('active'); gsap.set(cur, { clearProps: 'all' }); }
      next.classList.add('active');
    }
  });
  if (cur) tl.to(cur, { opacity: 0, y: -14, duration: 0.38, ease: 'power2.inOut' });
  gsap.set(next, { opacity: 0, y: 22 });
  next.classList.add('active');
  tl.to(next, { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, cur ? '-=0.1' : 0);
}
function initHorses() {
  var sky = $('#sky-stars');
  sky.innerHTML = '';
  for (var i = 0; i < 55; i++) {
    var s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 58 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.width = s.style.height = 1.2 + Math.random() * 2.4 + 'px';
    sky.appendChild(s);
  }
  gsap.to('#moon', { scale: 1.08, opacity: 1, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('#sound-hint', { opacity: 1, duration: 0.9, delay: 0.6 });
  var track = $('#horse-track');
  track.innerHTML = '';
  var dustEl = $('#dust');
  dustEl.innerHTML = '';
  var src = (typeof HORSE_SRC !== 'undefined' && HORSE_SRC) ? HORSE_SRC : '';
  var herd = [
    { layer: 'far',  size: 52,  bottom: 48, speed: 4.2, count: 4, stagger: 0.38, bob: 3 },
    { layer: 'mid',  size: 72,  bottom: 28, speed: 3.3, count: 4, stagger: 0.30, bob: 5 },
    { layer: 'near', size: 96,  bottom: 10, speed: 2.55, count: 4, stagger: 0.24, bob: 7 },
    { layer: 'near', size: 110, bottom: 0,  speed: 2.15, count: 3, stagger: 0.28, bob: 9 }
  ];
  var allHorses = [];
  herd.forEach(function (band) {
    for (var i = 0; i < band.count; i++) {
      var el = document.createElement('div');
      el.className = 'horse ' + band.layer;
      el.style.width = band.size + 'px';
      el.style.height = band.size + 'px';
      el.style.bottom = band.bottom + (Math.random() * 8 - 2) + 'px';
      el.style.left = '0';
      el.style.opacity = '1';
      el.style.zIndex = String(10 + band.bottom);
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Ngua';
      img.draggable = false;
      img.style.transform = 'scaleX(-1)';
      el.appendChild(img);
      var trail = document.createElement('div');
      trail.className = 'horse-trail';
      el.appendChild(trail);
      track.appendChild(el);
      allHorses.push({ el: el, band: band, i: i });
    }
  });
  gsap.to('#horses-caption', { opacity: 1, duration: 1, delay: 0.2, ease: 'power2.out' });
  try { startGallopSound(); } catch (e) {}
  function screenW() { return ($('#app') ? $('#app').clientWidth : window.innerWidth) || 400; }
  var w = screenW();
  var master = gsap.timeline({
    delay: 0.35,
    onComplete: function () {
      stopGallopSound();
      setTimeout(function () { showScene('envelope'); initEnvelopeIdle(); }, 400);
    }
  });
  gsap.fromTo('#scene-horses', { scale: 1.06, x: -8 }, { scale: 1, x: 0, duration: 5.5, ease: 'power1.out' });
  allHorses.forEach(function (item) {
    var el = item.el, band = item.band, i = item.i;
    var startX = -band.size - 40 - i * (band.size * 0.85) - Math.random() * 40;
    var endX = w + band.size + 60 + i * 30;
    var dur = band.speed + Math.random() * 0.4;
    var delay = i * band.stagger + (band.layer === 'far' ? 0.05 : band.layer === 'mid' ? 0.12 : 0.18);
    gsap.set(el, { x: startX, opacity: 1, force3D: true });
    master.to(el, { x: endX, duration: dur, ease: 'none', delay: delay, force3D: true }, 0);
    gsap.to(el, {
      y: -band.bob, duration: 0.11 + Math.random() * 0.03, yoyo: true,
      repeat: Math.ceil(dur / 0.24) * 2, ease: 'sine.inOut', delay: 0.35 + delay, force3D: true
    });
    gsap.to(el, {
      scaleY: 0.92, scaleX: 1.06, duration: 0.11, yoyo: true,
      repeat: Math.ceil(dur / 0.22) * 2, ease: 'sine.inOut', delay: 0.35 + delay
    });
  });
  for (var d = 0; d < 28; d++) {
    var speck = document.createElement('i');
    dustEl.appendChild(speck);
    var dustDelay = 0.5 + d * 0.1;
    gsap.set(speck, {
      left: 5 + (d % 14) * 7 + '%', bottom: Math.random() * 18,
      scale: 0.5 + Math.random() * 1.2,
      background: 'rgba(200,180,140,' + (0.35 + Math.random() * 0.4) + ')'
    });
    gsap.to(speck, { opacity: 0.7, y: -18 - Math.random() * 28, x: (Math.random() - 0.5) * 30, scale: 1.8, duration: 0.75, delay: dustDelay, ease: 'power1.out' });
    gsap.to(speck, { opacity: 0, duration: 0.5, delay: dustDelay + 0.5 });
  }
  gsap.to('.ground', { y: 2, duration: 0.08, yoyo: true, repeat: 40, ease: 'none', delay: 0.6 });
  master.to('#horses-caption', { opacity: 0, y: -16, duration: 0.55 }, '-=1.0');
  master.to('#moon', { opacity: 0.25, duration: 0.5 }, '-=0.7');
  master.to('#scene-horses', { opacity: 0.15, duration: 0.45 }, '-=0.4');
}
function initEnvelopeIdle() {
  gsap.to('#envelope-wrap', { y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('#envelope-seal', { rotation: 5, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}
function openEnvelope() {
  var btn = $('#btn-open-envelope');
  if (btn.disabled) return;
  btn.disabled = true;
  unlockAudioOnce();
  gsap.killTweensOf(['#envelope-wrap', '#envelope-seal']);
  var tl = gsap.timeline({ onComplete: function () { setTimeout(function () { showScene('intro'); }, 220); } });
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
    if (!name) { $('#input-name').focus(); gsap.fromTo('#input-name', { x: -5 }, { x: 5, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' }); return; }
    if (!role) { $('#select-role').focus(); gsap.fromTo('#select-role', { x: -5 }, { x: 5, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' }); return; }
    state.name = name; state.role = role;
    unlockAudioOnce();
    startLetterMusic();
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
  var normal = $('#wishlist-normal'), special = $('#wishlist-special');
  normal.innerHTML = ''; special.innerHTML = '';
  CONFIG.wishlistNormal.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'wish-item';
    div.innerHTML = '<div class="wish-check">✓</div><span class="wish-label">' + item + '</span>';
    div.addEventListener('click', function () { toggleWish(div, item); });
    normal.appendChild(div);
  });
  CONFIG.wishlistSpecial.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'wish-item special';
    div.innerHTML = '<div class="wish-check">✓</div><span class="wish-label">' + item + '</span>';
    div.addEventListener('click', function () { toggleWish(div, item); });
    special.appendChild(div);
  });
}
function toggleWish(el, val) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) { if (state.wishlist.indexOf(val) === -1) state.wishlist.push(val); }
  else { state.wishlist = state.wishlist.filter(function (w) { return w !== val; }); }
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
  canvas.width = rect.width; canvas.height = rect.height;
  var colors = ['#c9a84c', '#e8c96a', '#8b6f5c', '#f5f0e6', '#fff'];
  var pieces = [];
  for (var i = 0; i < 80; i++) {
    pieces.push({ x: Math.random() * canvas.width, y: -20 - Math.random() * 40, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, color: colors[Math.floor(Math.random() * colors.length)], vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 3.5, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10 });
  }
  var frame = 0;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    if (++frame < 120) requestAnimationFrame(draw);
  })();
}
function submitRSVP() {
  if (!CONFIG.gasEndpoint) return Promise.resolve();
  return fetch(CONFIG.gasEndpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ timestamp: new Date().toISOString(), name: state.name, role: state.role, wishlist: state.wishlist, attending: true }) });
}
function prepareThanks() {
  var who = state.role && state.name ? state.role + ' ' + state.name : state.name || 'bạn';
  $('#thanks-title').textContent = 'Cảm ơn ' + who;
  var polite = state.role === 'Anh' || state.role === 'Chị' ? state.role.toLowerCase() : 'bạn';
  $('#thanks-msg').textContent = 'Một chỗ ngồi đã được giữ riêng cho ' + polite + ' tại Tà Vẹt.';
  var target = new Date(CONFIG.eventDateISO + 'T18:00:00');
  $('#countdown-days').textContent = Math.max(0, Math.ceil((target - new Date()) / 86400000));
}
function init() {
  document.body.addEventListener('touchstart', unlockAudioOnce, { once: true, passive: true });
  document.body.addEventListener('click', unlockAudioOnce, { once: true });
  $('#btn-open-envelope').addEventListener('click', openEnvelope);
  $('#envelope-wrap').addEventListener('click', openEnvelope);
  initIntro();
  $('#btn-to-info').addEventListener('click', function () {
    gsap.to('#letter-sheet', {
      opacity: 0, x: -24, duration: 0.4, ease: 'power2.in',
      onComplete: function () {
        gsap.set('#letter-sheet', { clearProps: 'all' });
        showScene('info');
        gsap.fromTo('#info-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55 });
      }
    });
  });
  $('#btn-maps').addEventListener('click', function () { window.open(CONFIG.eventMapsUrl, '_blank', 'noopener'); });
  $('#btn-to-wishlist').addEventListener('click', function () { buildWishlist(); showScene('wishlist'); });
  $('#btn-to-confirm').addEventListener('click', function () { updateSummary(); showScene('confirm'); });
  $('#btn-rsvp').addEventListener('click', function () {
    var btn = $('#btn-rsvp');
    btn.disabled = true; btn.textContent = 'Đang gửi...';
    stopLetterMusic(); launchConfetti();
    submitRSVP().catch(function () {});
    setTimeout(function () {
      prepareThanks(); showScene('thanks');
      gsap.fromTo('.thanks-content > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 });
    }, 1100);
  });
  var preload = new Image();
  preload.onload = function () { initHorses(); };
  preload.onerror = function () { initHorses(); };
  preload.src = (typeof HORSE_SRC !== 'undefined' && HORSE_SRC) ? HORSE_SRC : '';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
