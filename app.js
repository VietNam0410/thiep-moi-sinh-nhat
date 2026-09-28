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
  gasEndpoint: '',
  horseImage: (window.HORSE_IMG || '')
};

const state = { name: '', role: '', wishlist: [], attending: true };
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const scenes = {
  horses: $('#scene-horses'), envelope: $('#scene-envelope'), intro: $('#scene-intro'),
  letter: $('#scene-letter'), info: $('#scene-info'), wishlist: $('#scene-wishlist'),
  confirm: $('#scene-confirm'), thanks: $('#scene-thanks')
};

var audioCtx = null;
var gallopTimer = null;
var ambientNodes = [];
var musicPlaying = false;

function ensureAudio() {
  if (!audioCtx) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playHoof() {
  var ctx = ensureAudio();
  if (!ctx) return;
  var t = ctx.currentTime;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(90 + Math.random() * 30, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  gain.gain.setValueAtTime(0.22, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.13);
  var bufferSize = ctx.sampleRate * 0.06;
  var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
  var noise = ctx.createBufferSource();
  noise.buffer = buffer;
  var ng = ctx.createGain();
  ng.gain.setValueAtTime(0.08, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  noise.connect(ng);
  ng.connect(ctx.destination);
  noise.start(t);
}

function startGallopSound() {
  stopGallopSound();
  if (!ensureAudio()) return;
  var beat = 0;
  gallopTimer = setInterval(function () {
    playHoof();
    if (beat % 2 === 1) setTimeout(playHoof, 70);
    beat++;
  }, 280);
}

function stopGallopSound() {
  if (gallopTimer) { clearInterval(gallopTimer); gallopTimer = null; }
}

function startLetterMusic() {
  if (musicPlaying) return;
  var ctx = ensureAudio();
  if (!ctx) return;
  musicPlaying = true;
  ambientNodes = [];
  var freqs = [220, 277.18, 329.63, 440];
  freqs.forEach(function (f, i) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = f;
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    gain.gain.value = 0;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.035 - i * 0.005, ctx.currentTime + 1.5);
    ambientNodes.push({ osc: osc, gain: gain });
  });
  var melody = [329.63, 349.23, 392.0, 440.0, 392.0, 349.23, 329.63, 293.66];
  var step = 0;
  var melodyTimer = setInterval(function () {
    if (!musicPlaying || !audioCtx) { clearInterval(melodyTimer); return; }
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = melody[step % melody.length];
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 0.15);
    gain.gain.linearRampToValueAtTime(0, t + 1.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 1.3);
    step++;
  }, 1400);
  ambientNodes.push({ timer: melodyTimer });
}

function stopLetterMusic() {
  musicPlaying = false;
  ambientNodes.forEach(function (n) {
    if (n.timer) clearInterval(n.timer);
    if (n.gain) { try { n.gain.gain.linearRampToValueAtTime(0, (audioCtx && audioCtx.currentTime || 0) + 0.8); } catch (e) {} }
    if (n.osc) { try { n.osc.stop((audioCtx && audioCtx.currentTime || 0) + 1); } catch (e) {} }
  });
  ambientNodes = [];
}

function unlockAudioOnce() {
  ensureAudio();
  var hint = $('#sound-hint');
  if (hint) gsap.to(hint, { opacity: 0, duration: 0.4 });
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
  if (cur) tl.to(cur, { opacity: 0, y: -16, duration: 0.4, ease: 'power2.inOut' });
  gsap.set(next, { opacity: 0, y: 24 });
  next.classList.add('active');
  tl.to(next, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, cur ? '-=0.12' : 0);
}

function initHorses() {
  var sky = $('#sky-stars');
  for (var i = 0; i < 40; i++) {
    var s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 55 + '%';
    s.style.animationDelay = Math.random() * 2.8 + 's';
    s.style.width = s.style.height = 1 + Math.random() * 2 + 'px';
    sky.appendChild(s);
  }
  gsap.to('#moon', { scale: 1.06, opacity: 0.95, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('#sound-hint', { opacity: 1, duration: 1, delay: 0.8 });
  var track = $('#horse-track');
  var dustEl = $('#dust');
  var herd = [
    { layer: 'far', bottom: 36, speed: 3.5, count: 3, stagger: 0.32 },
    { layer: 'mid', bottom: 16, speed: 2.7, count: 3, stagger: 0.26 },
    { layer: 'near', bottom: 0, speed: 2.1, count: 3, stagger: 0.2 }
  ];
  var allHorses = [];
  herd.forEach(function (band) {
    for (var i = 0; i < band.count; i++) {
      var el = document.createElement('div');
      el.className = 'horse ' + band.layer;
      var img = document.createElement('img');
      img.src = CONFIG.horseImage;
      img.alt = 'Ngựa';
      img.draggable = false;
      if (Math.random() > 0.5) img.style.transform = 'scaleX(-1)';
      el.appendChild(img);
      el.style.left = '-120px';
      el.style.bottom = band.bottom + (Math.random() * 10 - 3) + 'px';
      track.appendChild(el);
      allHorses.push({ el: el, band: band, i: i });
    }
  });
  gsap.to('#horses-caption', { opacity: 1, duration: 1.1, delay: 0.25, ease: 'power2.out' });
  try { startGallopSound(); } catch (e) {}
  function screenW() { return ($('#app') ? $('#app').clientWidth : window.innerWidth) || 400; }
  var master = gsap.timeline({
    delay: 0.45,
    onComplete: function () {
      stopGallopSound();
      setTimeout(function () { showScene('envelope'); initEnvelopeIdle(); }, 450);
    }
  });
  allHorses.forEach(function (item) {
    var el = item.el, band = item.band, i = item.i;
    var startX = -140 - i * 55 - Math.random() * 30;
    var endX = screenW() + 120 + i * 40;
    var dur = band.speed + Math.random() * 0.35;
    var delay = i * band.stagger + (band.layer === 'far' ? 0.12 : band.layer === 'mid' ? 0.04 : 0);
    master.fromTo(el, { x: startX, opacity: 0 }, { x: endX, opacity: 1, duration: dur, ease: 'none', delay: delay }, 0);
    var bobAmt = band.layer === 'near' ? 8 : band.layer === 'mid' ? 6 : 4;
    gsap.to(el, { y: -bobAmt, duration: 0.14 + Math.random() * 0.04, yoyo: true, repeat: Math.ceil(dur / 0.28) * 2, ease: 'sine.inOut', delay: 0.45 + delay });
  });
  for (var d = 0; d < 16; d++) {
    var speck = document.createElement('i');
    dustEl.appendChild(speck);
    var dustDelay = 0.85 + d * 0.12;
    gsap.set(speck, { left: 8 + d * 5 + '%', bottom: Math.random() * 12, scale: 0.4 + Math.random() * 0.8 });
    gsap.to(speck, { opacity: 0.5, y: -12 - Math.random() * 16, x: (Math.random() - 0.5) * 18, scale: 1.3, duration: 0.65, delay: dustDelay, ease: 'power1.out' });
    gsap.to(speck, { opacity: 0, duration: 0.4, delay: dustDelay + 0.45 });
  }
  master.to('#horses-caption', { opacity: 0, y: -12, duration: 0.5 }, '-=0.85');
  master.to('#moon', { opacity: 0.3, duration: 0.45 }, '-=0.55');
  master.to('#scene-horses', { opacity: 0.25, duration: 0.4 }, '-=0.3');
}

function initEnvelopeIdle() {
  gsap.to('#envelope-wrap', { y: -5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('#envelope-seal', { rotation: 4, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

function openEnvelope() {
  var btn = $('#btn-open-envelope');
  if (btn.disabled) return;
  btn.disabled = true;
  unlockAudioOnce();
  gsap.killTweensOf(['#envelope-wrap', '#envelope-seal']);
  var tl = gsap.timeline({ onComplete: function () { setTimeout(function () { showScene('intro'); }, 250); } });
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
  var normal = $('#wishlist-normal');
  var special = $('#wishlist-special');
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
  canvas.width = rect.width; canvas.height = rect.height;
  var colors = ['#c9a84c', '#e8c96a', '#8b6f5c', '#f5f0e6', '#fff'];
  var pieces = [];
  for (var i = 0; i < 70; i++) {
    pieces.push({ x: Math.random() * canvas.width, y: -20 - Math.random() * 40, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, color: colors[Math.floor(Math.random() * colors.length)], vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 3.5, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10 });
  }
  var frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    frame++;
    if (frame < 110) requestAnimationFrame(draw);
  }
  draw();
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
    btn.disabled = true;
    btn.textContent = 'Đang gửi...';
    stopLetterMusic();
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

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
