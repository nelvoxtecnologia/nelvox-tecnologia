# Estado do trabalho SEO + GEO

Para retomar em outra sessão. Atualizado em 17/10/2026.

## Onde estamos

| Fase | Situação |
|---|---|
| 0 · reconhecimento e linha de base | **concluída** (`baseline/`) |
| 1 · correções técnicas | aguardando respostas dos gates G1 e G5 (ver abaixo) |
| 2 · dados estruturados | não iniciada |
| 3 · conteúdo e arquitetura | não iniciada (tudo em rascunho) |
| 4 · GEO | não iniciada |
| 5 · verificação e entrega | não iniciada |

## Git

- Branch de trabalho: `seo-geo`, criada de `fix/hero-h1-e-politica` (commit `5f40095`), que **nunca foi publicada** (o push parou no login do GitHub). Ela carrega, além do que o PR #1 já levou: H1 da home sem legenda, logo azul-marinho no schema, Política com contato comercial (retenção de 6 meses), descrição do schema e CSS inline.
- `origin/master` está em `23dda5d` (merge do PR #1). **Ninguém faz push na `master`/`main`.**
- Push de `seo-geo` precisa do login do Douglas no GitHub (o ambiente do Claude não consegue abrir a janela).

## Como rodar

- Desenvolvimento com recarga automática: `npx next dev --webpack -p 3000` (o Turbopack de desenvolvimento falha na fonte do Google; o webpack funciona).
- Build de produção local: `npm run build` e `npx next start -p 4001`.
- Verificação: `npm run seo:check -- http://localhost:4001`.
- Medições da Fase 0: scripts em `scratchpad` da sessão (não versionados); resultados em `baseline/`.

## Decisões já tomadas (pelo Douglas, antes deste roteiro)

- Legenda do H1 "Nelvox — criação de sites…" **deve sair** (quebra a experiência). **Conflita com o padrão do G1** (opção A mantém um H1 buscável visível).
- Logo do schema: `simbolo_nelvox_gold_navy.png`.
- Política: contato comercial com 6 meses de retenção; fornecedores (ZapSign, Asaas, Google) confirmados.
- Plano Essencial é "Landing page com até 5 seções".
- Descrição do schema: "Infraestrutura de presença digital para negócios de Porto Seguro/BA: site, Google Meu Negócio e Instagram."
- Instagram: https://www.instagram.com/nelvox.tech/ · Perfil no Google: link curto `https://share.google/1byQLfMtI7OHcWanh` (resolve para a busca, não para o Maps).

## Gates pendentes

| Gate | Pergunta | Padrão do roteiro | Observação |
|---|---|---|---|
| G1 | hero/H1 | A: H1 buscável permanente e legível, sem fade | contradiz o pedido de tirar a legenda; o H1 invisível atual é um risco (ver `baseline/estado-verificado.md`, achado 1) |
| G2 | endereço | só "Porto Seguro, BA" | já é assim |
| G3 | crawlers de treino de IA | permitir | produção já responde igual a todos |
| G4 | URLs de segmento | `/saude`, `/turismo`, `/negocios-locais` | |
| G5 | dados que só o Douglas tem | sem resposta, o PR fica "não pronto" | vigência dos preços, texto das condições da oferta, horário oficial (sábado?), URL estável do Maps, URL do LinkedIn |

## Pendências `TODO_DOUGLAS_*` conhecidas

`TODO_DOUGLAS_VIGENTE_DESDE`, `TODO_DOUGLAS_CONDICOES`, `TODO_DOUGLAS_URL_ESTAVEL_GOOGLE_MAPS`, `TODO_DOUGLAS_LINKEDIN`, `TODO_DOUGLAS_HORARIO_OFICIAL`, `TODO_DOUGLAS_OG_IMAGE` (só se necessário).

## PAUSA de 18/10/2026: retomar daqui

O Douglas pausou por bateria baixa e trovoada. Nada abaixo foi commitado, testado ou enviado. O servidor de desenvolvimento está parado (subir com `npx next dev --webpack -p 3000`).

**Decisões do Douglas**
- G1: subir a headline da Cena 2 ("Existem negócios que ninguém enxerga no mar digital.") a H1 e rebaixar "Todo porto precisa de uma luz." a H2. Sem texto novo na tela.
- G5: preços vigentes até 31/12/2026; horário oficial seg a sex 8h às 18h e sáb 9h às 12h; Maps https://maps.app.goo.gl/JSwQ3TjLnfVzfHc48; LinkedIn não existe; "Condições da oferta" fica sem bloco até o Douglas enviar o texto do Contrato.
- Atualizar o horário também nos Termos de uso e no llms.txt (feito nos arquivos).
- Checkbox de cookies: o que ele viu (revogou Google e Meta, trocou de página, opções seguiram desmarcadas, banner não voltou) é o comportamento correto. O defeito real encontrado foi o banner não fechar ao salvar pelo link "Preferências" dele (corrigido nos arquivos).

**Já editado nos arquivos (sem teste, sem commit)**
- Consentimento: ouvir `storage` entre abas, validar o evento, `fbq grant`, apagar cookie com `Domain`, banner fecha ao salvar por outro caminho (`consent.ts`, `Tracking.tsx`, `ConsentBanner.tsx`).
- `next.config.ts`: falha fechado em produção e redirect www para o apex; `.gitignore`; `engines`; `TermsContent.tsx` (regex do link); `SEGURANCA.md`.
- Horário com sábado e Maps em `site.ts`, schema, rodapé, `llms.txt` e Termos (data dos Termos: 18/10/2026).
- `src/content/plans.ts` (preços como números, vigência), `PlansContent.tsx` com a linha de vigência.
- `schema.ts`: `serviceType`, ofertas em /planos, WebPage/AboutPage + BreadcrumbList por página; `JsonLd` aceita `data`.
- Metadados: `title.template` "%s | Nelvox", títulos e descrições novos, `keywords` removido.

**Falta fazer**
1. G1 no código: `SceneHero.tsx` (h1 vira h2) e a primeira headline de `SceneSea.tsx` (h2 vira h1).
2. Título do diálogo de cookies deixar de ser `h2` (`ConsentPreferences.tsx`, usar `aria-labelledby` com `<p>`).
3. Skip link em todas as páginas (hoje só na home, `src/app/page.tsx`).
4. Cards do Método visíveis sem JavaScript (`<noscript><style>` no layout).
5. `sitemap.ts`: `lastModified` das páginas alteradas = 2026-10-18.
6. `seo-check.mjs`: conferir que preços, telefone e horários do JSON-LD aparecem no texto visível.
7. `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run seo:check`; teste Recusar/Aceitar (IDs falsos, requests abortados); conferir /planos, /quem-somos e o www redirect.
8. CHANGELOG (obrigatório: tocou consentimento, rodapé e Termos) e commits pequenos, um por mudança lógica.
9. Pedido do Douglas: conferir o SEO do site e da ficha do Google (GMB) com os plugins (searchfit-seo, Windsor `google_my_business`, ou a página do Maps no navegador) e comparar nome, endereço, telefone, horário, site e redes, depois da correção de horário.
10. Push da `seo-geo`: o Git pede login no GitHub; o Douglas precisa rodar `git push -u origin seo-geo`.

**Armadilhas conhecidas**
- Não digitar a sequência de escape unicode do "<" em edições: a ferramenta a converte em "<". Foi assim que o escape do JSON-LD regrediu; alterar por script.
- Validadores do skill security-audit não rodam no Windows; usar as cópias em `scratchpad/validators` (ver `run-1/REPORT.md`).

**Fora desta rodada (precisa de confirmação do Douglas)**: páginas de segmento (/saude, /turismo, /negocios-locais) e guias, `entidade.md` e `medicao.md`, bloco "Condições da oferta".
