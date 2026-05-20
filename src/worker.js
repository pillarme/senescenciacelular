// senescenciacelular.com — Cloudflare Worker
// Static assets + HTMLRewriter that injects site-wide FAQPage and BreadcrumbList
// JSON-LD on every HTML page, plus skip-links and SW-friendly headers.
//
// Every planned slug is now built (100 articles + landings + utility pages).
// We keep the coming-soon mechanism in case future slugs are added.

const BUILT = new Set([
  "/",
  "/senescencia-celular/",
  "/tu-estrogeno-hormona-longevidad/",
  "/dasatinib-quercetina-senoliticos/",
  "/hallmarks-envejecimiento/",
  "/fuentes-cientificas/",
  "/preguntas-frecuentes/",
  "/coming-soon/",
  "/404/",
  "/sobre/",
  "/buscar/",
  // Pillar 02 (15/15)
  "/que-es-celula-senescente/",
  "/sasp-secreto-inflamatorio/",
  "/fisetina-flavonoide-senolitico/",
  "/senoliticos-eliminar-celulas-viejas/",
  "/marcadores-senescencia-p16-p21-galactosidasa/",
  "/rapamicina-mtor-mujeres/",
  "/metformina-geroprotector/",
  "/espermidina-autofagia/",
  "/nad-senescencia/",
  "/glp1-geroprotectores/",
  "/acarbosa-longevidad/",
  "/senomorficos-silenciar-sasp/",
  "/futuro-senoliticos-clinicos/",
  "/senescencia-enfermedad-modelo-unificado/",
  // Pillar 03 (16/15 + viral seed)
  "/estrogeno-longevidad/",
  "/receptores-estrogeno-er-alpha-beta-gper/",
  "/estrogeno-mitocondrial/",
  "/keeps-trial-terapia-hormonal-senescencia/",
  "/elite-trial-ventana-oportunidad/",
  "/whi-revisitado/",
  "/estradiol-transdermico-superior/",
  "/estrogeno-autofagia-mitocondrial-rab9/",
  "/ooforectomia-temprana-envejecimiento/",
  "/estrogeno-hueso-usp10-p53/",
  "/estrogeno-cerebro/",
  "/estrogeno-telomeros/",
  "/estrogeno-reparacion-adn/",
  "/estrogeno-stress-oxidativo/",
  "/estrogeno-arterias/",
  // Pillar 04 (11/10)
  "/envejecimiento-ovarico/",
  "/reserva-ovarica/",
  "/amh-hormona-antimulleriana/",
  "/atrofia-ovarica/",
  "/senoliticos-fertilidad/",
  "/oopause/",
  "/preservacion-fertilidad/",
  "/insuficiencia-ovarica-primaria/",
  "/endometriosis-envejecimiento-celular/",
  "/adenomiosis-sasp-uterino/",
  "/microbioma-vaginal-senescencia/",
  // Pillar 05 (11/10)
  "/piel-senescencia/",
  "/piel-organo-senescencia/",
  "/fotoenvejecimiento-vs-cronoenvejecimiento/",
  "/colageno-tipo-i-iii-piel-femenina/",
  "/retinoides-evidencia/",
  "/vitamina-c-topica/",
  "/niacinamida-senescencia-dermica/",
  "/peptidos-piel/",
  "/estrogeno-topico-piel/",
  "/microneedling-radiofrecuencia-laser/",
  "/paradoja-piel-hispana-fitzpatrick/",
  // Pillar 06 (11/10)
  "/biomarcadores-envejecimiento/",
  "/edad-biologica-vs-cronologica/",
  "/reloj-epigenetico-horvath/",
  "/grimage-predictor-mortalidad/",
  "/dunedinpace-velocidad-envejecimiento/",
  "/telomeros-como-medirlos/",
  "/proteomica-envejecimiento/",
  "/metabolomica-envejecimiento/",
  "/inflammaging-hscrp-il6-tnf/",
  "/glycanage-edad-glicanos/",
  "/elegir-prueba-envejecimiento-latam-espana/",
  // Pillar 07 (16/15)
  "/suplementos-evidencia/",
  "/nmn-vs-nr-nad-precursores/",
  "/resveratrol-funciona/",
  "/pterostilbeno-longevidad/",
  "/espermidina-evidencia/",
  "/urolitina-a-mitocondrias/",
  "/glicina-nac-glynac/",
  "/coenzima-q10-ubiquinol/",
  "/magnesio-l-treonato-cerebro/",
  "/sulforafano-nrf2/",
  "/curcumina-biodisponibilidad/",
  "/berberina-metformina-natural/",
  "/astaxantina-senescencia/",
  "/quercetina-senolitico-natural/",
  "/fisetina-dosis-senolitica/",
  "/marcas-suplementos-confiables/",
  // Pillar 08 (11/10)
  "/ciencia-traducida/",
  "/como-leer-paper-pubmed/",
  "/revision-sistematica-explicada/",
  "/evaluar-suplemento-evidencia/",
  "/evaluar-clinica-longevidad/",
  "/voces-cientificas-envejecimiento/",
  "/centros-investigacion-envejecimiento/",
  "/glosario-senescencia-autofagia-mtor-sasp/",
  "/cronologia-ciencia-envejecimiento/",
  "/boom-clinicas-longevidad/",
  "/futuro-ciencia-femenina-envejecimiento/",
  // Pillar 01 (15/15)
  "/12-hallmarks-envejecimiento/",
  "/inestabilidad-genomica-mujeres/",
  "/acortamiento-telomeros-diferencias-sexo/",
  "/alteraciones-epigeneticas-estrogeno/",
  "/perdida-proteostasis/",
  "/autofagia-disfuncional/",
  "/desregulacion-deteccion-nutrientes-mtor-ampk/",
  "/disfuncion-mitocondrial-femenina/",
  "/agotamiento-celulas-madre/",
  "/comunicacion-intercelular-alterada/",
  "/inflamacion-cronica-inflammaging/",
  "/disbiosis-microbioma/",
  "/hallmarks-envejecimiento-ovarico/",
  "/hallmarks-envejecimiento-piel-femenina/",
]);

const PLANNED = []; // empty — every slug is built

// Pretty labels for breadcrumb generation
const BREADCRUMB_LABELS = {
  "/": "Inicio",
  "senescencia-celular": "Senescencia celular",
  "hallmarks-envejecimiento": "Hallmarks",
  "estrogeno-longevidad": "Estrógeno",
  "envejecimiento-ovarico": "Ovárico",
  "piel-senescencia": "Piel",
  "biomarcadores-envejecimiento": "Biomarcadores",
  "suplementos-evidencia": "Suplementos",
  "ciencia-traducida": "Ciencia traducida",
  "preguntas-frecuentes": "FAQ",
  "fuentes-cientificas": "Bibliografía",
  "buscar": "Buscar",
  "sobre": "Sobre",
  "tu-estrogeno-hormona-longevidad": "Estrógeno y longevidad",
};

function prettifySlug(slug) {
  if (BREADCRUMB_LABELS[slug]) return BREADCRUMB_LABELS[slug];
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bMtor\b/i, "mTOR")
    .replace(/\bAmpk\b/i, "AMPK")
    .replace(/\bNad\b/i, "NAD+")
    .replace(/\bSasp\b/i, "SASP")
    .replace(/\bAmh\b/i, "AMH")
    .replace(/\bGlp1\b/i, "GLP-1")
    .replace(/\bWhi\b/i, "WHI")
    .replace(/\bKeeps\b/i, "KEEPS")
    .replace(/\bElite\b/i, "ELITE")
    .replace(/\bPi51\b/i, "p53");
}

function buildBreadcrumb(pathname, origin) {
  const parts = pathname.split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Inicio", item: origin + "/" },
  ];
  let acc = "";
  parts.forEach((slug, idx) => {
    acc += "/" + slug;
    items.push({
      "@type": "ListItem",
      position: idx + 2,
      name: prettifySlug(slug),
      item: origin + acc + "/",
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// Site-wide FAQ — injected on every HTML page so every URL ships a FAQPage.
// Topical for cellular senescence, estrogen, female longevity — applicable
// to any page on this site.
const SITE_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es la senescencia celular?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La senescencia celular es un estado en el que la célula deja de dividirse de forma permanente pero permanece metabólicamente activa, secretando un cóctel inflamatorio llamado SASP (senescence-associated secretory phenotype). Es uno de los 12 hallmarks del envejecimiento descritos por López-Otín 2023 y se acumula con la edad contribuyendo a enfermedades como fibrosis, osteoporosis, sarcopenia, aterosclerosis y deterioro cognitivo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Por qué las mujeres envejecen distinto a nivel celular?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El estrógeno suprime la senescencia celular: reduce el daño al ADN, baja el estrés oxidativo a través de receptores mitocondriales y previene el SASP. Tras la menopausia, las mujeres muestran acortamiento acelerado de telómeros y aumento de marcadores de senescencia como GDF15, TNFR1 y FAS. El estrógeno es funcionalmente una hormona longevidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿La terapia hormonal sustitutiva retrasa el envejecimiento celular?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El sub-estudio del ensayo KEEPS de Mayo Clinic demostró que tanto el estrógeno equino conjugado oral como el 17β-estradiol transdérmico redujeron significativamente los marcadores séricos de senescencia GDF15, TNFR1 y FAS frente a placebo en mujeres recientemente menopáusicas. Es evidencia mecanística directa de que la terapia hormonal actúa sobre la maquinaria celular del envejecimiento — no solo sobre los síntomas vasomotores.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué son los senolíticos y funcionan en humanos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los senolíticos son fármacos o compuestos que eliminan selectivamente las células senescentes. La combinación pionera dasatinib + quercetina, desarrollada en Mayo Clinic por James Kirkland, ha mostrado eficacia en ensayos humanos de fibrosis pulmonar idiopática y diabetes. Fisetina es el senolítico natural más potente identificado en estudios preclínicos. La evidencia humana es todavía temprana pero prometedora.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se mide la edad biológica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Con relojes epigenéticos basados en patrones de metilación del ADN. Los más usados son el reloj de Horvath, GrimAge (predictor de mortalidad), DunedinPACE (velocidad de envejecimiento) y PhenoAge. Métricas complementarias incluyen longitud de telómeros, proteómica (SomaLogic, Olink), GlycanAge y marcadores de inflammaging como hs-CRP, IL-6 y TNF-α.",
      },
    },
  ],
};

const SITE_FAQ_JSON = JSON.stringify(SITE_FAQ);

class HeadInjector {
  constructor(pathname, origin) {
    this.pathname = pathname;
    this.origin = origin;
  }
  element(el) {
    const breadcrumb = buildBreadcrumb(this.pathname, this.origin);
    const blocks = [
      `<script type="application/ld+json" data-injected="breadcrumb">${JSON.stringify(breadcrumb)}</script>`,
      `<script type="application/ld+json" data-injected="faq">${SITE_FAQ_JSON}</script>`,
    ].join("");
    el.append(blocks, { html: true });
  }
}

class BodyInjector {
  element(el) {
    // Inject skip-link as first child of <body>, idempotent enough (extra
    // skip link with same target is harmless for accessibility).
    el.prepend(
      `<a class="skip-link" href="#main">Saltar al contenido</a>`,
      { html: true }
    );
  }
}

// Make the Google Fonts stylesheet non-render-blocking on every page
// (the homepage already does this; the handler skips pages already done).
class FontAsync {
  element(el) {
    const href = el.getAttribute("href") || "";
    if (
      href.includes("fonts.googleapis.com/css") &&
      el.getAttribute("media") !== "print"
    ) {
      el.setAttribute("media", "print");
      el.setAttribute("onload", "this.media='all'");
    }
  }
}

function normalize(pathname) {
  if (pathname === "" || pathname === "/") return "/";
  if (pathname.includes(".")) return pathname;
  return pathname.endsWith("/") ? pathname : pathname + "/";
}

function securityHeaders(headers = new Headers()) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  headers.set("Vary", "Accept-Encoding");
  return headers;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = normalize(url.pathname);

    // Static assets passthrough
    if (
      url.pathname.startsWith("/assets/") ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/sitemap.xml" ||
      url.pathname === "/feed.xml" ||
      url.pathname === "/manifest.webmanifest" ||
      url.pathname === "/sw.js" ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/favicon.svg"
    ) {
      const res = await env.ASSETS.fetch(request);
      const headers = securityHeaders(new Headers(res.headers));
      if (url.pathname.startsWith("/assets/")) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
      } else if (url.pathname === "/sw.js") {
        headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      } else {
        headers.set("Cache-Control", "public, max-age=3600");
      }
      return new Response(res.body, { status: res.status, headers });
    }

    // Built HTML page — fetch, then inject JSON-LD + skip-link
    if (BUILT.has(path)) {
      const res = await env.ASSETS.fetch(request);
      const headers = securityHeaders(new Headers(res.headers));
      headers.set("Cache-Control", "public, max-age=300, s-maxage=3600");
      headers.set("Content-Type", "text/html; charset=utf-8");

      const rewriter = new HTMLRewriter()
        .on("head", new HeadInjector(path, url.origin))
        .on('link[rel="stylesheet"]', new FontAsync())
        .on("body", new BodyInjector());
      const transformed = rewriter.transform(new Response(res.body, { status: res.status, headers }));
      return transformed;
    }

    // Planned not built → 302
    if (PLANNED.includes(path)) {
      const target = new URL("/coming-soon/", url);
      target.searchParams.set("from", path);
      return new Response(null, {
        status: 302,
        headers: securityHeaders(new Headers({ Location: target.toString() })),
      });
    }

    // 404
    const notFound = await env.ASSETS.fetch(new Request(new URL("/404/", url)));
    const headers = securityHeaders(new Headers(notFound.headers));
    headers.set("Content-Type", "text/html; charset=utf-8");
    return new Response(notFound.body, { status: 404, headers });
  },
};
