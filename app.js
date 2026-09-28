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
/* FULL APP CONTINUES - horses, fireworks, envelope, letter, wishlist, rsvp - see local artifacts */
console.log('[thiep] partial load - full version pending');
