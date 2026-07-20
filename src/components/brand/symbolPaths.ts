/* ===== GEOMETRIA DO SÍMBOLO ===== */
/**
 * Os quatro paths do símbolo Nelvox, extraídos sem alteração do arquivo
 * vetorial oficial (Identidade Visual/Nelvox Logo/Nelvox_Logo_Oficial/
 * SVG_Vector/Nelvox_Vector-01-01.svg, viewBox 0 0 3000 3000).
 *
 * Os gradientes do arquivo original foram descartados aqui: o símbolo é
 * pintado com cor sólida da paleta, e no preloader ele precisa ser
 * traçado como linha antes de ser preenchido.
 *
 * O viewBox quadrado original é mantido. O desenho não o preenche por
 * inteiro, e essa folga é a área de proteção da marca exigida pelo
 * manual — recortar mais justo economizaria pixels e violaria a regra.
 */

export const SYMBOL_VIEWBOX = "0 0 3000 3000";

export type SymbolShape = {
  id: string;
  d: string;
};

/**
 * Ordem deliberada de desenho no preloader.
 *
 * As duas foices (left, right) abrem o envelope da letra; as duas
 * diagonais (top, center) descem e fecham o N. Nessa sequência a
 * animação é lida como a letra sendo escrita. Desenhar as diagonais
 * primeiro faria parecer quatro formas surgindo em ordem arbitrária.
 */
export const SYMBOL_SHAPES: SymbolShape[] = [
  {
    id: "left",
    d: "M907.85,898.13c90.13,54.39,217.18,175.86,277.41,265.6-83.04,175.02-203.71,377.62-265.75,555.77-99.07,285.39-53.31,681.59,120.91,914.53,2.69,3.93-1.52,8.87-5.85,6.9-262.89-109.59-522.29-400.75-581.54-720.22-63.23-352.03,105.24-819.54,454.83-1022.58Z",
  },
  {
    id: "right",
    d: "M2117.77,2132.26c-87.19-65.74-223.16-213.92-288.35-303.6,236.24-476.38,485.64-954.01,148.13-1456.73-2.64-3.95,1.61-8.85,5.93-6.84,250.82,106.95,536.71,409.35,555.08,734.16,16.95,239.57-2.33,474.69-199.25,755.53-32.98,47.04-220.06,278.56-221.54,277.48Z",
  },
  {
    id: "top",
    d: "M1786.32,1786.17c-264.38-313.13-528.76-626.26-793.14-939.39-163.29-199.59-424.57-154.63-593.18-49.43,148.11-226.39,544.44-629.31,896.72-182.09,107.85,127.92,546.79,663.48,658.41,803.33-56.27,122.52-112.54,245.05-168.81,367.57Z",
  },
  {
    id: "center",
    d: "M1217.07,1193.53c263.31,314.03,526.62,628.06,789.92,942.09,162.6,200.15,424.04,156.09,593,51.46-148.88,225.88-546.59,627.45-897.34,179.02-107.41-128.29-544.52-665.35-655.66-805.58,56.69-122.33,113.38-244.66,170.07-366.99Z",
  },
];
