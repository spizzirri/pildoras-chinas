(function () {
  const lista = document.getElementById("vista-lista");
  const detalleVista = document.getElementById("vista-detalle");
  const grilla = document.getElementById("grilla");
  const detalle = document.getElementById("detalle");
  let pildoras = [];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inlineMarkdown(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1<em>$2</em>");
    return html;
  }

  function markdownToHtml(src) {
    const blocks = String(src).trim().split(/\n{2,}/);
    return blocks.map(function (block) {
      const lines = block.split("\n");
      const isList = lines.every(function (line) {
        return /^\s*[-*]\s+/.test(line);
      });
      if (isList) {
        const items = lines.map(function (line) {
          return "<li>" + inlineMarkdown(line.replace(/^\s*[-*]\s+/, "")) + "</li>";
        }).join("");
        return "<ul>" + items + "</ul>";
      }
      return "<p>" + lines.map(inlineMarkdown).join("<br>") + "</p>";
    }).join("");
  }

  function formatoFecha(iso) {
    const partes = iso.split("-").map(Number);
    if (partes.length !== 3) return escapeHtml(iso);
    const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
    return fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function buscar(id) {
    return pildoras.find(function (item) { return item.id === id; });
  }

  function renderLista() {
    grilla.innerHTML = pildoras.map(function (item) {
      return (
        "<a class=\"tarjeta\" href=\"#/pildora/" + encodeURIComponent(item.id) + "\">" +
          "<img src=\"" + escapeHtml(item.image) + "\" alt=\"\">" +
          "<div class=\"tarjeta-cuerpo\">" +
            "<p class=\"meta\"><time datetime=\"" + escapeHtml(item.date) + "\">" +
              formatoFecha(item.date) + "</time> · " + escapeHtml(item.category) + "</p>" +
            "<h3>" + escapeHtml(item.emoji ? item.emoji + " " : "") + escapeHtml(item.title) + "</h3>" +
          "</div>" +
        "</a>"
      );
    }).join("");
  }

  function renderDetalle(item) {
    const fuentes = (item.sources || []).map(function (fuente) {
      return (
        "<li><a href=\"" + escapeHtml(fuente.url) + "\" rel=\"noopener noreferrer\" target=\"_blank\">" +
          escapeHtml(fuente.title) + "</a></li>"
      );
    }).join("");

    detalle.innerHTML =
      "<div class=\"detalle-card\">" +
        "<img src=\"" + escapeHtml(item.image) + "\" alt=\"\">" +
        "<div class=\"detalle-texto\">" +
          "<p class=\"meta\"><time datetime=\"" + escapeHtml(item.date) + "\">" +
            formatoFecha(item.date) + "</time> · " + escapeHtml(item.category) + "</p>" +
          "<h2>" + escapeHtml(item.emoji ? item.emoji + " " : "") + escapeHtml(item.title) + "</h2>" +
          "<div class=\"prosa\">" + markdownToHtml(item.body) + "</div>" +
          (fuentes ? "<section class=\"fuentes\"><h3>Fuentes</h3><ol>" + fuentes + "</ol></section>" : "") +
        "</div>" +
      "</div>";
  }

  function mostrar(vista) {
    const irALista = vista === "lista";
    lista.hidden = !irALista;
    detalleVista.hidden = irALista;
    lista.classList.toggle("vista-activa", irALista);
    detalleVista.classList.toggle("vista-activa", !irALista);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function rutear() {
    const hash = window.location.hash || "#/";
    const match = hash.match(/^#\/pildora\/(.+)$/);
    if (match) {
      const item = buscar(decodeURIComponent(match[1]));
      if (!item) {
        detalle.innerHTML = "<p class=\"vacio\">No encontré esa píldora.</p>";
      } else {
        renderDetalle(item);
      }
      mostrar("detalle");
      return;
    }
    mostrar("lista");
  }

  fetch("pildoras.json")
    .then(function (respuesta) {
      if (!respuesta.ok) throw new Error("No se pudo leer pildoras.json");
      return respuesta.json();
    })
    .then(function (datos) {
      pildoras = Array.isArray(datos) ? datos : [];
      if (!pildoras.length) {
        grilla.innerHTML = "<p class=\"vacio\">Todavía no hay píldoras para mostrar.</p>";
        return;
      }
      renderLista();
      rutear();
    })
    .catch(function () {
      grilla.innerHTML = "<p class=\"error\">No pude cargar las píldoras. Abrí el sitio desde un servidor local para que el navegador pueda leer el JSON.</p>";
    });

  window.addEventListener("hashchange", rutear);
})();
