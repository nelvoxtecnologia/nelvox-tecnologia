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
 *
 * Cada palavra é envolvida em dois spans: o de fora recorta, o de dentro
 * desliza. É o que permite revelar a frase palavra a palavra, subindo de
 * trás de uma máscara, em vez de fazer o bloco inteiro aparecer. Sem
 * JavaScript os spans não têm efeito nenhum e o texto fica normal.
 */
export function Headline({
  content,
  as = "h2",
  className = "",
  ...rest
}: HeadlineProps) {
  const Tag = as;
  const words = content.lead.split(" ").filter(Boolean);

  return (
    <Tag className={`font-display font-light text-papel-300 ${className}`} {...rest}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="reveal-word">
          <span className="reveal-word__inner">{word}</span>{" "}
        </span>
      ))}
      <em className="reveal-word italic text-gold-400">
        <span className="reveal-word__inner">{content.accent}</span>
      </em>
    </Tag>
  );
}
