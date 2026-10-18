# Changelog — alterações que tocam rastreamento, consentimento ou dados pessoais

Formato exigido pela Regra 5 dos guardrails (ver `CLAUDE.md`).

## 2026-09-25
- **Alteração**: Google Consent Mode v2 com padrão "tudo negado" desde o carregamento
  (`ga4-consent-default`, stub local sem requisição de rede); `consent update` a cada escolha
  (aceitar, recusar, revogar) e sinais de anúncio ligados só pela categoria Marketing.
  **Responsável**: Claude Code. **Impacto LGPD**: sim — reforça o opt-in; nada de GA4/Meta
  carrega nem faz rede antes do consentimento da categoria.
- **Alteração**: política de privacidade com razão social e CNPJ reais; endereço residencial
  omitido (só "Porto Seguro — BA"); hospedagem informada como Hostinger.
  **Responsável**: Claude Code (dados fornecidos pelo Douglas). **Impacto LGPD**: sim — identifica
  o controlador sem expor endereço residencial.
- **Alteração**: validação do formato dos IDs de GA4/Meta e do consentimento salvo no
  `localStorage`; CSP e demais cabeçalhos de segurança (`next.config.ts`).
  **Responsável**: Claude Code. **Impacto LGPD**: sim — impede que valor malformado vire
  script e limita de onde o site pode carregar/enviar dados (ver `docs/SEGURANCA.md`).

## 2026-09-27
- **Alteração**: preenchidos os dois últimos dados pendentes da política de privacidade —
  nome do encarregado (DPO) e prazo de guarda de conversas sem contrato (12 meses, sem
  colchetes). Corrigido também o aviso de build (`PRIVACY_HAS_PLACEHOLDER`), que usava
  `JSON.stringify(...).includes("[")` e por isso disparava sempre (todo array do objeto
  gera "[" no JSON, mesmo sem placeholder real); agora verifica só o texto de cada campo.
  **Responsável**: Claude Code (dados confirmados pelo Douglas). **Impacto LGPD**: sim —
  identifica o encarregado e define o prazo de retenção exigidos pela política.
- **Alteração**: revogar só a categoria Marketing (ou só Análise) no diálogo de preferências
  agora limpa os cookies daquela categoria de imediato (`_fbp`/`_fbc` ou `_ga`/`_gid`/`_gat`);
  antes, `clearTrackingCookies()` só rodava quando as duas categorias estavam negadas ao mesmo
  tempo, deixando cookies de uma categoria já revogada no navegador enquanto a outra
  permanecesse aceita. Achado em auditoria de segurança de código.
  **Responsável**: Claude Code. **Impacto LGPD**: sim — reforça a Regra 6 (revogar precisa
  zerar de fato o rastreamento daquela categoria, não só sinalizar ao SDK).

## 2026-09-28
- **Alteração**: `/origem` e `/privacidade` renomeadas para `/quem-somos` e
  `/politica-de-privacidade` (com redirect 301 das URLs antigas). O link da política no
  banner de cookies (`ConsentBanner.tsx`) deixou de ser hardcoded e passou a usar a
  constante `FOOTER_LINKS.privacidade.href`, para não desalinhar se a rota mudar de novo.
  `Tracking.tsx` só teve um comentário atualizado (rota antiga citada em texto), sem
  mudança de comportamento. `layout.tsx` passou a montar também o novo
  `WhatsappFloatingButton` (botão de WhatsApp flutuante, mobile) — mesmo padrão de
  `contactHref()`/`trackLead()` já usado nos outros CTAs, sem novo destino de dado.
  **Responsável**: Claude Code. **Impacto LGPD**: nenhum — é reorganização de rota e
  navegação; nenhum dado novo é coletado e o consentimento continua controlando os
  mesmos dois scripts (GA4/Meta) do jeito que já estava.

## 2026-09-30
- **Alteração**: banner de cookies (`ConsentBanner.tsx`) mais compacto em tablet/desktop
  (largura máxima 320px a partir de `sm`, espaçamentos internos e altura dos botões menores),
  para não cobrir a headline da Cena 1 em notebooks de tela baixa. Só estilo: textos, ordem
  dos botões ("Aceitar" e "Recusar" com o mesmo peso), lógica de gravação e leitura do
  consentimento inalteradas. Validado com IDs de teste: antes da escolha, 0 requisições a
  Google/Meta e Consent Mode com tudo `denied`; "Recusar" → 0 requisições; "Aceitar" → GA4 e
  Meta Pixel carregam (1366×641 e 390×844).
  **Responsável**: Claude Code. **Impacto LGPD**: nenhum — mesmo opt-in, mesmas opções com o
  mesmo destaque; nenhum dado novo coletado.

## 2026-10-03
- **Alteração**: branch `fix/seo-fundacao` (SEO). Rodapé (`Footer.tsx`, que abriga o botão
  "Preferências de cookies", mantido sem alteração) ganhou identificação do controlador (razão
  social, CNPJ, e-mail, WhatsApp, horário) e links para Planos, Termos de uso, Instagram e Google
  Meu Negócio (links comuns, abrem em nova aba com `rel="noopener noreferrer"`; **nenhum script de
  terceiro novo**, então a Regra 4 não se aplica). Nova página `/termos-de-uso`, com texto que cita
  Google Analytics e Meta Pixel só com consentimento e remete às "Preferências de cookies". JSON-LD
  ampliado (`src/lib/seo/schema.ts`: razão social, CNPJ, telefone, e-mail, horário, fundador,
  perfis) — são dados institucionais da empresa, sem dado pessoal de visitante. `GA4` e `Meta Pixel`,
  `Tracking.tsx`, `ConsentBanner.tsx` e o Consent Mode não foram alterados.
  **Responsável**: Claude Code. **Impacto LGPD**: sim, positivo — o controlador e o canal de
  contato passam a estar identificados em todas as páginas, e os Termos reforçam o opt-in; nenhuma
  coleta nova, nenhum script novo e nenhum disparo antes do consentimento.

- **Alteração**: política de privacidade (`PRIVACY` em `site.ts`, `PrivacyContent.tsx`) alinhada ao
  Playbook V5.3, à auditoria documental de 01/10/2026 e aos Termos de uso: novo card "Dados de quem
  contrata" (nome, CPF ou CNPJ, endereço, e-mail, telefone e registro da assinatura eletrônica);
  fornecedores de contratação e armazenamento (ZapSign, Asaas, Google Drive e Planilhas) na seção 6;
  contrato, cobrança e assinatura como finalidade e base ("procedimentos de contrato"); aviso de
  mudanças "com pelo menos 10 dias de antecedência" (igual aos Termos); remissão aos Termos de uso;
  nomes dos cookies de análise e marketing com o produto (Google Analytics, Meta Pixel); data de
  atualização 3 de outubro de 2026. Banner e diálogo de preferências revisados e **sem alteração**
  (nenhuma caixa pré-marcada, Aceitar e Recusar com o mesmo peso, Cancelar não grava, revogação
  pelo rodapé); `CONSENT_VERSION` não foi alterado porque nenhuma categoria nem finalidade de
  cookie mudou.
  **Responsável**: Claude Code (a partir do Playbook e da auditoria do Douglas; o texto ainda precisa
  de validação jurídica). **Impacto LGPD**: sim — a política passa a declarar tratamentos e
  operadores que já existiam na contratação; nenhuma coleta nova e nenhum script novo.

- **Alteração**: política de privacidade passa a cobrir o contato comercial com empresas
  (prospecção): novo card "Contatos comerciais de empresas" (dados públicos de contato; quem não
  quiser ser contatado avisa e o pedido é registrado numa lista de supressão), base "legítimo
  interesse" estendida a esse contato e novo prazo de retenção "Contatos comerciais sem resposta:
  até 6 meses" (prazo da auditoria documental de 01/10/2026, confirmado pelo Douglas). Fornecedores
  já listados (ZapSign, Asaas, Google) confirmados pelo Douglas. Banner e diálogo de preferências
  não foram alterados; `CONSENT_VERSION` mantido (nenhuma categoria de cookie mudou).
  **Responsável**: Claude Code (a partir da auditoria e das confirmações do Douglas; o texto ainda
  precisa de validação jurídica). **Impacto LGPD**: sim — a política passa a informar um tratamento
  que já ocorria (art. 9º da LGPD); nenhuma coleta nova e nenhum script novo.

## 2026-10-04
- **Alteração**: JSON-LD da empresa (`src/lib/seo/schema.ts`, `src/content/site.ts`): descrição passa a
  "Infraestrutura de presença digital para negócios de Porto Seguro/BA: site, Google Meu Negócio e
  Instagram." e `areaServed` a "Porto Seguro, BA, Brasil"; o bloco único (`ProfessionalService`, `@id`
  `/#empresa`) foi ajustado em vez de criar um segundo `Organization` na home. Sem campos de avaliação,
  preço ou endereço de rua. `next.config.ts`: só `experimental.inlineCss` (desempenho no celular); a CSP e
  os demais cabeçalhos **não foram alterados** e não há violação de CSP no navegador (verificado em 4
  páginas); `Tracking.tsx`, `ConsentBanner.tsx` e o Consent Mode inalterados.
  **Responsável**: Claude Code. **Impacto LGPD**: nenhum — dados institucionais já públicos no rodapé e
  na política; nenhuma coleta nova, nenhum script novo.

## 2026-10-18
- **Alteração**: consentimento (`src/lib/consent.ts`, `Tracking.tsx`, `ConsentBanner.tsx`,
  `ConsentPreferences.tsx`). (1) Revogar ou aceitar em uma aba agora vale nas outras abertas (evento
  `storage`); antes uma aba antiga seguia com o consentimento velho. (2) O evento interno de consentimento
  só é aplicado se o formato for válido (`isConsentState`). (3) Marketing aceito também envia
  `fbq("consent","grant")`, igual ao `revoke` que já existia. (4) A revogação apaga cookies `_ga*`/`_fbp`/`_fbc`
  gravados com atributo `Domain` (antes só apagava os de caminho simples e os de domínio permaneciam).
  (5) O banner fecha ao salvar por qualquer caminho (inclusive o link "Preferências" do próprio banner) e
  não reaparece se já houver escolha. (6) "Recusar" no banner passou a ter o mesmo peso visual do "Aceitar"
  (botões com a mesma proeminência). (7) O título do diálogo de preferências deixou de ser `h2` (não vira
  título da página). Mapeamento das categorias, Consent Mode v2 (padrão `denied`) e IDs inalterados.
  **Responsável**: Claude Code. **Impacto LGPD**: positivo — revogação passa a ter efeito real em todas as
  abas e nos cookies de domínio; nenhum script novo e nenhuma coleta nova. Validado (Regra 6, IDs falsos,
  requisições a Google/Meta abortadas): Recusar → 0 requisições; Aceitar → GA4/Meta disparam.
- **Alteração**: rodapé e páginas institucionais (`src/content/site.ts`, `Footer`, Termos de uso): horário
  oficial seg a sex 8h às 18h e sáb 9h às 12h, link da ficha no Google Maps
  (`https://maps.app.goo.gl/JSwQ3TjLnfVzfHc48`), data dos Termos 18/10/2026. Política de privacidade:
  descrição e metadados revisados. Schema (`OpeningHoursSpecification`, `serviceType`, ofertas em /planos)
  e `llms.txt` com os mesmos dados. **Responsável**: Claude Code (dados do Douglas).
  **Impacto LGPD**: nenhum — dados institucionais da empresa, nenhum dado pessoal novo.
- **Alteração**: `next.config.ts` passa a falhar fechado em produção se faltar configuração de segurança e
  ganha redirect 301 de `www.nelvox.com.br` para o domínio sem `www`. **Responsável**: Claude Code.
  **Impacto LGPD**: nenhum direto — evita duplicidade de origem para o consentimento (que fica no
  `localStorage` por origem).
