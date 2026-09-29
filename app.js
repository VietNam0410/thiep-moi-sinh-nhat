/* ==========================================================================
 *  THIỆP MỜI SINH NHẬT — app.js (phần 1/2: CONFIG → pháo hoa)
 *  ---------------------------------------------------------------------------
 *  CÁCH CHỈNH SỬA NHANH:
 *    1. CONFIG          → nội dung thư, ngày giờ, địa điểm, wishlist, gasEndpoint
 *    2. MUSIC #1        → chèn nhạc khi mở phong bì  (hàm openEnvelope trong app2.js)
 *    3. MUSIC #2        → chèn nhạc sau khi bấm RSVP (nút #btn-rsvp trong app2.js)
 *    4. wishlistNormal  → danh sách quà (giảm / thêm item)
 *    5. gasEndpoint     → URL Google Apps Script nhận RSVP
 * ========================================================================== */


/* ==========================================================================
 *  1. CẤU HÌNH — chỉnh nội dung tại đây
 * ========================================================================== */
const CONFIG = {

  /* Nội dung lá thư (mỗi dòng = 1 dòng trên thiệp) */
  invitationLetter: `Mình viết vài dòng này
với rất nhiều chân thành.

Tuổi mới sắp tới —
mình muốn được ngồi cùng
những người quan trọng,
uống một ly, kể vài câu chuyện,
và cảm ơn vì đã ở bên.

Không cần mang gì cầu kỳ.
Chỉ cần bạn tới là đủ
để buổi tối ấy trở nên đặc biệt.

Hẹn gặp bạn
vào tối thứ Bảy tại Tà Vẹt.`,

  /* Thông tin người gửi & sự kiện */
  senderName: 'Việt Nam (Em Cưng)',
  eventDate: '03/10/2026',
  eventDow: 'Thứ Bảy',
  eventTime: 'Từ 19:00',
  eventPlace: 'Quán Nhậu Tà Vẹt',
  eventAddress: '11 Võ Thị Sáu, Huế',
  eventMapsUrl: 'https://maps.google.com/?q=Tà+Vẹt+Coffee+Pub+11+Võ+Thị+Sáu+Huế',
  eventDateISO: '2026-10-03',

  /* Wishlist thường — giảm / thêm item tại đây */
  wishlistNormal: [
    'Nụ hôn lốc xoáy',
    'Lốc sữa Milo',
    'Tô mì tôm',
    'Chai Sting và Tẩy Đá'
  ],

  /* Wishlist đặc biệt */
  wishlistSpecial: ['Sự có mặt của bạn tại bữa tiệc'],

  /* Google Apps Script endpoint — nhận RSVP POST JSON */
  gasEndpoint: 'https://script.google.com/macros/s/AKfycbyxJ3mh4S-SiW0rkiSjJEfvShymi6KPHf59DTsh_hL4x0YZn-bjEWKbHejhobNXBKn7/exec',

  /* Không hiện link Sheet cho khách (để trống) */
  sheetUrl: ''
};

/* Trạng thái form người dùng nhập */
const state = {
  name: '',
  role: '',
  wishlist: [],
  customGift: '',
  attending: true
};

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

var audioCtx = null;
var gallopTimer = null;
var fwRunning = false;
var fwAnimId = null;
var audioUnlocked = false;

var AUDIO_GALLOP = 'tieng_vo_ngua_chay-www_tiengdong_com.mp3';
var AUDIO_LETTER = 'alex-morgan-wedding-instrumental-vow-exchange-578502.mp3';

var gallopAudio = null;
var letterAudio = null;
var currentTrack = null;

function ensureAudio() {
  if (!audioCtx) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  ensureAudio();
  var h = $('#sound-hint');
  if (h) gsap.to(h, { opacity: 0, duration: 0.3 });
  if (currentTrack !== 'letter') startGallopSound();
}

function stopAllMusic() {
  if (gallopAudio) {
    try { gallopAudio.pause(); gallopAudio.currentTime = 0; } catch (e) {}
  }
  if (letterAudio) {
    try { letterAudio.pause(); letterAudio.currentTime = 0; } catch (e) {}
  }
  currentTrack = null;
  gallopTimer = null;
}

function startGallopSound() {
  if (currentTrack === 'gallop' && gallopAudio && !gallopAudio.paused) return;
  if (letterAudio) {
    try { letterAudio.pause(); letterAudio.currentTime = 0; } catch (e) {}
  }
  if (!gallopAudio) {
    gallopAudio = new Audio(AUDIO_GALLOP);
    gallopAudio.loop = true;
    gallopAudio.volume = 0.65;
    gallopAudio.preload = 'auto';
  }
  currentTrack = 'gallop';
  gallopTimer = 1;
  var p = gallopAudio.play();
  if (p && p.catch) p.catch(function () {});
}

function stopGallopSound() {
  if (gallopAudio) {
    try { gallopAudio.pause(); gallopAudio.currentTime = 0; } catch (e) {}
  }
  if (currentTrack === 'gallop') currentTrack = null;
  gallopTimer = null;
}

function startLetterMusic() {
  stopGallopSound();
  if (currentTrack === 'letter' && letterAudio && !letterAudio.paused) return;
  if (!letterAudio) {
    letterAudio = new Audio(AUDIO_LETTER);
    letterAudio.loop = true;
    letterAudio.volume = 0.55;
    letterAudio.preload = 'auto';
  }
  currentTrack = 'letter';
  var p = letterAudio.play();
  if (p && p.catch) p.catch(function () {});
}

function stopLetterMusic() {
  if (letterAudio) {
    try { letterAudio.pause(); letterAudio.currentTime = 0; } catch (e) {}
  }
  if (currentTrack === 'letter') currentTrack = null;
}

function playUiClick() {
  try {
    var ctx = ensureAudio();
    if (!ctx) return;
    var t = ctx.currentTime;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(280, t + 0.08);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.11);
  } catch (e) {}
}

function showScene(name) {
  var cur = document.querySelector('.scene.active');
  var next = scenes[name];
  if (!next || cur === next) return;
  var tl = gsap.timeline({
    onComplete: function () {
      if (cur) {
        cur.classList.remove('active');
        gsap.set(cur, { clearProps: 'all' });
      }
      next.classList.add('active');
    }
  });
  if (cur) {
    tl.to(cur, { opacity: 0, y: -14, duration: 0.38, ease: 'power2.inOut' });
  }
  gsap.set(next, { opacity: 0, y: 20 });
  next.classList.add('active');
  tl.to(next, { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, cur ? '-=.1' : 0);
}

function startContinuousFireworks() {
  var canvas = $('#fw-canvas');
  if (!canvas || fwRunning) return;
  fwRunning = true;
  var parent = canvas.parentElement;
  var rect = parent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var rockets = [];
  var colors = ['#c9a84c', '#e8c96a', '#ff6b6b', '#4ecdc4', '#ffe66d', '#fff', '#ff9ff3', '#54a0ff', '#ffd700'];

  function burst(x, y, n, power) {
    power = power || 1;
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n + Math.random() * 0.4;
      var sp = (2.2 + Math.random() * 4.8) * power;
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.8 * power,
        life: 1,
        decay: 0.012 + Math.random() * 0.014,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2.6
      });
    }
  }

  function launchRocket() {
    if (!fwRunning) return;
    var tx = rect.width * (0.22 + Math.random() * 0.56);
    var startY = rect.height * (0.42 + Math.random() * 0.12);
    var ty = rect.height * (0.12 + Math.random() * 0.22);
    rockets.push({ x: tx, y: startY, tx: tx, ty: ty, vx: (Math.random() - 0.5) * 0.6, vy: -2.8 - Math.random() * 1.2, exploded: false });
  }

  var launchCount = 0;
  var launchTimer = setInterval(function () {
    if (!fwRunning) { clearInterval(launchTimer); return; }
    launchRocket();
    if (launchCount % 2 === 0) {
      burst(rect.width * (0.25 + Math.random() * 0.5), rect.height * (0.15 + Math.random() * 0.28), 26, 0.95);
    }
    launchCount++;
  }, 380);

  for (var k = 0; k < 5; k++) setTimeout(launchRocket, k * 160);

  function draw() {
    if (!fwRunning && !particles.length && !rockets.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rockets = rockets.filter(function (r) {
      if (r.exploded) return false;
      r.x += r.vx; r.y += r.vy; r.vy += 0.09;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#ffe66d';
      ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(r.x - 1, r.y + 2, 2, 7);
      if (r.y <= r.ty || r.vy >= 0) {
        burst(r.x, r.y, 38 + Math.floor(Math.random() * 18), 1.1);
        r.exploded = true;
        return false;
      }
      return true;
    });
    particles = particles.filter(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.055; p.vx *= 0.984; p.life -= p.decay;
      if (p.life <= 0) return false;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
    fwAnimId = requestAnimationFrame(draw);
  }
  fwAnimId = requestAnimationFrame(draw);
  startContinuousFireworks._timer = launchTimer;
}

function stopContinuousFireworks() {
  fwRunning = false;
  if (startContinuousFireworks._timer) {
    clearInterval(startContinuousFireworks._timer);
    startContinuousFireworks._timer = null;
  }
  setTimeout(function () {
    var canvas = $('#fw-canvas');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, 900);
}
