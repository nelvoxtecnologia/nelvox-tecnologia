# Lighthouse — linha de base (Fase 0)

Lighthouse 12.8.2, uma execução por célula, 17/10/2026. "Build local" é `next start` do branch `seo-geo` na máquina de desenvolvimento (sem CDN); "produção" é https://nelvox.com.br. **Não são comparáveis entre si** (rede, CDN e hardware diferentes) e uma execução isolada varia bastante (TBT mobile entre 517 e 775 ms em condições iguais).

| Alvo | Dispositivo | Página | Perf | A11y | SEO | LCP | FCP | SI | TBT | CLS | Falhas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| produção | mobile | / | 72 | 96 | 100 | 3.1 s | 1.2 s | 5.3 s | 681 ms | 0.000 | color-contrast (contraste: 18 itens) |
| produção | mobile | /planos | 71 | 96 | 100 | 3.5 s | 1.0 s | 6.1 s | 585 ms | 0.000 | color-contrast (contraste: 10 itens) |
| produção | desktop | / | 95 | 96 | 100 | 0.7 s | 0.4 s | 2.2 s | 51 ms | 0.001 | color-contrast (contraste: 18 itens) |
| produção | desktop | /planos | 95 | 96 | 100 | 0.7 s | 0.3 s | 2.2 s | 31 ms | 0.001 | color-contrast (contraste: 10 itens) |
| build local (seo-geo) | mobile | / | 70 | 96 | 100 | 3.6 s | 2.0 s | 5.6 s | 517 ms | 0.000 | color-contrast (contraste: 18 itens) |
| build local (seo-geo) | mobile | /planos | 66 | 96 | 100 | 3.8 s | 0.8 s | 5.3 s | 775 ms | 0.000 | color-contrast (contraste: 10 itens) |
| build local (seo-geo) | desktop | / | 96 | 96 | 100 | 0.8 s | 0.5 s | 2.1 s | 48 ms | 0.001 | color-contrast (contraste: 18 itens) |
| build local (seo-geo) | desktop | /planos | 95 | 96 | 100 | 0.8 s | 0.2 s | 2.0 s | 73 ms | 0.002 | color-contrast (contraste: 9 itens) |

Leitura: SEO 100 em todas as células; acessibilidade 96 (única falha: contraste, já registrada: palavras da Missão começam com opacidade .14 antes da animação e `text-papel-700` de 13px em `/planos`); CLS ≈ 0; o gargalo é o LCP no celular (~3 a 3,8 s), concentrado no atraso de renderização da abertura (preloader), ver `docs/seo/desempenho_mobile.md`.

Limitação: o PageSpeed Insights de 3/10 deu nota 87 no celular com TBT de 40 ms; o Lighthouse local usa CPU mais lenta. Os números de TBT daqui não devem ser comparados com os do PSI.
