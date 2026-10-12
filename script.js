(function () {
  'use strict';

  var root = document.documentElement;
  var stage = document.getElementById('stage');
  var site = document.getElementById('site');
  var launchBtn = document.getElementById('launchBtn');
  var skipBtn = document.getElementById('skipBtn');
  var guestEl = document.getElementById('stageGuest');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  /* ---------- Mobile menu ---------- */
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Launch screen ---------- */
  if (root.classList.contains('skip-stage')) return;

  document.body.classList.add('has-stage');

  // Guest name: open the page with ?guest=Name, e.g. index.html?ceremony&guest=Dr.%20Rao
  var guest = new URLSearchParams(location.search).get('guest');
  if (guest) {
    guestEl.textContent = 'Inaugurated by ' + guest.trim().slice(0, 60);
    guestEl.hidden = false;
  }
  launchBtn.focus();

  function chime() {
    // One soft, short chime. Fails silently if audio is unavailable.
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      var ctx = new Ctx(), t = ctx.currentTime;
      [523.25, 783.99].forEach(function (f, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.18 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 1.4);
        o.connect(g); g.connect(ctx.destination);
        o.start(t + i * 0.18); o.stop(t + i * 0.18 + 1.5);
      });
    } catch (e) {}
  }

  function finish() {
    stage.classList.add('done');
    site.classList.add('ready');
    try { localStorage.setItem('gpadhiu-launched', '1'); } catch (e) {}
    setTimeout(function () {
      stage.classList.add('gone');
      document.body.classList.remove('has-stage');
    }, 800);
  }

  var started = false;
  function launch() {
    if (started) return;
    started = true;
    stage.classList.add('launching');
    chime();
    setTimeout(finish, 3200);
  }

  launchBtn.addEventListener('click', launch);
  skipBtn.addEventListener('click', function () { started = true; finish(); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !started) { started = true; finish(); }
  });
})();