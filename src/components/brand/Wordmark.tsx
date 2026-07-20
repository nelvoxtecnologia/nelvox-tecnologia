import { NelvoxSymbol } from "./NelvoxSymbol";

type WordmarkProps = {
  className?: string;
  /** Oculta o símbolo, deixando só o texto (rodapé, espaços estreitos). */
  textOnly?: boolean;
  /** Papel para uso neutro, Gold para o lockup principal. */
  tone?: "gold" | "papel";
};

/**
 * Lockup NELVOX.
 *
 * O texto é composto ao vivo em General Sans, e não a imagem do wordmark:
 * o manual especifica caixa alta com letter-spacing de 6px, e texto real
 * fica nítido em qualquer densidade de tela, é selecionável e não custa
 * uma requisição. O PNG do wordmark segue disponível em public/brand para
 * Open Graph, onde texto não é opção.
 */
export function Wordmark({
  className = "",
  textOnly = false,
  tone = "papel",
}: WordmarkProps) {
  const toneClass = tone === "gold" ? "text-gold-400" : "text-papel-300";

  return (
    <span className={`inline-flex items-center gap-2 ${toneClass} ${className}`}>
      {!textOnly && (
        <NelvoxSymbol className="h-6 w-6 shrink-0 text-gold-400" />
      )}
      <span className="wordmark text-[15px] leading-none">NELVOX</span>
    </span>
  );
}
