"use client";

import { useRef, useState } from "react";
import { NicheCard } from "./NicheCard";
import type { SCENES } from "@/content/site";

type Card = (typeof SCENES)["metodo"]["cards"][number];

/**
 * Grid dos 3 cards de nicho + o diálogo (nativo, `showModal()`) que mostra o
 * detalhamento de qualquer um deles. Um único <dialog> compartilhado (não um
 * por card) — mesmo padrão de ConsentPreferences.tsx, e herda de graça a
 * regra global `dialog[open] { cursor: auto }` já em globals.css.
 */
export function MethodCards({ cards }: { cards: readonly Card[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = cards.find((card) => card.id === activeId) ?? null;

  const open = (id: string) => {
    setActiveId(id);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-[20px] lg:grid-cols-3 lg:gap-6 lg:px-0">
        {cards.map((card, index) => (
          <NicheCard key={card.id} card={card} delayMs={index * 120} onOpen={() => open(card.id)} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active ? `Detalhes — ${active.title}` : "Detalhes da solução"}
        className="m-auto w-[calc(100%-32px)] max-w-[560px] rounded-md border border-navy-700 bg-navy-800 p-8 text-papel-300 backdrop:bg-navy-950/70"
        onClose={() => dialogRef.current?.close()}
      >
        {active && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">{active.eyebrow}</p>
              <h3 className="font-display text-[32px] font-light leading-none text-papel-300">
                {active.title}
              </h3>
            </div>

            <p className="font-body text-[15px] leading-[1.65] text-papel-500">{active.audience}</p>

            <div className="flex flex-col gap-[14px]">
              {active.detail.map((paragraph, index) => (
                <p key={index} className="font-body text-[15px] leading-[1.7] text-papel-500">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col border-t border-navy-700">
              {active.lines.map((line) => (
                <div
                  key={line.label}
                  className="grid grid-cols-[84px_1fr] gap-[12px] border-b border-navy-700 py-[12px]"
                >
                  <span className="eyebrow pt-1 tracking-[3px] text-papel-700">{line.label}</span>
                  <span className="font-body text-[14px] leading-[1.5] text-papel-500">{line.text}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              data-hot
              className="self-start rounded-sm border border-navy-700 px-4 py-2 font-body text-[13px] font-semibold text-papel-300 transition-colors duration-ui ease-brand-in-out hover:border-papel-500"
            >
              Fechar
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
