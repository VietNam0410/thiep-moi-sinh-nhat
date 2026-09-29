function buildWishlist() {
  var normal = $('#wishlist-normal');
  var special = $('#wishlist-special');
  if (!normal || !special) return;

  normal.innerHTML = '';
  special.innerHTML = '';

  /* Box wishlist thường (từ CONFIG.wishlistNormal) */
  CONFIG.wishlistNormal.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'wish-item';
    div.innerHTML =
      '<div class="wish-check">✓</div>' +
      '<span class="wish-label">' + item + '</span>';
    div.addEventListener('click', function () {
      toggleWish(div, item);
    });
    normal.appendChild(div);
  });

  /* Ô nhập quà tùy chọn */
  var custom = document.createElement('div');
  custom.className = 'wish-item wish-custom';
  custom.innerHTML =
    '<div class="wish-check">✓</div>' +
    '<input type="text" class="wish-input" id="custom-gift-input" ' +
    'placeholder="Quà khác bạn muốn tặng..." maxlength="80" />';
  normal.appendChild(custom);

  var ci = custom.querySelector('#custom-gift-input');
  if (ci) {
    ci.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    ci.addEventListener('input', function () {
      state.customGift = (ci.value || '').trim();
      if (state.customGift) {
        custom.classList.add('selected');
      } else {
        custom.classList.remove('selected');
      }
    });
  }

  /* Box wishlist đặc biệt */
  CONFIG.wishlistSpecial.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'wish-item special';
    div.innerHTML =
      '<div class="wish-check">✓</div>' +
      '<span class="wish-label">' + item + '</span>';
    div.addEventListener('click', function () {
      toggleWish(div, item);
    });
    special.appendChild(div);
  });
}

function toggleWish(el, val) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (state.wishlist.indexOf(val) === -1) {
      state.wishlist.push(val);
    }
  } else {
    state.wishlist = state.wishlist.filter(function (w) {
      return w !== val;
    });
  }
}

function updateSummary() {
  if ($('#sum-name')) {
    $('#sum-name').textContent = state.name || '—';
  }
  if ($('#sum-role')) {
    $('#sum-role').textContent = state.role || '—';
  }

  var list = state.wishlist.slice();
  if (state.customGift) {
    list.push(state.customGift);
  }

  if ($('#sum-wishlist')) {
    $('#sum-wishlist').textContent = list.length
      ? list.join(', ')
      : 'Chưa chọn';
  }
}


/* ==========================================================================
 *  12. CONFETTI — sau khi xác nhận RSVP
 * ========================================================================== */
function launchConfetti() {
  var canvas = $('#confetti-canvas');
  if (!canvas) return;

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
  (function draw() {
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
    if (++frame < 110) {
      requestAnimationFrame(draw);
    }
  })();
}


/* ==========================================================================
 *  13. GỬI RSVP → Google Sheet (qua gasEndpoint)
 *      Payload: timestamp, name, role, wishlist, attending
 * ========================================================================== */
function submitRSVP() {
  if (!CONFIG.gasEndpoint) {
    return Promise.resolve();
  }

  return fetch(CONFIG.gasEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      name: state.name,
      role: state.role,
      wishlist: state.customGift
        ? state.wishlist.concat([state.customGift])
        : state.wishlist,
      attending: true
    })
  }).catch(function () {});
}

function prepareThanks() {
  var roleLabel = state.role || 'bạn';
  var who =
    state.role && state.name
      ? state.role + ' ' + state.name
      : state.name || 'bạn';

  if ($('#thanks-title')) {
    $('#thanks-title').textContent = 'Cảm ơn ' + who;
  }

  if ($('#thanks-msg')) {
    $('#thanks-msg').textContent =
      'Sự có mặt của ' +
      roleLabel +
      ' là niềm hạnh phúc của gia đình chúng tui.';
  }

  var target = new Date(CONFIG.eventDateISO + 'T18:00:00+07:00');
  if ($('#countdown-days')) {
    $('#countdown-days').textContent = Math.max(
      0,
      Math.ceil((target - new Date()) / 86400000)
    );
  }
}


/* ==========================================================================
 *  14. KHỞI TẠO — gắn sự kiện nút + bắt đầu scene ngựa
 *      ★ MUSIC #2 nằm trong handler nút #btn-rsvp
 * ========================================================================== */
function init() {
  /* Mở khóa audio khi người dùng chạm lần đầu (policy trình duyệt) */
  document.body.addEventListener('touchstart', unlockAudioOnce, {
    once: true,
    passive: true
  });
  document.body.addEventListener('pointerdown', unlockAudioOnce, {
    once: true
  });
  document.body.addEventListener('click', unlockAudioOnce, { once: true });

  try {
    ensureAudio();
    startGallopSound();
  } catch (e) {}

  /* Nút / chạm mở phong bì */
  if ($('#btn-open-envelope')) {
    $('#btn-open-envelope').addEventListener('click', openEnvelope);
  }
  if ($('#envelope-wrap')) {
    $('#envelope-wrap').addEventListener('click', openEnvelope);
  }

  initIntro();

  /* Lá thư → Thông tin sự kiện */
  if ($('#btn-to-info')) {
    $('#btn-to-info').addEventListener('click', function () {
      gsap.to('#letter-sheet', {
        opacity: 0,
        x: -24,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: function () {
          gsap.set('#letter-sheet', { clearProps: 'all' });
          showScene('info');
          gsap.fromTo(
            '#info-card',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.55 }
          );
        }
      });
    });
  }

  /* Xem bản đồ */
  if ($('#btn-maps')) {
    $('#btn-maps').addEventListener('click', function () {
      window.open(CONFIG.eventMapsUrl, '_blank', 'noopener');
    });
  }

  /* → Wishlist */
  if ($('#btn-to-wishlist')) {
    $('#btn-to-wishlist').addEventListener('click', function () {
      buildWishlist();
      showScene('wishlist');
    });
  }

  /* → Xác nhận */
  if ($('#btn-to-confirm')) {
    $('#btn-to-confirm').addEventListener('click', function () {
      updateSummary();
      showScene('confirm');
    });
  }

  /* Nút RSVP — gửi Sheet + confetti + trang cảm ơn */
  if ($('#btn-rsvp')) {
    $('#btn-rsvp').addEventListener('click', function () {
      var btn = $('#btn-rsvp');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Đang gửi...';
      }
      state.attending = true;
      launchConfetti();
      submitRSVP().catch(function () {});

      /* ---------------------------------------------------------
       *  ★ MUSIC #2 — SAU XÁC NHẬN THAM GIA
       *  Chèn code phát nhạc tại đây, ví dụ:
       *
       *    var audio = new Audio('music/thanks.mp3');
       *    audio.volume = 0.7;
       *    audio.play().catch(function () {});
       *
       * --------------------------------------------------------- */




      setTimeout(function () {
        prepareThanks();
        showScene('thanks');
        gsap.fromTo(
          '.thanks-content > *',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }
        );
      }, 1100);
    });
  }

  /* Preload sprite ngựa rồi khởi động scene */
  function startHorsesSafe() {
    try {
      initHorses();
    } catch (e) {
      console.error('[horses]', e);
    }
  }

  var firstSrc =
    typeof HORSE_SHEETS !== 'undefined' && HORSE_SHEETS.brown
      ? HORSE_SHEETS.brown.src
      : typeof HORSE_SRC !== 'undefined' && HORSE_SRC
        ? HORSE_SRC
        : '';

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


/* ==========================================================================
 *  15. BOOT — chạy init khi DOM sẵn sàng
 * ========================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
