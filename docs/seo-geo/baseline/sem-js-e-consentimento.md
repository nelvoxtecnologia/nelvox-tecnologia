# Sem JavaScript e consentimento (Fase 0)

Playwright + Chrome, perfil limpo, 17/10/2026. Requests de terceiros **abortados e registrados**: nada foi enviado ao Google nem à Meta.

## build local (seo-geo)

- mobile 390x844: {"h1_visivel":false,"hint_toque_no_farol_visivel":true,"cards_metodo_visiveis":[0,0,0],"titulo_missao_opacidade_palavras":1,"rodape_links":8,"preloader_cobrindo":false}
- desktop 1440x900: {"h1_visivel":false,"hint_toque_no_farol_visivel":true,"cards_metodo_visiveis":[0,0,0],"titulo_missao_opacidade_palavras":1,"rodape_links":8,"preloader_cobrindo":false}

## produção

- mobile 390x844: {"h1_visivel":true,"hint_toque_no_farol_visivel":true,"cards_metodo_visiveis":[0,0,0],"titulo_missao_opacidade_palavras":1,"rodape_links":8,"preloader_cobrindo":false}
- desktop 1440x900: {"h1_visivel":true,"hint_toque_no_farol_visivel":true,"cards_metodo_visiveis":[0,0,0],"titulo_missao_opacidade_palavras":1,"rodape_links":8,"preloader_cobrindo":false}


# Requests de terceiros por fase (produção, perfil limpo, requests abortados e registrados)

## Recusar
- Consent Mode (dataLayer) antes de qualquer escolha: [["default",{"analytics_storage":"denied","ad_storage":"denied","ad_user_data":"denied","ad_personalization":"denied"}]]
- banner visível: true
- estilo dos dois botões: ["Aceitar: fundo rgb(200, 179, 138), borda rgb(5, 13, 24)","Recusar: fundo rgba(0, 0, 0, 0), borda rgb(26, 59, 92)"]
- salvo: {"v":1,"analytics":false,"marketing":false,"ts":1792277616236}
- 1-antes-de-qualquer-clique: 0 request(s) de terceiros 
- 2-banner-visivel-sem-escolha: 0 request(s) de terceiros 
- 3-depois-de-Recusar: 0 request(s) de terceiros 

## Aceitar
- Consent Mode (dataLayer) antes de qualquer escolha: [["default",{"analytics_storage":"denied","ad_storage":"denied","ad_user_data":"denied","ad_personalization":"denied"}]]
- banner visível: true
- estilo dos dois botões: ["Aceitar: fundo rgb(200, 179, 138), borda rgb(5, 13, 24)","Recusar: fundo rgba(0, 0, 0, 0), borda rgb(26, 59, 92)"]
- salvo: {"v":1,"analytics":true,"marketing":true,"ts":1792277636540}
- 1-antes-de-qualquer-clique: 0 request(s) de terceiros 
- 2-banner-visivel-sem-escolha: 0 request(s) de terceiros 
- 3-depois-de-Aceitar: 2 request(s) de terceiros → www.googletagmanager.com/gtag/js
