/* PluviaTech — prototipo navegable (HTML, CSS y JavaScript sin librerías). */
(function () {
  "use strict";

  var D = window.CTI_DATA;
  var main = document.getElementById("contenido");
  var HOY = new Date();

  /* ================= Utilidades ================= */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function fecha(iso) {
    if (!iso) return "";
    return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  }
  function pesos(v) { return "$" + Math.round(v).toLocaleString("es-CO"); }
  function num(v) { return v.toLocaleString("es-CO", { maximumFractionDigits: 2 }); }
  function diasDesde(iso) { return Math.floor((HOY - new Date(iso + "T12:00:00")) / 86400000); }
  function sumarDias(iso, n) { var d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  function hoyISO() { return HOY.toISOString().slice(0, 10); }
  function pendiente(o) { return diasDesde(o.verificado) > D.DIAS_REVISION; }
  function barrio(slug) { return D.barrios.filter(function (b) { return b.slug === slug; })[0]; }
  function obra(id) { return D.intervenciones.filter(function (o) { return String(o.id) === String(id); })[0]; }
  function obrasDe(slug) { return D.intervenciones.filter(function (o) { return o.barrio === slug; }); }
  function plural(n, uno, varios) { return n + " " + (n === 1 ? uno : varios); }
  function edad(nac) {
    var n = new Date(nac + "T12:00:00"), e = HOY.getFullYear() - n.getFullYear(), m = HOY.getMonth() - n.getMonth();
    if (m < 0 || (m === 0 && HOY.getDate() < n.getDate())) e--;
    return e;
  }

  var memoria = {};
  var store = {
    get: function (k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return k in memoria ? memoria[k] : def; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { memoria[k] = v; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { delete memoria[k]; } }
  };

  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  /* ================= Íconos y Goti ================= */

  var ICON_PATHS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    rain: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    warn: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 11v4"/><path d="M12 18h.01"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/>',
    vol: '<path d="M11 5 6 9H2v6h4l5 4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    mute: '<path d="M11 5 6 9H2v6h4l5 4Z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    img: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    a11y: '<circle cx="12" cy="4" r="2"/><path d="M5 8h14"/><path d="M12 8v6"/><path d="m8 21 4-7 4 7"/>',
    print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'
  };
  function ico(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICON_PATHS[n] || "") + "</svg>"; }

  var GOTI =
    '<svg viewBox="0 0 120 140" aria-hidden="true">' +
    '<ellipse cx="60" cy="134" rx="30" ry="4" fill="#0f172a" opacity=".12"/>' +
    '<path d="M60 14C60 14 18 64 18 92a42 42 0 0 0 84 0C102 64 60 14 60 14Z" fill="#38bdf8" stroke="#0369a1" stroke-width="3" stroke-linejoin="round"/>' +
    '<ellipse cx="38" cy="86" rx="6" ry="13" fill="#fff" opacity=".55" transform="rotate(-18 38 86)"/>' +
    '<path d="M36 54Q60 24 84 54Z" fill="#facc15" stroke="#a16207" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<rect x="28" y="52" width="64" height="8" rx="4" fill="#eab308" stroke="#a16207" stroke-width="2.5"/>' +
    '<rect x="57" y="32" width="6" height="20" rx="3" fill="#fde047"/>' +
    '<circle cx="46" cy="88" r="6.5" fill="#0f172a"/><circle cx="74" cy="88" r="6.5" fill="#0f172a"/>' +
    '<circle cx="48.5" cy="85.5" r="2" fill="#fff"/><circle cx="76.5" cy="85.5" r="2" fill="#fff"/>' +
    '<circle cx="38" cy="100" r="5" fill="#fb7185" opacity=".45"/><circle cx="82" cy="100" r="5" fill="#fb7185" opacity=".45"/>' +
    '<path d="M48 104Q60 115 72 104" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>' +
    '<g transform="rotate(10 96 109)"><rect x="86" y="96" width="20" height="26" rx="3" fill="#fff" stroke="#0369a1" stroke-width="2.5"/>' +
    '<path d="M90 105h11M90 111h11M90 117h7" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></g></svg>';

  function pintar(scope) {
    (scope || document).querySelectorAll("[data-goti]").forEach(function (el) { el.innerHTML = GOTI; });
    (scope || document).querySelectorAll("[data-icon]").forEach(function (el) { el.innerHTML = ico(el.getAttribute("data-icon")); });
  }

  /* ================= Piezas ================= */

  var ESTADOS = ["Anunciada", "En diseño", "Contratada", "En ejecución", "Terminada"];
  function badge(e) {
    var c = { "En diseño": "st-dis", "Contratada": "st-con", "En ejecución": "st-eje", "Terminada": "st-ter", "Suspendida": "st-sus" }[e] || "";
    return '<span class="estado ' + c + '">' + esc(e) + "</span>";
  }
  function demo() { return '<span class="demo">Datos de demostración</span>'; }
  function pendTag() { return '<span class="pend">Pendiente de actualizar</span>'; }

  function dato(c, tipo) {
    if (!c) return '<span class="na">Información no disponible</span>';
    if (c.solicitada) return '<span class="na">Información solicitada a ' + esc(c.solicitada.entidad) + " el " + fecha(c.solicitada.fecha) + "</span>";
    var v = tipo === "dinero" ? pesos(c.valor) : tipo === "fecha" ? fecha(c.valor) : c.valor + " %";
    return '<span class="val">' + v + '</span><span class="src">Fuente: ' + esc(c.fuente) + "</span>";
  }
  function corto(c, tipo) {
    if (!c) return '<span class="na">No disponible</span>';
    if (c.solicitada) return '<span class="na">Solicitada</span>';
    return '<span class="val">' + (tipo === "dinero" ? pesos(c.valor) : tipo === "fecha" ? fecha(c.valor) : c.valor + " %") + "</span>";
  }

  function etapas(e) {
    var i = ESTADOS.indexOf(e);
    if (i < 0) return "";
    return '<ol class="stage" aria-label="Etapa de la intervención">' + ESTADOS.map(function (s, k) {
      return '<li class="' + (k < i ? "done" : k === i ? "now" : "") + '"' + (k === i ? ' aria-current="step"' : "") + ">" + esc(s) + "</li>";
    }).join("") + "</ol>";
  }

  function ocard(o) {
    var b = barrio(o.barrio);
    var costo = o.contratado && o.contratado.valor ? pesos(o.contratado.valor) : o.presupuesto && o.presupuesto.valor ? pesos(o.presupuesto.valor) : "No disponible";
    var ini = o.inicio && o.inicio.valor ? fecha(o.inicio.valor) : "Sin fecha";
    var ent = o.entregaReal && o.entregaReal.valor ? fecha(o.entregaReal.valor) : o.entregaEstimada && o.entregaEstimada.valor ? fecha(o.entregaEstimada.valor) : "Sin fecha";
    return '<a class="ocard" href="#obra-' + o.id + '">' +
      '<span class="ocard__meta">' + esc(o.tipo) + " · " + esc(o.tramo) + " · " + esc(b.nombre) + "</span>" +
      '<span class="ocard__title">' + esc(o.titulo) + "</span>" +
      '<span class="row" style="justify-content:flex-start">' + badge(o.estado) + (pendiente(o) ? pendTag() : "") + "</span>" +
      '<span class="ocard__facts"><span>Inicio<strong>' + ini + "</strong></span><span>" + (o.entregaReal ? "Entregada" : "Entrega") + "<strong>" + ent + "</strong></span><span>" +
      (o.contratado && o.contratado.valor ? "Contratado" : "Costo") + "<strong>" + costo + "</strong></span></span>" +
      '<span class="ocard__src">Fuente: ' + esc(o.fuente.nombre) + " · verificada el " + fecha(o.verificado) + "</span></a>";
  }

  function compartir(titulo) {
    var wa = "https://wa.me/?text=" + encodeURIComponent(titulo + " — PluviaTech: " + location.href);
    return '<div class="actions no-print"><a class="btn btn--wa" href="' + wa + '" target="_blank" rel="noreferrer">' + ico("share") + "WhatsApp</a>" +
      '<button type="button" class="btn btn--line" data-print>' + ico("print") + "Imprimir</button></div>";
  }

  function emergencia() {
    return '<aside class="emergency"><strong>¿Emergencia? Llame a la línea <a href="tel:123">123</a>.</strong><p>Bomberos 119 · Cruz Roja 132 · Defensa Civil 144 · Gestión del Riesgo 317 503 0465. <a href="#canales">Ver todos</a></p></aside>';
  }

  // Panel desplegable accesible: botón con aria-expanded que muestra u oculta su contenido.
  function panel(id, titulo, cuerpo) {
    return '<section class="panel">' +
      '<div class="panel__head"><h3 id="pt-' + id + '">' + titulo + "</h3>" +
      '<button type="button" class="panel__btn" data-panel aria-expanded="false" aria-controls="pc-' + id + '" aria-describedby="pt-' + id + '">' +
      '<span class="panel__lbl">Ver información</span>' + ico("chev") + "</button></div>" +
      '<div class="panel__body" id="pc-' + id + '" role="region" aria-labelledby="pt-' + id + '" hidden>' + cuerpo + "</div></section>";
  }

  function opinion(lugar) {
    return '<form class="card form no-print" data-feedback="' + esc(lugar) + '">' +
      "<h3>¿Encontró lo que buscaba?</h3>" +
      '<div class="opts" role="radiogroup" aria-label="¿Encontró lo que buscaba?">' +
      '<label><input type="radio" name="ok" value="si" required> Sí</label><label><input type="radio" name="ok" value="parte"> En parte</label><label><input type="radio" name="ok" value="no"> No</label></div>' +
      '<label class="field"><span>¿Qué le hizo falta? Escriba su sugerencia (opcional)</span><textarea name="falta" rows="2" maxlength="300"></textarea></label>' +
      '<div class="adj">' +
      '<input type="file" accept="image/*" class="sr-only" id="adj-' + esc(lugar) + '" data-adjunto>' +
      '<label class="btn btn--line adj__btn" for="adj-' + esc(lugar) + '" tabindex="0" role="button">' + ico("img") + '<span data-adj-lbl>Adjuntar imagen</span></label>' +
      '<span class="small muted">Opcional: una foto o captura de pantalla.</span>' +
      '<div class="adj__prev hidden" data-adj-prev><img alt="Vista previa de la imagen adjunta"><div><span class="small" data-adj-nombre></span>' +
      '<button type="button" class="link adj__quitar" data-adj-quitar>Quitar imagen</button></div></div>' +
      "</div>" +
      '<div><button class="btn" type="submit">Enviar sugerencia</button></div></form>';
  }

  function sim(txt) { return '<p class="sim">' + (txt || "Segunda fase · simulación: no envía datos a ningún servidor ni guarda contraseñas.") + "</p>"; }

  /* ================= Inicio ================= */

  function vistaInicio() {
    var C = D.contexto;
    var activos = D.barrios.filter(function (b) { return b.activo; });

    var porBarrio = activos.map(function (b) { return { e: b.nombre, v: obrasDe(b.slug).length }; }).sort(function (a, b) { return b.v - a.v; });
    var conteo = {};
    D.intervenciones.forEach(function (o) { conteo[o.tipo] = (conteo[o.tipo] || 0) + 1; });
    var porTipo = Object.keys(conteo).map(function (k) { return { e: k, v: conteo[k] }; }).sort(function (a, b) { return b.v - a.v; });

    return '<div class="page">' +
      '<section class="hero"><div class="hero__grid"><div>' +
      '<div class="row" style="justify-content:flex-start">' + demo() + '<span class="pill">Piloto Canal Ricaurte</span></div>' +
      "<h1>PluviaTech</h1>" +
      '<p class="hero__lema">Innovación tecnológica aplicada al drenaje pluvial</p>' +
      '<p class="hero__lead">Las obras del canal de su barrio, explicadas claro.</p>' +
      '<p class="hero__sub">Información oficial sobre el Canal Ricaurte, con su fuente y la fecha en que la revisamos.</p>' +
      '<ul class="qchips" aria-label="Preguntas que responde este portal">' +
      ["¿Qué van a arreglar?", "¿Cuándo empieza?", "¿Cómo va la obra?", "¿Cuánto cuesta?", "¿Cuándo la entregan?"].map(function (q) { return "<li>" + q + "</li>"; }).join("") + "</ul>" +
      '<label for="q" class="sr-only">Buscar una obra</label>' +
      '<div class="search">' + ico("search") + '<input id="q" type="search" placeholder="Busque: dragado, limpieza, San Antonio…" autocomplete="off"></div>' +
      "</div>" +
      '<a class="goti-hi" href="#asistente"><span class="goti-hi__bubble"><strong>¡Hola! Soy Goti.</strong> Le ayudo a encontrar la obra de su canal y le digo de dónde salió cada dato.</span><span class="goti-hi__fig" data-goti></span></a>' +
      "</div></section>" +

      '<section id="res" class="hidden" aria-live="polite"></section>' +

      "<section><h2>Elija su barrio</h2>" +
      '<p class="muted mt1">Sectores candidatos del piloto alrededor del Canal Ricaurte. Están pendientes de confirmación.</p>' +
      '<div class="grid g3 mt4">' + activos.map(bcard).join("") + "</div>" +
      '<a class="link mt3" style="display:inline-block" href="#barrios">Ver todos los sectores del piloto</a></section>' +

      '<section aria-labelledby="dt"><h2 id="dt">El problema en datos</h2>' +
      '<p class="muted mt1">Por qué importa seguir las obras de los canales. Cada cifra muestra de dónde viene y de qué fecha es.</p>' +
      '<div class="grid g4 mt4">' + C.cifras.map(function (c) {
        var f = c.url ? '<a href="' + c.url + '" target="_blank" rel="noreferrer">' + esc(c.fuente) + "</a>" : esc(c.fuente);
        return '<article class="card stat">' + ico(c.icono) + '<p class="stat__num">' + c.num + '</p><p class="stat__txt">' + esc(c.txt) + '</p><p class="src">Fuente: ' + f + " · " + esc(c.fecha) + "</p></article>";
      }).join("") + "</div>" +

      '<div class="panels mt4">' +
      panel("afectados", "Barrios y sectores con afectaciones",
        '<p class="muted small">Reportados tras las lluvias del 24 de octubre de 2026.</p><ul class="chips">' +
        C.afectados2026.map(function (b) { return b === "Olaya Herrera" ? '<li class="hot">Olaya Herrera · zona del piloto</li>' : "<li>" + esc(b) + "</li>"; }).join("") +
        '</ul><p class="src mt3">Fuente: <a href="' + C.cifras[2].url + '" target="_blank" rel="noreferrer">El Universal, 24 oct. 2026</a>. La nota no indica qué canal se desbordó en cada barrio.</p>') +

      panel("metas", "¿Cómo van las metas de canales del Distrito?",
        '<p class="chart__desc">Porcentaje cumplido de cada meta del proyecto de recuperación de canales y drenajes pluviales de Valorización Distrital.</p>' +
        '<div class="axis" aria-hidden="true"><span></span><span><span>0 %</span><span>50 %</span><span>100 %</span></span><span></span></div>' +
        '<ul class="bars bars--meta">' + C.metas.map(function (m) {
          var p = Math.min(100, (m.ejecutado / m.planeado) * 100);
          return '<li class="bar"><span class="bar__lbl"><strong>' + esc(m.meta) + "</strong><small>" + num(m.ejecutado) + " de " + num(m.planeado) + " " + m.unidad + " · " + m.periodo + "</small></span>" +
            '<span class="track track--mid"><span class="fill" style="width:' + Math.max(p, 1.5) + '%"></span></span><span class="bar__val">' + num(Math.round(p * 10) / 10) + " %</span></li>";
        }).join("") + "</ul>" +
        '<details><summary>Ver como tabla</summary><table><thead><tr><th>Meta</th><th class="num">Ejecutado</th><th class="num">Planeado</th><th class="num">Cumplido</th></tr></thead><tbody>' +
        C.metas.map(function (m) {
          return "<tr><td>" + esc(m.meta) + '</td><td class="num">' + num(m.ejecutado) + " " + m.unidad + '</td><td class="num">' + num(m.planeado) + " " + m.unidad + '</td><td class="num">' + num(Math.round((m.ejecutado / m.planeado) * 1000) / 10) + " %</td></tr>";
        }).join("") + "</tbody></table></details>" +
        '<p class="src mt3">Fuente: <a href="' + C.url + '" target="_blank" rel="noreferrer">' + esc(C.fuente) + "</a>. El informe no nombra los canales intervenidos y algunas cifras no coinciden entre sus tablas y su texto (por ejemplo, 4,5 km frente a 4,58 km diseñados); aquí se usan las de la tabla de metas.</p>") +

      panel("fichas", "Fichas publicadas en este portal",
        '<p class="muted small">' + plural(D.intervenciones.length, "ficha publicada", "fichas publicadas") + ". Toque una para ver su detalle.</p>" +
        '<div class="grid g2 mt3">' + D.intervenciones.map(ocard).join("") + "</div>" +
        '<div class="grid g2 mt4">' + conteoChart("Intervenciones por barrio", "Fichas publicadas para cada sector del piloto.", porBarrio, "Barrio") +
        conteoChart("Intervenciones por tipo de obra", "Limpieza, dragado, mantenimiento, reparación y obra.", porTipo, "Tipo") + "</div>") +
      "</div></section>" +

      '<section class="grid g2">' +
      '<a class="cta cta--goti" href="#asistente"><span class="cta__goti" data-goti></span><span><strong>Pregúntele a Goti</strong>Le ayuda a encontrar una obra y le dice de dónde salió el dato.</span></a>' +
      '<a class="cta cta--rep" href="#reportar"><span class="cta__ic">' + ico("warn") + "</span><span><strong>Reportar una posible falla</strong>Requiere cuenta y ser mayor de 18 años. No es para emergencias.</span></a>" +
      "</section>" +
      emergencia() +
      '<button type="button" class="btn btn--line hidden" id="instalar">Instalar PluviaTech en este celular</button>' +
      "</div>";
  }

  function conteoChart(titulo, desc, datos, col) {
    var max = Math.max.apply(null, [1].concat(datos.map(function (d) { return d.v; })));
    var tot = datos.reduce(function (s, d) { return s + d.v; }, 0);
    return '<figure class="card" style="margin:0"><figcaption><span class="chart__title">' + esc(titulo) + '</span><span class="chart__desc">' + esc(desc) + "</span></figcaption>" +
      '<ul class="bars bars--count">' + datos.map(function (d) {
        return '<li class="bar" title="' + esc(d.e) + ": " + d.v + " de " + tot + '"><span class="bar__lbl">' + esc(d.e) + '</span><span class="track"><span class="fill" style="width:' + (d.v / max) * 100 + '%"></span></span><span class="bar__val">' + d.v + "</span></li>";
      }).join("") + "</ul>" +
      "<details><summary>Ver como tabla</summary><table><thead><tr><th>" + col + '</th><th class="num">Fichas</th></tr></thead><tbody>' +
      datos.map(function (d) { return "<tr><td>" + esc(d.e) + '</td><td class="num">' + d.v + "</td></tr>"; }).join("") +
      '<tr><td><strong>Total</strong></td><td class="num"><strong>' + tot + "</strong></td></tr></tbody></table></details></figure>";
  }

  function bcard(b) {
    var n = obrasDe(b.slug).length;
    return '<a class="bcard" href="#barrio-' + b.slug + '"><span class="bcard__pin">' + ico("pin") + "</span>" +
      '<span><span class="bcard__name">' + esc(b.nombre) + '</span><span class="small muted">' + plural(n, "intervención", "intervenciones") + "</span></span>" +
      '<span class="bcard__arrow">' + ico("arrow") + "</span></a>";
  }

  /* ================= Barrios, barrio, ficha, canales ================= */

  function vistaBarrios() {
    return '<div class="page page--tight"><div class="crumbs"><a href="#inicio">Inicio</a> › Barrios</div>' +
      "<div><h1>Sectores del piloto</h1>" +
      '<p class="muted mt2">El piloto empieza en el entorno del Canal Ricaurte, en 2 o 3 sectores. Todos están <strong>pendientes de confirmación</strong>: cada uno debe tener afectaciones documentadas, información oficial que se pueda mantener al día y una comunidad dispuesta a probar el portal.</p></div>' +
      '<div class="grid g2">' + D.barrios.map(function (b) {
        if (b.activo) return bcard(b);
        return '<div class="bcard bcard--off"><span class="bcard__pin">' + ico("pin") + '</span><span><span class="bcard__name">' + esc(b.nombre) + '</span><span class="small muted">En evaluación · se incluirá si cumple las condiciones del piloto</span></span></div>';
      }).join("") + "</div>" + emergencia() + "</div>";
  }

  function vistaBarrio(slug) {
    var b = barrio(slug);
    if (!b) return noHay();
    var obras = obrasDe(slug);
    return '<div class="page page--tight"><div class="crumbs no-print"><a href="#inicio">Inicio</a> › <a href="#barrios">Barrios</a> › ' + esc(b.nombre) + "</div>" +
      '<header class="phead"><div><p class="eyebrow">' + esc(b.zona) + " · Canal Ricaurte</p><h1>" + esc(b.nombre) + '</h1><p class="small muted mt1">Sector candidato del piloto · pendiente de confirmación</p></div>' + compartir("Obras del canal en " + b.nombre) + "</header>" +

      "<section><div class=\"row\"><h2>Novedades oficiales</h2>" + demo() + "</div>" +
      (b.novedades.length ? '<ul class="news">' + b.novedades.map(function (n) {
        return "<li><time>" + fecha(n.fecha) + " · " + esc(n.entidad) + '</time><p class="mt1">' + esc(n.texto) + '</p><span class="src mt1">Fuente: ' + esc(n.fuente) + "</span></li>";
      }).join("") + "</ul>" : '<p class="na mt2">Información no disponible</p>') + "</section>" +

      '<section><div class="row"><h2>Intervenciones</h2><span class="small muted">' + plural(obras.length, "ficha", "fichas") + "</span></div>" +
      (obras.length ? '<div class="grid g2 mt3">' + obras.map(ocard).join("") + "</div>" : '<p class="na mt2">Información no disponible</p>') + "</section>" +

      '<section class="card"><h3>Canales de atención</h3><ul class="clist">' + D.canales.filter(function (c) { return c.tel; }).map(function (c) {
        return "<li><span>" + esc(c.nombre) + '</span><a class="clist__num' + (c.tipo === "emergencia" ? " is-sos" : "") + '" href="tel:' + c.tel + '">' + esc(c.num) + "</a></li>";
      }).join("") + '</ul><a class="link small" href="#canales">Ver todos los canales oficiales</a></section>' +
      opinion("barrio-" + slug) + "</div>";
  }

  function vistaObra(id) {
    var o = obra(id);
    if (!o) return noHay();
    var b = barrio(o.barrio);
    var costo = o.contratado && o.contratado.valor ? ["Valor contratado", o.contratado] : ["Presupuesto anunciado", o.presupuesto];
    var entrega = o.entregaReal ? ["Entregada el", o.entregaReal] : ["Entrega estimada", o.entregaEstimada];
    return '<div class="page page--tight"><div class="crumbs no-print"><a href="#inicio">Inicio</a> › <a href="#barrio-' + b.slug + '">' + esc(b.nombre) + "</a> › Ficha</div>" +
      "<header>" +
      '<p class="eyebrow">' + esc(o.tipo) + " · " + esc(o.canal) + " · " + esc(b.nombre) + "</p>" +
      '<h1 class="mt1">' + esc(o.titulo) + "</h1>" +
      '<div class="row mt3" style="justify-content:flex-start">' + badge(o.estado) + (pendiente(o) ? pendTag() : "") + (o.demo ? demo() : "") + "</div>" +
      '<div class="mt4">' + etapas(o.estado) + "</div></header>" +

      '<dl class="facts">' +
      "<div><dt>Empieza</dt><dd>" + corto(o.inicio, "fecha") + "</dd></div>" +
      "<div><dt>" + entrega[0] + "</dt><dd>" + corto(entrega[1], "fecha") + "</dd></div>" +
      "<div><dt>" + costo[0] + "</dt><dd>" + corto(costo[1], "dinero") + "</dd></div>" +
      "<div><dt>Avance físico</dt><dd>" + corto(o.avanceFisico, "pct") + "</dd></div></dl>" +

      '<section class="card"><h2 class="section-t">¿Qué van a arreglar?</h2><p>' + esc(o.queSeHace) + "</p>" +
      '<p class="small muted mt2">' + esc(o.canal) + ", " + esc(o.tramo) + ". Responsable: " + esc(o.entidad) + ".</p></section>" +

      '<section class="card"><h2 class="section-t">¿Cómo va la obra?</h2>' +
      '<p class="small muted">Último avance publicado · ' + fecha(o.ultimoAvance.fecha) + '</p><p class="mt1">' + esc(o.ultimoAvance.texto) + "</p>" +
      '<div class="mt4">' + pct(o.avanceFisico, "Avance físico (lo construido)") + pct(o.avanceFinanciero, "Avance financiero (lo pagado)") + "</div></section>" +

      '<section class="card"><h2 class="section-t">¿Cuánto cuesta?</h2><dl class="money">' +
      "<div><dt>Presupuesto anunciado</dt><dd>" + dato(o.presupuesto, "dinero") + "</dd></div>" +
      "<div><dt>Valor contratado</dt><dd>" + dato(o.contratado, "dinero") + "</dd></div>" +
      "<div><dt>Monto ejecutado</dt><dd>" + dato(o.ejecutado, "dinero") + "</dd></div></dl></section>" +

      '<section class="card"><h2 class="section-t">¿Cuándo empieza y cuándo la entregan?</h2><dl class="money">' +
      "<div><dt>Inicio programado</dt><dd>" + dato(o.inicio, "fecha") + "</dd></div>" +
      "<div><dt>Entrega estimada</dt><dd>" + dato(o.entregaEstimada, "fecha") + "</dd></div>" +
      "<div><dt>Entrega real</dt><dd>" + (o.entregaReal ? dato(o.entregaReal, "fecha") : '<span class="na">Aún no confirmada</span>') + "</dd></div></dl></section>" +

      '<section class="card origin"><h2 class="section-t">De dónde sale esta información</h2>' +
      "<p><strong>Fuente:</strong> " + (o.fuente.url ? '<a href="' + o.fuente.url + '" target="_blank" rel="noreferrer">' + esc(o.fuente.nombre) + "</a>" : esc(o.fuente.nombre)) + "</p>" +
      '<p class="mt1"><strong>Verificada el</strong> ' + fecha(o.verificado) + " · próxima revisión " + fecha(sumarDias(o.verificado, D.DIAS_REVISION)) + "</p>" +
      (pendiente(o) ? '<p class="warn mt2">Pasaron más de ' + D.DIAS_REVISION + " días sin revisar esta ficha. Puede haber cambios que aún no aparecen.</p>" : "") +
      '<p class="small muted mt2">Solo mostramos porcentajes cuando una fuente oficial los publica.</p></section>' +

      compartir(o.titulo) +
      '<p class="no-print"><a class="link" href="#asistente">¿Dudas sobre esta ficha? Pregúntele a Goti</a></p>' +
      opinion("obra-" + o.id) + emergencia() + "</div>";
  }

  function pct(c, etiqueta) {
    if (!c || c.solicitada) return '<div class="pct"><span class="pct__lbl"><span>' + etiqueta + "</span></span>" + dato(c) + "</div>";
    return '<div class="pct"><span class="pct__lbl"><span>' + etiqueta + "</span><strong>" + c.valor + ' %</strong></span><span class="track"><span class="fill" style="width:' + c.valor + '%"></span></span><span class="src mt1">Fuente: ' + esc(c.fuente) + "</span></div>";
  }

  function lineaCard(c) {
    return '<a class="line' + (c.tipo === "emergencia" ? " line--sos" : "") + '" href="tel:' + c.tel + '"><span class="line__num' + (c.num.length > 4 ? " line__num--long" : "") + '">' + esc(c.num) + "</span>" +
      '<span class="line__txt"><strong>' + esc(c.nombre) + "</strong><span>" + esc(c.nota) + '</span></span><span class="line__call">' + ico("phone") + "</span></a>";
  }

  function vistaCanales() {
    var lineas = D.canales.filter(function (c) { return c.tel; });
    var fuentes = [];
    lineas.forEach(function (c) { if (c.fuente && fuentes.indexOf(c.fuente) < 0) fuentes.push(c.fuente); });
    return '<div class="page page--tight"><div class="crumbs"><a href="#inicio">Inicio</a> › Canales oficiales</div>' +
      '<div><h1>Canales oficiales de atención</h1><p class="muted mt2">Toque un número para llamar. Este portal informa sobre obras; no atiende emergencias.</p></div>' +
      "<section><h2>Emergencias y socorro</h2>" +
      '<div class="lines mt3">' + lineas.map(lineaCard).join("") + "</div>" +
      '<p class="src mt3">Fuentes: ' + fuentes.map(function (f) { return '<a href="' + f.url + '" target="_blank" rel="noreferrer">' + esc(f.nombre) + "</a>"; }).join(" · ") + ". Verificadas el 18 nov. 2026.</p></section>" +
      "<section><h2>Obras y trámites</h2>" +
      '<div class="grid g3 mt3">' + D.canales.filter(function (c) { return !c.tel; }).map(function (c) {
        return '<article class="ent ent--' + (c.color || "azul") + '"><h3 class="ent__head">' + esc(c.nombre) + '</h3><div class="ent__body"><p class="small">' + esc(c.nota) + '</p><p class="small mt2 muted">Contacto: ' + esc(c.num) + "</p></div></article>";
      }).join("") + "</div>" +
      '<p class="small muted mt3">Los teléfonos y correos de estas entidades se publicarán cuando el equipo los verifique.</p></section>' +
      '<section class="sep"><h2>Sugerencias sobre este portal</h2><p class="small muted mt1">Este formulario no es un canal de emergencias ni de reportes.</p><div class="mt3">' + opinion("canales") + "</div></section></div>";
  }

  /* ================= Segunda fase ================= */

  function usuario() {
    var s = store.get("cti_sesion", null), u = store.get("cti_usuario", null);
    return s && u && u.correo === s ? u : null;
  }

  function vistaIngresar() {
    return '<div class="page page--tight narrow"><div class="crumbs"><a href="#inicio">Inicio</a> › Ingresar</div><div><h1>Ingresar</h1><p class="muted mt2">Solo necesita cuenta para enviar reportes. Las consultas son libres.</p></div>' +
      '<form class="card form" id="f-login" novalidate>' +
      '<label class="field"><span>Correo electrónico</span><input name="correo" type="email" autocomplete="email" required></label>' +
      '<label class="field"><span>Contraseña</span><input name="clave" type="password" autocomplete="current-password" required></label>' +
      '<p class="err" role="alert"></p><button class="btn btn--full" type="submit">Ingresar</button>' +
      '<a class="link small" href="#recuperar">¿Olvidó su contraseña?</a></form>' +
      '<p>¿No tiene cuenta? <a class="link" href="#registro">Regístrese</a></p>' + sim() + "</div>";
  }

  function vistaRegistro() {
    return '<div class="page page--tight narrow"><div class="crumbs"><a href="#inicio">Inicio</a> › Crear cuenta</div><h1>Crear cuenta</h1>' +
      '<form class="card form" id="f-registro" novalidate>' +
      '<label class="field"><span>Nombre</span><input name="nombre" autocomplete="name" required></label>' +
      '<label class="field"><span>Correo electrónico</span><input name="correo" type="email" autocomplete="email" required></label>' +
      '<label class="field"><span>Fecha de nacimiento</span><input name="nacimiento" type="date" required max="' + hoyISO() + '"></label>' +
      '<p class="why"><strong>¿Por qué le pedimos este dato?</strong> Solo las personas de 18 años o más pueden enviar reportes. Lo usamos para comprobarlo cada vez que envía uno, y no lo mostramos a nadie.</p>' +
      '<label class="field"><span>Contraseña (mínimo 8 caracteres)</span><input name="clave" type="password" autocomplete="new-password" required minlength="8"></label>' +
      '<label class="field"><span>Repita la contraseña</span><input name="clave2" type="password" autocomplete="new-password" required minlength="8"></label>' +
      '<label class="check"><input type="checkbox" name="acepto" required> Acepto que mis datos se usen solo para gestionar mis reportes. No se publican.</label>' +
      '<p class="err" role="alert"></p><button class="btn btn--full" type="submit">Crear cuenta</button></form>' +
      '<p>¿Ya tiene cuenta? <a class="link" href="#ingresar">Ingrese</a></p>' + sim() + "</div>";
  }

  function vistaRecuperar() {
    return '<div class="page page--tight narrow"><div class="crumbs"><a href="#ingresar">Ingresar</a> › Recuperar contraseña</div><h1>Recuperar contraseña</h1>' +
      '<form class="card form" id="f-recuperar" novalidate><label class="field"><span>Correo de su cuenta</span><input name="correo" type="email" required></label>' +
      '<p class="err" role="alert"></p><button class="btn btn--full" type="submit">Enviar enlace</button></form>' + sim() + "</div>";
  }

  function vistaCuenta() {
    var u = usuario();
    if (!u) return vistaIngresar();
    return '<div class="page page--tight narrow"><div class="crumbs"><a href="#inicio">Inicio</a> › Mi cuenta</div><h1>Hola, ' + esc(u.nombre.split(" ")[0]) + "</h1>" +
      '<div class="card"><p><strong>Correo:</strong> ' + esc(u.correo) + "</p>" +
      (edad(u.nacimiento) >= 18 ? '<p class="ok mt2">Puede enviar reportes.</p>' : '<p class="warn mt2">Puede consultar el portal. Los reportes son solo para mayores de 18 años.</p>') +
      '<div class="actions mt4"><a class="btn" href="#mis-reportes">Mis reportes</a><a class="btn btn--line" href="#reportar">Nuevo reporte</a></div></div>' +
      '<button class="btn btn--line btn--full" type="button" id="salir">Cerrar sesión</button>' + sim() + "</div>";
  }

  function vistaReportar() {
    var u = usuario();
    if (!u) {
      return '<div class="page page--tight narrow"><div class="crumbs"><a href="#inicio">Inicio</a> › Reportar</div><h1>Reportar una posible falla</h1>' +
        '<div class="card"><p>Para enviar un reporte necesita una cuenta y tener 18 años o más. Así el equipo puede contactarle si necesita más datos.</p>' +
        '<div class="actions mt4"><a class="btn" href="#ingresar">Ingresar</a><a class="btn btn--line" href="#registro">Crear cuenta</a></div></div>' +
        '<p class="small muted">¿Es una emergencia? Consulte las líneas de socorro en <a href="#canales">Canales oficiales</a>.</p>' + sim() + "</div>";
    }
    return '<div class="page page--tight narrow narrow--wide"><div class="crumbs"><a href="#inicio">Inicio</a> › Reportar</div><h1>Reportar una posible falla</h1>' +
      '<fieldset class="card field" id="paso-riesgo"><legend style="float:left;width:100%;margin-bottom:.5rem">¿Hay riesgo ahora mismo para personas o viviendas?</legend>' +
      '<div class="opts"><label><input type="radio" name="riesgo" value="si"> Sí, hay riesgo</label><label><input type="radio" name="riesgo" value="no"> No, es una falla para revisar</label></div></fieldset>' +
      '<div id="riesgo-si" class="card hidden"><strong>Este formulario no atiende emergencias.</strong><p class="mt2">Comuníquese con los organismos de socorro que aparecen en el directorio.</p><p class="mt3"><a class="btn" href="#canales">Ir a Canales oficiales</a></p></div>' +
      '<form class="card form hidden" id="f-reporte" novalidate>' +
      '<label class="field"><span>Barrio</span><select name="barrio" required><option value="">Elija…</option>' + D.barrios.map(function (b) { return '<option value="' + b.slug + '">' + esc(b.nombre) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field"><span>Canal o tramo aproximado</span><input name="tramo" required placeholder="Ej.: Canal Ricaurte, cerca del puente Pedro Romero"></label>' +
      '<label class="field"><span>Fecha en que lo vio</span><input name="fecha" type="date" required max="' + hoyISO() + '"></label>' +
      '<fieldset class="field"><legend>Tipo de falla</legend><div class="opts mt1">' + ["Obstrucción", "Acumulación de sedimentos", "Desbordamiento", "Daño visible"].map(function (t) {
        return '<label><input type="radio" name="tipo" value="' + t + '" required> ' + t + "</label>";
      }).join("") + "</div></fieldset>" +
      '<label class="field"><span>Descripción breve</span><textarea name="desc" rows="3" maxlength="400" required placeholder="¿Qué vio? ¿Dónde exactamente?"></textarea></label>' +
      '<label class="field"><span>Fotografía (opcional)</span><input name="foto" type="file" accept="image/*"></label>' +
      '<img id="foto-prev" class="foto-prev hidden" alt="Vista previa de la fotografía">' +
      '<p class="small muted">Sus datos personales no se publican. Si el equipo decide publicar el reporte, aparecerá como «Reporte ciudadano no verificado» hasta que una entidad lo confirme.</p>' +
      '<p class="err" role="alert"></p><button class="btn btn--full" type="submit">Enviar reporte</button></form>' + sim() + "</div>";
  }

  function misReportes(u) {
    var todos = store.get("cti_reportes", []);
    var mios = todos.filter(function (r) { return r.correo === u.correo; });
    if (!mios.some(function (r) { return r.demo; })) {
      var d = { id: "D-" + Date.now().toString(36).slice(-4).toUpperCase(), demo: true, correo: u.correo, barrio: "sector-central", tramo: "Canal Ricaurte, puente Pedro Romero",
        fecha: "2026-11-10", tipo: "Acumulación de sedimentos", desc: "Hay mucho lodo bajo el puente y el agua casi no pasa.",
        historial: [{ estado: "Recibido", fecha: "2026-11-10" }, { estado: "En revisión", fecha: "2026-11-12" }] };
      todos.push(d); store.set("cti_reportes", todos); mios.push(d);
    }
    return mios;
  }

  function vistaMisReportes() {
    var u = usuario();
    if (!u) return vistaIngresar();
    return '<div class="page page--tight narrow narrow--wide"><div class="crumbs"><a href="#cuenta">Mi cuenta</a> › Mis reportes</div><div class="row"><h1>Mis reportes</h1><a class="btn" href="#reportar">Nuevo reporte</a></div>' +
      '<div class="grid">' + misReportes(u).slice().reverse().map(function (r) {
        var ult = r.historial[r.historial.length - 1].estado, b = barrio(r.barrio);
        return '<a class="ocard" href="#reporte-' + r.id + '"><span class="ocard__meta">' + esc(b ? b.nombre : "") + " · " + esc(r.tramo) + '</span><span class="ocard__title">' + esc(r.tipo) + "</span>" +
          '<span class="row" style="justify-content:flex-start"><span class="rstate rs-' + norm(ult).replace(/\s/g, "") + '">' + esc(ult) + "</span>" + (r.demo ? demo() : "") + "</span>" +
          '<span class="ocard__src">Reporte ' + esc(r.id) + " · enviado el " + fecha(r.historial[0].fecha) + "</span></a>";
      }).join("") + "</div>" + sim() + "</div>";
  }

  function vistaReporte(id) {
    var u = usuario();
    if (!u) return vistaIngresar();
    var r = store.get("cti_reportes", []).filter(function (x) { return x.id === id && x.correo === u.correo; })[0];
    if (!r) return noHay();
    var b = barrio(r.barrio), ult = r.historial[r.historial.length - 1].estado;
    return '<div class="page page--tight narrow narrow--wide"><div class="crumbs"><a href="#mis-reportes">Mis reportes</a> › ' + esc(r.id) + "</div>" +
      '<div><h1>' + esc(r.tipo) + '</h1><p class="muted mt1">' + esc(b ? b.nombre : "") + " · " + esc(r.tramo) + " · visto el " + fecha(r.fecha) + "</p></div>" +
      '<ol class="timeline">' + ["Recibido", "En revisión", "Remitido"].map(function (p) {
        var h = r.historial.filter(function (x) { return x.estado === p; })[0];
        return '<li class="' + (h ? "done" : "") + '"><strong>' + p + "</strong>" + (h ? "<span>" + fecha(h.fecha) + (h.entidad ? " · enviado a " + esc(h.entidad) : "") + "</span>"
          : '<span class="muted">' + (p === "Remitido" ? "Aparece solo cuando el equipo confirme el envío a la entidad responsable." : "Pendiente") + "</span>") + "</li>";
      }).join("") + "</ol>" +
      '<div class="card"><p><strong>Descripción:</strong> ' + esc(r.desc) + "</p>" + (r.foto ? '<p class="mt1"><strong>Foto:</strong> ' + esc(r.foto) + "</p>" : "") +
      '<p class="small muted mt2">Sus datos personales son privados. Si el equipo publica este reporte, se verá como «Reporte ciudadano no verificado» hasta que exista confirmación oficial.</p></div>' +
      (ult !== "Remitido" ? '<div><button class="btn btn--line" type="button" id="simular" data-id="' + esc(r.id) + '">' + (ult === "Recibido" ? "Simular: pasar a «En revisión»" : "Simular: el equipo confirma el envío a la OAGRD") + '</button><p class="sim mt2">Botón solo para mostrar el flujo en la demostración.</p></div>' : "") +
      '<p class="small muted">¿Es una emergencia? Consulte las líneas de socorro en <a href="#canales">Canales oficiales</a>.</p></div>';
  }

  /* ---------- Goti: chat, voz y conocimiento sobre canales ---------- */

  var chatLog = [];
  var SUGS = ["¿Qué es un canal pluvial?", "¿Por qué se inunda mi barrio?", "Cuénteme del Canal Ricaurte", "¿Qué hago si llueve fuerte?", "¿Qué obras hay en San Antonio?", "¿Cuánto cuesta el mantenimiento con maquinaria?", "Números de emergencia"];

  function chatUI(id) {
    return ajustesVoz() + '<div class="chat__log" id="' + id + '-log" data-chatlog aria-live="polite"></div>' +
      '<div class="sugs" data-sugs>' + SUGS.map(function (q) { return '<button type="button">' + esc(q) + "</button>"; }).join("") + "</div>" +
      '<form class="chat__form" data-chatform><label for="' + id + '-in" class="sr-only">Escriba su pregunta</label>' +
      '<input id="' + id + '-in" autocomplete="off" placeholder="Escriba o hable…">' +
      '<button type="button" class="iconbtn mic hidden" data-mic aria-label="Hablarle a Goti">' + ico("mic") + "</button>" +
      '<button class="btn" type="submit">Enviar</button></form>';
  }

  function vistaAsistente() {
    return '<div class="chat"><div class="chat__head"><span class="goti-av" data-goti></span><div><h1>Goti</h1><p class="small muted">Le explica los canales pluviales y las obras de su barrio, y le dice de dónde salió cada dato.</p></div>' +
      vozBtn() + "</div>" + chatUI("pg") +
      sim("Segunda fase · simulación: Goti responde con reglas a partir de las fichas y de fuentes citadas. En producción, un modelo de IA respondería solo con información publicada y citaría la ficha o la fuente y su fecha.") + "</div>";
  }

  function vozBtn() {
    return '<button type="button" class="iconbtn iconbtn--sm" data-voz-ajustes aria-label="Elegir la voz de Goti">' + ico("gear") + "</button>" +
      '<button type="button" class="voz' + (voz.on ? " is-on" : "") + '" data-voz aria-pressed="' + voz.on + '">' + ico(voz.on ? "vol" : "mute") + "<span>" + (voz.on ? "Voz activada" : "Voz apagada") + "</span></button>";
  }

  // Base de conocimiento sobre canales pluviales (con fuente cuando el dato no es general).
  var F = {
    valor: "Valorización Distrital, Reporte de Buena Práctica «Sistema de Canales Pluviales», 2026",
    heraldo: "El Heraldo, 2016",
    univ12: "El Universal, 2012",
    univ24: "El Universal, abril de 2024",
    oagrd23: "OAGRD, citada por El Universal, 31 dic. 2023",
    estr25: "El Universal, 25 sep. 2025",
    bomb: "Cuerpo de Bomberos de Cartagena, citado por El Universal",
    guia: "Guía de PluviaTech"
  };
  var KB = [
    { re: /que es (un )?canal|para que sirve(n)? (un |los )?canal|canal pluvial/,
      a: "<p>Un <strong>canal pluvial</strong> es un cauce, abierto o cubierto, que recoge el agua de lluvia de calles y techos y la lleva hacia la ciénaga, la bahía o el mar. Si está limpio, el agua corre; si se tapa con basura o lodo, el agua se devuelve a las calles y casas.</p>", f: F.guia },
    { re: /cuantos canales|numero de canales|inventario/,
      a: "<p>Cartagena tiene un inventario de <strong>201 canales pluviales</strong>. Valorización Distrital los está caracterizando poco a poco: ubicación, longitud, sección, revestimiento y estado.</p>", f: F.valor },
    { re: /por que se inunda|por que hay inundacion|causa|se desborda/,
      a: "<p>Varias cosas se juntan:</p><ul><li><strong>Basura y escombros</strong> que tapan el canal y los puentes.</li><li><strong>Sedimentos</strong> (lodo y arena) que reducen el espacio para el agua.</li><li><strong>Construcciones</strong> sobre el canal o sus orillas.</li><li><strong>Más ciudad</strong>: con más calles y techos, la lluvia corre más rápido hacia los canales.</li><li>En el Canal Ricaurte, que desemboca en la Ciénaga de la Virgen, el nivel de la ciénaga también influye.</li></ul>", f: F.valor + " · " + F.univ12 },
    { re: /ricaurte/,
      a: "<p>El <strong>Canal Ricaurte</strong>:</p><ul><li>Mide más de 3 km y su zona de influencia abarca unos 30 barrios.</li><li>Desemboca en la Ciénaga de la Virgen.</li><li>Fue la prueba piloto del Sistema de Canales Pluviales de Valorización.</li><li>En 2024 la Alcaldía anunció inversión para ponerlo a punto junto con el canal Chiamaría, y la OAGRD anunció retiro de sedimentos.</li></ul><p>Sus fichas están en <a href=\"#barrios\">Barrios</a>.</p>", f: F.heraldo + " · " + F.univ12 + " · " + F.valor + " · " + F.univ24 },
    { re: /dragado|dragar|sediment/,
      a: "<p><strong>Dragar</strong> es sacar con maquinaria el lodo, la arena y la basura acumulados en el fondo del canal. Los <strong>sedimentos</strong> son ese material que trae el agua y se asienta. Si no se retiran, el canal pierde capacidad y se desborda más fácil.</p>", f: F.guia },
    { re: /limpieza|quien limpia|mantenimiento de (los )?canales/,
      a: "<p>La limpieza y el mantenimiento de canales los lideran la <strong>OAGRD</strong>, la <strong>Secretaría de Infraestructura</strong> y las <strong>tres alcaldías locales</strong>. Valorización Distrital se encarga de diseños y obras de canalización.</p>", f: F.estr25 + " · " + F.valor },
    { re: /quien (se encarga|es responsable|responde)|que entidad/,
      a: "<p>Depende de la acción:</p><ul><li><strong>Valorización Distrital</strong>: diseños y obras de canales y drenajes.</li><li><strong>OAGRD (Gestión del Riesgo)</strong>: riesgo por lluvias, limpieza y atención de afectaciones.</li><li><strong>Secretaría de Infraestructura y alcaldías locales</strong>: mantenimiento y jornadas de limpieza.</li></ul><p>Cada ficha dice qué entidad es la responsable.</p>", f: F.estr25 + " · " + F.valor },
    { re: /antes de (la )?lluvia|prevenir|como ayudo|que puedo hacer|prepar/,
      a: "<p>Antes de la temporada de lluvias:</p><ul><li>No bote basura ni escombros al canal ni a la calle.</li><li>Saque la basura en el horario de recolección.</li><li>Limpie canaletas y desagües de su casa.</li><li>Guarde documentos y medicinas en bolsas, en un lugar alto.</li><li>Tenga a mano los <a href=\"#canales\">números de emergencia</a>.</li></ul>", f: F.guia },
    { re: /llueve|durante (la )?lluvia|aguacero|arroyo|que hago si/,
      a: "<p>Si llueve fuerte:</p><ul><li><strong>No cruce arroyos ni corrientes</strong>, ni a pie ni en vehículo.</li><li>Aléjese de las orillas del canal.</li><li>Si el agua entra a su casa, desconecte la energía si puede hacerlo sin riesgo.</li><li>Si hay riesgo para personas, llame al <strong>123</strong>.</li></ul>", f: F.bomb + " · " + F.guia },
    { re: /despues de (la )?lluvia|cable|poste|afectacion|me afecto/,
      a: "<p>Después de la lluvia:</p><ul><li>No toque cables caídos; avise a Afinia al <strong>115</strong>.</li><li>Reporte daños por lluvias a Gestión del Riesgo al <strong>317 503 0465</strong> (también WhatsApp).</li><li>Si ve una falla en el canal, puede <a href=\"#reportar\">reportarla aquí</a>.</li></ul>", f: "El Universal, líneas de emergencia en Cartagena, 2025" },
    { re: /temporada|cuando llueve|meses de lluvia/,
      a: "<p>En la región Caribe las lluvias suelen concentrarse en dos temporadas: una entre abril y junio y otra, más fuerte, entre septiembre y noviembre. Siga siempre los avisos oficiales de Gestión del Riesgo.</p>", f: F.guia },
    { re: /cuanto (han )?avanz|metas|como van las (obras|metas)/,
      a: "", f: "" }, // se resuelve con las metas reales (abajo)
    { re: /basura|botar|escombro/,
      a: "<p>La basura es una de las principales causas de que los canales se tapen. Ayude así: no la bote al canal ni a la calle, sáquela en el horario de recolección y avise si ve botaderos en las orillas. La OAGRD ha señalado la falta de civismo y las construcciones sobre el agua como problemas del Canal Ricaurte.</p>", f: "OAGRD, citada por El Universal · " + F.guia },
    { re: /cuantas familias|afectad|damnific/,
      a: "<p>En la temporada de lluvias de 2023 la OAGRD registró <strong>12.181 familias afectadas</strong>, más de 45.000 personas. Tras el aguacero del 24 de octubre de 2026 se reportaron afectaciones en 10 barrios y sectores, entre ellos Olaya Herrera.</p>", f: F.oagrd23 + " · El Universal, 24 oct. 2026" }
  ];

  var SIGNIFICA = {
    "anunciada": "la Alcaldía dijo que la hará, pero aún no hay contrato ni diseño publicado.",
    "en diseno": "se están haciendo los estudios o planos; la obra todavía no empieza.",
    "contratada": "ya hay un contrato firmado, pero la obra aún no empieza o no hay avance publicado.",
    "en ejecucion": "la obra está en marcha.",
    "terminada": "la entidad informó que la obra se entregó.",
    "suspendida": "la obra se detuvo; la ficha debe indicar la razón publicada."
  };
  function citaTxt(t) { return '<span class="cite">Fuente: ' + esc(t) + "</span>"; }
  function cita(o) { return '<span class="cite">Ficha #' + o.id + " «" + esc(o.titulo) + "», verificada el " + fecha(o.verificado) + " · " + esc(o.fuente.nombre) + "</span>"; }
  function enlace(o) { return '<a href="#obra-' + o.id + '">' + esc(o.titulo) + "</a>"; }
  function txt(c, tipo) {
    if (!c) return null;
    if (c.solicitada) return "información solicitada a " + c.solicitada.entidad + " el " + fecha(c.solicitada.fecha);
    return tipo === "dinero" ? pesos(c.valor) : tipo === "fecha" ? fecha(c.valor) : c.valor + " %";
  }
  function falta(o, que) { return "<p>No hay información publicada sobre " + que + " de " + enlace(o) + ". Puede consultar a <strong>" + esc(o.entidad) + '</strong> en los <a href="#canales">canales oficiales</a>.</p>'; }
  function buscarObras(t) {
    var pal = t.replace(/[^a-z0-9ñ\s]/g, " ").split(/\s+/).filter(function (w) {
      return w.length > 3 && ["obra", "obras", "cuanto", "cuando", "cuesta", "entregan", "empieza", "canal", "como", "hay", "esta", "para"].indexOf(w) < 0;
    });
    return D.intervenciones.map(function (o) {
      var s = norm(o.titulo + " " + o.tipo + " " + o.tramo + " " + o.entidad);
      return { o: o, p: pal.filter(function (w) { return s.indexOf(w) > -1; }).length };
    }).filter(function (x) { return x.p; }).sort(function (a, b) { return b.p - a.p; }).map(function (x) { return x.o; });
  }
  function lineasHTML() {
    return "<ul>" + D.canales.filter(function (c) { return c.tel; }).map(function (c) { return "<li>" + esc(c.nombre) + ": <strong>" + esc(c.num) + "</strong></li>"; }).join("") + "</ul>";
  }

  function responder(q) {
    var t = norm(q).replace(/[¿?¡!.,;:«»"]/g, " ").replace(/\s+/g, " ");
    if (/emergencia|urgente|derrumb|peligro|se esta inundando|me estoy inundando|numero|telefono|linea|llamar|bombero|cruz roja|defensa civil/.test(t)) {
      return "<p><strong>Si hay riesgo para personas o viviendas, llame ya al 123.</strong> Yo informo sobre obras; no atiendo emergencias.</p>" + lineasHTML() + citaTxt("El Universal y El Tiempo, líneas de emergencia en Cartagena");
    }
    if (/como (uso|funciona)|ayuda|que puedes|que sabes/.test(t)) {
      return "<p>Puedo explicarle qué es un canal pluvial, por qué se inunda su barrio, qué hacer cuando llueve y quién se encarga de cada obra. También le busco una obra y le digo su estado, fechas y costo, con la fuente y la fecha.</p><p>Escriba o toque el micrófono y hábleme.</p>";
    }
    for (var k in SIGNIFICA) {
      if (/significa|quiere decir|que es/.test(t) && t.indexOf(k) > -1) return "<p>Que una obra esté «" + esc(ESTADOS.concat("Suspendida").filter(function (e) { return norm(e) === k; })[0]) + "» significa que " + SIGNIFICA[k] + "</p>" + citaTxt("Guía de estados de PluviaTech");
    }
    var obras = buscarObras(t), o = obras[0];
    // Preguntas sobre una obra concreta
    if (o && /cuanto|cuesta|costo|valor|plata|presupuesto/.test(t)) {
      var p = txt(o.presupuesto, "dinero"), c = txt(o.contratado, "dinero"), e = txt(o.ejecutado, "dinero");
      if (!p && !c && !e) return falta(o, "el costo") + cita(o);
      return "<p>Costo de " + enlace(o) + ":</p><ul><li>Presupuesto anunciado: " + (p || "no disponible") + "</li><li>Valor contratado: " + (c || "no disponible") + "</li><li>Monto ejecutado: " + (e || "no disponible") + "</li></ul>" + cita(o);
    }
    if (o && /cuando|fecha|empieza|inicia|entreg|termina/.test(t)) {
      var i = txt(o.inicio, "fecha"), s2 = txt(o.entregaEstimada, "fecha"), r = txt(o.entregaReal, "fecha");
      if (!i && !s2 && !r) return falta(o, "las fechas") + cita(o);
      return "<p>Fechas de " + enlace(o) + ":</p><ul><li>Inicio programado: " + (i || "no disponible") + "</li><li>Entrega estimada: " + (s2 || "no disponible") + "</li><li>Entrega real: " + (r || "aún no confirmada") + "</li></ul>" + cita(o);
    }
    if (o && /como va|avance|estado|progreso/.test(t)) {
      return "<p>" + enlace(o) + " está <strong>" + esc(o.estado) + "</strong>. Último avance (" + fecha(o.ultimoAvance.fecha) + "): " + esc(o.ultimoAvance.texto) + "</p><ul><li>Avance físico: " + (txt(o.avanceFisico, "pct") || "no disponible") +
        "</li><li>Avance financiero: " + (txt(o.avanceFinanciero, "pct") || "no disponible") + "</li></ul>" + cita(o);
    }
    // Conocimiento sobre canales
    for (var n = 0; n < KB.length; n++) {
      if (KB[n].re.test(t)) {
        if (!KB[n].a) {
          var C = D.contexto;
          return "<p>Así van las metas de canales de Valorización Distrital:</p><ul>" + C.metas.map(function (m) {
            return "<li>" + esc(m.meta) + ": " + num(m.ejecutado) + " de " + num(m.planeado) + " " + m.unidad + " (" + num(Math.round((m.ejecutado / m.planeado) * 1000) / 10) + " %)</li>";
          }).join("") + "</ul>" + citaTxt(C.fuente);
        }
        return KB[n].a + citaTxt(KB[n].f);
      }
    }
    var b = D.barrios.filter(function (x) { return t.indexOf(norm(x.nombre)) > -1 || t.indexOf(norm(x.nombre.replace("Sector ", ""))) > -1; })[0];
    if (b) {
      var l = obrasDe(b.slug);
      if (!l.length) return "<p>" + esc(b.nombre) + " está en evaluación y todavía no tiene fichas publicadas.</p>";
      return '<p>En <a href="#barrio-' + b.slug + '">' + esc(b.nombre) + "</a> hay " + plural(l.length, "intervención", "intervenciones") + ":</p><ul>" + l.map(function (x) { return "<li>" + enlace(x) + " — " + esc(x.estado) + "</li>"; }).join("") + "</ul>";
    }
    if (obras.length) return "<p>Encontré estas fichas:</p><ul>" + obras.slice(0, 3).map(function (x) { return "<li>" + enlace(x) + " — " + esc(x.estado) + "</li>"; }).join("") + "</ul><p>Pregúnteme por su costo, sus fechas o su avance.</p>";
    return '<p>No encontré eso en la información publicada. Puede preguntarme qué es un canal pluvial, por qué se inunda su barrio, qué hacer si llueve, o por una obra de San Antonio, Central o Ricaurte. Si necesita otra cosa, use los <a href="#canales">canales oficiales</a>.</p>';
  }

  function pintarChat() {
    var logs = document.querySelectorAll("[data-chatlog]");
    if (!logs.length) return;
    if (!chatLog.length) chatLog.push({ de: "goti", html: "<p><strong>¡Hola! Soy Goti</strong>, la gota inspectora de canales. Le explico los canales pluviales y las obras de su barrio. Puede escribirme o hablarme.</p>" });
    var html = chatLog.map(function (m, i) {
      return '<div class="msg ' + (m.de === "yo" ? "msg--yo" : "msg--goti") + '">' + m.html +
        (m.de === "goti" ? '<button type="button" class="listen" data-listen="' + i + '">' + ico("vol") + "Escuchar</button>" : "") + "</div>";
    }).join("");
    logs.forEach(function (log) { log.innerHTML = html; log.scrollTop = log.scrollHeight; });
    document.querySelectorAll("[data-mic]").forEach(function (b) { b.classList.toggle("hidden", !Reconoce); });
  }

  function preguntar(q) {
    if (!q.trim()) return;
    var r = responder(q);
    chatLog.push({ de: "yo", html: "<p>" + esc(q) + "</p>" }, { de: "goti", html: r });
    pintarChat();
    if (voz.on) hablar(r);
  }

  /* ---- Voz: Goti lee sus respuestas (síntesis de voz del navegador) ---- */

  var voz = { on: store.get("cti_voz", true), voice: null, nombre: store.get("cti_voz_nombre", ""), lista: [] };
  var puedeHablar = "speechSynthesis" in window;

  // Busca la voz más natural disponible: voces neuronales femeninas en español, cálidas y claras (estilo asistente de hogar).
  var VOCES_PREFERIDAS = [
    /salome.*(natural|online)/i,        // Microsoft Salomé (Colombia), neuronal — Edge
    /dalia.*(natural|online)/i,         // Microsoft Dalia (México), neuronal — Edge
    /paloma.*(natural|online)/i,        // Microsoft Paloma (EE. UU.), neuronal — Edge
    /(elvira|ximena).*(natural|online)/i,
    /(natural|online).*(spanish|español)/i,
    /google español de estados unidos/i, // Chrome
    /google español/i,
    /paulina|m[oó]nica|marisol|angelica/i, // Apple (iPhone, Mac)
    /sabina|helena|laura/i              // Windows sin conexión
  ];
  function puntaje(v) {
    for (var i = 0; i < VOCES_PREFERIDAS.length; i++) if (VOCES_PREFERIDAS[i].test(v.name)) return 100 - i * 5 + (/es[-_]CO/i.test(v.lang) ? 3 : 0);
    return /^es/i.test(v.lang) ? 10 : 0;
  }
  function elegirVoz() {
    if (!puedeHablar) return;
    voz.lista = window.speechSynthesis.getVoices().filter(function (v) { return /^es/i.test(v.lang); })
      .sort(function (a, b) { return puntaje(b) - puntaje(a); });
    voz.voice = voz.lista.filter(function (v) { return v.name === voz.nombre; })[0] || voz.lista[0] || null;
    document.querySelectorAll("[data-voces]").forEach(function (sel) { sel.innerHTML = opcionesVoz(); });
  }
  function opcionesVoz() {
    if (!voz.lista.length) return '<option value="">Voz del sistema</option>';
    return voz.lista.map(function (v) {
      var n = v.name.replace(/^Microsoft /, "").replace(/ Online \(Natural\)/, " (natural)");
      return '<option value="' + esc(v.name) + '"' + (voz.voice && v.name === voz.voice.name ? " selected" : "") + ">" + esc(n) + " · " + esc(v.lang) + "</option>";
    }).join("");
  }
  function ajustesVoz() {
    return '<div class="voces hidden" data-voces-panel><label class="field"><span>Voz de Goti</span><select data-voces>' + opcionesVoz() + "</select></label>" +
      '<button type="button" class="btn btn--line" data-probar>' + ico("vol") + "Probar</button></div>";
  }
  if (puedeHablar) { elegirVoz(); window.speechSynthesis.onvoiceschanged = elegirVoz; }

  function textoPlano(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    d.querySelectorAll(".cite").forEach(function (c) { c.textContent = ". " + c.textContent.replace("Fuente:", "Fuente,") ; });
    d.querySelectorAll("li").forEach(function (li) { li.textContent = li.textContent + ". "; });
    return d.textContent.replace(/\$/g, "").replace(/\s+/g, " ").replace(/ %/g, " por ciento").trim();
  }
  function hablar(html) {
    if (!puedeHablar) { toast("Su navegador no puede leer en voz alta."); return; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(textoPlano(html));
    u.lang = voz.voice ? voz.voice.lang : "es-CO";
    if (voz.voice) u.voice = voz.voice;
    u.rate = 1; u.pitch = 1.05; // ritmo natural, tono cálido
    u.onstart = function () { document.body.classList.add("goti-habla"); };
    u.onend = u.onerror = function () { document.body.classList.remove("goti-habla"); };
    window.speechSynthesis.speak(u);
  }
  function callar() { if (puedeHablar) window.speechSynthesis.cancel(); document.body.classList.remove("goti-habla"); }

  /* ---- Micrófono: dictar la pregunta (si el navegador lo permite) ---- */

  var Reconoce = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  function escuchar(btn) {
    if (!Reconoce) return;
    callar();
    var rec = new Reconoce();
    rec.lang = "es-CO"; rec.interimResults = false; rec.maxAlternatives = 1;
    btn.classList.add("is-rec");
    rec.onresult = function (e) { preguntar(e.results[0][0].transcript); };
    rec.onerror = function () { toast("No pude oírle. Revise el permiso del micrófono o escriba su pregunta."); };
    rec.onend = function () { btn.classList.remove("is-rec"); };
    try { rec.start(); } catch (e) { btn.classList.remove("is-rec"); }
  }

  /* ---- Goti flotante (en todas las páginas) ---- */

  function montarFlotante() {
    var w = document.createElement("div");
    w.className = "fab";
    w.innerHTML =
      '<div class="fab__panel hidden" id="fab-panel" role="dialog" aria-label="Chat con Goti">' +
      '<div class="fab__head"><span class="goti-av" data-goti></span><div><strong>Goti</strong><span>Asistente de PluviaTech</span></div>' + vozBtn() +
      '<button type="button" class="iconbtn" id="fab-cerrar" aria-label="Cerrar">' + ico("x") + "</button></div>" +
      chatUI("fab") + "</div>" +
      '<div class="fab__stack">' +
      '<button type="button" class="fab__hi" id="fab-hi">Hola, soy <strong>Goti</strong>. ¿Le ayudo?</button>' +
      '<button type="button" class="fab__goti" id="fab-open" aria-label="Abrir el chat con Goti"><span data-goti></span></button>' +
      '<button type="button" class="fab__btn" id="fab-a11y" aria-pressed="false" aria-label="Agrandar el texto">' + ico("a11y") + "</button>" +
      "</div>";
    document.body.appendChild(w);
    pintar(w);
    setTimeout(function () { var h = document.getElementById("fab-hi"); if (h) h.classList.add("is-gone"); }, 9000);
  }
  function abrirFab() {
    document.getElementById("fab-panel").classList.remove("hidden");
    document.getElementById("fab-hi").classList.add("is-gone");
    pintarChat();
    var i = document.getElementById("fab-in"); if (i) i.focus();
  }

  function noHay() { return '<div class="page page--tight"><h1 style="padding-top:1rem">No encontramos esta página</h1><p><a class="link" href="#inicio">Volver al inicio</a></p></div>'; }

  /* ================= Enrutador ================= */

  function ruta() {
    var h = (location.hash || "#inicio").slice(1) || "inicio", m;
    if ((m = h.match(/^barrio-(.+)$/))) return [vistaBarrio(m[1]), "barrios"];
    if ((m = h.match(/^obra-(\d+)$/))) return [vistaObra(m[1]), "barrios"];
    if ((m = h.match(/^reporte-(.+)$/))) return [vistaReporte(m[1]), "cuenta"];
    var r = {
      inicio: [vistaInicio, "inicio"], barrios: [vistaBarrios, "barrios"], canales: [vistaCanales, "canales"], asistente: [vistaAsistente, "asistente"],
      ingresar: [vistaIngresar, "cuenta"], registro: [vistaRegistro, "cuenta"], recuperar: [vistaRecuperar, "cuenta"], cuenta: [vistaCuenta, "cuenta"],
      reportar: [vistaReportar, "reportar"], "mis-reportes": [vistaMisReportes, "cuenta"]
    }[h];
    return r ? [r[0](), r[1]] : [noHay(), ""];
  }

  function render() {
    var r = ruta();
    main.innerHTML = r[0];
    pintar(main);
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === r[1]) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    var u = usuario();
    document.getElementById("nav-cuenta-desk").textContent = u ? "Mi cuenta" : "Ingresar";
    document.getElementById("nav-cuenta-mob").textContent = u ? "Mi cuenta" : "Cuenta";
    var h1 = main.querySelector("h1");
    document.title = (h1 && r[1] !== "inicio" ? h1.textContent + " · PluviaTech" : "PluviaTech · Innovación tecnológica aplicada al drenaje pluvial");
    var fab = document.querySelector(".fab");
    if (fab) { fab.classList.toggle("hidden", r[1] === "asistente"); if (r[1] === "asistente") document.getElementById("fab-panel").classList.add("hidden"); }
    pintarChat();
    if (instalarEvt) { var bi = document.getElementById("instalar"); if (bi) bi.classList.remove("hidden"); }
    window.scrollTo(0, 0);
  }

  /* ================= Eventos ================= */

  document.addEventListener("input", function (e) {
    if (e.target.id !== "q") return;
    var q = norm(e.target.value.trim()), box = document.getElementById("res");
    if (q.length < 2) { box.classList.add("hidden"); return; }
    var res = D.intervenciones.filter(function (o) { return norm(o.titulo + " " + o.tipo + " " + o.tramo + " " + barrio(o.barrio).nombre).indexOf(q) > -1; });
    box.innerHTML = "<h2>Resultados (" + res.length + ")</h2>" + (res.length ? '<div class="grid g2 mt3">' + res.map(ocard).join("") + "</div>"
      : '<p class="muted mt2">No hay fichas con esa palabra. Pruebe con el nombre de su barrio o pregúntele a <a class="link" href="#asistente">Goti</a>.</p>');
    box.classList.remove("hidden");
  });

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-print]")) { try { window.print(); } catch (err) { toast("Use la opción Imprimir de su navegador."); } return; }
    var sb = t.closest("[data-sugs] button"); if (sb) { preguntar(sb.textContent); return; }
    var li = t.closest("[data-listen]"); if (li) { hablar(chatLog[+li.getAttribute("data-listen")].html); return; }
    if (t.closest("[data-voz]")) {
      voz.on = !voz.on; store.set("cti_voz", voz.on);
      if (!voz.on) callar();
      document.querySelectorAll("[data-voz]").forEach(function (b) {
        b.classList.toggle("is-on", voz.on); b.setAttribute("aria-pressed", voz.on);
        b.innerHTML = ico(voz.on ? "vol" : "mute") + "<span>" + (voz.on ? "Voz activada" : "Voz apagada") + "</span>";
      });
      toast(voz.on ? "Goti leerá sus respuestas en voz alta." : "Voz apagada.");
      return;
    }
    var pb = t.closest("[data-panel]");
    if (pb) {
      var abierto = pb.getAttribute("aria-expanded") === "true";
      pb.setAttribute("aria-expanded", String(!abierto));
      pb.querySelector(".panel__lbl").textContent = abierto ? "Ver información" : "Ocultar información";
      document.getElementById(pb.getAttribute("aria-controls")).hidden = abierto;
      pb.closest(".panel").classList.toggle("is-open", !abierto);
      return;
    }
    var aq = t.closest("[data-adj-quitar]");
    if (aq) { limpiarAdjunto(aq.closest("form")); toast("Imagen quitada."); return; }
    var vb = t.closest("[data-voz-ajustes]");
    if (vb) { var box = vb.closest(".fab__panel, .chat").querySelector("[data-voces-panel]"); if (box) box.classList.toggle("hidden"); return; }
    if (t.closest("[data-probar]")) { hablar("<p>¡Hola! Soy Goti, la gota inspectora de canales. Así sonaré cuando le responda.</p>"); return; }
    var mb = t.closest("[data-mic]"); if (mb) { escuchar(mb); return; }
    if (t.closest("#fab-open")) { var pn = document.getElementById("fab-panel"); if (pn.classList.contains("hidden")) abrirFab(); else { pn.classList.add("hidden"); callar(); } return; }
    if (t.closest("#fab-hi")) { abrirFab(); return; }
    if (t.closest("#fab-cerrar")) { document.getElementById("fab-panel").classList.add("hidden"); callar(); return; }
    var ab = t.closest("#fab-a11y");
    if (ab) { var on = document.documentElement.classList.toggle("big"); ab.setAttribute("aria-pressed", on); toast(on ? "Texto más grande." : "Texto normal."); return; }
    if (t.id === "salir") { store.del("cti_sesion"); toast("Cerró sesión."); location.hash = "#inicio"; return; }
    if (t.id === "simular") {
      var id = t.getAttribute("data-id"), todos = store.get("cti_reportes", []);
      todos.forEach(function (r) {
        if (r.id !== id) return;
        var ult = r.historial[r.historial.length - 1].estado;
        if (ult === "Recibido") r.historial.push({ estado: "En revisión", fecha: hoyISO() });
        else if (ult === "En revisión") r.historial.push({ estado: "Remitido", fecha: hoyISO(), entidad: "OAGRD" });
      });
      store.set("cti_reportes", todos); render(); return;
    }
    if (t.id === "instalar" && instalarEvt) { instalarEvt.prompt(); instalarEvt = null; t.classList.add("hidden"); }
  });

  function limpiarAdjunto(f) {
    var inp = f.querySelector("[data-adjunto]"), prev = f.querySelector("[data-adj-prev]");
    inp.value = "";
    var img = prev.querySelector("img"); if (img.src) URL.revokeObjectURL(img.src); img.removeAttribute("src");
    prev.classList.add("hidden");
    f.querySelector("[data-adj-lbl]").textContent = "Adjuntar imagen";
  }

  document.addEventListener("keydown", function (e) {
    var l = e.target.closest && e.target.closest(".adj__btn");
    if (l && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); document.getElementById(l.getAttribute("for")).click(); }
  });

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-adjunto")) {
      var fo = t.closest("form"), file = t.files && t.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) { toast("Elija una imagen (JPG, PNG…)."); t.value = ""; return; }
      if (file.size > 5 * 1024 * 1024) { toast("La imagen pesa más de 5 MB. Elija una más liviana."); t.value = ""; return; }
      var pv = fo.querySelector("[data-adj-prev]"), im = pv.querySelector("img");
      if (im.src) URL.revokeObjectURL(im.src);
      im.src = URL.createObjectURL(file);
      fo.querySelector("[data-adj-nombre]").textContent = file.name + " · " + Math.max(1, Math.round(file.size / 1024)) + " KB";
      pv.classList.remove("hidden");
      fo.querySelector("[data-adj-lbl]").textContent = "Reemplazar imagen";
      return;
    }
    if (t.hasAttribute("data-voces")) {
      voz.voice = voz.lista.filter(function (v) { return v.name === t.value; })[0] || voz.voice;
      voz.nombre = voz.voice ? voz.voice.name : ""; store.set("cti_voz_nombre", voz.nombre);
      document.querySelectorAll("[data-voces]").forEach(function (sl) { sl.value = voz.nombre; });
      hablar("<p>Listo, ahora hablo con esta voz.</p>");
      return;
    }
    if (t.name === "riesgo") {
      document.getElementById("riesgo-si").classList.toggle("hidden", t.value !== "si");
      document.getElementById("f-reporte").classList.toggle("hidden", t.value !== "no");
    }
    if (t.name === "foto" && t.files && t.files[0]) {
      var img = document.getElementById("foto-prev");
      img.src = URL.createObjectURL(t.files[0]); img.classList.remove("hidden");
    }
  });

  function err(f, m) { f.querySelector(".err").textContent = m; }

  document.addEventListener("submit", function (e) {
    var f = e.target, v = {};
    e.preventDefault();
    new FormData(f).forEach(function (val, k) { v[k] = val; });

    if (f.hasAttribute("data-feedback")) {
      var l = store.get("cti_opiniones", []);
      var adj = f.querySelector("[data-adjunto]");
      var archivo = adj && adj.files && adj.files[0] ? adj.files[0].name : "";
      l.push({ lugar: f.getAttribute("data-feedback"), ok: v.ok, falta: v.falta || "", imagen: archivo, fecha: HOY.toISOString() });
      store.set("cti_opiniones", l);
      f.innerHTML = '<p class="ok">Gracias. Recibimos su sugerencia' + (archivo ? " con la imagen «" + esc(archivo) + "»" : "") + ". Nos ayuda a mejorar el portal.</p>";
      return;
    }
    if (f.hasAttribute("data-chatform")) { var inp = f.querySelector("input"); preguntar(inp.value); inp.value = ""; inp.focus(); return; }
    if (f.id === "f-registro") {
      if (!v.nombre || !v.correo || !v.nacimiento || !v.clave) return err(f, "Complete todos los campos.");
      if (!/^\S+@\S+\.\S+$/.test(v.correo)) return err(f, "Revise el correo electrónico.");
      if (v.clave.length < 8) return err(f, "La contraseña debe tener al menos 8 caracteres.");
      if (v.clave !== v.clave2) return err(f, "Las contraseñas no coinciden.");
      if (!v.acepto) return err(f, "Debe aceptar el uso de sus datos para gestionar reportes.");
      var c = v.correo.trim().toLowerCase();
      store.set("cti_usuario", { nombre: v.nombre.trim(), correo: c, nacimiento: v.nacimiento });
      store.set("cti_sesion", c);
      toast(edad(v.nacimiento) >= 18 ? "Cuenta creada. Ya puede enviar reportes." : "Cuenta creada. Podrá enviar reportes cuando cumpla 18 años.");
      location.hash = "#cuenta"; return;
    }
    if (f.id === "f-login") {
      var u = store.get("cti_usuario", null), co = (v.correo || "").trim().toLowerCase();
      if (!co || !v.clave) return err(f, "Escriba su correo y su contraseña.");
      if (!u || u.correo !== co) return err(f, "No encontramos una cuenta con ese correo en este dispositivo. Regístrese primero.");
      store.set("cti_sesion", co); toast("Bienvenido de nuevo."); location.hash = "#cuenta"; return;
    }
    if (f.id === "f-recuperar") {
      if (!/^\S+@\S+\.\S+$/.test(v.correo || "")) return err(f, "Revise el correo electrónico.");
      f.innerHTML = '<p class="ok">Si el correo está registrado, le enviaremos un enlace para crear una nueva contraseña.</p>'; return;
    }
    if (f.id === "f-reporte") {
      var yo = usuario();
      if (!yo) { location.hash = "#ingresar"; return; }
      if (edad(yo.nacimiento) < 18) return err(f, "Los reportes son solo para personas de 18 años o más. Puede seguir consultando el portal.");
      if (!v.barrio || !v.tramo || !v.fecha || !v.tipo || !(v.desc || "").trim()) return err(f, "Complete barrio, tramo, fecha, tipo de falla y descripción.");
      var todos = store.get("cti_reportes", []), id = "R-" + Date.now().toString(36).slice(-5).toUpperCase();
      todos.push({ id: id, correo: yo.correo, barrio: v.barrio, tramo: v.tramo, fecha: v.fecha, tipo: v.tipo, desc: v.desc.trim(),
        foto: f.foto.files && f.foto.files[0] ? f.foto.files[0].name : "", historial: [{ estado: "Recibido", fecha: hoyISO() }] });
      store.set("cti_reportes", todos); toast("Reporte recibido."); location.hash = "#reporte-" + id;
    }
  });

  /* ================= PWA ================= */

  var instalarEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); instalarEvt = e;
    var b = document.getElementById("instalar"); if (b) b.classList.remove("hidden");
  });
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    try { navigator.serviceWorker.register("sw.js").catch(function () {}); } catch (e) { /* no disponible */ }
  }

  pintar(document);
  montarFlotante();
  window.addEventListener("hashchange", render);
  render();
})();
