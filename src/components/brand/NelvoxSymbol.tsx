import { forwardRef } from "react";
import { SYMBOL_SHAPES, SYMBOL_VIEWBOX } from "./symbolPaths";

type NelvoxSymbolProps = {
  className?: string;
  /**
   * "solid" preenche as formas (uso normal: header, footer).
   * "outline" desenha só o contorno, que é o estado inicial do preloader
   * antes do traço ser preenchido.
   */
  variant?: "solid" | "outline";
  /** Espessura do traço em unidades do viewBox (3000 = largura total). */
  strokeWidth?: number;
  title?: string;
};

/**
 * O símbolo Nelvox como SVG inline.
 *
 * Precisa ser inline (e não <img>) porque o preloader anima cada path
 * individualmente via stroke-dashoffset — algo impossível com uma imagem.
 * Os paths recebem `data-shape` para que a timeline os selecione por nome
 * em vez de por índice, que quebraria silenciosamente se a ordem mudasse.
 */
export const NelvoxSymbol = forwardRef<SVGSVGElement, NelvoxSymbolProps>(
  function NelvoxSymbol(
    { className, variant = "solid", strokeWidth = 10, title },
    ref,
  ) {
    const isOutline = variant === "outline";

    return (
      <svg
        ref={ref}
        viewBox={SYMBOL_VIEWBOX}
        className={className}
        role={title ? "img" : "presentation"}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        focusable="false"
      >
        {title ? <title>{title}</title> : null}
        {SYMBOL_SHAPES.map((shape) => (
          <path
            key={shape.id}
            data-shape={shape.id}
            d={shape.d}
            fill={isOutline ? "none" : "currentColor"}
            stroke={isOutline ? "currentColor" : "none"}
            strokeWidth={isOutline ? strokeWidth : undefined}
            strokeLinejoin={isOutline ? "round" : undefined}
            strokeLinecap={isOutline ? "round" : undefined}
            vectorEffect={isOutline ? "non-scaling-stroke" : undefined}
          />
        ))}
      </svg>
    );
  },
);
