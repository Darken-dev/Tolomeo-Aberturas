(function () {
  if (window.__yetiGamesLoaded) return;
  window.__yetiGamesLoaded = true;

  var CANDIES = ['🪟', '🚪', '🚧', '🔑', '⭐', '🏠'];
  var yetiSprite = new Image();
  var yetiSpriteReady = false;
  var mascotSvg = document.querySelector('#tolo svg');
  if (mascotSvg) {
    var spriteClone = mascotSvg.cloneNode(true);
    var sleepText = spriteClone.querySelector('.zz');
    if (sleepText) sleepText.remove();
    var spriteMarkup = new XMLSerializer().serializeToString(spriteClone);
    yetiSprite.onload = function () { yetiSpriteReady = true; };
    yetiSprite.onerror = function () { console.warn('No se pudo cargar el SVG original del Yeti para los minijuegos.'); };
    yetiSprite.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(spriteMarkup);
  } else {
    console.warn('No se encontró el SVG original del Yeti; se usará la ilustración del minijuego.');
  }
  var GAMES = [
    { id: 'catch', category: 'Movimiento', title: 'Tirá y atrapá', help: 'Tocá la pelota para lanzársela a Yeti. También podés arrastrarla para apuntar.' },
    { id: 'rope', category: 'Movimiento', title: 'Saltar la cuerda', help: 'Tocá Saltar justo antes de que la cuerda llegue al suelo.' },
    { id: 'trampoline', category: 'Movimiento', title: 'Trampolín', help: 'Tocá Rebotar cuando Yeti esté bajando y cerca de la cama elástica.' },
    { id: 'football', category: 'Deportes', title: 'Penales contra Yeti', help: 'La pelota espera abajo en el centro. Tocá un rincón del arco para patear; Yeti se mueve de lado a lado.' },
    { id: 'basket', category: 'Deportes', title: 'Básquet', help: 'Deslizá desde la pelota hacia arriba y a la derecha para encestar.' },
    { id: 'volley', category: 'Deportes', title: 'Vóley de playa', help: 'Yeti inicia el juego. Tocá la pelota cuando llegue a tu lado para devolverla antes de que caiga.' },
    { id: 'runner', category: 'Carreras', title: 'Carrera de obstáculos', help: 'Tocá Saltar o la barra espaciadora para pasar las vallas.' },
    { id: 'driver', category: 'Carreras', title: 'Auto de Yeti', help: 'Cambiá de carril para esquivar baches y juntar estrellas.' },
    { id: 'skate', category: 'Carreras', title: 'Monopatín', help: 'Usá izquierda y derecha para equilibrarte y saltá las rampas.' },
    { id: 'ttt', category: 'Lógica', title: 'Ta-Te-Ti', help: 'Hacé una línea de tres antes que Yeti. Él no te lo va a dejar fácil.' },
    { id: 'match3', category: 'Lógica', title: 'Conectá tres', help: 'Sostené una ficha y arrastrala en cruz a una vecina para alinear tres iguales. Tenés 18 movimientos.' }
  ];

  var style = document.createElement('style');
  style.textContent = `
    #yeti-games-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:clamp(8px,2vw,24px);background:rgba(7,18,42,.78);backdrop-filter:blur(7px);font-family:Montserrat,Arial,sans-serif;color:#142747}
    #yeti-games-overlay *{box-sizing:border-box}
    #yeti-games-overlay[hidden]{display:none}
    .yg-panel{width:min(980px,100%);max-height:min(94dvh,900px);overflow:auto;background:#f7f9ff;border:1px solid rgba(255,255,255,.55);border-radius:22px;box-shadow:0 24px 80px #06112680;padding:clamp(16px,3vw,30px)}
    .yg-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px}
    .yg-header h2{margin:0;color:#0c2461;font-size:clamp(1.25rem,3vw,1.8rem);font-weight:900}
    .yg-subtitle{margin:5px 0 0;color:#53627a;font-size:.88rem;line-height:1.5}
    .yg-close,.yg-back,.yg-action{border:0;border-radius:999px;padding:10px 15px;font:700 .82rem Montserrat,Arial,sans-serif;cursor:pointer}
    .yg-close{background:#e8eefb;color:#0c2461;flex-shrink:0}
    .yg-back{background:#e8eefb;color:#0c2461}
    .yg-action{background:#0c2461;color:#fff}
    .yg-close:focus-visible,.yg-back:focus-visible,.yg-action:focus-visible,.yg-card:focus-visible,.yg-cell:focus-visible,.yg-game-button:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
    .yg-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,225px),1fr));gap:12px}
    .yg-card{display:flex;flex-direction:column;align-items:flex-start;gap:7px;min-height:120px;padding:16px;border:1px solid #dfe7f5;border-radius:16px;background:#fff;text-align:left;cursor:pointer;transition:transform .15s,box-shadow .15s}
    .yg-card:hover{transform:translateY(-2px);box-shadow:0 8px 22px #0c24611c}
    .yg-category{font-size:.67rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#2563eb}
    .yg-card strong{font-size:.94rem;color:#0c2461}
    .yg-card small{font-size:.76rem;line-height:1.5;color:#53627a}
    .yg-game{display:grid;gap:12px}
    .yg-product-strip{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;padding:10px;border-radius:14px;background:#e8eefb}
    .yg-product-chip{display:flex;align-items:center;gap:6px;padding:7px 11px;border:1px solid #d5e0f2;border-radius:10px;background:#fff;color:#0c2461;font-size:.75rem;font-weight:800}
    .yg-canvas-wrap{overflow:hidden;border-radius:16px;background:#dcecff;box-shadow:inset 0 0 0 1px #0c24611c}
    .yg-canvas{display:block;width:100%;height:auto;aspect-ratio:16/9;touch-action:none}
    .yg-status{min-height:24px;color:#0c2461;font-size:.87rem;font-weight:700}
    .yg-actions{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px}
    .yg-board{display:grid;justify-content:center;gap:8px;margin:8px auto 16px}
    .yg-board.ttt{grid-template-columns:repeat(3,min(23vw,100px))}
    .yg-board.match3{grid-template-columns:repeat(7,min(10vw,62px));gap:5px}
    .yg-cell{display:grid;place-items:center;aspect-ratio:1;border:2px solid #dbe5f5;border-radius:13px;background:#fff;color:#0c2461;font-size:clamp(1.5rem,5vw,2.4rem);font-weight:900;cursor:pointer;touch-action:manipulation}
    .yg-board.match3 .yg-cell{border-radius:11px;font-size:clamp(1.15rem,4vw,2rem);padding:0;touch-action:none;user-select:none;transition:transform 150ms cubic-bezier(.2,.8,.2,1),box-shadow 150ms}
    .yg-board.match3 .yg-cell.match-dragging{position:relative;z-index:2;box-shadow:0 10px 24px #0c246155}
    .yg-cell.selected{border-color:#2563eb;background:#e8f0ff;transform:scale(.94)}
    .yg-cell:disabled{cursor:default}
    .yg-safe-note{text-align:center;margin:14px 0 0;color:#6b7a9c;font-size:.72rem}
    .yg-game-button{min-width:110px;border:0;border-radius:999px;padding:10px 15px;background:#e8eefb;color:#0c2461;font:700 .8rem Montserrat,Arial,sans-serif;cursor:pointer;touch-action:manipulation}
    .yg-game-button.primary{background:#2563eb;color:#fff}
    @media(max-width:600px){#yeti-games-overlay{align-items:flex-start;padding:8px}.yg-panel{max-height:calc(100dvh - 16px);border-radius:17px;padding:15px}.yg-header{margin-bottom:12px}.yg-grid{grid-template-columns:1fr 1fr;gap:8px}.yg-card{min-height:108px;padding:12px}.yg-board.match3{grid-template-columns:repeat(7,min(12vw,48px));gap:3px}.yg-cell{border-radius:9px}.yg-board.match3 .yg-cell{border-radius:7px}}
    @media(prefers-reduced-motion:reduce){#yeti-games-overlay *,#yeti-games-overlay *::before,#yeti-games-overlay *::after{scroll-behavior:auto!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'yeti-games-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'yg-title');
  overlay.innerHTML = '<section class="yg-panel"><div class="yg-header"><div><h2 id="yg-title">Juegos del Yeti</h2><p class="yg-subtitle" id="yg-subtitle">Minijuegos inspirados en puertas, ventanas y portones.</p></div><button class="yg-close" type="button" aria-label="Cerrar juegos">Cerrar ✕</button></div><main id="yg-content"></main><p class="yg-safe-note">Minijuegos locales · No usan sensores, no envían datos y no interfieren con el catálogo.</p></section>';
  document.body.appendChild(overlay);

  var content = overlay.querySelector('#yg-content');
  var title = overlay.querySelector('#yg-title');
  var subtitle = overlay.querySelector('#yg-subtitle');
  var closeButton = overlay.querySelector('.yg-close');
  var previousFocus = null;
  var previousScrollX = 0;
  var previousScrollY = 0;
  var previousOverflow = '';
  var frame = 0;
  var activeGame = null;
  var canvas = null;
  var ctx = null;
  var lastFrameTime = 0;
  var accumulator = 0;
  var fixedStep = 1 / 120;
  var keys = Object.create(null);

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function openHub() {
    if (!overlay.hidden) return;
    previousFocus = document.activeElement;
    previousScrollX = window.scrollX;
    previousScrollY = window.scrollY;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    renderHub();
    closeButton.focus();
  }

  function stopLoop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    activeGame = null;
    canvas = null;
    ctx = null;
    keys = Object.create(null);
  }

  function closeHub() {
    if (overlay.hidden) return;
    stopLoop();
    overlay.hidden = true;
    document.body.style.overflow = previousOverflow;
    window.dispatchEvent(new CustomEvent('yeti:games:closed'));
    var focusTarget = previousFocus && previousFocus.isConnected
      ? previousFocus
      : document.querySelector('#tolo .opts [data-go="games"]');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
    window.scrollTo(previousScrollX, previousScrollY);
  }

  function renderHub() {
    stopLoop();
    title.textContent = 'Juegos del Yeti';
    subtitle.textContent = 'Elegí un juego. ¡El catálogo queda guardado mientras jugás!';
    content.innerHTML = '<div class="yg-grid">' + GAMES.map(function (game) {
      return '<button class="yg-card" type="button" data-game="' + game.id + '"><span class="yg-category">' + game.category + '</span><strong>' + game.title + '</strong><small>' + game.help + '</small></button>';
    }).join('') + '</div>';
  }

  function buildGame(id) {
    var def = GAMES.find(function (item) { return item.id === id; });
    if (!def) return;
    stopLoop();
    activeGame = createState(id);
    title.textContent = def.title;
    subtitle.textContent = def.help;
    content.innerHTML = '<div class="yg-game">' +
      (id === 'ttt' ? '<div class="yg-product-strip" aria-label="Productos del juego"><span class="yg-product-chip">🪟 Ventanas</span><span class="yg-product-chip">🚪 Puertas</span><span class="yg-product-chip">🚧 Portones</span></div><div class="yg-board ttt" id="yg-board"></div>' :
        id === 'match3' ? '<div class="yg-product-strip" aria-label="Fichas del juego"><span class="yg-product-chip">🪟 Ventana</span><span class="yg-product-chip">🚪 Puerta</span><span class="yg-product-chip">🚧 Portón</span></div><div class="yg-board match3" id="yg-board"></div>' :
          '<div class="yg-canvas-wrap"><canvas class="yg-canvas" width="800" height="450" aria-label="' + escapeHtml(def.title) + '"></canvas></div>') +
      '<div class="yg-status" id="yg-status" role="status" aria-live="polite"></div>' +
      '<div class="yg-actions" id="yg-actions"></div>' +
      '<div class="yg-actions"><button class="yg-back" type="button" data-hub>← Todos los juegos</button></div></div>';
    content.querySelector('[data-hub]').addEventListener('click', renderHub);
    if (id === 'ttt' || id === 'match3') {
      renderBoard();
      return;
    }
    canvas = content.querySelector('canvas');
    ctx = canvas.getContext('2d');
    addGameControls(id);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); });
    lastFrameTime = performance.now();
    accumulator = 0;
    frame = requestAnimationFrame(gameFrame);
  }

  function addGameControls(id) {
    var actions = content.querySelector('#yg-actions');
    var buttonSets = {
      rope: [['Saltar', 'jump']],
      trampoline: [['Rebotar', 'bounce']],
      runner: [['Saltar', 'jump']],
      driver: [['◀ Carril', 'left'], ['Carril ▶', 'right']],
      skate: [['◀ Equilibrar', 'left'], ['Saltar', 'jump'], ['Equilibrar ▶', 'right']]
    };
    (buttonSets[id] || []).forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'yg-game-button' + (item[1] === 'jump' || item[1] === 'hit' || item[1] === 'bounce' ? ' primary' : '');
      button.textContent = item[0];
      button.addEventListener('click', function () { performAction(item[1]); });
      actions.appendChild(button);
    });
    var restart = document.createElement('button');
    restart.type = 'button';
    restart.className = 'yg-game-button';
    restart.textContent = 'Reiniciar';
    restart.addEventListener('click', function () { buildGame(id); });
    actions.appendChild(restart);
  }

  function createState(id) {
    var state = {
      id: id, elapsed: 0, score: 0, status: '', ended: false, won: false,
      pointer: null, lastPointer: null, pointerDown: null, spawnTimer: 0, objects: [],
      player: {}, ball: {}, hits: 0, misses: 0, lane: 1, coins: 0, lean: 0, angularVelocity: 0,
      nextRamp: 3.2, jumpTime: 0, lastCycle: -1, bounces: 0, lives: 3, moves: 18,
      board: [], selected: null, busy: false, lastHit: -1
    };
    if (id === 'catch') Object.assign(state, { ball: { x: 120, y: 334, vx: 0, vy: 0, active: false }, player: { x: 640, y: 370 } });
    if (id === 'rope') Object.assign(state, { ropePeriod: 1.45, jumpUntil: 0, lastCycle: -1, status: '¡Preparado! Esperá el momento y saltá.' });
    if (id === 'trampoline') Object.assign(state, { player: { x: 400, y: 230, vy: 0 }, misses: 0, status: 'Tocá Rebotar cuando esté bajando cerca de la lona.' });
    if (id === 'football') Object.assign(state, { ball: { x: 400, y: 410, vx: 0, vy: 0, active: false }, player: { x: 400, direction: 1 }, shot: 0, status: 'La pelota está en el centro. Tocá el arco para patear.' });
    if (id === 'basket') Object.assign(state, { ball: { x: 115, y: 345, vx: 0, vy: 0, active: false }, attempts: 0, status: 'Deslizá la pelota en arco hacia el aro.' });
    if (id === 'volley') Object.assign(state, {
      ball: { x: 585, y: 245, vx: 0, vy: 0, active: false },
      player: { x: 180, y: 355 }, lives: 3, lastTouch: 'yeti', serveAt: .65,
      status: 'Yeti va a sacar. Tocá la pelota cuando vuelva a tu lado.'
    });
    if (id === 'runner') Object.assign(state, { player: { y: 360, vy: 0 }, spawnTimer: 1.3, status: '¡A correr! Saltá las vallas.' });
    if (id === 'driver') Object.assign(state, { lane: 1, spawnTimer: .8, status: 'Esquivá los baches y juntá estrellas.' });
    if (id === 'skate') Object.assign(state, { player: { y: 350 }, status: 'Mantené el equilibrio y preparate para las rampas.' });
    if (id === 'ttt') Object.assign(state, { board: Array(9).fill(''), status: 'Tu turno: X.' });
    if (id === 'match3') Object.assign(state, { board: createMatchBoard(), moves: 18, status: 'Sostené una ficha y arrastrala arriba, abajo o a un costado.' });
    return state;
  }

  function gameFrame(now) {
    if (!activeGame || overlay.hidden || !canvas || !ctx) return;
    var delta = Math.min(.05, Math.max(0, (now - lastFrameTime) / 1000));
    lastFrameTime = now;
    accumulator += delta;
    while (accumulator >= fixedStep) {
      updateGame(activeGame, fixedStep);
      accumulator -= fixedStep;
    }
    drawGame(activeGame);
    var status = content.querySelector('#yg-status');
    if (status) status.textContent = gameStatus(activeGame);
    frame = requestAnimationFrame(gameFrame);
  }

  function gameStatus(s) {
    if (s.id === 'catch') return 'Atrapadas: ' + s.score + (s.status ? ' · ' + s.status : '');
    if (s.id === 'rope') return 'Saltos: ' + s.score + ' · Errores: ' + s.misses + (s.status ? ' · ' + s.status : '');
    if (s.id === 'trampoline') return 'Rebotes: ' + s.score + ' · ' + s.status;
    if (s.id === 'football') return 'Goles: ' + s.score + ' · Atajadas de Yeti: ' + s.misses + (s.status ? ' · ' + s.status : '');
    if (s.id === 'basket') return 'Encestes: ' + s.score + ' · Tiros: ' + s.attempts + ' · ' + s.status;
    if (s.id === 'volley') return 'Toques seguidos: ' + s.score + ' · Vidas: ' + s.lives + ' · ' + s.status;
    if (s.id === 'runner') return s.ended ? 'Fin de carrera · Puntaje: ' + Math.floor(s.score) + ' · Tocá Reiniciar.' : 'Puntaje: ' + Math.floor(s.score);
    if (s.id === 'driver') return 'Carril: ' + (s.lane + 1) + '/3 · Estrellas: ' + s.coins + ' · Distancia: ' + Math.floor(s.elapsed) + ' m';
    if (s.id === 'skate') return s.ended ? '¡Yeti se cayó! Puntaje: ' + Math.floor(s.score) + ' · Tocá Reiniciar.' : 'Distancia: ' + Math.floor(s.score) + ' · Equilibrio: ' + Math.max(0, 100 - Math.floor(Math.abs(s.lean) * 100)) + '%';
    if (s.id === 'match3') return 'Puntaje: ' + s.score + ' · Movimientos: ' + s.moves + ' · ' + s.status;
    return s.status;
  }

  function updateGame(s, dt) {
    if (s.ended) return;
    s.elapsed += dt;
    if (s.id === 'catch') updateCatch(s, dt);
    if (s.id === 'rope') updateRope(s);
    if (s.id === 'trampoline') updateTrampoline(s, dt);
    if (s.id === 'football') updateFootball(s, dt);
    if (s.id === 'basket') updateBasket(s, dt);
    if (s.id === 'volley') updateVolley(s, dt);
    if (s.id === 'runner') updateRunner(s, dt);
    if (s.id === 'driver') updateDriver(s, dt);
    if (s.id === 'skate') updateSkate(s, dt);
  }

  function updateCatch(s, dt) {
    var b = s.ball;
    if (!b.active) return;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vy += 760 * dt;
    s.player.x += Math.min(1, dt * 1.8) * (Math.max(500, Math.min(670, b.x)) - s.player.x);
    if (b.x > 590 && b.x < 705 && Math.abs(b.y - 278) < 70) {
      b.active = false;
      s.score++;
      s.status = '¡La atrapó! Volvé a tirar.';
    } else if (b.x > 820 || b.y > 440) {
      b.active = false;
      s.status = 'Se escapó. Probá otro lanzamiento.';
    }
  }

  function updateRope(s) {
    var cycle = Math.floor(s.elapsed / s.ropePeriod);
    var phase = (s.elapsed % s.ropePeriod) / s.ropePeriod;
    if (cycle !== s.lastCycle) s.lastCycle = cycle;
    if (phase > .46 && phase < .56 && s.lastHit !== cycle) {
      s.lastHit = cycle;
      if (s.jumpUntil > s.elapsed) {
        s.score++;
        s.status = '¡Bien saltado! Seguí el ritmo.';
      } else {
        s.misses++;
        s.status = '¡Uy! Saltá un poquito antes.';
      }
    }
  }

  function updateTrampoline(s, dt) {
    var p = s.player;
    p.y += p.vy * dt;
    p.vy += 1050 * dt;
    if (p.y > 382) {
      p.y = 382;
      p.vy = 0;
      s.landingUntil = s.elapsed + .8;
      if (s.lastHit !== s.bounces) {
        s.misses++;
        s.lastHit = s.bounces;
        s.status = '¡Se escapó el rebote! Tocá cuando baje.';
      }
      if (s.misses >= 3) {
        s.misses = 0;
        p.y = 280;
        p.vy = -480;
      }
    }
  }

  function resetShot(s, scored) {
    if (scored) s.score++;
    else s.misses++;
    s.shot++;
    s.ball.x = 400;
    s.ball.y = 410;
    s.ball.vx = 0;
    s.ball.vy = 0;
    s.ball.active = false;
    s.saveAt = 0;
  }

  function updateFootball(s, dt) {
    var b = s.ball;
    var keeperSpeed = Math.min(420, 115 + s.score * 28);
    if (b.active) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      var keeperDelta = b.x - s.player.x;
      s.player.x += Math.sign(keeperDelta) * Math.min(Math.abs(keeperDelta), keeperSpeed * dt);
      if (b.y <= 280) {
        if (b.x >= 225 && b.x <= 575 && Math.abs(b.x - s.player.x) <= 48) {
          s.status = '¡Yeti atajó el penal! Apuntá al otro lado.';
          resetShot(s, false);
        } else if (b.x >= 220 && b.x <= 580) {
          s.status = '¡Gol! Yeti va a moverse más rápido en el próximo penal.';
          resetShot(s, true);
        } else {
          s.status = 'La pelota se fue afuera. Probá otra vez.';
          resetShot(s, false);
        }
      }
      return;
    }
    s.player.x += s.player.direction * keeperSpeed * dt;
    if (s.player.x >= 530) { s.player.x = 530; s.player.direction = -1; }
    if (s.player.x <= 270) { s.player.x = 270; s.player.direction = 1; }
  }

  function updateBasket(s, dt) {
    var b = s.ball;
    if (!b.active) return;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vy += 580 * dt;
    if (Math.abs(b.x - 610) < 8 && Math.abs(b.y - 190) < 24 && b.vy > 0) {
      s.score++;
      s.status = '¡Encestaste! Prepará el próximo tiro.';
      b.active = false;
      return;
    }
    if (b.x > 820 || b.y > 440 || b.y < -40) {
      b.active = false;
      s.status = 'Casi. Probá ajustar el arco del lanzamiento.';
    }
  }

  function updateVolley(s, dt) {
    var b = s.ball;
    if (!b.active) {
      if (s.elapsed < s.serveAt) return;
      b.active = true;
      b.x = 585;
      b.vx = -220;
      b.vy = -260;
      s.lastTouch = 'yeti';
      s.status = '¡Yeti sacó la pelota! Tocala cuando llegue a tu lado.';
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vy += 460 * dt;
    if (b.x <= 410 && b.vx < 0 && s.lastTouch === 'yeti') {
      s.lastTouch = 'player';
      s.status = '¡La pelota está en tu lado! Tocala para devolverla.';
    }
    if (b.x >= 410 && b.vx > 0) {
      b.x = 410;
      b.vx = -180;
      b.y = Math.max(190, b.y);
      b.vy = -170;
      s.lastTouch = 'yeti';
      s.status = '¡Yeti la tocó! Esperá a que vuelva y tocala antes de que caiga.';
    }
    if (b.y < 30) { b.y = 30; b.vy = Math.abs(b.vy) * .72; }
    if (b.y > 380) {
      s.lives--;
      b.x = 585; b.y = 245; b.vx = 0; b.vy = 0; b.active = false;
      s.serveAt = s.elapsed + .65;
      if (s.lives <= 0) {
        s.lives = 3;
        s.status = '¡Se terminó el rally! Yeti saca otra vez. Récord: ' + s.score + ' toques.';
        s.score = 0;
      } else s.status = 'La pelota cayó. Yeti saca otra vez; te quedan ' + s.lives + ' vidas.';
    }
  }

  function updateRunner(s, dt) {
    var p = s.player;
    p.y += p.vy * dt;
    p.vy += 1500 * dt;
    if (p.y > 360) { p.y = 360; p.vy = 0; }
    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) {
      var obstacleTypes = ['door', 'window', 'gate'];
      s.objects.push({ x: 830, w: 42, h: 48, type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)] });
      s.spawnTimer = Math.max(1.05, 1.7 - s.score / 120);
    }
    s.objects.forEach(function (obstacle) { obstacle.x -= (300 + Math.min(180, s.score * 2)) * dt; });
    var near = s.objects.find(function (obstacle) { return obstacle.x < 190 && obstacle.x + obstacle.w > 140; });
    if (near && p.y > 320) {
      s.ended = true;
      s.status = '¡Yeti chocó con una valla!';
      return;
    }
    s.objects = s.objects.filter(function (obstacle) { return obstacle.x > -60; });
    s.score += dt * 10;
  }

  function updateDriver(s, dt) {
    s.spawnTimer -= dt;
    if (s.spawnTimer <= 0) {
      s.objects.push({ x: 840, lane: Math.floor(Math.random() * 3), type: Math.random() < .72 ? 'rock' : 'coin', hit: false });
      s.spawnTimer = .75 + Math.random() * .7;
    }
    s.objects.forEach(function (object) {
      object.x -= 330 * dt;
      if (!object.hit && Math.abs(object.x - 150) < 20 && object.lane === s.lane) {
        object.hit = true;
        if (object.type === 'coin') { s.coins++; s.score++; }
        else { s.misses++; s.status = '¡Bache! Cambiá de carril.'; }
      }
    });
    s.objects = s.objects.filter(function (object) { return object.x > -40; });
  }

  function updateSkate(s, dt) {
    var steer = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
    s.angularVelocity += steer * 2.3 * dt;
    s.angularVelocity -= s.lean * 1.15 * dt;
    s.angularVelocity *= Math.pow(.985, dt * 60);
    s.lean += s.angularVelocity * dt;
    s.nextRamp -= 220 * dt;
    s.jumpTime = Math.max(0, s.jumpTime - dt);
    if (s.nextRamp <= 178 && s.nextRamp >= 130 && s.lastHit < s.elapsed - .3) {
      if (s.jumpTime > 0) {
        s.score += 25;
        s.lastHit = s.elapsed;
      } else {
        s.ended = true;
        s.status = '¡Faltó saltar la rampa!';
      }
    }
    if (s.nextRamp < -80) s.nextRamp = 880;
    if (Math.abs(s.lean) > .85) {
      s.ended = true;
      s.status = '¡Yeti perdió el equilibrio!';
    }
    s.score += dt * 8;
  }

  function drawGame(s) {
    if (!ctx) return;
    ctx.clearRect(0, 0, 800, 450);
    if (s.id === 'catch') drawCatch(s);
    if (s.id === 'rope') drawRope(s);
    if (s.id === 'trampoline') drawTrampoline(s);
    if (s.id === 'football') drawFootball(s);
    if (s.id === 'basket') drawBasket(s);
    if (s.id === 'volley') drawVolley(s);
    if (s.id === 'runner') drawRunner(s);
    if (s.id === 'driver') drawDriver(s);
    if (s.id === 'skate') drawSkate(s);
  }

  function drawText(text, x, y, size, color, align) {
    ctx.font = '700 ' + size + 'px Montserrat, Arial, sans-serif';
    ctx.fillStyle = color || '#0c2461';
    ctx.textAlign = align || 'left';
    ctx.fillText(text, x, y);
  }

  function drawCourt() {
    var gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, '#d8edff');
    gradient.addColorStop(1, '#f5f8ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 450);
  }

  function drawWindow(x, y, w, h) {
    ctx.fillStyle = '#a8bdd8';
    ctx.fillRect(x - 7, y - 7, w + 14, h + 14);
    ctx.fillStyle = '#9edcf4';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#e7f8ff';
    ctx.fillRect(x + 5, y + 5, w * .42, h * .38);
    ctx.strokeStyle = '#315b8e';
    ctx.lineWidth = Math.max(3, w * .045);
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);
    ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();
  }

  function drawDoor(x, y, w, h) {
    ctx.fillStyle = '#e8d7ba';
    ctx.fillRect(x - 9, y - 9, w + 18, h + 9);
    ctx.fillStyle = '#9a6844';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#e9c99c';
    ctx.lineWidth = Math.max(3, w * .05);
    ctx.strokeRect(x + w * .1, y + h * .08, w * .8, h * .84);
    ctx.beginPath();
    ctx.moveTo(x + w * .1, y + h * .52); ctx.lineTo(x + w * .9, y + h * .52);
    ctx.stroke();
    ctx.fillStyle = '#f5d477';
    ctx.beginPath(); ctx.arc(x + w * .78, y + h * .57, Math.max(2, w * .035), 0, Math.PI * 2); ctx.fill();
  }

  function drawGate(x, y, w, h) {
    ctx.fillStyle = '#aabbd0';
    ctx.fillRect(x - 9, y - 9, w + 18, h + 18);
    ctx.fillStyle = '#667e9d';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#e8f0fb';
    ctx.lineWidth = Math.max(2, h * .055);
    ctx.strokeRect(x, y, w, h);
    for (var i = 1; i < 5; i++) {
      var lineY = y + h * i / 5;
      ctx.beginPath(); ctx.moveTo(x + 3, lineY); ctx.lineTo(x + w - 3, lineY); ctx.stroke();
    }
  }

  function drawGround(y, color) {
    ctx.fillStyle = color || '#77c879';
    ctx.fillRect(0, y, 800, 450 - y);
    ctx.fillStyle = '#438b53';
    ctx.fillRect(0, y, 800, 8);
  }

  function drawYeti(x, y, scale, tilt) {
    if (yetiSpriteReady) {
      var spriteScale = scale || 1;
      ctx.save();
      ctx.translate(x, y - 37 * spriteScale);
      ctx.rotate(tilt || 0);
      ctx.drawImage(yetiSprite, -60 * spriteScale, -75 * spriteScale, 120 * spriteScale, 150 * spriteScale);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt || 0);
    ctx.scale(scale || 1, scale || 1);
    ctx.fillStyle = '#2563eb';
    ctx.beginPath(); ctx.ellipse(0, -8, 39, 48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#eff6ff';
    ctx.beginPath(); ctx.ellipse(0, -58, 45, 43, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.arc(-28, -89, 11, 0, Math.PI * 2);
    ctx.arc(-9, -99, 12, 0, Math.PI * 2);
    ctx.arc(12, -99, 12, 0, Math.PI * 2);
    ctx.arc(31, -88, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a1f44';
    ctx.beginPath(); ctx.arc(-16, -61, 4, 0, Math.PI * 2); ctx.arc(16, -61, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ef8b9b';
    ctx.beginPath(); ctx.arc(0, -49, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#173d9b';
    ctx.beginPath(); ctx.ellipse(-22, 38, 17, 7, 0, 0, Math.PI * 2); ctx.ellipse(21, 38, 17, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawBall(x, y, radius, color) {
    ctx.fillStyle = color || '#f59e0b';
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffffcc'; ctx.lineWidth = Math.max(2, radius * .12);
    ctx.beginPath(); ctx.arc(x, y, radius * .62, -.8, 1.7); ctx.stroke();
  }

  function drawCatch(s) {
    drawCourt(); drawGround(392, '#83cf87');
    drawDoor(38, 210, 72, 152);
    drawWindow(137, 238, 112, 78);
    drawGate(304, 207, 142, 94);
    ctx.fillStyle = '#ffdf88'; ctx.beginPath(); ctx.arc(650, 220, 105, 0, Math.PI * 2); ctx.fill();
    drawYeti(s.player.x, 364, .8);
    drawBall(s.ball.x, s.ball.y, 16, '#ef8b36');
    drawText('Tocá o arrastrá la pelota para lanzársela a Yeti', 24, 38, 18);
  }

  function drawRope(s) {
    drawCourt(); drawGround(392, '#f3d7ab');
    drawWindow(77, 123, 108, 72);
    drawDoor(616, 113, 74, 145);
    drawGate(271, 135, 160, 74);
    var angle = (s.elapsed % s.ropePeriod) / s.ropePeriod * Math.PI * 2;
    var endX = 400 + Math.sin(angle) * 210;
    var endY = 220 - Math.cos(angle) * 180;
    ctx.strokeStyle = '#d08b53'; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(400, 220); ctx.lineTo(endX, endY); ctx.stroke();
    ctx.fillStyle = '#87562c'; ctx.beginPath(); ctx.arc(400, 220, 11, 0, Math.PI * 2); ctx.fill();
    var jump = s.jumpUntil > s.elapsed ? Math.sin((s.jumpUntil - s.elapsed) / .42 * Math.PI) * 80 : 0;
    drawYeti(400, 365 - jump, .85);
    drawText('Saltá cuando la cuerda pase abajo', 24, 38, 18);
  }

  function drawTrampoline(s) {
    drawCourt(); drawGround(400, '#83cf87');
    drawWindow(76, 158, 118, 82);
    drawGate(280, 131, 240, 142);
    drawDoor(615, 145, 75, 145);
    ctx.fillStyle = '#1f56d6'; ctx.beginPath(); ctx.ellipse(400, 396, 130, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0c2461'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(290, 396); ctx.lineTo(272, 425); ctx.moveTo(510, 396); ctx.lineTo(528, 425); ctx.stroke();
    drawYeti(400, s.player.y, .78);
    drawText('¡Buscá el momento del rebote!', 24, 38, 18);
  }

  function drawFootball(s) {
    drawCourt();
    ctx.fillStyle = '#64b66d'; ctx.fillRect(0, 325, 800, 125);
    drawWindow(38, 158, 78, 68);
    drawDoor(135, 136, 60, 116);
    drawGate(214, 162, 46, 68);
    ctx.fillStyle = '#489653'; ctx.fillRect(220, 72, 360, 248);
    ctx.fillStyle = '#5cad68'; ctx.fillRect(237, 88, 326, 215);
    ctx.strokeStyle = '#f2fff1'; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(220, 72); ctx.lineTo(238, 91); ctx.lineTo(238, 302); ctx.lineTo(220, 320);
    ctx.moveTo(580, 72); ctx.lineTo(562, 91); ctx.lineTo(562, 302); ctx.lineTo(580, 320);
    ctx.moveTo(220, 72); ctx.lineTo(580, 72); ctx.moveTo(220, 320); ctx.lineTo(580, 320);
    ctx.stroke();
    ctx.strokeStyle = '#ffffffb0'; ctx.lineWidth = 2;
    for (var y = 105; y < 310; y += 26) { ctx.beginPath(); ctx.moveTo(239, y); ctx.lineTo(561, y); ctx.stroke(); }
    for (var x = 260; x < 561; x += 34) { ctx.beginPath(); ctx.moveTo(x, 89); ctx.lineTo(x, 303); ctx.stroke(); }
    ctx.strokeStyle = '#f2fff1'; ctx.lineWidth = 7;
    ctx.strokeRect(220, 72, 360, 248);
    drawYeti(s.player.x, 315, .88);
    drawBall(s.ball.x, s.ball.y, 13, '#fff');
    drawText('Penal contra Yeti · Tocá el arco para elegir dónde patear', 24, 38, 18);
  }

  function drawBasket(s) {
    drawCourt(); drawGround(392, '#e8b779');
    drawDoor(92, 145, 75, 140);
    drawGate(234, 162, 150, 88);
    drawWindow(654, 136, 91, 73);
    ctx.fillStyle = '#deb887'; ctx.fillRect(610, 100, 15, 105);
    ctx.fillStyle = '#fff'; ctx.fillRect(580, 112, 52, 48);
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(590, 185); ctx.lineTo(645, 185); ctx.stroke();
    ctx.strokeStyle = '#eaa66d'; ctx.lineWidth = 2;
    for (var i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(592 + i * 10, 187); ctx.lineTo(599 + i * 9, 225); ctx.stroke(); }
    drawYeti(680, 370, .65);
    drawBall(s.ball.x, s.ball.y, 14, '#ef8b36');
    drawText('Deslizá con fuerza y en arco', 24, 38, 18);
  }

  function drawVolley(s) {
    drawCourt();
    drawDoor(52, 161, 67, 132);
    drawWindow(141, 197, 108, 70);
    drawGate(578, 155, 168, 107);
    ctx.fillStyle = '#f0d39a'; ctx.fillRect(0, 340, 800, 110);
    ctx.fillStyle = '#e9c476'; ctx.fillRect(0, 330, 800, 12);
    ctx.fillStyle = '#fff'; ctx.fillRect(396, 190, 8, 150);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    for (var y = 200; y < 340; y += 14) { ctx.beginPath(); ctx.moveTo(390, y); ctx.lineTo(410, y); ctx.stroke(); }
    drawYeti(600, s.player.y, .68);
    drawBall(s.ball.x, s.ball.y, 14, '#fbbf24');
    if (s.ball.active && s.ball.x < 410 && s.ball.vx < 0) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, 27, 0, Math.PI * 2); ctx.stroke();
      drawText('TOCÁ', s.ball.x, s.ball.y - 36, 15, '#0c2461', 'center');
    }
    drawText('Yeti toca primero · Tocá la pelota amarilla para devolverla', 24, 38, 18);
  }

  function drawRunner(s) {
    drawCourt(); drawGround(380, '#84c878');
    drawWindow(73, 123, 115, 73);
    drawDoor(310, 117, 65, 138);
    drawGate(568, 132, 160, 91);
    drawYeti(160, s.player.y, .72);
    s.objects.forEach(function (obstacle) {
      if (obstacle.type === 'window') drawWindow(obstacle.x, 380 - obstacle.h, obstacle.w, obstacle.h);
      else if (obstacle.type === 'gate') drawGate(obstacle.x, 380 - obstacle.h, obstacle.w, obstacle.h);
      else drawDoor(obstacle.x, 380 - obstacle.h, obstacle.w, obstacle.h);
    });
    drawText('¡Yeti va a toda velocidad!', 24, 38, 18);
  }

  function drawDriver(s) {
    drawCourt(); drawGround(150, '#5c657b');
    drawWindow(42, 42, 106, 73);
    drawDoor(189, 24, 57, 118);
    drawGate(568, 45, 170, 82);
    ctx.fillStyle = '#4c566d'; ctx.fillRect(0, 158, 800, 292);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.setLineDash([26, 22]);
    ctx.beginPath(); ctx.moveTo(0, 255); ctx.lineTo(800, 255); ctx.moveTo(0, 350); ctx.lineTo(800, 350); ctx.stroke(); ctx.setLineDash([]);
    var laneY = [205, 300, 395];
    s.objects.forEach(function (object) {
      if (object.type === 'coin') {
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(object.x, laneY[object.lane], 15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#a16207'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'; ctx.fillText('★', object.x, laneY[object.lane] + 6);
      } else {
        ctx.fillStyle = '#332f35'; ctx.beginPath(); ctx.ellipse(object.x, laneY[object.lane], 20, 10, -.2, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.fillStyle = '#dc2626'; ctx.fillRect(112, laneY[s.lane] - 25, 82, 43);
    ctx.fillStyle = '#bfdbfe'; ctx.fillRect(127, laneY[s.lane] - 18, 30, 13);
    drawYeti(150, laneY[s.lane] - 24, .38);
    drawText('Cambiá de carril y juntá estrellas', 24, 38, 18, '#fff');
  }

  function drawSkate(s) {
    drawCourt(); drawGround(380, '#b8c6dc');
    drawWindow(67, 127, 105, 68);
    drawGate(288, 138, 187, 94);
    drawDoor(629, 113, 68, 139);
    ctx.fillStyle = '#7b8fae'; ctx.beginPath(); ctx.moveTo(s.nextRamp, 380); ctx.lineTo(s.nextRamp + 55, 330); ctx.lineTo(s.nextRamp + 110, 380); ctx.fill();
    ctx.save(); ctx.translate(200, 348); ctx.rotate(s.lean * .45);
    ctx.fillStyle = '#f97316'; ctx.fillRect(-45, 24, 90, 8);
    ctx.fillStyle = '#0c2461'; ctx.beginPath(); ctx.arc(-30, 40, 7, 0, Math.PI * 2); ctx.arc(30, 40, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    drawYeti(200, 330 - (s.jumpTime > 0 ? 72 : 0), .54, s.lean * .4);
    drawText('Equilibrio: izquierda ↔ derecha', 24, 38, 18);
  }

  function eventPoint(event) {
    var rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width * 800, y: (event.clientY - rect.top) / rect.height * 450 };
  }

  function onPointerDown(event) {
    if (!activeGame || activeGame.ended) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    var point = eventPoint(event);
    activeGame.pointerDown = point;
    activeGame.pointer = point;
  }

  function onPointerMove(event) {
    if (!activeGame || !canvas) return;
    var point = eventPoint(event);
    activeGame.pointer = point;
  }

  function onPointerCancel() {
    if (activeGame) activeGame.pointerDown = null;
  }

  function onPointerUp(event) {
    if (!activeGame) return;
    var s = activeGame;
    var end = eventPoint(event);
    var start = s.pointerDown;
    s.pointerDown = null;
    if (s.id === 'football' && !s.ball.active) {
      if (end.x >= 220 && end.x <= 580 && end.y >= 72 && end.y <= 320) {
        var targetX = Math.max(230, Math.min(570, end.x));
        var targetY = Math.max(100, Math.min(275, end.y));
        var shotSpeed = 500 + Math.min(180, s.score * 12);
        var flightTime = (s.ball.y - targetY) / shotSpeed;
        s.ball.vx = (targetX - s.ball.x) / flightTime;
        s.ball.vy = -shotSpeed;
        s.ball.active = true;
        s.status = '¡Va el remate! Yeti se mueve para atajar.';
      } else s.status = 'Tocá el arco centrado para patear.';
    } else if (s.id === 'catch' && start && !s.ball.active) {
      var dx = start.x - end.x;
      var dy = end.y - start.y;
      if (Math.hypot(start.x - s.ball.x, start.y - s.ball.y) < 52) {
        dx = 0;
        dy = 0;
      }
      s.ball.x = 120; s.ball.y = 334;
      s.ball.vx = Math.max(260, Math.min(760, 590 + dx * 2.2));
      s.ball.vy = Math.max(-780, Math.min(-260, -400 + dy * 2.1));
      s.ball.active = true;
      s.status = '';
    } else if (s.id === 'basket' && start && !s.ball.active) {
      var vx = (end.x - start.x) * 2.3;
      var vy = (end.y - start.y) * 2.45;
      if (vx > 120 && vy < -120) {
        s.ball.x = 115; s.ball.y = 345;
        s.ball.vx = Math.min(850, vx); s.ball.vy = Math.max(-900, vy);
        s.ball.active = true; s.attempts++;
      } else s.status = 'Deslizá hacia adelante y hacia arriba.';
    } else if (s.id === 'volley') {
      if (Math.hypot(end.x - s.ball.x, end.y - s.ball.y) <= 54 &&
          s.ball.active && s.ball.x <= 410 && s.lastTouch === 'player') {
        s.ball.vx = 240;
        s.ball.vy = -390;
        s.lastTouch = 'player';
        s.score++;
        s.status = '¡Buen toque! Yeti ya va por la devolución.';
      } else {
        s.status = s.ball.x > 410
          ? 'Esperá el saque de Yeti y tocá la pelota cuando venga a tu lado.'
          : 'Tocá la pelota amarilla cuando pase cerca del círculo blanco.';
      }
    } else if (s.id === 'driver' && start) {
      if (Math.abs(end.y - start.y) > 25) performAction(end.y < start.y ? 'left' : 'right');
    }
  }

  function performAction(action) {
    if (!activeGame || activeGame.ended) {
      if (activeGame && activeGame.ended && action === 'restart') buildGame(activeGame.id);
      return;
    }
    var s = activeGame;
    if (s.id === 'rope' && action === 'jump') {
      s.jumpUntil = s.elapsed + .42;
      s.status = '¡Yeti saltó! Seguí el ritmo de la cuerda.';
    }
    if (s.id === 'trampoline' && action === 'bounce') {
      if ((s.player.vy > 80 && s.player.y > 270 && s.player.y < 390) ||
          (s.player.y >= 380 && s.elapsed <= s.landingUntil)) {
        s.player.vy = -Math.min(920, 590 + s.score * 14);
        s.score++; s.bounces++; s.lastHit = s.bounces - 1;
        s.misses = 0;
        s.status = '¡Rebote perfecto! ' + s.score + (s.score === 1 ? ' punto.' : ' puntos.');
      } else s.status = 'Esperá a que Yeti baje cerca de la lona.';
    }
    if (s.id === 'volley' && action === 'hit') {
      if (Math.hypot(s.ball.x - 180, s.ball.y - 285) < 190 && s.elapsed - s.lastHit > .28) {
        s.ball.vx = 250 + Math.random() * 80;
        s.ball.vy = -510;
        s.score++; s.lastHit = s.elapsed;
        s.status = '¡Buen toque! Seguí el rally.';
      } else s.status = 'Esperá a que la pelota esté cerca de Yeti.';
    }
    if (s.id === 'runner' && action === 'jump' && s.player.y >= 359) s.player.vy = -650;
    if (s.id === 'driver' && (action === 'left' || action === 'right')) s.lane = Math.max(0, Math.min(2, s.lane + (action === 'left' ? -1 : 1)));
    if (s.id === 'skate') {
      if (action === 'left') keys.ArrowLeft = true;
      if (action === 'right') keys.ArrowRight = true;
      if (action === 'jump' && s.nextRamp < 440 && s.nextRamp > 100) {
        s.jumpTime = .75;
        s.status = '¡Saltando la rampa!';
      } else if (action === 'jump') s.status = 'Guardá el salto para acercarte a la rampa.';
      setTimeout(function () { keys.ArrowLeft = false; keys.ArrowRight = false; }, 250);
    }
  }

  function onKeyDown(event) {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { closeHub(); return; }
    if (!activeGame) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) event.preventDefault();
    keys[event.code] = true;
    if (event.key === ' ' || event.key === 'ArrowUp') {
      if (activeGame.id === 'runner' || activeGame.id === 'rope') performAction('jump');
      else if (activeGame.id === 'trampoline') performAction('bounce');
      else if (activeGame.id === 'volley') performAction('hit');
      else if (activeGame.id === 'skate') performAction('jump');
    }
    if (activeGame.id === 'driver') {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') performAction('left');
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') performAction('right');
    }
  }

  function onKeyUp(event) { keys[event.code] = false; }

  function renderBoard() {
    if (!activeGame) return;
    var s = activeGame;
    var board = content.querySelector('#yg-board');
    var actions = content.querySelector('#yg-actions');
    if (!board) return;
    if (s.id === 'ttt') {
      board.innerHTML = s.board.map(function (cell, index) {
        return '<button class="yg-cell" type="button" data-cell="' + index + '" aria-label="Casilla ' + (index + 1) + (cell ? ': ' + cell : ' vacía') + '"' + (cell || s.ended ? ' disabled' : '') + '>' + escapeHtml(cell) + '</button>';
      }).join('');
      actions.innerHTML = '<button class="yg-game-button primary" type="button" data-reset>Otra partida</button>';
      board.onclick = function (event) {
        var cell = event.target.closest('[data-cell]');
        if (cell && !s.ended) playTicTacToe(Number(cell.dataset.cell));
      };
      actions.querySelector('[data-reset]').onclick = function () { buildGame('ttt'); };
    } else {
      board.innerHTML = s.board.map(function (row, y) {
        return row.map(function (candy, x) {
          var index = y * 7 + x;
          var selected = s.selected === index;
          return '<button class="yg-cell' + (selected ? ' selected' : '') + '" type="button" data-cell="' + index + '" aria-label="Ficha ' + (y + 1) + ', ' + (x + 1) + '"' + (s.ended || s.busy ? ' disabled' : '') + '>' + CANDIES[candy] + '</button>';
        }).join('');
      }).join('');
      actions.innerHTML = '<button class="yg-game-button primary" type="button" data-reset>Nueva partida</button>';
      var dragStart = null;
      board.onpointerdown = function (event) {
        var cell = event.target.closest('[data-cell]');
        if (!cell || s.busy || s.ended || event.button > 0) return;
        event.preventDefault();
        if (s.selected !== null) s.selected = null;
        var index = Number(cell.dataset.cell);
        cell.classList.remove('selected');
        cell.classList.add('match-dragging');
        dragStart = {
          pointerId: event.pointerId,
          index: index,
          x: event.clientX,
          y: event.clientY,
          cell: cell,
          neighbor: null,
          axis: null,
          sign: 0,
          step: 0,
          moved: false
        };
        cell.setPointerCapture(event.pointerId);
      };
      board.onpointermove = function (event) {
        if (!dragStart || event.pointerId !== dragStart.pointerId) return;
        var dx = event.clientX - dragStart.x;
        var dy = event.clientY - dragStart.y;
        if (!dragStart.axis && Math.max(Math.abs(dx), Math.abs(dy)) < 4) return;
        dragStart.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        var delta = dragStart.axis === 'x' ? dx : dy;
        var col = dragStart.index % 7;
        var row = Math.floor(dragStart.index / 7);
        var sign = delta < 0 ? -1 : 1;
        var nextCol = col + (dragStart.axis === 'x' ? sign : 0);
        var nextRow = row + (dragStart.axis === 'y' ? sign : 0);
        var neighborIndex = nextRow * 7 + nextCol;
        if (nextCol < 0 || nextCol >= 7 || nextRow < 0 || nextRow >= 7) {
          dragStart.cell.style.transform = 'translate(0, 0)';
          if (dragStart.neighbor) dragStart.neighbor.style.transform = 'translate(0, 0)';
          dragStart.neighbor = null;
          dragStart.moved = false;
          return;
        }
        var neighbor = board.querySelector('[data-cell="' + neighborIndex + '"]');
        var cellRect = dragStart.cell.getBoundingClientRect();
        var gap = parseFloat(getComputedStyle(board).columnGap) || 0;
        var step = (dragStart.axis === 'x' ? cellRect.width : cellRect.height) + gap;
        if (dragStart.neighbor !== neighbor) {
          if (dragStart.neighbor) dragStart.neighbor.style.transform = 'translate(0, 0)';
          dragStart.neighbor = neighbor;
        }
        dragStart.sign = sign;
        dragStart.step = step;
        dragStart.moved = true;
        var distance = Math.min(Math.abs(delta), step);
        var offset = sign * distance;
        var transform = dragStart.axis === 'x'
          ? 'translate(' + offset + 'px, 0)'
          : 'translate(0, ' + offset + 'px)';
        var opposite = dragStart.axis === 'x'
          ? 'translate(' + -offset + 'px, 0)'
          : 'translate(0, ' + -offset + 'px)';
        dragStart.cell.style.transform = transform;
        neighbor.style.transform = opposite;
      };
      board.onpointerup = function (event) {
        if (!dragStart || event.pointerId !== dragStart.pointerId) return;
        var start = dragStart;
        dragStart = null;
        var dx = event.clientX - start.x;
        var dy = event.clientY - start.y;
        var delta = start.axis === 'x' ? dx : dy;
        var destination = start.index + (start.axis === 'x' ? start.sign : start.sign * 7);
        var threshold = start.step * .3;
        start.cell.classList.remove('match-dragging');
        if (!start.moved || Math.abs(delta) < threshold || !start.neighbor) {
          animateMatchReset(start);
          return;
        }
        s.suppressMatchClick = true;
        window.setTimeout(function () { s.suppressMatchClick = false; }, 250);
        var valid = isValidMatchSwap(s, start.index, destination);
        var signedStep = start.sign * start.step;
        var swapTransform = start.axis === 'x'
          ? 'translate(' + signedStep + 'px, 0)'
          : 'translate(0, ' + signedStep + 'px)';
        var reverseTransform = start.axis === 'x'
          ? 'translate(' + -signedStep + 'px, 0)'
          : 'translate(0, ' + -signedStep + 'px)';
        start.cell.style.transform = swapTransform;
        start.neighbor.style.transform = reverseTransform;
        window.setTimeout(function () {
          if (activeGame !== s) return;
          if (valid) {
            swapMatchCells(s, start.index, destination);
          } else {
            start.cell.style.transform = 'translate(0, 0)';
            start.neighbor.style.transform = 'translate(0, 0)';
            window.setTimeout(function () {
              if (activeGame !== s) return;
              start.cell.style.transform = '';
              start.neighbor.style.transform = '';
              s.status = 'Ese intercambio no forma una línea de tres.';
              var status = content.querySelector('#yg-status');
              if (status) status.textContent = s.status;
            }, 170);
          }
        }, 170);
      };
      board.onpointercancel = function () {
        if (!dragStart) return;
        var start = dragStart;
        dragStart = null;
        start.cell.classList.remove('match-dragging');
        animateMatchReset(start);
      };
      board.onclick = function (event) {
        if (s.suppressMatchClick) {
          s.suppressMatchClick = false;
          event.preventDefault();
          return;
        }
        var cell = event.target.closest('[data-cell]');
        if (cell && !s.busy && !s.ended) playMatchCell(Number(cell.dataset.cell));
      };
      actions.querySelector('[data-reset]').onclick = function () { buildGame('match3'); };
    }
    var status = content.querySelector('#yg-status');
    if (status) status.textContent = s.status;
  }

  function playTicTacToe(index) {
    var s = activeGame;
    if (s.board[index] || s.ended) return;
    s.board[index] = 'X';
    var result = ticTacToeWinner(s.board);
    if (result) {
      s.ended = true; s.status = result === 'X' ? '¡Ganaste! 🎉' : 'Yeti ganó esta vez.';
      renderBoard(); return;
    }
    if (s.board.every(Boolean)) {
      s.ended = true; s.status = '¡Empate! Buena partida.';
      renderBoard(); return;
    }
    s.board[bestMove(s.board)] = 'O';
    result = ticTacToeWinner(s.board);
    if (result) { s.ended = true; s.status = 'Yeti encontró una línea. ¡Probá otra!'; }
    else if (s.board.every(Boolean)) { s.ended = true; s.status = '¡Empate! Buena partida.'; }
    else s.status = 'Tu turno: X.';
    renderBoard();
  }

  var WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function ticTacToeWinner(board) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var line = WIN_LINES[i];
      if (board[line[0]] && board[line[0]] === board[line[1]] && board[line[1]] === board[line[2]]) return board[line[0]];
    }
    return '';
  }

  function bestMove(board) {
    var bestScore = -Infinity;
    var move = board.findIndex(function (cell) { return !cell; });
    board.forEach(function (cell, index) {
      if (cell) return;
      board[index] = 'O';
      var score = minimax(board, false, 0);
      board[index] = '';
      if (score > bestScore) { bestScore = score; move = index; }
    });
    return move;
  }

  function minimax(board, maximizing, depth) {
    var winner = ticTacToeWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(Boolean)) return 0;
    var best = maximizing ? -Infinity : Infinity;
    board.forEach(function (cell, index) {
      if (cell) return;
      board[index] = maximizing ? 'O' : 'X';
      var score = minimax(board, !maximizing, depth + 1);
      board[index] = '';
      best = maximizing ? Math.max(best, score) : Math.min(best, score);
    });
    return best;
  }

  function createMatchBoard() {
    var board = [];
    for (var attempt = 0; attempt < 80; attempt++) {
      board = [];
      for (var y = 0; y < 7; y++) {
        board[y] = [];
        for (var x = 0; x < 7; x++) {
          var choices = [0, 1, 2, 3, 4, 5].filter(function (value) {
            return !(x >= 2 && board[y][x - 1] === value && board[y][x - 2] === value) &&
              !(y >= 2 && board[y - 1][x] === value && board[y - 2][x] === value);
          });
          board[y][x] = choices[Math.floor(Math.random() * choices.length)];
        }
      }
      if (hasAvailableMatch(board)) return board;
    }
    return board;
  }

  function hasAvailableMatch(board) {
    for (var y = 0; y < 7; y++) {
      for (var x = 0; x < 7; x++) {
        var directions = [[1, 0], [0, 1]];
        for (var i = 0; i < directions.length; i++) {
          var nx = x + directions[i][0], ny = y + directions[i][1];
          if (nx >= 7 || ny >= 7) continue;
          var temp = board[y][x];
          board[y][x] = board[ny][nx];
          board[ny][nx] = temp;
          var matches = findMatches(board).size > 0;
          temp = board[y][x];
          board[y][x] = board[ny][nx];
          board[ny][nx] = temp;
          if (matches) return true;
        }
      }
    }
    return false;
  }

  function findMatches(board) {
    var matches = new Set();
    for (var y = 0; y < 7; y++) {
      var count = 1;
      for (var x = 1; x <= 7; x++) {
        if (x < 7 && board[y][x] === board[y][x - 1]) count++;
        else {
          if (count >= 3) for (var hx = x - count; hx < x; hx++) matches.add(y * 7 + hx);
          count = 1;
        }
      }
    }
    for (var x = 0; x < 7; x++) {
      var vertical = 1;
      for (var y = 1; y <= 7; y++) {
        if (y < 7 && board[y][x] === board[y - 1][x]) vertical++;
        else {
          if (vertical >= 3) for (var vy = y - vertical; vy < y; vy++) matches.add(vy * 7 + x);
          vertical = 1;
        }
      }
    }
    return matches;
  }

  function animateMatchReset(start, onComplete) {
    start.cell.style.transform = 'translate(0, 0)';
    if (start.neighbor) start.neighbor.style.transform = 'translate(0, 0)';
    window.setTimeout(function () {
      start.cell.style.transform = '';
      if (start.neighbor) start.neighbor.style.transform = '';
      if (onComplete) onComplete();
    }, 170);
  }

  function swapMatchValues(s, first, second) {
    var x1 = first % 7, y1 = Math.floor(first / 7);
    var x2 = second % 7, y2 = Math.floor(second / 7);
    var candy = s.board[y1][x1];
    s.board[y1][x1] = s.board[y2][x2];
    s.board[y2][x2] = candy;
  }

  function isValidMatchSwap(s, first, second) {
    swapMatchValues(s, first, second);
    var valid = findMatches(s.board).size > 0;
    swapMatchValues(s, first, second);
    return valid;
  }

  function swapMatchCells(s, first, second) {
    swapMatchValues(s, first, second);
    if (!findMatches(s.board).size) {
      swapMatchValues(s, first, second);
      s.status = 'Ese intercambio no forma una línea de tres.';
      renderBoard();
      return;
    }
    s.moves--;
    resolveMatches(s, 0);
  }

  function playMatchCell(index) {
    var s = activeGame;
    if (s.selected === null) { s.selected = index; renderBoard(); return; }
    var first = s.selected;
    s.selected = null;
    if (first === index) { renderBoard(); return; }
    var x1 = first % 7, y1 = Math.floor(first / 7);
    var x2 = index % 7, y2 = Math.floor(index / 7);
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) !== 1) {
      s.selected = index; renderBoard(); return;
    }
    swapMatchCells(s, first, index);
  }

  function resolveMatches(s, depth) {
    var matches = findMatches(s.board);
    if (!matches.size || depth > 12) {
      s.busy = false;
      if (!s.moves) { s.ended = true; s.status = '¡Fin! Juntaste ' + s.score + ' puntos.'; }
      renderBoard();
      return;
    }
    s.busy = true;
    s.score += matches.size * 10;
    matches.forEach(function (index) {
      var x = index % 7, y = Math.floor(index / 7);
      s.board[y][x] = -1;
    });
    for (var x = 0; x < 7; x++) {
      var column = [];
      for (var y = 6; y >= 0; y--) if (s.board[y][x] >= 0) column.push(s.board[y][x]);
      for (var row = 6; row >= 0; row--) s.board[row][x] = column[6 - row] === undefined ? Math.floor(Math.random() * CANDIES.length) : column[6 - row];
    }
    s.status = '+' + (matches.size * 10) + ' puntos. ¡Combo!';
    renderBoard();
    window.setTimeout(function () { if (activeGame === s && !overlay.hidden) resolveMatches(s, depth + 1); }, 140);
  }

  content.addEventListener('click', function (event) {
    var card = event.target.closest('[data-game]');
    if (card && overlay.contains(card)) buildGame(card.dataset.game);
  });
  closeButton.addEventListener('click', closeHub);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeHub();
  });
  overlay.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(overlay.querySelectorAll('button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('yeti:games:open', openHub);
})();
