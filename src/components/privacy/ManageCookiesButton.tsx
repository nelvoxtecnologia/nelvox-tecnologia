"use client";

import { SlidersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { openConsentPreferences } from "@/lib/consent";

/** Abre o diálogo de preferências de cookies (ConsentPreferences, montado no layout). */
export function ManageCookiesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openConsentPreferences}
      data-hot
      className="inline-flex items-center gap-[10px] rounded-sm border border-gold-400 px-[20px] py-[12px] font-body text-[14px] font-semibold tracking-[0.3px] text-gold-400 transition-colors duration-ui ease-brand-in-out hover:border-gold-bright hover:bg-gold-400/10 hover:text-gold-bright"
    >
      <SlidersHorizontal size={16} weight="regular" aria-hidden="true" />
      {label}
    </button>
  );
}
