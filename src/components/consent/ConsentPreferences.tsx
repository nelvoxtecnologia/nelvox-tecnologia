"use client";

import { useEffect, useRef, useState } from "react";
import { OPEN_CONSENT_PREFERENCES_EVENT, readConsent, saveConsent } from "@/lib/consent";

type Category = {
  key: "analytics" | "marketing";
  title: string;
  description: string;
};

const CATEGORIES: Category[] = [
  {
    key: "analytics",
    title: "Análise",
    description: "Google Analytics — como o site é usado, para melhorá-lo.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Meta Pixel — desempenho de anúncios e campanhas mais relevantes.",
  },
];

/**
 * Diálogo de preferências de cookies. Fica montado em toda página (ver
 * layout.tsx) e abre a partir de qualquer lugar via
 * `openConsentPreferences()` — o banner, o rodapé e o menu mobile
 * disparam o mesmo evento em vez de gerenciar estado próprio.
 */
export function ConsentPreferences() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, onOpen);
  }, []);

  const save = () => {
    saveConsent(analytics, marketing);
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Preferências de cookies"
      className="m-auto w-[calc(100%-32px)] max-w-[420px] rounded-md border border-navy-700 bg-navy-800 p-6 text-papel-300 backdrop:bg-navy-950/70"
      onClose={() => dialogRef.current?.close()}
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow">Privacidade</p>
          <h2 className="mt-2 font-display text-h3 font-light text-papel-300">
            Preferências de cookies
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 border-b border-navy-700 pb-4">
            <div>
              <p className="font-body text-[14px] font-semibold text-papel-300">Necessários</p>
              <p className="font-body text-[13px] text-papel-500">
                Guarda sua escolha de cookies. Sempre ativo.
              </p>
            </div>
            <input type="checkbox" checked disabled aria-label="Necessários (sempre ativo)" />
          </div>

          {CATEGORIES.map((category) => (
            <div key={category.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-body text-[14px] font-semibold text-papel-300">
                  {category.title}
                </p>
                <p className="font-body text-[13px] text-papel-500">{category.description}</p>
              </div>
              <input
                type="checkbox"
                aria-label={category.title}
                checked={category.key === "analytics" ? analytics : marketing}
                onChange={(event) =>
                  category.key === "analytics"
                    ? setAnalytics(event.target.checked)
                    : setMarketing(event.target.checked)
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-[12px]">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-sm border border-navy-700 px-4 py-2 font-body text-[13px] text-papel-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-sm bg-gold-400 px-4 py-2 font-body text-[13px] font-semibold text-navy-950"
          >
            Salvar
          </button>
        </div>
      </div>
    </dialog>
  );
}
