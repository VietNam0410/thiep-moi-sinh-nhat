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
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const scenes = {
horses: $('#scene-horses'), envelope: $('#scene-envelope'), intro: $('#scene-intro'),
letter: $('#scene-letter'), info: $('#scene-info'), wishlist: $('#scene-wishlist'),
confirm: $('#scene-confirm'), thanks: $('#scene-thanks')
};
var audioCtx = null, gallopTimer = null, musicPlaying = false, ambientNodes = [];
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
var ctx = ensureAudio(); if (!ctx) return;
var t = ctx.currentTime;
var osc = ctx.createOscillator(), g = ctx.createGain();
osc.type = 'triangle';
osc.frequency.setValueAtTime(95 + Math.random() * 35, t);
osc.frequency.exponentialRampToValueAtTime(38, t + 0.09);
g.gain.setValueAtTime(0.22, t);
g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
osc.connect(g); g.connect(ctx.destination);
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
function startViolinPad(){if(musicPlaying)return;var ctx=ensureAudio();if(!ctx)return;musicPlaying=true;ambientNodes=[];[220,261.63,329.63,392].forEach(function(f,i){var o=ctx.createOscillator(),g=ctx.createGain(),fl=ctx.createBiquadFilter();o.type=i%2?'triangle':'sine';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=1000;g.gain.value=0;o.connect(fl);fl.connect(g);g.connect(ctx.destination);o.start();g.gain.linearRampToValueAtTime(0.03-i*0.004,ctx.currentTime+1.6);ambientNodes.push({osc:o,gain:g})});var mel=[329.63,349.23,392,440,392,349.23,329.63,293.66],st=0;var tm=setInterval(function(){if(!musicPlaying||!audioCtx){clearInterval(tm);return}var t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=mel[st%mel.length];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.04,t+0.12);g.gain.linearRampToValueAtTime(0,t+1.3);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+1.4);st++},1500);ambientNodes.push({timer:tm})}
function playPaperRustle(){var ctx=ensureAudio();if(!ctx)return;var t=ctx.currentTime,n=Math.floor(ctx.sampleRate*0.3),buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*0.12*Math.exp(-i/(n*0.4));var src=ctx.createBufferSource();src.buffer=buf;var fl=ctx.createBiquadFilter();fl.type='bandpass';fl.frequency.value=1600;var g=ctx.createGain();g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);src.connect(fl);fl.connect(g);g.connect(ctx.destination);src.start(t)}
function playSoftChime(){var ctx=ensureAudio();if(!ctx)return;var t=ctx.currentTime;[523.25,659.25,783.99].forEach(function(f,i){var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t+i*0.08);g.gain.linearRampToValueAtTime(0.06,t+i*0.08+0.05);g.gain.exponentialRampToValueAtTime(0.001,t+i*0.08+1.1);o.connect(g);g.connect(ctx.destination);o.start(t+i*0.08);o.stop(t+i*0.08+1.2)})}

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
gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
osc.connect(gain); gain.connect(audioCtx.destination);
osc.start(t); osc.stop(t + 0.75);
step++;
}, 900);
ambientNodes.push({ timer: timer });
}
function stopLetterMusic() {
musicPlaying = false;
ambientNodes.forEach(function (n) {
if (n.timer) clearInterval(n.timer);
if (n.gain) n.gain.gain.linearRampToValueAtTime(0, (audioCtx && audioCtx.currentTime || 0) + 0.8);
if (n.osc) try { n.osc.stop((audioCtx && audioCtx.currentTime || 0) + 1); } catch (e) {}
});
ambientNodes = [];
}
function unlockAudioOnce() {
ensureAudio();
var h = $('#sound-hint');
if (h) gsap.to(h, { opacity: 0, duration: 0.3 });
}
function showScene(name) {
var cur = document.querySelector('.scene.active'), next = scenes[name];
if (!next || cur === next) return;
var tl = gsap.timeline({
onComplete: function () {
if (cur) { cur.classList.remove('active'); cur.style.opacity = ''; }
next.classList.add('active');
}
});
if (cur) tl.to(cur, { opacity: 0, duration: 0.35, ease: 'power1.in' });
tl.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.out' }, cur ? '-=0.1' : 0);
}
function initHorses() {
var sky = $('#sky-stars');
if (sky) {
sky.innerHTML = '';
for (var i = 0; i < 48; i++) {
var s = document.createElement('span');
s.style.left = Math.random() * 100 + '%';
s.style.top = Math.random() * 55 + '%';
s.style.animationDelay = Math.random() * 3 + 's';
s.style.width = s.style.height = (1.4 + Math.random() * 2.2) + 'px';
sky.appendChild(s);
}
}
if ($('#moon')) gsap.to('#moon', { scale: 1.08, opacity: 1, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
if ($('#sound-hint')) gsap.to('#sound-hint', { opacity: 1, duration: 0.9, delay: 0.5 });
var track = $('#horse-track');
var dustEl = $('#dust');
if (!track) return;
track.innerHTML = '';
if (dustEl) dustEl.innerHTML = '';
var sheets = (typeof HORSE_SHEETS !== 'undefined') ? HORSE_SHEETS : null;
var colors = sheets ? Object.keys(sheets) : ['brown'];
var srcFallback = (typeof HORSE_SRC !== 'undefined' && HORSE_SRC) ? HORSE_SRC : '';
// Herd layout tuned for mobile 9:16 — depth layers, no overlap clutter
var herd = [
{ layer: 'far',  size: 42, bottom: 58, speed: 5.0, count: 4, stagger: 0.38, bob: 2 },
{ layer: 'mid',  size: 62, bottom: 36, speed: 3.8, count: 5, stagger: 0.28, bob: 3 },
{ layer: 'near', size: 88, bottom: 14, speed: 2.9, count: 4, stagger: 0.22, bob: 5 },
{ layer: 'near', size: 108, bottom: 2,  speed: 2.3, count: 3, stagger: 0.26, bob: 7 }
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
el.style.bottom = (band.bottom + (Math.random() * 5 - 1)) + 'px';
el.style.left = '0';
el.style.zIndex = String(15 + band.bottom);
el.style.backgroundImage = 'url(' + meta.src + ')';
el.style.backgroundRepeat = 'no-repeat';
el.style.backgroundSize = (fw * frames * sc) + 'px ' + elH + 'px';
el.style.backgroundPosition = '0 0';
el.style.imageRendering = 'pixelated';
el.style.filter = (meta.filter ? meta.filter + ' ' : '') + 'drop-shadow(0 ' + Math.round(3 * sc) + 'px ' + Math.round(5 * sc) + 'px rgba(0,0,0,0.4))';
el.style.willChange = 'transform';
track.appendChild(el);
var frame = 0;
var animId = setInterval(function () {
frame = (frame + 1) % frames;
el.style.backgroundPosition = (-frame * elW) + 'px 0';
}, 90 + Math.random() * 20);
allHorses.push({ el: el, band: band, i: i, fw: elW, animId: animId });
}
});
startGallopSound();
function screenW() { return ($('#app') ? $('#app').clientWidth : window.innerWidth) || 400; }
var w = screenW();
var master = gsap.timeline({
delay: 0.3,
onComplete: function () {
stopGallopSound();
launchFireworks(function () {
setTimeout(function () {
showScene('envelope');
initEnvelopeIdle();
startViolinPad();
}, 400);
});
}
});
gsap.fromTo('#scene-horses', { scale: 1.04, x: -4 }, { scale: 1, x: 0, duration: 5.2, ease: 'power1.out' });
allHorses.forEach(function (item) {
var el = item.el, band = item.band, i = item.i;
var startX = -item.fw - 50 - i * (item.fw * 0.9) - Math.random() * 40;
var endX = w + item.fw + 70 + i * 20;
var dur = band.speed + Math.random() * 0.35;
var delay = i * band.stagger + (band.layer === 'far' ? 0.05 : band.layer === 'mid' ? 0.12 : 0.18);
gsap.set(el, { x: startX, force3D: true });
master.to(el, { x: endX, duration: dur, ease: 'none', delay: delay, force3D: true }, 0);
gsap.to(el, {
y: -band.bob, scaleY: 0.94, duration: 0.12 + Math.random() * 0.03, yoyo: true,
repeat: Math.ceil(dur / 0.26) * 2, ease: 'sine.inOut', delay: 0.3 + delay, force3D: true
});
});
if (dustEl) {
for (var d = 0; d < 26; d++) {
var speck = document.createElement('i');
dustEl.appendChild(speck);
var dustDelay = 0.45 + d * 0.1;
gsap.set(speck, {
left: (4 + (d % 13) * 7) + '%', bottom: Math.random() * 16,
scale: 0.5 + Math.random() * 1.2,
background: 'rgba(200,180,140,' + (0.35 + Math.random() * 0.4) + ')'
});
gsap.to(speck, { opacity: 0.7, y: -18 - Math.random() * 26, x: (Math.random() - 0.5) * 28, scale: 1.8, duration: 0.75, delay: dustDelay, ease: 'power1.out' });
gsap.to(speck, { opacity: 0, duration: 0.45, delay: dustDelay + 0.5 });
}
}
if ($('.ground')) gsap.to('.ground', { y: 2, duration: 0.08, yoyo: true, repeat: 45, ease: 'none', delay: 0.5 });
if ($('#horses-caption')) master.to('#horses-caption', { opacity: 0, y: -14, duration: 0.5 }, '-=0.95');
if ($('#moon')) master.to('#moon', { opacity: 0.3, duration: 0.4 }, '-=0.6');
master.to('#scene-horses', { opacity: 0.2, duration: 0.4 }, '-=0.35');
}
function launchFireworks(onDone) {
var canvas = $('#fw-canvas');
if (!canvas) { if (onDone) onDone(); return; }
var parent = canvas.parentElement;
var rect = parent.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
var ctx = canvas.getContext('2d');
var particles = [];
var rockets = [];
var colors = ['#c9a84c', '#e8c96a', '#ff6b6b', '#4ecdc4', '#ffe66d', '#fff', '#ff9ff3', '#54a0ff', '#ffd700', '#ff8c42'];
function burst(x, y, n, power) {
power = power || 1;
for (var i = 0; i < n; i++) {
var angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
var speed = (2.2 + Math.random() * 5.5) * power;
particles.push({
x: x, y: y,
vx: Math.cos(angle) * speed,
vy: Math.sin(angle) * speed - 1.8 * power,
life: 1,
decay: 0.008 + Math.random() * 0.014,
color: colors[Math.floor(Math.random() * colors.length)],
size: 2 + Math.random() * 3.2,
trail: true
});
}
for (var j = 0; j < Math.floor(n * 0.3); j++) {
var a2 = Math.random() * Math.PI * 2;
var s2 = (1 + Math.random() * 2.5) * power;
particles.push({
x: x, y: y, vx: Math.cos(a2) * s2, vy: Math.sin(a2) * s2 - 0.5,
life: 1, decay: 0.02 + Math.random() * 0.02, color: '#fff', size: 1.2 + Math.random(), trail: false
});
}
}
function launchRocket(tx, ty, delay) {
setTimeout(function () {
rockets.push({
x: rect.width * (0.3 + Math.random() * 0.4),
y: rect.height,
tx: tx, ty: ty,
vx: (tx - rect.width * 0.5) * 0.02,
vy: -8 - Math.random() * 3,
life: 1, exploded: false
});
}, delay);
}
var shots = [
{ x: rect.width * 0.22, y: rect.height * 0.28, n: 42, delay: 0 },
{ x: rect.width * 0.78, y: rect.height * 0.22, n: 48, delay: 200 },
{ x: rect.width * 0.5,  y: rect.height * 0.18, n: 56, delay: 380 },
{ x: rect.width * 0.35, y: rect.height * 0.32, n: 36, delay: 560 },
{ x: rect.width * 0.65, y: rect.height * 0.26, n: 40, delay: 720 }
];
shots.forEach(function (s) { launchRocket(s.x, s.y, s.delay); });
setTimeout(function () { burst(rect.width * 0.4, rect.height * 0.55, 28, 0.7); }, 900);
setTimeout(function () { burst(rect.width * 0.6, rect.height * 0.5, 32, 0.8); }, 1050);
var frame = 0;
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
rockets = rockets.filter(function (r) {
if (r.exploded) return false;
r.x += r.vx; r.y += r.vy; r.vy += 0.12;
ctx.globalAlpha = 0.7;
ctx.fillStyle = '#ffe66d';
ctx.beginPath(); ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2); ctx.fill();
ctx.fillStyle = '#fff';
ctx.fillRect(r.x - 1, r.y + 4, 2, 8);
if (r.y <= r.ty || r.vy >= 0) {
burst(r.x, r.y, 40 + Math.floor(Math.random() * 20), 1.1);
r.exploded = true;
return false;
}
return true;
});
particles = particles.filter(function (p) {
p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.vx *= 0.985; p.life -= p.decay;
if (p.life <= 0) return false;
ctx.globalAlpha = Math.max(0, p.life);
ctx.fillStyle = p.color;
ctx.beginPath();
ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
ctx.fill();
if (p.trail) {
ctx.fillStyle = '#fff';
ctx.globalAlpha = p.life * 0.35;
ctx.fillRect(p.x - 0.6, p.y - 0.6, 1.2, 1.2);
}
return true;
});
ctx.globalAlpha = 1;
frame++;
if (frame < 140 || particles.length > 0 || rockets.length > 0) {
requestAnimationFrame(draw);
} else {
ctx.clearRect(0, 0, canvas.width, canvas.height);
if (onDone) onDone();
}
}
requestAnimationFrame(draw);
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
playPaperRustle();
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
var name = ($('#input-name').value || '').trim();
if (!name) { $('#input-name').focus(); return; }
state.name = name;
state.role = $('#select-role').value || 'Bạn';
prepareLetter();
showScene('letter');
animateLetter();
startLetterMusic();
});
}
function prepareLetter() {
var g = $('#letter-greeting');
var body = $('#letter-body');
var sig = $('#letter-signature');
if (g) g.textContent = state.role + ' ' + state.name + ' thân mến,';
if (body) {
body.innerHTML = '';
CONFIG.invitationLetter.trim().split('\n').forEach(function (line) {
var p = document.createElement('p');
p.textContent = line || '\u00a0';
body.appendChild(p);
});
}
if (sig) sig.innerHTML = '<span>' + CONFIG.senderName + '</span>';
}
function animateLetter() {
var lines = $$('#letter-body p');
gsap.fromTo(lines, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power1.out' });
gsap.fromTo('#letter-signature', { opacity: 0 }, { opacity: 1, duration: 0.55, delay: 0.3 + lines.length * 0.14 });
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
if (!canvas) return;
var ctx = canvas.getContext('2d');
var rect = canvas.parentElement.getBoundingClientRect();
canvas.width = rect.width; canvas.height = rect.height;
var colors = ['#c9a84c', '#e8c96a', '#ff6b6b', '#4ecdc4', '#ffe66d', '#fff', '#ff9ff3', '#54a0ff', '#8b6f5c'];
var pieces = [];
for (var i = 0; i < 70; i++) {
pieces.push({ x: Math.random() * canvas.width, y: -20 - Math.random() * 60, w: 4 + Math.random() * 6, h: 3 + Math.random() * 4, color: colors[Math.floor(Math.random() * colors.length)], vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 3.5, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10, type: 'rect' });
}
for (var b = 0; b < 3; b++) {
var bx = canvas.width * (0.25 + b * 0.25), by = canvas.height * 0.3;
for (var j = 0; j < 28; j++) {
var ang = (Math.PI * 2 * j) / 28;
var sp = 2.5 + Math.random() * 3;
pieces.push({ x: bx, y: by, w: 3, h: 3, color: colors[Math.floor(Math.random() * colors.length)], vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1, rot: 0, vr: 0, type: 'spark', life: 1 });
}
}
var frame = 0;
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
pieces = pieces.filter(function (p) {
p.x += p.vx; p.y += p.vy; p.rot += p.vr;
if (p.type === 'spark') { p.vy += 0.06; p.life = (p.life || 1) - 0.015; if (p.life <= 0) return false; ctx.globalAlpha = p.life; }
else { p.vy += 0.04; if (p.y > canvas.height + 20) return false; ctx.globalAlpha = 1; }
ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
return true;
});
ctx.globalAlpha = 1;
frame++;
if (frame < 120 || pieces.length > 0) requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
}
function submitRSVP() {
if (!CONFIG.gasEndpoint) return Promise.resolve();
var payload = {
name: state.name, role: state.role, wishlist: state.wishlist.join('; '),
attending: state.attending, timestamp: new Date().toISOString()
};
return fetch(CONFIG.gasEndpoint, {
method: 'POST', mode: 'no-cors',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
}).catch(function () {});
}
function prepareThanks() {
stopLetterMusic();
playSoftChime();
launchConfetti();
var daysEl = $('#countdown-days');
if (daysEl) {
var target = new Date(CONFIG.eventDateISO + 'T18:00:00+07:00');
var now = new Date();
var days = Math.max(0, Math.ceil((target - now) / 86400000));
daysEl.textContent = String(days);
}
var title = $('#thanks-title');
if (title) title.textContent = 'Cảm ơn ' + (state.name || 'bạn');
}
function init() {
document.body.addEventListener('touchstart', unlockAudioOnce, { once: true, passive: true });
document.body.addEventListener('click', unlockAudioOnce, { once: true });
$('#btn-open-envelope').addEventListener('click', openEnvelope);
$('#envelope-wrap').addEventListener('click', openEnvelope);
initIntro();
$('#btn-to-info').addEventListener('click', function () {
showScene('info');
$('#info-date').textContent = CONFIG.eventDate + ' · ' + CONFIG.eventDow;
$('#info-time').textContent = CONFIG.eventTime;
$('#info-place').textContent = CONFIG.eventPlace;
$('#info-address').textContent = CONFIG.eventAddress;
});
$('#btn-maps').addEventListener('click', function () { window.open(CONFIG.eventMapsUrl, '_blank', 'noopener'); });
$('#btn-to-wishlist').addEventListener('click', function () { buildWishlist(); showScene('wishlist'); });
$('#btn-to-confirm').addEventListener('click', function () { updateSummary(); showScene('confirm'); });
$('#btn-rsvp').addEventListener('click', function () {
var btn = $('#btn-rsvp');
btn.disabled = true; btn.textContent = 'Đang giữ chỗ…';
submitRSVP().catch(function () {});
setTimeout(function () {
prepareThanks(); showScene('thanks');
}, 600);
});
function startHorsesSafe() {
try { initHorses(); } catch (err) { console.error('[horses]', err); }
}
var firstSrc = (typeof HORSE_SHEETS !== 'undefined' && HORSE_SHEETS.brown)
? HORSE_SHEETS.brown.src
: ((typeof HORSE_SRC !== 'undefined' && HORSE_SRC) ? HORSE_SRC : '');
if (firstSrc) {
var preload = new Image();
preload.onload = startHorsesSafe;
preload.onerror = startHorsesSafe;
preload.src = firstSrc;
setTimeout(startHorsesSafe, 1000);
} else {
startHorsesSafe();
}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
