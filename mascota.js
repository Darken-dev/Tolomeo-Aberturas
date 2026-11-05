/* Yeti, la mascota de Tolomeo Aberturas — un solo archivo, sin imágenes.
   Uso: <script src="mascota.js" defer></script> antes de </body> */
(function () {
  if (window.__tolo) return; window.__tolo = 1;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/2235220206?text=' + encodeURIComponent('¡Hola! Quiero consultar sobre sus aberturas');

  var css = `
#tolo-door{position:fixed;right:18px;bottom:0;width:74px;height:124px;z-index:9990;perspective:420px;cursor:pointer;-webkit-tap-highlight-color:transparent;outline-offset:4px}
#tolo-door .fr{position:absolute;inset:0;background:linear-gradient(#0c2461,#0a1f44);border-radius:10px 10px 0 0;box-shadow:0 8px 24px rgba(10,31,68,.35)}
#tolo-door .in{position:absolute;left:6px;right:6px;top:6px;bottom:0;border-radius:6px 6px 0 0;background:radial-gradient(ellipse at 50% 95%,#fff1bd,#d4a630 55%,#6b4a08)}
#tolo-door .lf{position:absolute;left:6px;right:6px;top:6px;bottom:0;border-radius:6px 6px 0 0;background:linear-gradient(100deg,#8a5a2b,#aa7440 50%,#8a5a2b);transform-origin:left center;transition:transform .45s cubic-bezier(.3,1.2,.4,1);box-shadow:inset 0 0 0 3px rgba(0,0,0,.12)}
#tolo-door .lf::before{content:"";position:absolute;left:9px;right:9px;top:12px;bottom:34px;border:3px solid rgba(0,0,0,.16);border-radius:4px}
#tolo-door .lf::after{content:"";position:absolute;right:7px;top:60%;width:9px;height:9px;border-radius:50%;background:#f3d36b;box-shadow:0 1px 2px #0006}
#tolo-door.open .lf{transform:rotateY(-78deg)}
#tolo-door.knock .lf{animation:tlk .35s}
@keyframes tlk{0%,40%,80%,100%{transform:rotateY(0)}20%{transform:rotateY(-6deg)}60%{transform:rotateY(-5deg)}}
#tolo-door .tg{position:absolute;left:50%;bottom:100%;margin-bottom:8px;transform:translateX(-50%);white-space:nowrap;background:#fff;color:#0c2461;font:700 12px Montserrat,sans-serif;padding:6px 11px;border-radius:999px;box-shadow:0 6px 20px rgba(10,31,68,.25);animation:tlf 2s ease-in-out infinite}
#tolo-door.open .tg{display:none}
@keyframes tlf{50%{transform:translate(-50%,-4px)}}
#tolo{position:fixed;bottom:2px;left:0;width:112px;z-index:9991;opacity:0;pointer-events:none;transition:left linear,opacity .4s}
#tolo.on{opacity:1;pointer-events:auto}
#tolo svg{display:block;width:100%;overflow:visible;filter:drop-shadow(0 6px 6px rgba(10,31,68,.25));cursor:pointer}
#tolo .fl{transition:transform .2s}
#tolo.jump .jm{animation:tlj .5s}
@keyframes tlj{40%{transform:translateY(-24px)}}
#tolo .bod{transform-origin:60px 140px;animation:tlb 3s ease-in-out infinite}
@keyframes tlb{50%{transform:scaleY(1.025)}}
#tolo.walking .bod{animation:tlw .2s infinite}
@keyframes tlw{50%{transform:translateY(-5px) rotate(2deg)}}
#tolo.walking .foot.l{animation:tls .2s infinite}
#tolo.walking .foot.r{animation:tls .2s -.1s infinite}
@keyframes tls{50%{transform:translateY(-6px)}}
#tolo .arm.r{transform-origin:96px 92px}
#tolo.wave .arm.r{animation:tlv .3s 4}
@keyframes tlv{0%,100%{transform:rotate(-120deg)}50%{transform:rotate(-150deg)}}
#tolo.point .arm.r{transform:rotate(-140deg)}
#tolo.talk .mouth{animation:tlm .22s infinite}
#tolo .mouth{transform-box:fill-box;transform-origin:center top}
@keyframes tlm{50%{transform:scaleY(.45)}}
#tolo .eye{transform-box:fill-box;transform-origin:center;animation:tle 4.5s infinite}
@keyframes tle{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.08)}}
#tolo.sleep .eye{animation:none;transform:scaleY(.1)}
#tolo .zz{opacity:0}
#tolo.sleep .zz{opacity:1;animation:tlz 2s infinite}
@keyframes tlz{50%{transform:translate(4px,-6px)}}
#tolo .bub{position:absolute;bottom:100%;margin-bottom:8px;width:max-content;max-width:min(240px,calc(100vw - 24px));background:#fff;color:#2d3a58;font:600 13px/1.4 Montserrat,sans-serif;padding:10px 12px;border-radius:14px;box-shadow:0 8px 28px rgba(10,31,68,.22);opacity:0;transform:translateY(6px) scale(.96);transition:.12s;pointer-events:none}
#tolo .bub.show{opacity:1;transform:none;pointer-events:auto}
#tolo .bub.chat{width:min(340px,calc(100vw - 28px));max-height:min(420px,calc(100vh - 150px));display:flex;flex-direction:column;gap:8px}
#tolo .chat-head{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#0c2461}
#tolo .chat-head button,#tolo .chat-form button{border:0;border-radius:999px;padding:7px 11px;font:700 12px Montserrat,sans-serif;cursor:pointer}
#tolo .chat-close{background:#e8f0ff;color:#0c2461}
#tolo .chat-log{display:flex;flex-direction:column;gap:7px;overflow:auto;max-height:250px;padding:2px}
#tolo .chat-message{max-width:90%;padding:8px 10px;border-radius:12px;overflow-wrap:anywhere;white-space:pre-wrap}
#tolo .chat-message.user{align-self:flex-end;background:#e8f0ff;color:#0c2461}
#tolo .chat-message.yeti{align-self:flex-start;background:#f1f4f9;color:#2d3a58}
#tolo .chat-form{display:flex;gap:6px;align-items:center}
#tolo .chat-form input{min-width:0;flex:1;border:1px solid #b0bcd4;border-radius:999px;padding:9px 11px;font:500 12px Montserrat,sans-serif;color:#2d3a58}
#tolo .chat-form input:focus{outline:2px solid #0a63ff;outline-offset:1px}
#tolo .chat-form button{background:#0a63ff;color:#fff}
#tolo .chat-note{font-size:10px;font-weight:500;color:#53627a}
#tolo .bub.l{left:0}#tolo .bub.r{right:0}
#tolo .bub::after{content:"";position:absolute;bottom:-5px;width:12px;height:12px;background:#fff;transform:rotate(45deg)}
#tolo .bub.l::after{left:40px}#tolo .bub.r::after{right:40px}
#tolo .opts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#tolo .opts button,#tolo .opts a{border:0;border-radius:999px;padding:6px 11px;font:700 12px Montserrat,sans-serif;background:#e8f0ff;color:#0c2461;cursor:pointer;text-decoration:none}
#tolo .opts .wa{background:#25d366;color:#fff}
#tolo .opts .x{background:#fff;box-shadow:inset 0 0 0 1px #b0bcd4;color:#6b7a9c}
#tolo .ht{position:absolute;left:50%;top:10%;font-size:18px;pointer-events:none;animation:tlh 1s forwards}
@keyframes tlh{to{transform:translate(var(--dx),-60px);opacity:0}}
@media(max-width:600px){#tolo{width:84px}#tolo-door{width:58px;height:98px;right:10px}}
@media(prefers-reduced-motion:reduce){#tolo *,#tolo-door *{animation:none!important}}
@media print{#tolo,#tolo-door{display:none}}`;

  var svg = `<svg viewBox="0 0 120 150" role="img" aria-label="Yeti, la mascota">
<defs>
<radialGradient id="tlF" cx=".35" cy=".28" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#eaf1fb"/><stop offset="1" stop-color="#bfd0e8"/></radialGradient>
<radialGradient id="tlB" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7db4ff"/><stop offset="1" stop-color="#1f56d6"/></radialGradient>
<linearGradient id="tlS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a3a8a"/><stop offset="1" stop-color="#0a1f44"/></linearGradient>
</defs>
<ellipse cx="60" cy="144" rx="34" ry="5" fill="#0a1f44" opacity=".18"/>
<g class="foot l"><ellipse cx="40" cy="139" rx="15" ry="8" fill="url(#tlB)"/></g>
<g class="foot r"><ellipse cx="80" cy="139" rx="15" ry="8" fill="url(#tlB)"/></g>
<g class="bod">
<ellipse cx="60" cy="108" rx="38" ry="32" fill="url(#tlF)"/>
<ellipse cx="60" cy="113" rx="22" ry="19" fill="#fff" opacity=".7"/>
<g class="arm l"><ellipse cx="21" cy="106" rx="11" ry="18" fill="url(#tlF)" transform="rotate(12 21 106)"/><circle cx="20" cy="121" r="7" fill="url(#tlB)"/></g>
<g class="arm r"><ellipse cx="99" cy="106" rx="11" ry="18" fill="url(#tlF)" transform="rotate(-12 99 106)"/><circle cx="100" cy="121" r="7" fill="url(#tlB)"/></g>
<ellipse cx="48" cy="19" rx="7" ry="9" fill="url(#tlF)"/><ellipse cx="60" cy="16" rx="7" ry="10" fill="url(#tlF)"/><ellipse cx="72" cy="19" rx="7" ry="9" fill="url(#tlF)"/>
<ellipse cx="60" cy="58" rx="46" ry="42" fill="url(#tlF)"/>
<ellipse cx="40" cy="36" rx="14" ry="7" fill="#fff" opacity=".85" transform="rotate(-30 40 36)"/>
<ellipse cx="34" cy="69" rx="7" ry="4.5" fill="#ffb4c0" opacity=".6"/><ellipse cx="86" cy="69" rx="7" ry="4.5" fill="#ffb4c0" opacity=".6"/>
<g class="eye"><ellipse cx="45" cy="58" rx="6.5" ry="8" fill="#0a1f44"/><g class="pp"><circle cx="43" cy="55" r="2.6" fill="#fff"/><circle cx="48" cy="61" r="1.3" fill="#fff"/></g></g>
<g class="eye"><ellipse cx="75" cy="58" rx="6.5" ry="8" fill="#0a1f44"/><g class="pp"><circle cx="73" cy="55" r="2.6" fill="#fff"/><circle cx="78" cy="61" r="1.3" fill="#fff"/></g></g>
<ellipse cx="60" cy="67" rx="4" ry="2.8" fill="#0a1f44"/>
<g class="mouth"><path d="M50 73Q60 90 70 73Z" fill="#7a1f3d"/><path d="M54 82Q60 78 66 82Q60 88 54 82Z" fill="#ff8aa0"/></g>
<path d="M70 104L83 104L85 128L72 130Z" fill="url(#tlS)"/>
<path d="M26 92Q60 108 94 92L92 103Q60 119 28 103Z" fill="url(#tlS)"/>
<circle cx="60" cy="106" r="6" fill="#fff"/><path d="M60 101l5 4v5h-10v-5z" fill="#2563eb"/>
<text class="zz" x="94" y="24" font-size="14" font-weight="800" fill="#2563eb" font-family="Montserrat,sans-serif">z</text>
</g></svg>`;

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div id="tolo-door" role="button" tabindex="0" aria-label="Tocar la puerta para llamar al Yeti"><span class="tg">Tocá la puerta 🚪</span><div class="fr"></div><div class="in"></div><div class="lf"></div></div>' +
    '<div id="tolo"><div class="bub l" aria-live="polite"></div><div class="jm"><div class="fl">' + svg + '</div></div></div>';
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var door = $('#tolo-door'), T = $('#tolo'), bub = $('.bub', T), fl = $('.fl', T), pps = T.querySelectorAll('.pp');
  var x = 0, out = false, busy = false, chatOpen = false, awake = Date.now(), lastTip = Date.now(), ctx, hideT, talkT;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var W = function () { return T.offsetWidth || 112; };
  var doorX = function () { var r = door.getBoundingClientRect(); return r.left + r.width / 2 - W() / 2; };
  var setX = function (v) { x = v; T.style.left = v + 'px'; };

  function knockSound() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      [0, .11, .22].forEach(function (d) {
        var t = ctx.currentTime + d, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(70, t + .09);
        g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .12);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .13);
      });
    } catch (e) {}
  }

  function walkTo(v) {
    v = Math.max(8, Math.min(innerWidth - W() - 8, v));
    var d = Math.abs(v - x);
    if (d < 4) return Promise.resolve();
    fl.style.transform = 'scaleX(' + (v < x ? -1 : 1) + ')';
    var dur = RM ? 0 : d / 420;
    T.style.transitionDuration = dur + 's,.4s';
    T.classList.add('walking'); setX(v);
    return wait(dur * 1000 + 40).then(function () { T.classList.remove('walking'); fl.style.transform = ''; });
  }

  function say(html, ms) {
    clearTimeout(hideT); clearTimeout(talkT);
    bub.className = 'bub show ' + (x + W() / 2 > innerWidth / 2 ? 'r' : 'l');
    bub.innerHTML = html;
    T.classList.add('talk'); talkT = setTimeout(function () { T.classList.remove('talk'); }, Math.min(2500, html.length * 35));
    if (ms) hideT = setTimeout(hide, ms);
  }
  function hide() { bub.classList.remove('show'); }
  function menu(msg) {
    chatOpen = false;
    say(msg + '<div class="opts"><button data-go="alu">Aluminio</button><button data-go="mad">Madera</button><button data-go="cha">Chapa</button>' +
      '<button data-go="faq">Preguntas</button><button data-go="chat">Chatear</button><button data-go="games">Jugar 🎮</button><a class="wa" href="' + WA + '" target="_blank" rel="noopener">Presupuesto</a><button class="x" data-go="home">Volver a casa</button></div>');
  }

  var chatHistory = [{
    role: 'yeti',
    text: '¡Hola! Soy el Yeti. Preguntame sobre aberturas, materiales o cómo pedir un presupuesto.'
  }];
  var chatAnswers = [
    { test: /hola|buenas|buenos dias|buenas tardes|buenas noches|que tal/, answer: '¡Hola! ¿En qué te puedo ayudar? Podés preguntarme sobre materiales, líneas, medidas o presupuesto 😊' },
    { test: /precio|precios|cuanto|cuesta|costo|presupuesto/, answer: 'El presupuesto es gratis y sin compromiso. Como el precio depende del material, las medidas y el tipo de abertura, escribinos por WhatsApp y te asesoramos: +54 9 223 522-0206.' },
    { test: /medida|medidas|a medida|personaliz/, answer: '¡Sí! Fabricamos a medida para cada obra. Para cotizar, mandanos por WhatsApp las medidas aproximadas y qué tipo de abertura necesitás 📐' },
    { test: /aluminio|herrero|modena|a30|rpt|rotura/, answer: 'Trabajamos aluminio en líneas Herrero, Modena, A30 y RPT. Si me contás si buscás puerta, ventana o portón, te ayudo a orientarte.' },
    { test: /madera/, answer: 'Tenemos aberturas de madera para interior y exterior, además de portones. También podemos asesorarte por WhatsApp según tu proyecto.' },
    { test: /chapa/, answer: 'Trabajamos aberturas de chapa. Para consultar opciones y presupuesto, escribinos por WhatsApp al +54 9 223 522-0206.' },
    { test: /puerta|puertas|ventana|ventanas|porton|portones/, answer: '¡Tenemos puertas, ventanas y portones! Los hacemos en aluminio, madera y chapa. ¿Qué material te interesa?' },
    { test: /ubicacion|direccion|donde|local|visitar/, answer: 'Estamos en Av. Juan B. Justo 5077, Mar del Plata 📍' },
    { test: /horario|abierto|atienden/, answer: 'Atendemos de lunes a viernes de 8 a 18 h. También podés escribirnos por WhatsApp cuando quieras.' },
    { test: /gracias|genial|perfecto/, answer: '¡De nada! Si necesitás un presupuesto, escribinos por WhatsApp. Estoy acá para ayudarte 😊' }
  ];
  var customChatAnswers = [];

  function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function getChatAnswer(text) {
    var normalized = normalizeText(text);
    var customMatch = customChatAnswers.find(function (item) {
      return item.keywords.some(function (keyword) {
        return normalized.includes(normalizeText(keyword));
      });
    });
    if (customMatch) return customMatch.answer;
    var match = chatAnswers.find(function (item) { return item.test.test(normalized); });
    return match
      ? match.answer
      : 'Todavía estoy aprendiendo 😊 Puedo orientarte sobre aluminio, madera, chapa, medidas y presupuestos. También podés elegir una opción o escribirnos por WhatsApp.';
  }

  function watchCustomChatAnswers() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) return;
    firebase.firestore().collection('siteConfig').doc('yetiTraining').onSnapshot(function (snapshot) {
      var items = snapshot.exists && snapshot.data() ? snapshot.data().items : [];
      customChatAnswers = Array.isArray(items) ? items.slice(0, 30).reduce(function (valid, item) {
        if (!item || !Array.isArray(item.keywords) || typeof item.answer !== 'string') return valid;
        var keywords = item.keywords.filter(function (keyword) {
          return typeof keyword === 'string' && keyword.trim() && keyword.length <= 60;
        }).slice(0, 10);
        var answer = item.answer.trim();
        if (keywords.length && answer && answer.length <= 500) valid.push({ keywords: keywords, answer: answer });
        return valid;
      }, []) : [];
    }, function (error) {
      console.warn('No se pudieron cargar las respuestas personalizadas del Yeti:', error);
    });
  }
  watchCustomChatAnswers();

  function showChat() {
    chatOpen = true;
    clearTimeout(hideT);
    say('');
    bub.classList.add('chat');

    var header = document.createElement('div');
    header.className = 'chat-head';
    var title = document.createElement('strong');
    title.textContent = 'Chat con el Yeti';
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'chat-close';
    close.dataset.go = 'chat-close';
    close.textContent = 'Opciones';
    header.append(title, close);

    var log = document.createElement('div');
    log.className = 'chat-log';
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    chatHistory.forEach(function (message) {
      var line = document.createElement('div');
      line.className = 'chat-message ' + message.role;
      line.textContent = message.text;
      log.appendChild(line);
    });

    var form = document.createElement('form');
    form.className = 'chat-form';
    var input = document.createElement('input');
    input.name = 'message';
    input.type = 'text';
    input.maxLength = 400;
    input.autocomplete = 'off';
    input.placeholder = 'Escribile al Yeti…';
    input.setAttribute('aria-label', 'Escribile al Yeti');
    input.required = true;
    var send = document.createElement('button');
    send.type = 'submit';
    send.textContent = 'Enviar';
    form.append(input, send);

    var note = document.createElement('div');
    note.className = 'chat-note';
    note.textContent = 'Chat de prueba · Respuestas automáticas';
    bub.append(header, log, form, note);
    bub.classList.add('show');
    log.scrollTop = log.scrollHeight;
    input.focus();
  }

  function sendChatMessage(form) {
    var input = form.elements.message;
    var text = input.value.trim();
    if (!text) return;
    chatHistory.push({ role: 'user', text: text });
    chatHistory.push({ role: 'yeti', text: getChatAnswer(text) });
    chatHistory = chatHistory.slice(-20);
    showChat();
  }

  function find(key) {
    var re = { alu: /alum/i, mad: /mader/i, cha: /chapa/i }[key];
    if (re) {
      var b = [].slice.call(document.querySelectorAll('#menu .acc-btn')).filter(function (e) { return re.test(e.textContent); })[0];
      if (b) { if (b.getAttribute('aria-expanded') !== 'true') b.click(); return b; }
    }
    return key === 'faq' ? $('#faq-heading') : $('#catalogo');
  }

  async function go(key) {
    if (key === 'chat') {
      showChat();
      return;
    }
    if (key === 'chat-close') {
      menu('¿Qué más querés consultar?');
      return;
    }
    if (key === 'games') {
      chatOpen = false;
      hide();
      window.dispatchEvent(new CustomEvent('yeti:games:open'));
      return;
    }
    if (key === 'home') return goHome();
    var names = { alu: 'el aluminio', mad: 'la madera', cha: 'la chapa', faq: 'las preguntas frecuentes' };
    hide(); busy = true;
    await walkTo(x > innerWidth / 2 ? 16 : innerWidth - W() - 16);
    var el = find(key); el.style.scrollMarginTop = '90px';
    el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    await wait(RM ? 100 : 500);
    T.classList.add('point'); say('¡Acá está ' + names[key] + '! 👆');
    await wait(1300); T.classList.remove('point'); busy = false;
    menu('¿Te muestro algo más?');
  }

  async function goHome() {
    chatOpen = false;
    busy = true; say('¡Chau! Tocá la puerta cuando me necesites 👋'); T.classList.add('wave');
    await wait(1100); T.classList.remove('wave'); hide();
    await walkTo(doorX()); T.classList.remove('on'); door.classList.remove('open');
    out = false; busy = false;
  }

  async function callHim() {
    if (busy) return; busy = true;
    door.classList.add('knock'); knockSound();
    await wait(420); door.classList.remove('knock'); door.classList.add('open');
    T.style.transitionDuration = '0s,.4s'; setX(doorX()); T.classList.add('on');
    await wait(220); out = true; awake = lastTip = Date.now();
    await walkTo(doorX() - 120);
    T.classList.add('wave'); menu('¡Hola! Soy el Yeti 👋 ¿Qué andás buscando?');
    await wait(1200); T.classList.remove('wave'); busy = false;
  }

  function wake() {
    awake = Date.now();
    if (T.classList.contains('sleep')) { T.classList.remove('sleep'); if (out) say('¡Ah! Me quedé dormido 😴', 2500); }
  }

  door.addEventListener('click', function () { out ? (!busy && goHome()) : callHim(); });
  door.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); door.click(); } });
  bub.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (b && (!busy || b.getAttribute('data-go') === 'games')) go(b.getAttribute('data-go'));
  });
  bub.addEventListener('submit', function (e) {
    if (!e.target.matches('.chat-form')) return;
    e.preventDefault();
    sendChatMessage(e.target);
  });
  window.addEventListener('yeti:games:closed', function () {
    if (out) menu('¿Te divertiste? ¿Jugamos otra vez?');
  });

  fl.addEventListener('click', function () {
    if (!out) return; wake();
    var h = document.createElement('span'); h.className = 'ht'; h.textContent = '💙';
    h.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px'); T.appendChild(h); setTimeout(function () { h.remove(); }, 1000);
    T.classList.add('jump'); setTimeout(function () { T.classList.remove('jump'); }, 500);
    if (!busy) menu('¡Jiji, me hacés cosquillas! 💙 ¿Te ayudo?');
  });

  addEventListener('pointermove', function (e) {
    awake = Date.now(); if (!out) return;
    var r = T.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * .4);
    var a = Math.atan2(dy, dx), d = Math.min(3, Math.hypot(dx, dy) / 60);
    for (var i = 0; i < pps.length; i++) pps[i].style.transform = 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px)';
  }, { passive: true });
  ['pointerdown', 'keydown', 'scroll'].forEach(function (ev) { addEventListener(ev, wake, { passive: true }); });
  addEventListener('resize', function () { if (out) { T.style.transitionDuration = '0s,.4s'; setX(Math.min(x, innerWidth - W() - 8)); } });

  var tips = ['¿Ya viste la línea RPT? Aísla del frío y del ruido ❄️', 'Fabricamos a medida para tu obra 📐', 'El presupuesto es gratis y sin compromiso 😉', 'Estamos en Av. Juan B. Justo 5077 📍'];
  setInterval(function () {
    if (!out || busy) return;
    var now = Date.now();
    if (now - awake > 45000 && !T.classList.contains('sleep')) { T.classList.add('sleep'); if (!chatOpen) hide(); return; }
    if (now - lastTip > 30000 && !T.classList.contains('sleep') && !bub.classList.contains('show')) {
      lastTip = now; say(tips[Math.floor(Math.random() * tips.length)], 5000);
    }
  }, 1000);
})();
