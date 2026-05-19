// senescenciacelular.com — Cloudflare Worker
// Routes any unbuilt page to /coming-soon and serves the static megasite otherwise.

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
  // Chunk 2
  "/que-es-celula-senescente/",
  "/sasp-secreto-inflamatorio/",
  "/fisetina-flavonoide-senolitico/",
  "/senoliticos-eliminar-celulas-viejas/",
  "/marcadores-senescencia-p16-p21-galactosidasa/",
  "/rapamicina-mtor-mujeres/",
  "/metformina-geroprotector/",
  "/keeps-trial-terapia-hormonal-senescencia/",
  "/edad-biologica-vs-cronologica/",
  "/reloj-epigenetico-horvath/",
  // Chunk 3 — closes Pillar 02
  "/espermidina-autofagia/",
  "/nad-senescencia/",
  "/glp1-geroprotectores/",
  "/acarbosa-longevidad/",
  "/senomorficos-silenciar-sasp/",
  "/futuro-senoliticos-clinicos/",
  "/senescencia-enfermedad-modelo-unificado/",
  // Chunk 4 — Pillar 03 Estrógeno depth
  "/estrogeno-longevidad/",
  "/receptores-estrogeno-er-alpha-beta-gper/",
  "/estrogeno-mitocondrial/",
  "/elite-trial-ventana-oportunidad/",
  "/whi-revisitado/",
  "/estradiol-transdermico-superior/",
  "/estrogeno-autofagia-mitocondrial-rab9/",
  "/ooforectomia-temprana-envejecimiento/",
  "/estrogeno-hueso-usp10-p53/",
  "/estrogeno-cerebro/",
  // Chunk 5 — Pillar 04 Ovárico complete
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
  // Chunk 6 — Pillar 06 Biomarcadores complete
  "/biomarcadores-envejecimiento/",
  "/grimage-predictor-mortalidad/",
  "/dunedinpace-velocidad-envejecimiento/",
  "/telomeros-como-medirlos/",
  "/proteomica-envejecimiento/",
  "/metabolomica-envejecimiento/",
  "/inflammaging-hscrp-il6-tnf/",
  "/glycanage-edad-glicanos/",
  "/elegir-prueba-envejecimiento-latam-espana/",
  // Chunk 7 — Pillar 05 Piel complete
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
  // Chunk 8 — Pillar 07 Suplementos complete
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
  // Chunk 9 — Pillar 08 + Pillar 03 stragglers
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
  "/estrogeno-telomeros/",
  "/estrogeno-reparacion-adn/",
  "/estrogeno-stress-oxidativo/",
  "/estrogeno-arterias/",
  // Chunk 10 — Pillar 01 Hallmarks complete
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

// Every planned slug from 04_senescenciacelular.md. Anything not in BUILT
// gets a 302 to /coming-soon?from=<slug>. Anything not here AND not built → 404.
const PLANNED = [
  // Pillar landing pages (not yet built)
  "/estrogeno-longevidad/",
  "/envejecimiento-ovarico/",
  "/piel-senescencia/",
  "/biomarcadores-envejecimiento/",
  "/suplementos-evidencia/",
  "/ciencia-traducida/",
  // Pillar 1 — Hallmarks
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
  // Pillar 2 — Senescencia profunda
  "/que-es-celula-senescente/",
  "/sasp-secreto-inflamatorio/",
  "/marcadores-senescencia-p16-p21-galactosidasa/",
  "/senescencia-enfermedad-modelo-unificado/",
  "/senoliticos-eliminar-celulas-viejas/",
  "/fisetina-flavonoide-senolitico/",
  "/espermidina-autofagia/",
  "/nad-senescencia/",
  "/rapamicina-mtor-mujeres/",
  "/metformina-geroprotector/",
  "/acarbosa-longevidad/",
  "/glp1-geroprotectores/",
  "/senomorficos-silenciar-sasp/",
  "/futuro-senoliticos-clinicos/",
  // Pillar 3 — Estrógeno
  "/receptores-estrogeno-er-alpha-beta-gper/",
  "/estrogeno-mitocondrial/",
  "/keeps-trial-terapia-hormonal-senescencia/",
  "/elite-trial-ventana-oportunidad/",
  "/whi-revisitado/",
  "/estradiol-transdermico-superior/",
  "/estrogeno-telomeros/",
  "/estrogeno-autofagia-mitocondrial-rab9/",
  "/estrogeno-reparacion-adn/",
  "/estrogeno-stress-oxidativo/",
  "/estrogeno-hueso-usp10-p53/",
  "/estrogeno-arterias/",
  "/estrogeno-cerebro/",
  "/ooforectomia-temprana-envejecimiento/",
  // Pillar 4 — Ovárico
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
  // Pillar 5 — Piel
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
  // Pillar 6 — Biomarcadores
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
  // Pillar 7 — Suplementos
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
  // Pillar 8 — Ciencia traducida
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
];

function normalize(pathname) {
  if (pathname === "" || pathname === "/") return "/";
  if (pathname.includes(".")) return pathname; // file extension — leave alone
  return pathname.endsWith("/") ? pathname : pathname + "/";
}

function securityHeaders(headers = new Headers()) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return headers;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = normalize(url.pathname);

    // Static asset passthrough (CSS, JS, images, manifest, robots, sitemap, favicons)
    if (
      url.pathname.startsWith("/assets/") ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/sitemap.xml" ||
      url.pathname === "/manifest.webmanifest" ||
      url.pathname === "/sw.js" ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/favicon.svg"
    ) {
      const res = await env.ASSETS.fetch(request);
      const headers = securityHeaders(new Headers(res.headers));
      // Long cache for fingerprinted assets, short for HTML/text
      if (url.pathname.startsWith("/assets/")) {
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
      }
      return new Response(res.body, { status: res.status, headers });
    }

    // Built page — serve it
    if (BUILT.has(path)) {
      const res = await env.ASSETS.fetch(request);
      const headers = securityHeaders(new Headers(res.headers));
      headers.set("Cache-Control", "public, max-age=300, s-maxage=3600");
      return new Response(res.body, { status: res.status, headers });
    }

    // Planned but not built → graceful redirect to coming-soon
    if (PLANNED.includes(path)) {
      const target = new URL("/coming-soon/", url);
      target.searchParams.set("from", path);
      return new Response(null, {
        status: 302,
        headers: securityHeaders(new Headers({ Location: target.toString() })),
      });
    }

    // Truly unknown → 404
    const notFound = await env.ASSETS.fetch(new Request(new URL("/404/", url)));
    const headers = securityHeaders(new Headers(notFound.headers));
    return new Response(notFound.body, { status: 404, headers });
  },
};
