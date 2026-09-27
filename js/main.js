/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'al-bocconcino',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si prenota al telefono, su Quandoo o su TheFork
      message: '',
      ids: [],
    },
    /* scheda Google (27/9/2026): tutti i giorni 12–15 e 19–23, il venerdì fino alle 23:30, il martedì solo a pranzo */
    hours: {
      0: [['12:00', '15:00'], ['19:00', '23:00']],
      1: [['12:00', '15:00'], ['19:00', '23:00']],
      2: [['12:00', '15:00']],
      3: [['12:00', '15:00'], ['19:00', '23:00']],
      4: [['12:00', '15:00'], ['19:00', '23:00']],
      5: [['12:00', '15:00'], ['19:00', '23:30']],
      6: [['12:00', '15:00'], ['19:00', '23:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to content",
      "m.top": "Al Bocconcino, back to the top",
      "m.sezioni": "Sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "v.pizza": "The pizza",
      "v.pesce": "Fish",
      "v.cucina": "The kitchen",
      "v.pranzo": "Lunch",
      "v.sala": "The room",
      "v.prenota": "Book",
      "t.prenota": "Book",
      "h.sopra": "Restaurant · Pizzeria · Via Gonin 7",
      "h.corsivo": "come and try the",
      "h.nome": "Racchetta",
      "h.n1": "The real Neapolitan pizza",
      "h.n2": "48-hour dough · wood-fired oven",
      "h.alt": "The Racchetta seen from above: prosciutto crudo, shavings of grana and rocket on the pizza, and in the middle a little ball of mozzarella with a basil leaf",
      "h.palla": "The bocconcino: the little mozzarella ball",
      "h.bollino": "Crust stuffed with ricotta",
      "h.n3": "«Crisp outside, soft inside… and with a heart of ricotta»",
      "h.n4": "tap the bocconcino",
      "a.aria": "Booking",
      "a.lede": "The real Neapolitan pizza, with a 48-hour dough, baked in the wood-fired oven. And a kitchen of sea and land, from lunch to dinner.",
      "a.tel": "Book: 388 347 0465",
      "a.quandoo": "Book on Quandoo",
      "a.thefork": "Book on TheFork",
      "a.vg": "on Google · 298 reviews",
      "a.vt": "on TheFork · 972 reviews",
      "a.sugg": "(tap the bocconcino)",
      "c1.nota": "«the crust, high and soft»",
      "c1.t": "The pizza",
      "c1.bollino": "48-hour dough",
      "c1.p1": "Neapolitan: the dough rises for 48 hours and the pizza bakes in the wood-fired oven. The crust is high and soft, and in some pizzas it is stuffed with buffalo ricotta: in the Genuina, and in the handle of the Racchetta.",
      "c1.alt1": "A pizza with prosciutto crudo, walnuts and basil held in front of the lit wood-fired oven",
      "c1.cap1": "In front of the oven.",
      "c1.alt2": "The Nerano in front of the oven: courgette cream, golden courgettes and stracciatella, with a high crust",
      "c1.cap2": "The Nerano.",
      "c1.m1": "The contemporary ones",
      "c1.racchetta": "fior di latte, tomato, prosciutto crudo, rocket, grana; the handle stuffed with buffalo ricotta",
      "c1.genuina": "datterini tomatoes, fior di latte, parmesan; the crust stuffed with buffalo ricotta and cooked ham",
      "c1.bocconcino": "tomato, aubergine parmigiana, smoked provola, parmesan shavings",
      "c1.nerano": "courgette cream, fior di latte, courgette chips, mint, stracciatella",
      "c1.pistacchio": "fior di latte, mortadella, pistachio cream and crumbs",
      "c1.noci": "fior di latte, walnut cream, speck, parmesan",
      "c1.nduja": "fior di latte, ’nduja, sausage",
      "c1.integrale": "buffalo mozzarella, corbarino tomatoes, yellow and red pacchetelle, parmesan",
      "c1.calzone": "pork cracklings, ricotta and black pepper",
      "c1.m2": "The traditional ones",
      "c1.margherita": "tomato, fior di latte, basil",
      "c1.marinara": "tomato, oregano, basil",
      "c1.napoli": "anchovies, taggiasca olives",
      "c1.diavola": "spicy salami",
      "c1.friarielli": "smoked provola",
      "c1.regina": "datterini tomatoes, buffalo mozzarella",
      "c1.cosacca": "tomato, pecorino romano",
      "c2.nota": "«fresh fish every day»",
      "c2.t": "Fish",
      "c2.bollino": "Made to order",
      "c2.p1": "From pasta allo scoglio to the mixed grill: the fish arrives fresh every day and is cooked to order.",
      "c2.alt1": "The mixed fried fish: prawns, squid and fried vegetables with a lemon wedge, carried into the dining room",
      "c2.cap1": "Mixed fried fish.",
      "c2.alt2": "Salmon tartare on a bed of avocado, with shredded radish on top",
      "c2.cap2": "Salmon and avocado tartare.",
      "c2.menu": "From their menu, a few dishes (ask for the catch of the day):",
      "c2.d1": "Crispy octopus",
      "c2.d1s": "with thyme and paprika",
      "c2.d2": "Sea bream tartare",
      "c2.d2s": "Mediterranean style",
      "c2.d3": "Vermicelli with clams",
      "c2.d3s": "and bottarga",
      "c2.d4": "Paccheri with lobster",
      "c2.d4s": "porcini and saffron",
      "c2.d5": "Tagliolini with scampi",
      "c2.d5s": "lime, mint and crunchy bread",
      "c2.d6": "Sea bass baked in salt",
      "c2.d6s": "for two, with grilled vegetables",
      "c2.d7": "Mixed fried fish",
      "c2.d7s": "with tartare sauce",
      "c3.nota": "«Tradition and Passion»",
      "c3.t": "The kitchen",
      "c3.bollino": "Selected meat",
      "c3.p1": "Traditional first and second courses, starters from the land, meat on the grill: the beef rib steak aged just long enough, the tagliata, the mixed grill.",
      "c3.alt1": "Three bruschette with burrata, anchovies, sun-dried tomatoes and parsley on a black plate",
      "c3.cap1": "Bruschette with burrata, anchovies and sun-dried tomatoes.",
      "c3.alt2": "Gnocco fritto and cured meats on the wooden board",
      "c3.cap2": "Gnocco fritto and cured meats.",
      "c3.alt3": "The grilled rib steak with roast potatoes and lemon",
      "c3.cap3": "The aged rib steak.",
      "c3.d1": "Parmigiana millefeuille",
      "c3.d1s": "with a grana crust",
      "c3.d2": "Risotto alla milanese",
      "c3.d2s": "with ossobuco",
      "c3.d3": "Risotto alla monzese",
      "c3.d3s": "sausage and saffron",
      "c3.d4": "Bucatini all’amatriciana",
      "c3.d5": "Carbonara",
      "c3.d6": "Elephant ear",
      "c3.d6s": "breaded veal with confit tomatoes and rocket",
      "c3.d7": "Picanha",
      "c3.d7s": "the Brazilian cut",
      "c3.d8": "And to finish",
      "c3.d8s": "tiramisù, torta della nonna, millefeuille, the homemade cheesecake",
      "c4.nota": "«good morning from us»",
      "c4.t": "Lunch",
      "c4.bollino": "Dish of the day",
      "c4.p1": "At lunch there is the menu of the day: a lunch break that is tasty, quick and good value. They post it in the morning on their social pages, with a good morning: «Dal Bocconcino vi diamo il buongiorno».",
      "c4.p2": "They are open for lunch every day, Tuesday too.",
      "c4.alt": "Paccheri with datterini tomatoes, buffalo mozzarella and a basil leaf in the spiral plate",
      "c4.cap": "Paccheri with datterini and buffalo mozzarella.",
      "c5.nota": "«recently renovated»",
      "c5.t": "The room",
      "c5.bollino": "Private room",
      "c5.alt": "The mural in the dining room: a city drawn in pencil, a street lamp, a flight of steps, a building among the trees and a squirrel",
      "c5.cap": "The mural: a city drawn in pencil (there is even a squirrel).",
      "c5.cit": "«Recently renovated, young, kind and friendly owners.»",
      "c5.chi": "from the reviews on Google (translated from Italian)",
      "c5.p1": "Besides the main room, a private dining room for group dinners and parties. You can eat at home too: takeaway, and home delivery, also on Just Eat and Deliveroo.",
      "c5.s1": "Accessible",
      "c5.s2": "Air conditioning",
      "c5.s3": "Kids’ menu",
      "c5.s4": "Vegan dishes",
      "c5.s5": "Pets welcome",
      "c5.s6": "Wi-Fi",
      "c6.nota": "«cooked to perfection»",
      "c6.t": "What people say",
      "c6.bollino": "4.6 on Google",
      "c6.vg": "on Google · 298 reviews",
      "c6.vt": "on TheFork · 972 reviews",
      "c6.r1": "«First time today at lunch and I must say the pizzas (there were 7 of us) were all excellent! Cooked to perfection! Even my mum, who always complains everywhere about the \"burnt\" bits, complimented the pizzaiolo today! I’ll definitely be back!»",
      "c6.su1": "on Google (translated from Italian)",
      "c6.r2": "«Impeccable welcome, kindness and good manners open the doors of the place. Quick service, no delays. Masterful pizza, very light dough, excellent quality ingredients. Good value for money. We’ll definitely be back»",
      "c6.su2": "A guest on TheFork · 9.5/10 · September 2026 (translated from Italian)",
      "c6.r3": "«We came to Milan from Turkey for a 7-day holiday and had the chance to try many pizzerias in the city. However, the pizza with courgettes and 4 cheeses we ate here was unmatched by any other <span class=\"taglio\">[…]</span>»",
      "c6.su3": "on Google (translated)",
      "c6.r4": "«very welcoming place, polite and helpful staff. we’ve been several times, we had the pizza, which is superb. maybe next time we’ll try the first courses. highly recommended»",
      "c6.su4": "A guest on TheFork · 10/10 · September 2026 (translated from Italian)",
      "c6.r5": "«Lovely, well-kept place. Kind staff. We had pizza (several kinds), gnocco fritto with cold cuts (superb!), lemon sorbet <span class=\"taglio\">[…]</span>»",
      "c6.su5": "A guest on TheFork · 10/10 · September 2026 (translated from Italian)",
      "c6.nota2": "From the reviews on Google and TheFork, as they were written.",
      "c7.nota": "«we look forward to seeing you»",
      "c7.t": "Book",
      "c7.bollino": "Tuesday lunch only",
      "c7.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.soloPranzo": "lunch only",
      "c7.k1": "Address",
      "c7.k2": "Area",
      "c7.v2": "Giambellino, 150 metres from Piazza Tirana",
      "c7.k3": "Phone",
      "c7.k4": "Metro",
      "c7.v4": "M4 San Cristoforo, about 300 metres away",
      "c7.strada": "Directions to Via Gonin 7 →",
      "c7.mappa": "Map: Al Bocconcino, Via Francesco Gonin 7, Milan",
      "z.tipo": "Restaurant Pizzeria",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · texts and photos from their website, their menu and their Instagram, the Google listing and public reviews on Google and TheFork (September 2026).",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ AL BOCCONCINO — «Vieni a provare la Racchetta.» ══════════
     La pagina è la Racchetta vista dall'alto: la testa (la loro foto dentro l'anello), il manico (i capitoli), la punta.
     la FIRMA — il palleggio del bocconcino: al primo sguardo il bocconcino cade sulla Racchetta, rimbalza due volte
     schiacciandosi e si ferma al suo posto, dove sta nella loro foto (sotto, la foto è rifinita: _boc_testa.mjs). Toccandolo
     (o con Invio e Spazio) palleggia di nuovo. Stato finale = l'HTML: il bocconcino al suo posto, nessuna trasformazione.
     Senza JS, con reduced-motion o senza GSAP resta fermo; la classe firma-attesa (messa nell'head) lo nasconde solo finché
     non cade, e se questo codice non parte l'head la toglie da sola dopo 2,5 s. */
  var palla = document.getElementById('bocconcino');
  var pallaImg = palla && palla.querySelector('.bocconcino__img');
  var ombra = palla && palla.querySelector('.bocconcino__ombra');
  var testaEl = document.getElementById('testa');
  var gioco = null;

  /* lo stato degli orari anche nella punta, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  /* la discesa da -h: la palla cade, si schiaccia, rimbalza due volte e si ferma; l'ombra cresce quando si avvicina */
  function discesa(tl, h) {
    tl.to(pallaImg, { y: 0, rotation: 0, duration: 0.5, ease: 'power2.in' })
      .to(ombra, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.in' }, '<')
      .to(pallaImg, { scaleY: 0.8, scaleX: 1.14, duration: 0.07, ease: 'power1.out' })
      .to(pallaImg, { scaleY: 1, scaleX: 1, duration: 0.12, ease: 'power1.in' })
      .to(pallaImg, { y: -h * 0.3, duration: 0.27, ease: 'power2.out' }, '<')
      .to(ombra, { scale: 0.6, opacity: 0.45, duration: 0.27, ease: 'power2.out' }, '<')
      .to(pallaImg, { y: 0, duration: 0.27, ease: 'power2.in' })
      .to(ombra, { scale: 1, opacity: 1, duration: 0.27, ease: 'power2.in' }, '<')
      .to(pallaImg, { scaleY: 0.9, scaleX: 1.06, duration: 0.06 })
      .to(pallaImg, { scaleY: 1, scaleX: 1, duration: 0.09 })
      .to(pallaImg, { y: -h * 0.08, duration: 0.14, ease: 'power2.out' }, '<')
      .to(pallaImg, { y: 0, duration: 0.14, ease: 'power2.in' });
    return tl;
  }
  function fine() { gsap.set([pallaImg, ombra], { clearProps: 'transform,opacity' }); gioco = null; }

  /* la caduta del primo sguardo: la palla parte da sopra la testa */
  function caduta() {
    var h = testaEl.offsetHeight * 0.62;
    gsap.set(pallaImg, { y: -h, rotation: -22 });
    gsap.set(ombra, { scale: 0.3, opacity: 0.15 });
    gioco = gsap.timeline({ delay: 0.35, onStart: function () { root.classList.remove('firma-attesa'); }, onComplete: fine });
    discesa(gioco, h);
  }
  /* il palleggio: la Racchetta la colpisce (si schiaccia), sale girando un po' e ricade */
  function palleggio() {
    if (gioco && gioco.isActive()) return;
    var h = testaEl.offsetHeight * 0.4;
    gioco = gsap.timeline({ onComplete: fine });
    gioco.to(pallaImg, { scaleY: 0.86, scaleX: 1.1, duration: 0.06, ease: 'power1.out' })
      .to(pallaImg, { scaleY: 1, scaleX: 1, y: -h, rotation: 18, duration: 0.34, ease: 'power2.out' })
      .to(ombra, { scale: 0.35, opacity: 0.25, duration: 0.34, ease: 'power2.out' }, '<');
    discesa(gioco, h);
  }

  var puoGiocare = hasGsap && !reducedMotion && palla && pallaImg && ombra && testaEl;
  if (!puoGiocare) {
    root.classList.remove('firma-attesa');
  } else {
    window.__pallaPronta = true;
    palla.setAttribute('role', 'button');
    palla.setAttribute('tabindex', '0');
    palla.addEventListener('click', palleggio);
    palla.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); palleggio(); }
    });
    var r = testaEl.getBoundingClientRect();
    if (r.bottom > 80 && r.top < window.innerHeight * 0.8) caduta();
    else root.classList.remove('firma-attesa'); /* aperta più in basso (un'ancora): la palla è già al suo posto */
  }
})();
