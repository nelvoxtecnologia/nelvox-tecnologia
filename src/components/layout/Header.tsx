"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/brand/Wordmark";
import { NAV_ITEMS, NAV_CTA, FOOTER, FOOTER_LINKS, contactHref } from "@/content/site";
import { useFarolLit } from "@/lib/useFarolLit";
import { openConsentPreferences } from "@/lib/consent";
import { trackLead } from "@/lib/track";

/* ===== HEADER =====
   Não renderiza antes do farol acender (README, "Nav"): a navegação não faz
   sentido enquanto a página ainda espera o clique. Depois, entra com fade de
   600ms (+300ms de atraso, ver .animate-header-in em globals.css).

   Celular (< 1024px, artboards mobile do mockup): barra de 64px com padding
   `0 10px 0 20px`, sem fundo; hambúrguer de 2 linhas (alvo 44×44) que vira X;
   menu em tela cheia com fade de 250ms, foco preso e Esc para fechar.
   Desktop: 80px, link "Quem somos" + botão; fundo com blur ao rolar.

   Na Cena 6 o botão do desktop some — o WhatsApp já está na própria cena. */

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Header() {
  /* useFarolLit() começa "false" (igual ao servidor) e atualiza sozinho quando
     o farol acende, sem erro de hidratação — ver farolEvents.ts. */
  const lit = useFarolLit();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hideCta, setHideCta] = useState(false);
  /* Só no mobile (ver className mais abaixo): esconde a barra inteira
     (símbolo + wordmark) ao rolar para baixo, mostra ao rolar para cima.
     No celular a barra fixa some por trás do texto da Cena 3→4 (feedback
     de usuário, 28/09/2026) — no desktop ela é discreta o bastante
     (fundo com blur) para nunca precisar sumir. */
  const [hideBar, setHideBar] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);

      /* Ignora oscilações pequenas (bounce do iOS, tremor do trackpad) e só
         decide a direção quando o scroll de fato avançou uns pixels. */
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) > 4) {
        setHideBar(delta > 0 && y > 80);
        lastScrollY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* O botão do desktop some quando a Cena 6 entra no centro da viewport. */
  useEffect(() => {
    if (!lit) return;
    const target = document.querySelector<HTMLElement>('[data-scene="6"]');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setHideCta(entry.isIntersecting), {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [lit]);

  /* Menu aberto: trava a rolagem (via html[data-menu], ver globals.css, que
     também sobe o farol acima do fundo do menu), fecha com Esc, prende o foco
     dentro do menu e fecha sozinho se a tela crescer para o layout desktop. */
  useEffect(() => {
    if (!isMenuOpen) return;
    document.documentElement.dataset.menu = "open";

    const focusables = () => [
      toggleRef.current,
      ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    ].filter((el): el is HTMLElement => el !== null);

    focusables()[1]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const media = window.matchMedia("(min-width: 1024px)");
    const onResize = () => media.matches && setIsMenuOpen(false);

    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onResize);
    return () => {
      delete document.documentElement.dataset.menu;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onResize);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  if (!lit) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 animate-header-in transition-[background-color,border-color,transform] duration-ui ease-brand-in-out lg:border-b lg:translate-y-0 ${
        hideBar && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        isScrolled
          ? "lg:border-navy-700 lg:bg-navy-950/72 lg:backdrop-blur-[8px]"
          : "lg:border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[64px] w-full max-w-container items-center justify-between pl-[20px] pr-[10px] lg:h-20 lg:px-20">
        <Link href="/" className="shrink-0" aria-label="Nelvox — início da página">
          <Wordmark tone="papel" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-hot
              className="font-body text-[13px] text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-papel-300 hover:underline hover:[text-underline-offset:5px]"
            >
              {item.label}
            </Link>
          ))}

          {!hideCta && (
            <a
              href={contactHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackLead}
              data-hot
              className="rounded-sm border border-gold-400 px-4 py-2 font-body text-[13px] font-semibold tracking-[0.3px] text-gold-400 transition-colors duration-ui ease-brand-in-out hover:bg-gold-400/10 hover:text-gold-bright"
            >
              {NAV_CTA}
            </a>
          )}
        </div>

        {/* Celular: hambúrguer de 2 linhas (22×1,5px, gap 6) que vira X em 250ms */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="menu-mobile"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="relative z-[6] h-[44px] w-[44px] lg:hidden"
        >
          {[0, 1].map((line) => (
            <span
              key={line}
              aria-hidden="true"
              className="absolute left-[11px] block h-[1.5px] w-[22px] bg-papel-300 transition-[top,transform] duration-ui ease-brand-in-out"
              style={{
                top: isMenuOpen ? 21 : line === 0 ? 17.5 : 25,
                transform: isMenuOpen ? `rotate(${line === 0 ? 45 : -45}deg)` : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Menu em tela cheia (celular) — fade de 250ms. `inert` tira do foco e do
          leitor de tela enquanto fechado. O farol fica acima deste fundo. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        inert={!isMenuOpen}
        className={`fixed inset-0 z-[4] bg-navy-950 transition-opacity duration-ui ease-brand-in-out lg:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Principal (mobile)" className="absolute inset-x-6 top-[220px] flex flex-col">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center justify-between border-t border-navy-700 py-[22px] font-display text-[38px] font-light leading-none text-papel-300"
            >
              {item.label}
              <ArrowUpRight size={18} weight="regular" aria-hidden="true" className="text-papel-700" />
            </Link>
          ))}
          <a
            href={contactHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackLead();
              closeMenu();
            }}
            className="flex items-center justify-between border-y border-navy-700 py-[22px] font-display text-[38px] font-light italic leading-none text-gold-400"
          >
            {NAV_CTA}
            <WhatsappLogo size={20} weight="regular" aria-hidden="true" />
          </a>
        </nav>

        <div className="absolute inset-x-0 bottom-[44px] flex flex-col items-center gap-[6px] text-center">
          <p className="font-display text-[20px] font-light italic text-papel-300">{FOOTER.tagline}</p>
          <p className="eyebrow text-papel-700">Porto Seguro · BA</p>
          <div className="mt-[10px] flex items-center gap-4 font-body text-caption text-papel-700">
            <Link href={FOOTER_LINKS.privacidade.href} onClick={closeMenu}>
              {FOOTER_LINKS.privacidade.label}
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openConsentPreferences();
              }}
            >
              {FOOTER_LINKS.preferenciasCookies.label}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
