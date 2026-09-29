function initHorses() {
  if ($('#moon')) {
    gsap.to('#moon', {
      y: -6,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
  if ($('#sound-hint')) {
    gsap.to('#sound-hint', { opacity: 1, duration: 0.9, delay: 0.4 });
  }
  if ($('#horses-caption')) {
    gsap.fromTo(
      '#horses-caption',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3 }
    );
  }

  var track = $('#horse-track');
  var dustEl = $('#dust');
  if (!track) return;
  track.innerHTML = '';
  if (dustEl) dustEl.innerHTML = '';

  var sheets = typeof HORSE_SHEETS !== 'undefined' ? HORSE_SHEETS : null;
  var colors = sheets ? Object.keys(sheets) : ['brown'];
  var srcFallback =
    typeof HORSE_SRC !== 'undefined' && HORSE_SRC ? HORSE_SRC : '';

  /* 4 lớp ngựa: xa → gần (size, tốc độ, số lượng khác nhau) */
  var herd = [
    { layer: 'far',  size: 42,  bottom: 58, speed: 5.0, count: 4, stagger: 0.38, bob: 2 },
    { layer: 'mid',  size: 62,  bottom: 36, speed: 3.8, count: 5, stagger: 0.28, bob: 3 },
    { layer: 'near', size: 88,  bottom: 14, speed: 2.9, count: 4, stagger: 0.22, bob: 5 },
    { layer: 'near', size: 108, bottom: 2,  speed: 2.3, count: 3, stagger: 0.26, bob: 7 }
  ];

  var allHorses = [];
  var colorIdx = 0;

  herd.forEach(function (band) {
    for (var i = 0; i < band.count; i++) {
      var cname = colors[colorIdx % colors.length];
      colorIdx++;
      var meta =
        sheets && sheets[cname]
          ? sheets[cname]
          : { src: srcFallback, fw: 82, fh: 66, frames: 5 };
      if (!meta.src) continue;

      var fw = meta.fw || 82;
      var fh = meta.fh || 66;
      var frames = meta.frames || 5;
      var sc = band.size / fw;
      var elW = Math.round(fw * sc);
      var elH = Math.round(fh * sc);

      var el = document.createElement('div');
      el.className = 'horse ' + band.layer;
      el.style.cssText =
        'position:absolute;' +
        'width:' + elW + 'px;' +
        'height:' + elH + 'px;' +
        'bottom:' + (band.bottom + (Math.random() * 4 - 1)) + 'px;' +
        'left:0;' +
        'z-index:' + (15 + band.bottom) + ';' +
        'background-image:url(' + meta.src + ');' +
        'background-repeat:no-repeat;' +
        'background-size:' + (fw * frames * sc) + 'px ' + elH + 'px;' +
        'background-position:0 0;' +
        'image-rendering:pixelated;' +
        'filter:' + (meta.filter ? meta.filter + ' ' : '') +
        'drop-shadow(0 ' + Math.round(2.5 * sc) + 'px ' +
        Math.round(5 * sc) + 'px rgba(0,0,0,.4));' +
        'will-change:transform';

      track.appendChild(el);

      /* Animation frame sprite (chạy) */
      (function (el, elW, frames) {
        var frame = 0;
        setInterval(function () {
          frame = (frame + 1) % frames;
          el.style.backgroundPosition = -frame * elW + 'px 0';
        }, 88 + Math.random() * 22);
      })(el, elW, frames);

      allHorses.push({ el: el, band: band, i: i, fw: elW });
    }
  });

  startGallopSound();
  startContinuousFireworks();

  function screenW() {
    return ($('#app') ? $('#app').clientWidth : window.innerWidth) || 400;
  }

  var w = screenW();
  var master = gsap.timeline({
    delay: 0.3,
    onComplete: function () {
      stopGallopSound();
      stopContinuousFireworks();
      setTimeout(function () {
        showScene('envelope');
        initEnvelopeIdle();
      }, 500);
    }
  });

  gsap.fromTo(
    '#scene-horses',
    { scale: 1.04, x: -4 },
    { scale: 1, x: 0, duration: 5.2, ease: 'power1.out' }
  );

  /* Di chuyển từng ngựa từ trái → phải + bob */
  allHorses.forEach(function (item) {
    var el = item.el;
    var band = item.band;
    var i = item.i;
    var startX = -item.fw - 50 - i * (item.fw * 0.9) - Math.random() * 40;
    var endX = w + item.fw + 70 + i * 20;
    var dur = band.speed + Math.random() * 0.35;
    var delay =
      i * band.stagger +
      (band.layer === 'far' ? 0.05 : band.layer === 'mid' ? 0.12 : 0.18);

    gsap.set(el, { x: startX, force3D: true });
    master.to(
      el,
      {
        x: endX,
        duration: dur,
        ease: 'none',
        delay: delay,
        force3D: true
      },
      0
    );
    gsap.to(el, {
      y: -band.bob,
      scaleY: 0.94,
      duration: 0.12 + Math.random() * 0.03,
      yoyo: true,
      repeat: Math.ceil(dur / 0.26) * 2,
      ease: 'sine.inOut',
      delay: 0.3 + delay,
      force3D: true
    });
  });

  /* --- Bụi mượt: 48 hạt nhỏ, fade mềm, bay theo hướng chạy --- */
  if (dustEl) {
    for (var d = 0; d < 48; d++) {
      var speck = document.createElement('i');
      dustEl.appendChild(speck);

      var dustDelay = 0.35 + d * 0.085;
      var baseLeft = 3 + (d % 16) * 5.8 + Math.random() * 3;

      gsap.set(speck, {
        left: baseLeft + '%',
        bottom: Math.random() * 14,
        scale: 0.35 + Math.random() * 0.9,
        background: 'rgba(190,165,125,' + (0.28 + Math.random() * 0.38) + ')',
        borderRadius: '50%'
      });

      gsap.to(speck, {
        opacity: 0.65,
        y: -12 - Math.random() * 22,
        x: 8 + Math.random() * 18,
        scale: 1.4 + Math.random() * 0.6,
        duration: 0.9 + Math.random() * 0.35,
        delay: dustDelay,
        ease: 'power1.out'
      });
      gsap.to(speck, {
        opacity: 0,
        duration: 0.55,
        delay: dustDelay + 0.55 + Math.random() * 0.2,
        ease: 'power1.in'
      });
    }
  }

  if ($('.ground')) {
    gsap.to('.ground', {
      y: 2,
      duration: 0.08,
      yoyo: true,
      repeat: 45,
      ease: 'none',
      delay: 0.5
    });
  }

  if ($('#horses-caption')) {
    master.to('#horses-caption', { opacity: 0, y: -14, duration: 0.5 }, '-=.95');
  }
  if ($('#moon')) {
    master.to('#moon', { opacity: 0.3, duration: 0.4 }, '-=.6');
  }
  master.to('#scene-horses', { opacity: 0.2, duration: 0.4 }, '-=.35');
}


/* ==========================================================================
 *  8. PHONG BÌ — idle bounce
 * ========================================================================== */
function initEnvelopeIdle() {
  gsap.to('#envelope-wrap', {
    y: -6,
    duration: 2.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
  gsap.to('#envelope-seal', {
    rotation: 5,
    duration: 1.8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
}


/* ==========================================================================
 *  9. MỞ PHONG BÌ → chuyển sang intro
 *     ★ MUSIC #1 — chèn nhạc tại đây
 * ========================================================================== */
function openEnvelope() {
  var btn = $('#btn-open-envelope');
  if (btn && btn.disabled) return;
  if (btn) btn.disabled = true;
  unlockAudioOnce();

  /* ---------------------------------------------------------
   *  ★ MUSIC #1 — MỞ THƯ
   *  Dừng vó ngựa → phát nhạc thư đến hết flow
   * --------------------------------------------------------- */
  stopGallopSound();
  startLetterMusic();
  playUiClick();

  gsap.killTweensOf(['#envelope-wrap', '#envelope-seal']);
  var tl = gsap.timeline({
    onComplete: function () {
      setTimeout(function () {
        showScene('intro');
      }, 220);
    }
  });

  tl.to('#envelope-flap', {
    rotationX: -170,
    duration: 0.85,
    ease: 'power2.inOut',
    transformOrigin: 'top center'
  })
    .to(
      '#envelope-seal',
      { scale: 0.5, opacity: 0, duration: 0.35 },
      '-=.65'
    )
    .to(
      '#envelope-letter-peek',
      { y: -100, duration: 0.65, ease: 'power2.out' },
      '-=.45'
    )
    .to(
      '#envelope-wrap',
      { scale: 0.9, opacity: 0, y: -36, duration: 0.45, ease: 'power2.in' },
      '-=.2'
    )
    .to(
      '.envelope-hint,#btn-open-envelope',
      { opacity: 0, duration: 0.3 },
      '-=.4'
    );
}


/* ==========================================================================
 *  10. INTRO — nhập tên + vai trò → mở lá thư
 * ========================================================================== */
function initIntro() {
  var btn = $('#btn-open-letter');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var name = ($('#input-name') && $('#input-name').value || '').trim();
    var role = ($('#select-role') && $('#select-role').value) || '';

    if (!name) {
      if ($('#input-name')) {
        $('#input-name').focus();
        gsap.fromTo(
          '#input-name',
          { x: -5 },
          { x: 5, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' }
        );
      }
      return;
    }

    if (!role) {
      if ($('#select-role')) {
        $('#select-role').focus();
        gsap.fromTo(
          '#select-role',
          { x: -5 },
          { x: 5, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' }
        );
      }
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
  var g = $('#letter-greeting');
  var body = $('#letter-body');

  if (g) {
    g.textContent = state.role + ' ' + state.name + ' thân mến,';
  }

  if (body) {
    body.innerHTML = '';
    CONFIG.invitationLetter
      .trim()
      .split('\n')
      .forEach(function (line) {
        var span = document.createElement('span');
        var empty = !line.trim();
        span.className = empty ? 'line is-break' : 'line';
        span.textContent = empty ? '\u00A0' : line;
        body.appendChild(span);
      });
  }
}

function animateLetter() {
  var lines = $$('#letter-body .line');

  gsap.fromTo(
    '#letter-greeting',
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.5 }
  );

  if (lines.length) {
    gsap.to(lines, {
      opacity: 1,
      duration: 0.32,
      stagger: 0.14,
      ease: 'power1.out',
      delay: 0.25
    });
  }

  gsap.fromTo(
    '.letter-closing',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.55,
      delay: 0.3 + (lines.length || 0) * 0.14
    }
  );
}


/* ==========================================================================
 *  11. WISHLIST — box chọn + ô nhập quà tùy chọn
 * ========================================================================== */
