import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { contactHref } from "@/content/site";

type CtaLinkProps = {
  children: React.ReactNode;
  /** primary é preenchido em Gold; secondary é contorno hairline. */
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  withIcon?: boolean;
};

/**
 * CTA de contato. Todos os CTAs do site apontam para o mesmo destino
 * (contactHref), então o número de WhatsApp muda em um lugar só.
 *
 * O ícone Phosphor vem do entrypoint /ssr: os componentes normais são
 * client-side e forçariam toda a árvore a virar client component só para
 * desenhar uma seta.
 */
export function CtaLink({
  children,
  variant = "primary",
  size = "md",
  className = "",
  withIcon = true,
}: CtaLinkProps) {
  const base =
    "group inline-flex items-center gap-2 rounded-sm font-body font-semibold " +
    "tracking-[0.3px] transition-colors duration-ui ease-brand-in-out";

  const sizes = {
    md: "px-6 py-2 text-[15px]",
    lg: "px-8 py-4 text-[16px]",
  };

  /* O primário é um degradê de Papel para Gold na diagonal, como no
     mockup de referência — o metal só lê como metal quando tem variação
     de luz na superfície. O manual proíbe gradiente em campos de fundo,
     não em controles. */
  const variants = {
    primary:
      "border border-gold-300 bg-gradient-to-br from-papel-100 via-gold-300 to-gold-500 text-navy-950 " +
      "hover:from-papel-50 hover:via-gold-200 hover:to-gold-400",
    secondary:
      "bg-transparent text-gold-400 border border-gold-400 hover:bg-gold-400 hover:text-navy-950",
  };

  return (
    <a
      href={contactHref()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
      {withIcon && (
        <ArrowRight
          size={16}
          weight="regular"
          aria-hidden="true"
          className="transition-transform duration-ui ease-brand-in-out group-hover:translate-x-1"
        />
      )}
    </a>
  );
}
