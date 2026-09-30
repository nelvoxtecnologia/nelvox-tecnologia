"use client";

import { useEffect, useState } from "react";
import { readConsent, saveConsent, openConsentPreferences } from "@/lib/consent";
import { FAROL_LIT_EVENT, isFarolLit } from "@/lib/farolEvents";
import { PRELOADER_DONE_EVENT } from "@/components/preloader/preloaderEvents";
import { FOOTER_LINKS } from "@/content/site";

const SHOW_DELAY_MS = 1200;

/**
 * Banner de cookies. Opt-in real: nada de GA/Meta carrega antes de
 * "Aceitar" (ver Tracking.tsx, que só lê o consentimento salvo por
 * este componente).
 *
 * Espera o farol acender (home) ou o preloader terminar (demais
 * páginas, onde não há farol para acender) antes de aparecer — nunca
 * compete com a primeira impressão. Não aparece se já existe uma
 * escolha salva.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() !== null) return;

    let timer = 0;
    const show = () => {
      timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    const hasFarol = document.querySelector("[data-farol-wrapper]") !== null;

    if (hasFarol && !isFarolLit()) {
      const onLit = () => show();
      window.addEventListener(FAROL_LIT_EVENT, onLit, { once: true });
      return () => {
        window.removeEventListener(FAROL_LIT_EVENT, onLit);
        window.clearTimeout(timer);
      };
    }

    if (document.documentElement.dataset.preloader === "done") {
      show();
    } else {
      const onDone = () => show();
      window.addEventListener(PRELOADER_DONE_EVENT, onDone, { once: true });
      return () => {
        window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
        window.clearTimeout(timer);
      };
    }

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVisible(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  const accept = () => {
    saveConsent(true, true);
    setVisible(false);
  };

  const decline = () => {
    saveConsent(false, false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Preferências de cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[380px] flex-col gap-[12px] rounded-md border border-navy-700 bg-navy-800 p-[20px] shadow-[0_20px_60px_-20px_rgba(0,0,0,.6)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-[320px]"
    >
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Privacidade</p>
        <p className="font-body text-[13px] leading-[1.5] text-papel-300">
          Usamos cookies para entender como o site é usado e medir anúncios.
          Só ativamos com a sua permissão.
        </p>
      </div>

      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          onClick={accept}
          data-hot
          className="flex-1 rounded-sm bg-gold-400 px-4 py-[8px] font-body text-[13px] font-semibold text-navy-950 transition-colors duration-ui ease-brand-in-out hover:bg-gold-300"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={decline}
          data-hot
          className="flex-1 rounded-sm border border-navy-700 px-4 py-[8px] font-body text-[13px] font-semibold text-papel-300 transition-colors duration-ui ease-brand-in-out hover:border-papel-500"
        >
          Recusar
        </button>
      </div>

      <div className="flex items-center gap-2 border-t border-navy-700 pt-[10px] text-[12px]">
        <button
          type="button"
          onClick={openConsentPreferences}
          data-hot
          className="text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
        >
          Preferências
        </button>
        <span className="text-papel-700">·</span>
        <a
          href={FOOTER_LINKS.privacidade.href}
          data-hot
          className="text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
        >
          Política de privacidade
        </a>
      </div>
    </div>
  );
}
