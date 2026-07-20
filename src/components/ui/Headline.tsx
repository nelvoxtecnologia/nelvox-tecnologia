import type { ComponentPropsWithoutRef } from "react";
import type { Headline as HeadlineContent } from "@/content/site";

type HeadlineProps = {
  content: HeadlineContent;
  /** Renderiza como h1 ou h2 conforme a posição na hierarquia da página. */
  as?: "h1" | "h2";
} & Omit<ComponentPropsWithoutRef<"h2">, "content">;

/**
 * A técnica expressiva assinatura da marca: Cormorant Light com
 * exatamente uma palavra final em Italic + Gold.
 *
 * Centralizar isso em um componente é o que garante a regra de "máximo
 * uma palavra por headline" — o conteúdo entrega `lead` e `accent`
 * separados, então não há como grifar meia frase por descuido.
 */
export function Headline({
  content,
  as = "h2",
  className = "",
  ...rest
}: HeadlineProps) {
  const Tag = as;

  return (
    <Tag className={`font-display font-light text-papel-300 ${className}`} {...rest}>
      {content.lead} <em className="italic text-gold-400">{content.accent}</em>
    </Tag>
  );
}
