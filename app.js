/* Minimal working app — horse herd */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
var audioCtx = null, gallopTimer = null;
function ensureAudio() {
  if (!audioCtx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; audioCtx = new AC(); }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playHoof() {
  var ctx = ensureAudio(); if (!ctx) return;
  var t = ctx.currentTime;
  var osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(95 + Math.random() * 35, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.09);
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.12);
}
function startGallopSound() {
  if (gallopTimer) return;
  if (!ensureAudio()) return;
  var beat = 0;
  gallopTimer = setInterval(function () {
    playHoof();
    if (beat % 2 === 1) setTimeout(playHoof, 65);
    beat++;
  }, 260);
}
function stopGallopSound() { if (gallopTimer) { clearInterval(gallopTimer); gallopTimer = null; } }

function initHorses() {
  var sky = $('#sky-stars');
  if (sky) {
    sky.innerHTML = '';
    for (var i = 0; i < 40; i++) {
      var s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 55 + '%';
      s.style.width = s.style.height = (1.5 + Math.random() * 2) + 'px';
      sky.appendChild(s);
    }
  }
  if ($('#moon')) gsap.to('#moon', { scale: 1.08, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  if ($('#sound-hint')) gsap.to('#sound-hint', { opacity: 1, duration: 0.8, delay: 0.4 });

  var track = $('#horse-track');
  if (!track) return;
  track.innerHTML = '';
  var dustEl = $('#dust');
  if (dustEl) dustEl.innerHTML = '';

  var sheets = (typeof HORSE_SHEETS !== 'undefined') ? HORSE_SHEETS : null;
  var colors = sheets ? Object.keys(sheets) : ['brown'];
  var srcFallback = (typeof HORSE_SRC !== 'undefined') ? HORSE_SRC : '';

  var herd = [
    { layer: 'far',  size: 55, bottom: 55, speed: 4.5, count: 4, stagger: 0.38, bob: 3 },
    { layer: 'mid',  size: 75, bottom: 32, speed: 3.4, count: 4, stagger: 0.28, bob: 5 },
    { layer: 'near', size: 100, bottom: 12, speed: 2.5, count: 4, stagger: 0.22, bob: 7 },
    { layer: 'near', size: 120, bottom: 0,  speed: 2.1, count: 3, stagger: 0.26, bob: 9 }
  ];

  var allHorses = [];
  var colorIdx = 0;
  herd.forEach(function (band) {
    for (var i = 0; i < band.count; i++) {
      var cname = colors[colorIdx % colors.length];
      colorIdx++;
      var meta = (sheets && sheets[cname]) ? sheets[cname] : { src: srcFallback, fw: 82, fh: 66, frames: 5 };
      if (!meta.src) continue;
      var fw = meta.fw || 82, fh = meta.fh || 66, frames = meta.frames || 5;
      var sc = band.size / fw;
      var elW = Math.round(fw * sc), elH = Math.round(fh * sc);

      var el = document.createElement('div');
      el.className = 'horse ' + band.layer;
      el.style.position = 'absolute';
      el.style.width = elW + 'px';
      el.style.height = elH + 'px';
      el.style.bottom = (band.bottom + Math.random() * 4 - 1) + 'px';
      el.style.left = '0';
      el.style.zIndex = String(20 + band.bottom);
      el.style.backgroundImage = 'url(' + meta.src + ')';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundSize = (fw * frames * sc) + 'px ' + elH + 'px';
      el.style.backgroundPosition = '0 0';
      el.style.imageRendering = 'pixelated';
      el.style.filter = (meta.filter ? meta.filter + ' ' : '') + 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))';
      el.style.willChange = 'transform';
      el.style.transformOrigin = '50% 100%';

      if (frames > 1) {
        var an = 'gal' + colorIdx;
        var st = document.createElement('style');
        st.textContent = '@keyframes ' + an + '{from{background-position:0 0}to{background-position:-' + (fw*frames*sc) + 'px 0}}';
        document.head.appendChild(st);
        el.style.animation = an + ' 0.4s steps(' + frames + ') infinite';
      }
      track.appendChild(el);
      allHorses.push({ el: el, band: band, i: i, fw: elW });
    }
  });
  console.log('[horses] spawned', allHorses.length);

  if ($('#horses-caption')) gsap.to('#horses-caption', { opacity: 1, duration: 0.9, delay: 0.15 });
  try { startGallopSound(); } catch (e) {}

  var w = ($('#app') && $('#app').clientWidth) || window.innerWidth || 400;
  var master = gsap.timeline({
    delay: 0.25,
    onComplete: function () {
      stopGallopSound();
    }
  });

  allHorses.forEach(function (item) {
    var el = item.el, band = item.band, i = item.i;
    var startX = -item.fw - 40 - i * (item.fw * 0.85) - Math.random() * 50;
    var endX = w + item.fw + 60;
    var dur = band.speed + Math.random() * 0.35;
    var delay = i * band.stagger + 0.1;
    gsap.set(el, { x: startX, force3D: true });
    master.to(el, { x: endX, duration: dur, ease: 'none', delay: delay, force3D: true }, 0);
    gsap.to(el, {
      y: -band.bob, scaleY: 0.94, duration: 0.12, yoyo: true,
      repeat: Math.ceil(dur / 0.26) * 2, ease: 'sine.inOut', delay: 0.25 + delay, force3D: true
    });
  });

  if (dustEl) {
    for (var d = 0; d < 24; d++) {
      var speck = document.createElement('i');
      dustEl.appendChild(speck);
      var dd = 0.4 + d * 0.1;
      gsap.set(speck, { left: (4 + (d % 12) * 8) + '%', bottom: Math.random() * 16, scale: 0.6 + Math.random() });
      gsap.to(speck, { opacity: 0.7, y: -20, x: (Math.random()-0.5)*24, scale: 1.6, duration: 0.7, delay: dd });
      gsap.to(speck, { opacity: 0, duration: 0.4, delay: dd + 0.5 });
    }
  }
  if ($('.ground')) gsap.to('.ground', { y: 2, duration: 0.08, yoyo: true, repeat: 40, ease: 'none', delay: 0.5 });
}

function init() {
  document.body.addEventListener('touchstart', function(){ ensureAudio(); }, { once: true, passive: true });
  document.body.addEventListener('click', function(){ ensureAudio(); }, { once: true });
  var started = false;
  function start() {
    if (started) return;
    started = true;
    try { initHorses(); } catch (e) { console.error(e); }
  }
  var src = (typeof HORSE_SHEETS !== 'undefined' && HORSE_SHEETS.brown)
    ? HORSE_SHEETS.brown.src
    : ((typeof HORSE_SRC !== 'undefined') ? HORSE_SRC : '');
  if (src) {
    var img = new Image();
    img.onload = start;
    img.onerror = start;
    img.src = src;
    setTimeout(start, 800);
  } else {
    start();
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
