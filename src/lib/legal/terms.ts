import { readFileSync } from "node:fs";
import path from "node:path";

/* ===== TERMOS DE USO =====
   O texto vive em docs/referencias/termos_de_uso_nelvox.md e é lido em tempo de build (a página é
   estática): assim o que está no ar nunca diverge do arquivo revisado juridicamente. O projeto não
   tem renderizador de Markdown e a regra é não instalar dependência só para isso, então este parser
   cobre exatamente o que o texto usa: `# título`, seções numeradas, parágrafos e listas com `- `. */

export type TermsBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };
export type TermsSection = { n: number; title: string; blocks: TermsBlock[] };
export type Terms = { title: string; sections: TermsSection[] };

const SOURCE = path.join(process.cwd(), "docs", "referencias", "termos_de_uso_nelvox.md");

/** "## 2. Quem somos" ou, só na seção 1, "1. Aceitação" (no arquivo ela está sem o `##`). */
const HEADING = /^\s*(##\s+)?(\d+)\.\s+(.+?)\s*$/;

export function parseTerms(markdown: string): Terms {
  let title = "";
  const sections: TermsSection[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    const section = sections[sections.length - 1];
    if (section && paragraph.length > 0) section.blocks.push({ type: "p", text: paragraph.join(" ") });
    if (section && list && list.length > 0) section.blocks.push({ type: "ul", items: list });
    paragraph = [];
    list = null;
  };

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading && (heading[1] || sections.length === 0)) {
      flush();
      sections.push({ n: Number(heading[2]), title: heading[3], blocks: [] });
      continue;
    }
    if (line.trim() === "") {
      flush();
      continue;
    }
    if (line.startsWith("- ")) {
      if (paragraph.length > 0) flush();
      (list ??= []).push(line.slice(2).trim());
      continue;
    }
    if (list) flush();
    paragraph.push(line.trim());
  }
  flush();

  if (!title || sections.length === 0) {
    throw new Error("[termos] docs/referencias/termos_de_uso_nelvox.md está vazio ou fora do formato esperado.");
  }
  return { title, sections };
}

export function loadTerms(): Terms {
  return parseTerms(readFileSync(SOURCE, "utf-8"));
}
