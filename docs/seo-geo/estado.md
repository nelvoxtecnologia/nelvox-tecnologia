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
