#!/usr/bin/env node
/* ===================================================================
   VERIFICAÇÃO DE SEO — roda contra um servidor no ar (next start ou o site publicado).

     npm run seo:check                          → http://localhost:3000
     npm run seo:check -- https://nelvox.com.br → outro endereço

   Node puro, sem dependência. Descobre as rotas pelo sitemap.xml e confere em cada uma
   (itens 1–7 bloqueiam: saída com código 1; o 8 é só aviso):

     1. exatamente um <h1
     2. JSON-LD na home, válido em JSON.parse, sem valor vazio nem "<" dentro de strings
     3. nenhum `inert` no HTML servido
     4. a frase da Missão contígua no HTML (home)
     5. canonical, title e description presentes e diferentes entre as rotas
     6. /llms.txt, /robots.txt e /sitemap.xml com status 200
     7. nenhum TODO, undefined, [completar, {{ }} ou <...> no texto visível
     8. (aviso) vocabulário proibido (regra 5 do briefing) e termos obsoletos, com rota e trecho
   =================================================================== */

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/+$/, "");
const MISSION_PHRASE = "Construir a presença digital de empresas com método e precisão";

const FORBIDDEN_WORDS = [
  /\bcompre\b/i,
  /\bcontrate\b/i,
  /\binvista\b/i,
  /aumente seu faturamento/i,
  /garanto resultados/i,
  /seu negócio vai crescer/i,
];
const OBSOLETE_TERMS = [
  /\bs[óo]cios?\b/i,
  /\bVagner\b/i,
  /\bAnthony\b/i,
  /\bCTO\b/,
  /\bCMO\b/,
  /\bFirebase\b/i,
  /\bFirestore\b/i,
  /Mercado ?Pago/i,
  /IA propriet[áa]ria/i,
];

const failures = [];
const warnings = [];
const fail = (item, route, detail) => failures.push({ item, route, detail });
const warn = (route, detail) => warnings.push({ route, detail });

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#x27;": "'", "&#39;": "'", "&nbsp;": " " };
const decode = (s) => s.replace(/&(?:amp|lt|gt|quot|nbsp|#x27|#39);/g, (m) => ENTITIES[m]);

/** Texto que o visitante lê: sem script, estilo, noscript, comentários nem tags. */
function visibleText(html) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

const pick = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]).trim() : null;
};

function emptyOrBroken(value, path, out) {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
    out.push(`${path} vazio`);
  } else if (typeof value === "string" && /</.test(value)) {
    out.push(`${path} contém "<": ${value.slice(0, 60)}`);
  } else if (Array.isArray(value)) {
    if (value.length === 0) out.push(`${path} lista vazia`);
    value.forEach((item, i) => emptyOrBroken(item, `${path}[${i}]`, out));
  } else if (typeof value === "object") {
    if (Object.keys(value).length === 0) out.push(`${path} objeto vazio`);
    for (const [k, v] of Object.entries(value)) emptyOrBroken(v, `${path}.${k}`, out);
  }
}

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "follow" });
  return { status: res.status, body: await res.text() };
}

async function main() {
  console.log(`seo:check em ${BASE}\n`);

  // 6. arquivos de rastreamento
  const files = {};
  for (const path of ["/llms.txt", "/robots.txt", "/sitemap.xml"]) {
    try {
      files[path] = await get(path);
    } catch (err) {
      fail(6, path, `não respondeu (${err.message}) — o servidor está no ar?`);
      continue;
    }
    if (files[path].status !== 200) fail(6, path, `status ${files[path].status}`);
  }
  if (!files["/sitemap.xml"] || files["/sitemap.xml"].status !== 200) return report();

  const routes = [...files["/sitemap.xml"].body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/");
  if (routes.length === 0) fail(6, "/sitemap.xml", "nenhuma <loc> encontrada");
  console.log(`rotas no sitemap (${routes.length}): ${routes.join("  ")}\n`);

  const seen = { title: new Map(), description: new Map(), canonical: new Map() };

  for (const route of routes) {
    let page;
    try {
      page = await get(route);
    } catch (err) {
      fail(1, route, `não respondeu (${err.message})`);
      continue;
    }
    if (page.status !== 200) {
      fail(1, route, `status ${page.status}`);
      continue;
    }
    const html = page.body;

    // 1. exatamente um h1
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) fail(1, route, `${h1} <h1> (esperado: 1)`);

    // 2. JSON-LD (obrigatório na home; se existir em outra rota, tem de ser válido também)
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (route === "/" && blocks.length === 0) fail(2, route, "JSON-LD ausente");
    for (const block of blocks) {
      try {
        const problems = [];
        emptyOrBroken(JSON.parse(block[1]), "$", problems);
        problems.forEach((p) => fail(2, route, p));
      } catch (err) {
        fail(2, route, `JSON-LD inválido em JSON.parse: ${err.message}`);
      }
    }

    // 3. nenhum inert no HTML servido
    if (/\binert\b/.test(html)) fail(3, route, "`inert` presente no HTML servido");

    // 4. frase da Missão (home)
    if (route === "/" && !html.includes(MISSION_PHRASE)) fail(4, route, `frase ausente: "${MISSION_PHRASE}"`);

    // 5. canonical, title, description
    const meta = {
      title: pick(html, /<title>([^<]*)<\/title>/),
      description: pick(html, /<meta name="description" content="([^"]*)"/),
      canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    };
    for (const [key, value] of Object.entries(meta)) {
      if (!value) {
        fail(5, route, `${key} ausente`);
        continue;
      }
      if (seen[key].has(value)) fail(5, route, `${key} repetido (igual ao de ${seen[key].get(value)})`);
      else seen[key].set(value, route);
    }

    // 7. placeholders no texto visível
    const text = visibleText(html);
    for (const [label, re] of [
      ["TODO", /\bTODO\b/],
      ["undefined", /\bundefined\b/],
      ["[completar", /\[completar/i],
      ["{{ }}", /\{\{|\}\}/],
      ["<...>", /<[^<>\n]{1,80}>/],
    ]) {
      const m = text.match(re);
      if (m) fail(7, route, `${label} no texto visível: "…${text.slice(Math.max(0, m.index - 30), m.index + 40)}…"`);
    }

    // 8. avisos
    for (const [kind, list] of [
      ["vocabulário proibido", FORBIDDEN_WORDS],
      ["termo obsoleto", OBSOLETE_TERMS],
    ]) {
      for (const re of list) {
        const m = text.match(re);
        if (m) warn(route, `${kind} "${m[0]}": "…${text.slice(Math.max(0, m.index - 40), m.index + 50)}…"`);
      }
    }

    console.log(
      `${route.padEnd(26)} h1=${h1}  ld+json=${blocks.length}  title="${meta.title ?? "—"}"`,
    );
  }

  report();
}

function report() {
  console.log("");
  if (warnings.length > 0) {
    console.log(`AVISOS (${warnings.length}, não bloqueiam):`);
    warnings.forEach((w) => console.log(`  ${w.route}  ${w.detail}`));
    console.log("");
  } else {
    console.log("Avisos: nenhum vocabulário proibido nem termo obsoleto encontrado.\n");
  }

  if (failures.length > 0) {
    console.log(`FALHAS (${failures.length}):`);
    failures.forEach((f) => console.log(`  [item ${f.item}] ${f.route}  ${f.detail}`));
    console.log("\nseo:check REPROVADO");
    process.exit(1);
  }
  console.log("seo:check APROVADO (itens 1 a 7)");
}

main().catch((err) => {
  console.error(`seo:check não conseguiu rodar: ${err.message}`);
  process.exit(1);
});
