import { Headline } from "@/components/ui/Headline";
import { METHOD } from "@/content/site";

/* ===== MÉTODO ===== */
/**
 * Quatro blocos em composição deliberadamente assimétrica: larguras e
 * deslocamentos verticais diferentes entre si, para que a leitura desça
 * em zigue-zague em vez de cair no ritmo previsível de um grid 2x2
 * espelhado.
 *
 * Em telas pequenas tudo empilha na ordem numérica — assimetria em 4
 * colunas viraria só desalinhamento.
 */

/**
 * Posição e deslocamento de cada bloco no grid de 12 colunas (desktop).
 *
 * Todos declaram o próprio `lg:mt-*`, inclusive o primeiro com zero. Se
 * o offset padrão viesse de uma classe no <li> e fosse sobrescrito aqui,
 * o resultado dependeria da ordem em que o Tailwind emite as regras —
 * duas classes de mesma especificidade, decididas por quem vem depois no
 * arquivo. Declarar por item torna isso explícito.
 */
const LAYOUT = [
  "lg:col-span-5 lg:col-start-1 lg:mt-0",
  "lg:col-span-6 lg:col-start-7 lg:mt-16",
  "lg:col-span-5 lg:col-start-2 lg:mt-8",
  "lg:col-span-5 lg:col-start-8 lg:mt-24",
];

export function Method() {
  return (
    <section
      id="metodo"
      data-animate="section"
      className="scroll-mt-16 border-t hairline py-28 lg:py-48"
    >
      <div className="brand-container">
        <div className="max-w-[52ch]">
          <p data-animate-item className="eyebrow">
            {METHOD.eyebrow}
          </p>
          <Headline
            content={METHOD.headline}
            data-animate-item
            className="mt-6 text-[clamp(30px,4vw,48px)] leading-[1.1]"
          />
        </div>

        <ol className="mt-20 grid grid-cols-4 gap-gutter-mobile lg:grid-cols-brand lg:gap-gutter">
          {METHOD.items.map((item, index) => (
            <li
              key={item.number}
              data-animate-item
              className={`col-span-4 mt-16 first:mt-0 ${LAYOUT[index]}`}
            >
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden="true"
                  className="font-body text-eyebrow text-gold-400"
                >
                  {item.number}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-navy-700"
                />
              </div>

              <h3 className="mt-6 font-display text-[clamp(24px,2.6vw,32px)] font-light leading-[1.15] text-papel-300">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[44ch] text-body text-papel-500">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
