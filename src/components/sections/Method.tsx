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

/**
 * Largura de cada bloco no trilho.
 *
 * Os blocos ficam alinhados pelo topo de propósito. Com deslocamentos
 * verticais diferentes, o trilho em movimento fazia os textos subirem e
 * descerem enquanto passavam, e a leitura virava bagunça — a assimetria
 * que funciona parada não sobrevive ao movimento lateral. A variação
 * ficou só nas larguras, que muda o ritmo sem desalinhar a base.
 */
const LAYOUT = [
  "lg:w-[360px]",
  "lg:w-[440px]",
  "lg:w-[380px]",
  "lg:w-[420px]",
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

        {/* Trilha de progresso do movimento lateral. Sem ela a seção
            presa não dá pistas de quanto falta, e o scroll horizontal
            passa a sensação de estar perdido em vez de conduzido. */}
        <div
          aria-hidden="true"
          className="mt-16 hidden h-px w-[220px] bg-navy-700 lg:block"
        >
          <div
            data-horizontal-progress
            className="h-px w-full origin-left scale-x-0 bg-gold-400"
          />
        </div>
      </div>

      {/* O trilho começa alinhado à margem do container e se estende para
          fora da tela à direita; o GSAP o desloca conforme o scroll.
          A folga final evita que o último bloco encoste na borda quando o
          movimento termina. */}
      <ol
        data-horizontal-track
        className="mt-20 flex flex-col px-[20px] lg:mt-28 lg:w-max lg:flex-row lg:items-start lg:gap-20 lg:pl-20 lg:pr-28"
      >
        {METHOD.items.map((item, index) => (
          <li
            key={item.number}
            data-animate-item
            className={`mt-16 shrink-0 first:mt-0 lg:mt-0 ${LAYOUT[index]}`}
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
