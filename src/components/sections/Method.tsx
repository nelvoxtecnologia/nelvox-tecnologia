import { Headline } from "@/components/ui/Headline";
import { METHOD } from "@/content/site";

/* ===== MÉTODO ===== */
/**
 * Quatro blocos que atravessam a tela horizontalmente enquanto a página
 * é rolada. A seção fica presa no lugar e o trilho corre para o lado —
 * o movimento lateral quebra a monotonia do scroll vertical e obriga a
 * leitura a passar por cada bloco, em vez de sobrevoá-los.
 *
 * A assimetria continua: cada bloco tem largura e deslocamento vertical
 * próprios, então o trilho não lê como um carrossel de cards iguais.
 *
 * Em telas menores nada disso acontece — o trilho vira uma pilha e o
 * scroll segue vertical. Prender a página no celular para mover conteúdo
 * de lado é desorientador, e o ganho estético não paga o custo.
 */

/** Largura e deslocamento de cada bloco no trilho (desktop). */
const LAYOUT = [
  "lg:w-[380px] lg:mt-0",
  "lg:w-[440px] lg:mt-16",
  "lg:w-[380px] lg:mt-6",
  "lg:w-[420px] lg:mt-24",
];

export function Method() {
  return (
    <section
      id="metodo"
      data-animate="section"
      data-horizontal
      className="scroll-mt-16 overflow-hidden border-t hairline py-28 lg:py-48"
    >
      <div className="brand-container">
        <div className="max-w-[52ch]">
          <p data-animate-item className="eyebrow">
            {METHOD.eyebrow}
          </p>
          <Headline
            content={METHOD.headline}
            data-animate-item
            data-reveal="mask"
            className="mt-6 text-[clamp(30px,4vw,48px)] leading-[1.1]"
          />
        </div>
      </div>

      {/* O trilho começa alinhado à margem do container e se estende para
          fora da tela à direita; o GSAP o desloca conforme o scroll. */}
      <ol
        data-horizontal-track
        className="mt-20 flex flex-col px-[20px] lg:mt-28 lg:w-max lg:flex-row lg:items-start lg:gap-16 lg:px-20"
      >
        {METHOD.items.map((item, index) => (
          <li
            key={item.number}
            data-animate-item
            className={`mt-16 shrink-0 first:mt-0 ${LAYOUT[index]}`}
          >
            <div className="flex items-baseline gap-4">
              <span aria-hidden="true" className="font-body text-eyebrow text-gold-400">
                {item.number}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-navy-700" />
            </div>

            <h3 className="mt-6 font-display text-[clamp(24px,2.6vw,32px)] font-light leading-[1.15] text-papel-300">
              {item.title}
            </h3>
            <p className="mt-4 text-body text-papel-500">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
