import { useId } from "react";
import { forwardRef } from "react";

type FarolSvgProps = {
  className?: string;
  /** Farol apagado (Cena 1A) ou aceso (Cena 1B em diante). */
  lit: boolean;
  /** Feixes só existem quando aceso; escondidos por padrão na doca. */
  showBeams?: boolean;
  /** Halo e feixes acendem com fade de 1200ms (só no clique, não ao carregar já aceso). */
  animateIn?: boolean;
};

/**
 * Geometria do farol, portada sem alteração do handoff
 * (`docs/design-handoff/Home Mockup.dc.html`, grupos `nvFarolOff`,
 * `nvFarolOn` e `nvBeams`). viewBox 1000×720, lâmpada em (500,178).
 *
 * Os ids dos gradientes/clipPath usam useId para que múltiplas
 * instâncias no mesmo documento (não deveria haver mais de uma, mas
 * strict mode monta e desmonta) nunca colidam.
 *
 * O grupo de feixes é encaminhado por ref porque Farol.tsx precisa
 * girá-lo em torno da lâmpada (500,178) via atributo `transform`
 * (rotate), não via CSS — SVG inline resolve isso sem ambiguidade de
 * transform-origin entre navegadores.
 */
export const FarolSvg = forwardRef<SVGGElement, FarolSvgProps>(function FarolSvg(
  { className, lit, showBeams = false, animateIn = false },
  beamsRef,
) {
  const uid = useId();
  const beamR = `nvBeamR-${uid}`;
  const beamL = `nvBeamL-${uid}`;
  const halo = `nvHalo-${uid}`;
  const shade = `nvShade-${uid}`;
  const towerClip = `nvTowerClip-${uid}`;

  return (
    <svg
      viewBox="0 0 1000 720"
      /* overflow-visible: os feixes passam bastante do viewBox (até 2600
         unidades) — sem isso eles são cortados numa borda reta. */
      className={`overflow-visible ${className ?? ""} ${animateIn ? "farol-animate-in" : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={beamR} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F0DFB8" stopOpacity="0.55" />
          <stop offset="0.14" stopColor="#C8B38A" stopOpacity="0.2" />
          <stop offset="0.6" stopColor="#C8B38A" stopOpacity="0.04" />
          <stop offset="1" stopColor="#C8B38A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={beamL} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#F0DFB8" stopOpacity="0.55" />
          <stop offset="0.14" stopColor="#C8B38A" stopOpacity="0.2" />
          <stop offset="0.6" stopColor="#C8B38A" stopOpacity="0.04" />
          <stop offset="1" stopColor="#C8B38A" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={halo} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F0DFB8" stopOpacity="0.75" />
          <stop offset="0.32" stopColor="#C8B38A" stopOpacity="0.24" />
          <stop offset="1" stopColor="#C8B38A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#050D18" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#050D18" stopOpacity="0" />
          <stop offset="1" stopColor="#050D18" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id={towerClip}>
          <path d="M 470 222 L 530 222 L 560 612 L 440 612 Z" />
        </clipPath>
      </defs>

      {showBeams && (
        <g ref={beamsRef} data-farol-beams>
          <polygon points="500,180 2600,-120 2600,480" fill={`url(#${beamR})`} />
          <polygon points="500,180 -1600,-120 -1600,480" fill={`url(#${beamL})`} />
        </g>
      )}

      {lit ? (
        <g data-farol-on>
          <ellipse cx="500" cy="180" rx="150" ry="150" fill={`url(#${halo})`} />
          <path d="M 470 222 L 530 222 L 560 612 L 440 612 Z" fill="#16273D" />
          <g clipPath={`url(#${towerClip})`}>
            <rect x="430" y="262" width="140" height="44" fill="#24354a" />
            <rect x="430" y="350" width="140" height="44" fill="#24354a" />
            <rect x="430" y="438" width="140" height="44" fill="#24354a" />
            <rect x="430" y="526" width="140" height="44" fill="#24354a" />
            <path d="M 470 222 L 530 222 L 560 612 L 440 612 Z" fill={`url(#${shade})`} />
          </g>
          <rect x="489" y="470" width="22" height="42" rx="11" fill="#050D18" opacity="0.7" />
          <rect x="492" y="330" width="14" height="22" rx="7" fill="#050D18" opacity="0.55" />
          <path d="M 456 222 L 544 222 L 538 206 L 462 206 Z" fill="#B89968" />
          <rect x="462" y="200" width="76" height="4" fill="#B89968" />
          <path d="M 478 206 L 478 150 L 522 150 L 522 206 Z" fill="#C8B38A" opacity="0.9" />
          <ellipse
            cx="500"
            cy="178"
            rx="13"
            ry="15"
            fill="#F0DFB8"
            style={{ filter: "drop-shadow(0 0 14px #F0DFB8) drop-shadow(0 0 40px #C8B38A)" }}
          />
          <g stroke="#6b5a3c" strokeWidth="2.5">
            <line x1="489" y1="150" x2="489" y2="206" />
            <line x1="511" y1="150" x2="511" y2="206" />
            <line x1="478" y1="150" x2="478" y2="206" />
            <line x1="522" y1="150" x2="522" y2="206" />
          </g>
          <path d="M 468 150 L 500 112 L 532 150 Z" fill="#A17F4C" />
          <line x1="500" y1="112" x2="500" y2="94" stroke="#B89968" strokeWidth="3" />
          <circle cx="500" cy="90" r="4" fill="#B89968" />
          <path d="M 424 612 L 576 612 L 590 646 L 410 646 Z" fill="#13233a" />
          <rect x="398" y="646" width="204" height="14" fill="#13233a" />
        </g>
      ) : (
        <g data-farol-off>
          <path d="M 470 222 L 530 222 L 560 612 L 440 612 Z" fill="#0A1A2F" />
          <g clipPath={`url(#${towerClip})`}>
            <rect x="430" y="262" width="140" height="44" fill="#102841" />
            <rect x="430" y="350" width="140" height="44" fill="#102841" />
            <rect x="430" y="438" width="140" height="44" fill="#102841" />
            <rect x="430" y="526" width="140" height="44" fill="#102841" />
            <path d="M 470 222 L 530 222 L 560 612 L 440 612 Z" fill={`url(#${shade})`} />
          </g>
          <rect x="489" y="470" width="22" height="42" rx="11" fill="#050D18" opacity="0.7" />
          <rect x="492" y="330" width="14" height="22" rx="7" fill="#050D18" opacity="0.55" />
          <path d="M 456 222 L 544 222 L 538 206 L 462 206 Z" fill="#102841" />
          <rect x="462" y="200" width="76" height="4" fill="#102841" />
          <path d="M 478 206 L 478 150 L 522 150 L 522 206 Z" fill="#0d2138" />
          <g stroke="#1A3B5C" strokeWidth="2.5">
            <line x1="489" y1="150" x2="489" y2="206" />
            <line x1="511" y1="150" x2="511" y2="206" />
            <line x1="478" y1="150" x2="478" y2="206" />
            <line x1="522" y1="150" x2="522" y2="206" />
          </g>
          <path d="M 468 150 L 500 112 L 532 150 Z" fill="#102841" />
          <line x1="500" y1="112" x2="500" y2="94" stroke="#102841" strokeWidth="3" />
          <circle cx="500" cy="90" r="4" fill="#102841" />
          <path d="M 424 612 L 576 612 L 590 646 L 410 646 Z" fill="#0A1A2F" />
          <rect x="398" y="646" width="204" height="14" fill="#0A1A2F" />
        </g>
      )}
    </svg>
  );
});
