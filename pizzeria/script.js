/* Don Pepe – Pizzería | script.js (con defer, después de jQuery y DOMPurify) */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

$(function () {
  'use strict';

  /* ===== EDITA AQUÍ ===== */
  const WA = '59178805695';            // WhatsApp del negocio (código país + número, sin +)
  const DELIVERY = 10;                  // costo de delivery en Bs
  const SUCURSALES = ['Don Pepe Sopocachi (Av. 6 de Agosto)']; // cambia por las reales
  const KEY = 'donpepe-estado-v1';
  /* ======================= */

  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducido) { $.fx.off = true; }

  /* ---------- CATÁLOGO (45 productos) ---------- */
  // Z = pizza (3 tamaños, se dibuja sola según sus ingredientes) · X = otros productos con emoji
  // Ingredientes: p pepperoni, h jamón, m champiñón, o aceituna, v pimentón, c cebolla, t tomate, b albahaca/rúcula,
  //               a piña, x tocino, e pollo/atún, n chorizo, w quesos
  const catalogo = [], TAM = ['Personal', 'Mediana', 'Familiar'];
  let n = 0;
  const Z = (c, nom, desc, base, tops, o) => catalogo.push({ id: ++n, c, nom, desc, tops, z: 1,
    v: [Math.round(base * .62), base, Math.round(base * 1.55)].map((p, i) => ({ t: TAM[i], p, antes: o ? Math.round(p * 1.12) : 0 })) });
  const X = (c, nom, desc, ico, v) => catalogo.push({ id: ++n, c, nom, desc, ico, v: v.map(([t, p, a]) => ({ t, p, antes: a || 0 })) });

  X('Combos', 'Combo Estudiante', 'Pizza personal + gaseosa 500 ml', '🎒', [['Combo', 29, 34]]);
  X('Combos', 'Combo Pareja', 'Pizza mediana a elección + 2 gaseosas 500 ml', '💕', [['Combo', 79, 92]]);
  X('Combos', 'Combo Familiar', 'Pizza familiar + palitos de ajo + gaseosa 2 L', '👨‍👩‍👧‍👦', [['Combo', 120, 138]]);
  X('Combos', 'Combo Amigos', '2 pizzas medianas + 6 alitas BBQ + gaseosa 2 L', '🎉', [['Combo', 145, 165]]);

  Z('Clásicas', 'Margarita', 'Salsa pomodoro, mozzarella y albahaca', 48, 'tb');
  Z('Clásicas', 'Pepperoni', 'Mozzarella y pepperoni crocante', 55, 'p');
  Z('Clásicas', 'Jamón y Queso', 'Jamón cocido y mozzarella', 50, 'h');
  Z('Clásicas', 'Napolitana', 'Tomate fresco, ajo, orégano y aceitunas', 52, 'tob');
  Z('Clásicas', 'Hawaiana', 'Jamón y piña', 55, 'ha');
  Z('Clásicas', 'Cuatro Quesos', 'Mozzarella, gorgonzola, parmesano y provolone', 62, 'w');
  Z('Clásicas', 'Champiñones', 'Champiñones salteados con ajo', 54, 'm');
  Z('Clásicas', 'Vegetariana', 'Pimentón, cebolla, champiñón, aceituna y choclo', 56, 'vcmo');

  Z('Especiales', 'Don Pepe', 'La de la casa: pepperoni, chorizo, cebolla caramelizada y pimentón', 72, 'pncv', 1);
  Z('Especiales', 'Carnívora', 'Pepperoni, jamón, tocino, chorizo y salame', 76, 'phxn');
  Z('Especiales', 'Pollo BBQ', 'Pollo, salsa BBQ, cebolla morada y choclo', 68, 'ec');
  Z('Especiales', 'Chorizo y Locoto', 'Chorizo parrillero, cebolla y locoto suave', 66, 'ncv', 1);
  Z('Especiales', 'Criolla', 'Carne sazonada, pimentón, cebolla y choclo', 64, 'nvc');
  Z('Especiales', 'Prosciutto y Rúcula', 'Jamón crudo, rúcula y parmesano', 78, 'hb');
  Z('Especiales', 'Atún y Cebolla', 'Atún, cebolla morada y aceitunas', 66, 'eco');
  Z('Especiales', 'Pesto y Tomate', 'Pesto de albahaca, tomate y mozzarella', 70, 'bt');
  Z('Especiales', 'Quesos, Miel y Nueces', 'Mozzarella, gorgonzola, miel y nueces', 69, 'w');

  X('Calzones', 'Calzone Clásico', 'Jamón, mozzarella y ricotta', '🥟', [['Unidad', 42]]);
  X('Calzones', 'Calzone Pepperoni', 'Pepperoni, mozzarella y orégano', '🥟', [['Unidad', 45]]);
  X('Calzones', 'Calzone Vegetal', 'Espinaca, champiñón y queso', '🥟', [['Unidad', 40]]);

  const PS = (a, b) => [['Individual', a], ['Para compartir', b]];
  X('Pastas', 'Lasaña de Carne', 'Capas de pasta, boloñesa y bechamel gratinada', '🍝', PS(42, 78));
  X('Pastas', 'Fettuccine Alfredo', 'Crema, parmesano y mantequilla', '🍝', PS(38, 70));
  X('Pastas', 'Spaghetti a la Boloñesa', 'Salsa de carne cocida lento', '🍝', PS(36, 66));
  X('Pastas', 'Ravioles Ricota y Espinaca', 'Con salsa pomodoro o crema', '🍝', PS(44, 82));
  X('Pastas', 'Penne al Pesto', 'Pesto de albahaca y parmesano', '🍝', PS(38, 70));

  X('Entradas', 'Palitos de Ajo', 'Con salsa de la casa', '🥖', [['6 und', 18], ['12 und', 32]]);
  X('Entradas', 'Pan de Ajo con Queso', 'Gratinado con mozzarella', '🧄', [['Porción', 22], ['Grande', 40]]);
  X('Entradas', 'Bruschettas', 'Tomate, albahaca y aceite de oliva', '🍅', [['4 und', 24], ['8 und', 44]]);
  X('Entradas', 'Alitas BBQ', 'Bañadas en salsa barbacoa', '🍗', [['6 und', 34], ['12 und', 62]]);
  X('Entradas', 'Papas Don Pepe', 'Papas fritas con cheddar y tocino', '🍟', [['Porción', 20], ['Grande', 34]]);
  X('Entradas', 'Ensalada Caprese', 'Tomate, mozzarella y albahaca', '🥗', [['Porción', 28], ['Grande', 46]]);

  X('Bebidas', 'Gaseosa', 'Sabores a elección', '🥤', [['500 ml', 8], ['2 L', 18]]);
  X('Bebidas', 'Limonada de la Casa', 'Con hierbabuena', '🍋', [['Vaso', 10], ['Jarra', 28]]);
  X('Bebidas', 'Jugo Natural', 'Frutilla, durazno o naranja', '🍓', [['Vaso', 12], ['Jarra', 32]]);
  X('Bebidas', 'Cerveza', 'Botella 620 ml bien helada', '🍺', [['Botella', 20]]);
  X('Bebidas', 'Agua Mineral', 'Con o sin gas', '💧', [['500 ml', 6]]);

  X('Postres', 'Pizza Nutella y Frutilla', 'Masa dulce, Nutella y frutillas', '🍫', [['Personal', 34], ['Mediana', 56]]);
  X('Postres', 'Tiramisú', 'Receta clásica italiana', '🍰', [['Porción', 24]]);
  X('Postres', 'Brownie con Helado', 'Tibio, con helado de vainilla', '🍨', [['Porción', 26]]);
  X('Postres', 'Helado Artesanal', 'Vainilla, chocolate o frutilla', '🍦', [['2 bolas', 18], ['3 bolas', 25]]);
  X('Postres', 'Flan Casero', 'Con caramelo', '🍮', [['Porción', 16]]);

  /* ---------- FOTOS REFERENCIALES (Unsplash) ---------- */
  // Para usar tus propias fotos: pon la URL completa (https://...) en lugar del ID, en POOL o en FOTO_ESPECIAL.
  const UNS = (f, w, q) => /^https?:/.test(f) ? f : `https://images.unsplash.com/photo-${f}?auto=format&fit=crop&w=${w}&q=${q}`;
  const POOL = ['1513104890138-7c749659a591', '1565299624946-b28f40a0ae38', '1574071318508-1cdbab80d002', '1604382354936-07c5d9983bd3',
    '1593560708920-61dd98c46a4e', '1571407970349-bc81e7e96d47', '1534308983496-4fabb1a015ee', '1590947132387-155cc02f3212']; // pizzas
  const FOTO_ESPECIAL = {
    'Margherita': '1534308983496-4fabb1a015ee', 'Pepperoni': '1604382354936-07c5d9983bd3',
    'Lasaña de Carne': '1574894709920-11b28e7367e3', 'Spaghetti a la Boloñesa': '1621996346565-e3dbc646d9a9',
    'Alitas BBQ': '1567620832903-9fc6debc209f', 'Papas Don Pepe': '1573080496219-bb080dd4f877',
    'Bruschettas': '1572695157366-5e585ab2b69f', 'Ensalada Caprese': '1608897013039-887f21d8c804',
    'Gaseosa': '1622483767028-3f66f32aef97', 'Cerveza': '1608270586620-248524c67de9',
    'Helado Artesanal': '1497034825429-c343d7c6a68f', 'Tiramisú': '1571877227200-a0d98ea607e9', 'Brownie con Helado': '1606313564200-e75d5e30476c'
  };
  // 2ª fuente (fotos reales por palabra clave, de Flickr): se usa si la 1ª no carga. Si ninguna carga, se muestra el dibujo.
  const KW = { 'Calzone Clásico': 'calzone', 'Calzone Pepperoni': 'calzone', 'Calzone Vegetal': 'calzone', 'Lasaña de Carne': 'lasagna',
    'Fettuccine Alfredo': 'fettuccine', 'Spaghetti a la Boloñesa': 'spaghetti', 'Ravioles Ricota y Espinaca': 'ravioli', 'Penne al Pesto': 'penne',
    'Palitos de Ajo': 'garlicbread', 'Pan de Ajo con Queso': 'garlicbread', 'Bruschettas': 'bruschetta', 'Alitas BBQ': 'chickenwings',
    'Papas Don Pepe': 'frenchfries', 'Ensalada Caprese': 'caprese', 'Gaseosa': 'soda', 'Limonada de la Casa': 'lemonade', 'Jugo Natural': 'orangejuice',
    'Cerveza': 'beer', 'Agua Mineral': 'mineralwater', 'Pizza Nutella y Frutilla': 'nutella', 'Tiramisú': 'tiramisu', 'Brownie con Helado': 'brownie',
    'Helado Artesanal': 'icecream', 'Flan Casero': 'flan' };
  const FLICKR = (kw, w, h, lock) => `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`;
  // 1ª fuente: tus fotos propias en la carpeta fotos/ (ej. fotos/margherita.jpg). Ver fotos/LEEME.txt con todos los nombres.
  const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  catalogo.forEach(p => {
    p.fotos = [['fotos/' + slug(p.nom) + '.jpg', 'fotos/' + slug(p.nom) + '.jpg']];
    const id = FOTO_ESPECIAL[p.nom] || (p.z ? POOL[p.id % POOL.length] : '');
    if (id) { p.fotos.push([UNS(id, 400, 75), UNS(id, 1400, 85)]); }
    const kw = p.z ? 'pizza' : KW[p.nom];
    if (kw) { [p.id, p.id + 50].forEach(l => p.fotos.push([FLICKR(kw, 400, 400, l), FLICKR(kw, 1000, 750, l)])); }  // 2 intentos distintos
  });
  const icoUri = e => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#f3c24f" stroke="#2a1a12" stroke-width="3"/><text x="50" y="68" font-size="52" text-anchor="middle">${e}</text></svg>`);

  /* ---------- PIZZAS DIBUJADAS (SVG generado por código, respaldo si una foto no carga) ---------- */
  /*PIZZA*/
  function topping(k, x, y, g) {
    const f = `transform="translate(${x} ${y}) rotate(${g})"`;
    return ({
      p: `<circle ${f} r="6" fill="#b3261e"/><circle ${f} cx="-1.5" cy="-1" r="1.2" fill="#8a1a14"/>`,
      h: `<rect ${f} x="-5" y="-4" width="10" height="8" rx="2.5" fill="#f3a6a6"/>`,
      m: `<ellipse ${f} rx="6" ry="3.6" fill="#e8d6b8"/>`,
      o: `<circle ${f} r="3.4" fill="none" stroke="#2b2b2b" stroke-width="2"/>`,
      v: `<path ${f} d="M-5 0Q0-5 5 0" fill="none" stroke="#3c9d3c" stroke-width="2.6"/>`,
      c: `<path ${f} d="M-5 0Q0-5 5 0" fill="none" stroke="#a35ab3" stroke-width="2"/>`,
      t: `<circle ${f} r="5" fill="#e04a2f"/>`,
      b: `<ellipse ${f} rx="5.5" ry="2.6" fill="#2f8f3a"/>`,
      a: `<rect ${f} x="-3.5" y="-3.5" width="7" height="7" fill="#ffd84d"/>`,
      x: `<rect ${f} x="-7" y="-1.8" width="14" height="3.6" rx="1.5" fill="#8c4a2f"/>`,
      e: `<rect ${f} x="-5" y="-3" width="10" height="6" rx="3" fill="#ead2a2"/>`,
      n: `<circle ${f} r="4.6" fill="#d2561f"/>`,
      w: `<circle ${f} r="2.6" fill="#fff8e1"/>`
    })[k] || '';
  }
  const cachePz = {};
  function pizza(id, tops) {
    const kk = id + tops;
    if (cachePz[kk]) { return cachePz[kk]; }
    let s = id * 7919 + 13, o = '';
    const r = () => (s = s * 16807 % 2147483647) / 2147483647;
    [...tops].forEach(k => {
      for (let i = 0; i < (k === 'w' ? 14 : 8); i++) {
        const a = r() * 6.283, d = Math.sqrt(r()) * 34;
        o += topping(k, (60 + Math.cos(a) * d).toFixed(1), (60 + Math.sin(a) * d).toFixed(1), (r() * 180).toFixed(0));
      }
    });
    let cortes = '';
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; cortes += `<path d="M${(60 + Math.cos(a) * 46).toFixed(1)} ${(60 + Math.sin(a) * 46).toFixed(1)}L${(60 - Math.cos(a) * 46).toFixed(1)} ${(60 - Math.sin(a) * 46).toFixed(1)}"/>`; }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="57" fill="#d99a4e"/><circle cx="60" cy="60" r="50" fill="#c8341f"/><circle cx="60" cy="60" r="46" fill="#f3c24f"/>${o}<g stroke="#8a5a1d" stroke-width=".9" opacity=".45">${cortes}</g></svg>`;
    return (cachePz[kk] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  }
  /*FIN_PIZZA*/

  /* ---------- UTILIDADES ---------- */
  const bob = x => 'Bs ' + x.toFixed(2);
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = s => String(s).replace(/[&<>"']/g, c => ESC[c]);
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const safe = ($t, html) => $t.html(window.DOMPurify ? window.DOMPurify.sanitize(html) : html);
  const movil = () => matchMedia('(max-width:1024px)').matches;

  let carrito = [], pedidos = [], cat = 'Todos', q = '';
  const $grid = $('#grid'), $ticket = $('#ticket'), $modal = $('#checkoutModal'), $toast = $('#toast');

  /* ---------- PERSISTENCIA ---------- */
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify({ carrito, pedidos })); } catch (e) {} }
  function cargar() {
    let d; try { d = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { d = {}; }
    (Array.isArray(d.carrito) ? d.carrito : []).forEach(i => {   // se reconstruye desde el catálogo: precios nunca vienen del almacenamiento
      const [id, t] = String(i && i.key).split('|');
      const p = catalogo.find(x => String(x.id) === id), v = p && p.v.find(x => x.t === t), qty = Math.floor(Number(i.qty));
      if (v && qty >= 1) { carrito.push({ key: p.id + '|' + v.t, nombre: p.nom, size: v.t, precio: v.p, qty: Math.min(qty, 99) }); }
    });
    (Array.isArray(d.pedidos) ? d.pedidos : []).forEach(r => {
      if (r && typeof r === 'object') {
        pedidos.push({ id: String(r.id).slice(0, 20), fecha: String(r.fecha), cliente: String(r.cliente), celular: String(r.celular), modo: String(r.modo),
          lugar: String(r.lugar), hora: String(r.hora), pago: String(r.pago), nota: String(r.nota), resumen: String(r.resumen),
          total: Number(r.total) || 0, cancelada: r.cancelada === true });
      }
    });
  }

  /* ---------- CARTA ---------- */
  const CATS = ['Todos', 'Ofertas', ...new Set(catalogo.map(p => p.c))];
  const esOferta = p => p.v.some(x => x.antes);
  const delCat = c => catalogo.filter(p => c === 'Todos' || (c === 'Ofertas' ? esOferta(p) : p.c === c));

  function renderChips() {
    safe($('#chips'), CATS.map(c => `<button type="button" class="${c === cat ? 'on' : ''}" data-c="${c}" aria-pressed="${c === cat}">${c === 'Ofertas' ? '🔥 ' : ''}${c}<small>${delCat(c).length}</small></button>`).join(''));
  }

  function card(p) {
    const v0 = p.v[0];
    const f = p.fotos[p.fi || 0];
    const img = f
      ? `<button type="button" class="ph" aria-label="Ampliar foto de ${p.nom}"><img class="foto" loading="lazy" alt="Foto referencial de ${p.nom}" src="${f[0]}" data-full="${f[1]}"></button>`
      : (p.z ? `<img class="pz" alt="" loading="lazy" src="${pizza(p.id, p.tops)}">` : `<span class="ico" aria-hidden="true">${p.ico}</span>`);
    const szs = p.v.map((x, i) => `<button type="button" class="sz${i === 0 ? ' on' : ''}" data-i="${i}">${x.t}</button>`).join('');
    return `<article class="item" data-id="${p.id}"><div class="item__img">${img}${esOferta(p) ? '<span class="tag">Oferta</span>' : ''}</div>` +
      `<div class="item__b"><h3 class="nm"><span>${p.nom}</span></h3><div class="prrow"><i class="dots"></i><s class="old">${v0.antes ? bob(v0.antes) : ''}</s><b class="price">${bob(v0.p)}</b></div>` +
      `<p class="ds">${p.desc}</p><div class="szs">${szs}</div><button type="button" class="add">+ Agregar</button></div></article>`;
  }

  function renderMenu() {
    const l = delCat(cat).filter(p => !q || norm(p.nom + ' ' + p.desc).includes(q));
    let html = '', last = '';
    l.forEach(p => {
      if (cat === 'Todos' && !q && p.c !== last) { html += `<h2 class="sec">${p.c}</h2>`; last = p.c; }
      html += card(p);
    });
    safe($grid, html || '<p class="empty">No encontramos nada con esa búsqueda 🍕</p>');
    $('#catTitle').text(cat === 'Todos' ? 'Toda la carta' : (cat === 'Ofertas' ? '🔥 Ofertas y combos' : cat));
    $('#catCount').text(l.length + (l.length === 1 ? ' producto' : ' productos'));
  }

  function setCat(c, scroll) {
    cat = c; renderChips(); renderMenu();
    if (scroll) { document.getElementById('menu').scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' }); }
  }
  $('#chips').on('click', 'button', function () { setCat($(this).data('c'), true); });
  $('#navOfertas, #btnHeroOfertas').on('click', () => setCat('Ofertas', true));
  $('#q').on('input', function () { q = norm(this.value.trim()); renderMenu(); });

  $grid.on('click', '.sz', function () {
    const $c = $(this).closest('.item'), p = catalogo.find(x => x.id === Number($c.data('id'))), v = p.v[$(this).data('i')];
    $c.find('.sz').removeClass('on'); $(this).addClass('on');
    $c.find('.price').text(bob(v.p)); $c.find('.old').text(v.antes ? bob(v.antes) : '');
  });
  $grid.on('click', '.add', function () {
    const $c = $(this).closest('.item'), $b = $(this), p = catalogo.find(x => x.id === Number($c.data('id'))), v = p.v[$c.find('.sz.on').data('i')];
    const key = p.id + '|' + v.t, it = carrito.find(i => i.key === key);
    if (it) { it.qty = Math.min(it.qty + 1, 99); } else { carrito.push({ key, nombre: p.nom, size: v.t, precio: v.p, qty: 1 }); }
    renderCarrito();
    $('#cartBadge').removeClass('bump'); void $('#cartBadge')[0].offsetWidth; $('#cartBadge').addClass('bump');
    $b.addClass('ok').text('✔ Agregado'); setTimeout(() => $b.removeClass('ok').text('+ Agregar'), 800);
  });

  /* ---------- TICKET (pedido) ---------- */
  const subtotal = () => carrito.reduce((s, i) => s + i.precio * i.qty, 0);
  const totalDe = modo => subtotal() + (modo === 'Delivery' ? DELIVERY : 0);

  function renderCarrito() {
    safe($('#cartList'), carrito.length ? carrito.map(i =>
      `<li class="ln" data-key="${esc(i.key)}"><div><b>${i.nombre}</b><br><small>${i.size} · ${bob(i.precio)}</small></div><b>${bob(i.precio * i.qty)}</b>` +
      `<div class="qty"><button type="button" class="mn" aria-label="Quitar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><span>${i.qty}</span><button type="button" class="pl" aria-label="Agregar uno">+</button></div>` +
      `<button type="button" class="del" aria-label="Eliminar ${i.nombre}">🗑️</button></li>`).join('') : '<li class="vacio">Tu pedido está vacío.<br>¡Elige algo rico de la carta! 🍕</li>');
    const cant = carrito.reduce((s, i) => s + i.qty, 0);
    $('#subtotal, #total').text(bob(subtotal()));
    $('#cartBadge, #barCant').text(cant);
    $('#barTotal').text(bob(subtotal()));
    $('#cartBar').toggleClass('on', cant > 0);
    $('#btnCheckout, #btnClear').prop('disabled', !carrito.length);
    $('#notaDelivery').text(carrito.length ? `Delivery: +${bob(DELIVERY)} (se suma al confirmar)` : '');
    guardar();
  }
  const buscar = $el => carrito.find(i => i.key === $el.closest('.ln').attr('data-key'));
  $('#cartList').on('click', '.pl', function () { const it = buscar($(this)); if (it && it.qty < 99) { it.qty++; renderCarrito(); } })
    .on('click', '.mn', function () { const it = buscar($(this)); if (it && it.qty > 1) { it.qty--; renderCarrito(); } })
    .on('click', '.del', function () { const it = buscar($(this)); carrito.splice(carrito.indexOf(it), 1); renderCarrito(); });
  $('#btnClear').on('click', () => { carrito = []; renderCarrito(); toast('🗑️ Pedido vaciado'); });

  function tab(id) {
    $('.tk-tabs [data-t]').removeClass('on').attr('aria-selected', 'false').filter(`[data-t="${id}"]`).addClass('on').attr('aria-selected', 'true');
    $('.pane').removeClass('on'); $('#' + id).addClass('on');
  }
  $('.tk-tabs [data-t]').on('click', function () { tab($(this).data('t')); });

  function abrirTicket() { $ticket.addClass('open'); $('#scrim').addClass('on'); }
  function cerrarTicket() { $ticket.removeClass('open'); $('#scrim').removeClass('on'); }
  $('#cartBar').on('click', () => { tab('pCart'); abrirTicket(); });
  $('#btnCartTop').on('click', () => { if (movil()) { abrirTicket(); } else { document.getElementById('ticket').scrollIntoView({ block: 'center' }); } });
  $('#tkClose, #scrim').on('click', cerrarTicket);

  function toast(msg, err) {
    $toast.stop(true, true).hide().toggleClass('e', !!err).text(msg).slideDown(240).delay(3000).fadeOut(320);
  }

  /* ---------- MODAL, FOCO Y TECLADO ---------- */
  let ultimoFoco = null;
  function abrirModal() { ultimoFoco = document.activeElement; $modal.fadeIn(160, () => $('#fName').trigger('focus')); }
  function cerrarModal() { if (!$modal.is(':visible')) { return; } $modal.fadeOut(160); if (ultimoFoco && ultimoFoco.focus) { ultimoFoco.focus(); } }
  $('#btnCloseModal').on('click', cerrarModal);
  $modal.on('click', e => { if (e.target === $modal[0]) { cerrarModal(); } });
  $(document).on('keydown', e => {
    if (e.key === 'Escape') { if ($('#lightboxModal').is(':visible')) { cerrarLb(); return; } cerrarModal(); cerrarTicket(); return; }
    const $o = $('.modal-overlay:visible');
    if (e.key !== 'Tab' || !$o.length) { return; }
    const f = $o.find('button, input, select').filter(':visible:not(:disabled)'); if (!f.length) { return; }
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });

  /* ---------- FORMULARIO ---------- */
  safe($('#fSuc'), '<option value="">Elige una sucursal</option>' + SUCURSALES.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join(''));
  $('#lblDel').text(`(+${bob(DELIVERY)})`);
  const modo = () => $('input[name=modo]:checked').val();
  function setErr($i, m) { $i.toggleClass('invalid', !!m).nextAll('.err').first().text(m || ''); }
  const vNombre = () => { const v = $('#fName').val().trim(); setErr($('#fName'), !v ? 'Escribe tu nombre.' : v.length < 3 ? 'El nombre es muy corto.' : ''); return v.length >= 3; };
  const vTel = () => { const v = $('#fPhone').val().replace(/\D/g, '').slice(0, 8); $('#fPhone').val(v); setErr($('#fPhone'), !v ? 'Escribe tu celular.' : v.length < 7 ? 'Debe tener 7 u 8 dígitos.' : ''); return v.length >= 7; };
  const vSuc = () => { if (modo() !== 'Recojo') { return true; } const ok = !!$('#fSuc').val(); setErr($('#fSuc'), ok ? '' : 'Elige una sucursal.'); return ok; };
  const vDir = () => { if (modo() !== 'Delivery') { return true; } const ok = $('#fDir').val().trim().length >= 6; setErr($('#fDir'), ok ? '' : 'Escribe tu dirección completa.'); return ok; };
  $('#fName').on('input', function () { const l = this.value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, ''); if (l !== this.value) { this.value = l; setErr($(this), 'Solo letras y espacios.'); } else { setErr($(this), ''); } }).on('blur', vNombre);
  $('#fPhone').on('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 8); setErr($(this), ''); }).on('blur', vTel);
  $('#fSuc').on('change blur', vSuc); $('#fDir').on('blur', vDir);
  $('input[name=modo]').on('change', function () {
    const d = modo() === 'Delivery';
    $('#boxSuc').prop('hidden', d); $('#boxDir').prop('hidden', !d);
    $('#modalTotal').text(bob(totalDe(modo())));
  });
  $('#btnCheckout').on('click', () => { if (carrito.length) { $('#modalTotal').text(bob(totalDe(modo()))); abrirModal(); } });

  /* ---------- PEDIDOS Y WHATSAPP ---------- */
  function nuevoId() {
    const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', d = new Date(); let id;
    do { id = '#PEPE-' + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-'; for (let i = 0; i < 3; i++) { id += A[Math.floor(Math.random() * A.length)]; } }
    while (pedidos.some(p => p.id === id));
    return id;
  }
  const abrirWA = t => window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t), '_blank', 'noopener,noreferrer');

  function mensajePedido(r, items) {
    return ['Hola, quiero hacer un pedido en *Don Pepe* 🍕:', '', '👤 *Cliente:* ' + r.cliente, '📱 *Celular:* ' + r.celular,
      '🛵 *Modalidad:* ' + (r.modo === 'Delivery' ? 'Delivery a ' + r.lugar : 'Recojo en ' + r.lugar),
      '🕒 *Hora:* ' + (r.hora || 'Lo antes posible'), '💳 *Pago:* ' + r.pago, '',
      '🍕 *DETALLE DEL PEDIDO:*', ...items.map(i => `• ${i.nombre} (${i.size}) x ${i.qty} = ${bob(i.precio * i.qty)}`),
      ...(r.modo === 'Delivery' ? ['• Delivery = ' + bob(DELIVERY)] : []), '', '💰 *TOTAL:* ' + bob(r.total),
      ...(r.nota ? ['', '📝 *Notas:* ' + r.nota] : []), '', '🔖 *Código:* ' + r.id].join('\n');
  }

  $('#checkoutForm').on('submit', function (e) {
    e.preventDefault();
    if (![vNombre(), vTel(), vSuc(), vDir()].every(Boolean)) { toast('⚠️ Revisa los campos marcados', true); return; }
    const items = carrito.map(i => ({ ...i })), m = modo();
    const r = { id: nuevoId(), fecha: new Date().toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' }),
      cliente: $('#fName').val().trim(), celular: $('#fPhone').val().trim(), modo: m,
      lugar: m === 'Delivery' ? $('#fDir').val().trim() : $('#fSuc').val(), hora: $('#fHora').val(), pago: $('input[name=pago]:checked').val(),
      nota: $('#fNota').val().trim(), total: totalDe(m), cancelada: false,
      resumen: items.map(i => `${i.qty}x ${i.nombre} ${i.size}`).join(', ') };
    pedidos.push(r);
    const texto = mensajePedido(r, items);
    carrito = []; renderCarrito(); renderLog();
    this.reset(); $('#boxSuc').prop('hidden', false); $('#boxDir').prop('hidden', true);
    $(this).find('.invalid').removeClass('invalid'); $(this).find('.err').text('');
    cerrarModal(); tab('pLog'); if (movil()) { abrirTicket(); }
    toast('✅ Pedido registrado. Abriendo WhatsApp…');
    abrirWA(texto);
  });

  function renderLog() {
    safe($('#logList'), pedidos.length ? pedidos.slice().reverse().map(p =>
      `<li class="lg${p.cancelada ? ' off' : ''}" data-id="${esc(p.id)}"><div class="h"><span>${esc(p.id)}</span><span>${esc(p.fecha)}</span></div>` +
      `<span class="rs">${esc(p.resumen)}</span><span>${p.modo === 'Delivery' ? '🛵' : '🏪'} ${esc(p.lugar)}${p.hora ? ' · ' + esc(p.hora) : ''}</span>` +
      `<span class="rs"><b>${bob(p.total)}</b> · ${esc(p.pago)}</span><span class="st">${p.cancelada ? '🔴 Cancelado' : '🟡 Pendiente: confirma por WhatsApp'}</span>` +
      (p.cancelada ? '' : '<div class="acc"><button type="button" class="c1">Cancelar pedido</button></div>') + '</li>').join('') : '<li class="vacio">Aún no tienes pedidos.</li>');
    guardar();
  }
  $('#logList').on('click', '.c1', function () {
    safe($(this).parent(), '<span>¿Cancelar y avisar por WhatsApp?</span><button type="button" class="c2">Sí</button><button type="button" class="c3">No</button>');
  }).on('click', '.c3', function () {
    safe($(this).parent(), '<button type="button" class="c1">Cancelar pedido</button>');
  }).on('click', '.c2', function () {
    const r = pedidos.find(p => p.id === $(this).closest('.lg').attr('data-id'));
    if (r) {
      r.cancelada = true; renderLog(); toast('🚫 Pedido ' + r.id + ' cancelado. Abriendo WhatsApp…', true);
      abrirWA(['Hola, quiero *CANCELAR* mi pedido en *Don Pepe*:', '', '🔖 *Código:* ' + r.id, '👤 *Cliente:* ' + r.cliente, '📱 *Celular:* ' + r.celular, '🍕 *Detalle:* ' + r.resumen, '💰 *Total:* ' + bob(r.total)].join('\n'));
    }
  });

  /* ---------- TEMA, INSTALACIÓN, PIE ---------- */
  const $body = $('body');
  function iconoTema() {
    const d = $body.hasClass('dark');
    $('#btnTheme').text(d ? '☀️' : '🌙').attr({ 'aria-label': d ? 'Cambiar a modo claro' : 'Cambiar a modo noche', 'aria-pressed': String(d) });
    $('meta[name=theme-color]').attr('content', '#1f1511');
  }
  $('#btnTheme').on('click', () => { $body.toggleClass('dark'); iconoTema(); try { localStorage.setItem('donpepe-theme', $body.hasClass('dark') ? 'dark' : 'light'); } catch (e) {} });
  try { if (localStorage.getItem('donpepe-theme') === 'dark') { $body.addClass('dark'); } } catch (e) {}
  iconoTema();

  let dip = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); dip = e; $('#btnInstall').prop('hidden', false); });
  window.addEventListener('appinstalled', () => $('#btnInstall').prop('hidden', true));
  $('#btnInstall').on('click', () => { if (dip) { dip.prompt(); dip.userChoice.finally(() => { dip = null; $('#btnInstall').prop('hidden', true); }); } });

  safe($('#ftInfo'), SUCURSALES.map(esc).join(' · ') + `<br>📲 Pedidos por WhatsApp: <a href="https://wa.me/${WA}" target="_blank" rel="noopener noreferrer">+${WA}</a>`);
  $('#heroPizza').attr('src', pizza(99, 'pnvhcbt'));

  /* ---------- FOTOS: respaldo y ampliación ---------- */
  // Si una foto no carga (sin internet o enlace roto) se cambia por el dibujo del producto.
  // Modo diagnóstico: abre la página con ?debug al final de la dirección para ver, en el pie, qué fotos no cargaron.
  const DEBUG = /[?&]debug/.test(location.search);
  if (DEBUG) { $('#contacto').append('<pre id="dbg" style="text-align:left;max-width:900px;margin:14px auto 0;white-space:pre-wrap;word-break:break-all;font-size:.72rem;color:#f3c24f">Fotos que no cargaron:\n</pre>'); }
  document.addEventListener('error', e => {
    const t = e.target;
    if (!t || t.tagName !== 'IMG' || !t.classList.contains('foto')) { return; }
    const p = catalogo.find(x => x.id === Number($(t).closest('.item').data('id')));
    console.warn('Foto no cargó:', t.src);
    if (DEBUG) { $('#dbg').append(document.createTextNode((p ? p.nom : '?') + ' → ' + t.src + '\n')); }
    if (p) { p.fi = (p.fi || 0) + 1; const nx = p.fotos[p.fi]; if (nx) { t.src = nx[0]; t.setAttribute('data-full', nx[1]); return; } }
    t.classList.remove('foto'); t.classList.add('pz'); t.removeAttribute('data-full');
    t.src = p ? (p.z ? pizza(p.id, p.tops) : icoUri(p.ico)) : icoUri('🍕');
    $(t).closest('.ph').addClass('sin');
  }, true);

  const $lb = $('#lightboxModal');
  $grid.on('click', '.ph', function () {
    const full = $(this).find('img').attr('data-full'); if (!full) { return; }
    const nombre = $(this).closest('.item').find('.nm > span:first-child').text();
    $('#lbImg').attr({ src: full, alt: 'Foto referencial de ' + nombre });
    $('#lbCap').text(nombre);
    ultimoFoco = document.activeElement;
    $lb.fadeIn(160, () => $('#btnCloseLb').trigger('focus'));
  });
  function cerrarLb() { if (!$lb.is(':visible')) { return; } $lb.fadeOut(160); if (ultimoFoco && ultimoFoco.focus) { ultimoFoco.focus(); } }
  $('#btnCloseLb').on('click', cerrarLb);
  $lb.on('click', e => { if (e.target === $lb[0]) { cerrarLb(); } });

  /* ---------- INICIO ---------- */
  cargar(); renderChips(); renderMenu(); renderCarrito(); renderLog();
});
