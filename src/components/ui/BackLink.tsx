import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

/**
 * Link de volta usado no topo das páginas secundárias (Quem somos,
 * Política de Privacidade, Planos) — nenhuma delas tinha um jeito
 * explícito de voltar além do wordmark do Header.
 */
export function BackLink({ href = "/", label = "Voltar para o início" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      data-hot
      className="eyebrow inline-flex items-center gap-2 text-papel-700 transition-colors duration-ui ease-brand-in-out hover:text-gold-bright"
    >
      <ArrowLeft size={14} weight="regular" aria-hidden="true" />
      {label}
    </Link>
  );
}
