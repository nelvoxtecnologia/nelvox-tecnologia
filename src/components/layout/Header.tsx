"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/brand/Wordmark";
import { CtaLink } from "@/components/ui/CtaLink";
import { NAV_ITEMS, NAV_CTA } from "@/content/site";

/* ===== HEADER ===== */
/**
 * Menu enxuto, não navbar genérica: três âncoras e um CTA. Todos os itens
 * apontam para seções que existem nesta página — o site não tem rotas
 * internas, então um item a mais seria um link morto.
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* A hairline inferior só aparece depois que a página sai do topo, para
     que o hero comece sem nenhuma linha cortando a composição. */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Esc fecha o painel e devolve o foco ao botão que o abriu — sem isso o
     foco fica órfão no fim do documento para quem navega por teclado. */
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-navy-900/90 backdrop-blur-sm transition-colors duration-ui ease-brand-in-out ${
        isScrolled ? "border-b hairline" : "border-b border-transparent"
      }`}
    >
      <div className="brand-container flex h-16 items-center justify-between">
        <a
          href="#topo"
          className="shrink-0"
          aria-label="Nelvox — início da página"
        >
          <Wordmark tone="papel" />
        </a>

        {/* Navegação desktop */}
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-body text-[13px] font-medium uppercase tracking-[1.5px] text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <CtaLink variant="secondary" withIcon={false}>
            {NAV_CTA}
          </CtaLink>
        </div>

        {/* Botão do menu mobile */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="menu-mobile"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="flex h-8 w-8 items-center justify-center text-papel-300 lg:hidden"
        >
          {isMenuOpen ? (
            <X size={24} weight="regular" aria-hidden="true" />
          ) : (
            <List size={24} weight="regular" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Painel mobile */}
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!isMenuOpen}
        className="border-t hairline bg-navy-950 lg:hidden"
      >
        <nav aria-label="Principal (mobile)" className="brand-container py-8">
          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="block font-display text-h3 font-light text-papel-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CtaLink variant="secondary" withIcon={false} className="w-full justify-center">
              {NAV_CTA}
            </CtaLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
