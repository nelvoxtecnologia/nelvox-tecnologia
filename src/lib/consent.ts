/* ===== CONSENTIMENTO (LGPD) ===== */
/**
 * Estado de consentimento de cookies, em localStorage.
 *
 * CONSENT_VERSION existe para reabrir a pergunta quando a política
 * mudar de um jeito que invalide escolhas antigas — subir o número faz
 * `readConsent()` tratar qualquer registro de versão anterior como
 * inexistente, sem precisar apagar nada manualmente.
 *
 * Nenhum acesso a localStorage é assumido como garantido: navegação
 * privada, cookies bloqueados ou quotas esgotadas podem lançar. Nesses
 * casos o site trata como "sem consentimento" — a opção mais segura do
 * ponto de vista de privacidade.
 */
export const CONSENT_VERSION = 1;

export type ConsentState = {
  v: number;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const STORAGE_KEY = "nelvox:consent";

export const CONSENT_CHANGED_EVENT = "nelvox:consent-changed";

function isConsentState(value: unknown): value is ConsentState {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.v === "number" &&
    typeof v.analytics === "boolean" &&
    typeof v.marketing === "boolean" &&
    typeof v.ts === "number"
  );
}

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    /* O localStorage é entrada não confiável (pode ser editado no
       navegador ou por extensão): valida o formato inteiro em vez de
       assumir o tipo. Qualquer divergência vale como "sem consentimento". */
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentState(parsed) || parsed.v !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  const state: ConsentState = {
    v: CONSENT_VERSION,
    analytics,
    marketing,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Sem storage, o consentimento simplesmente não persiste entre visitas. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: state }));
}

/** Abre o diálogo de preferências a partir de qualquer lugar do site. */
export const OPEN_CONSENT_PREFERENCES_EVENT = "nelvox:open-consent-preferences";

export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_PREFERENCES_EVENT));
}

/** Prefixos de cookie por categoria — usados para revogar cada categoria de forma independente. */
export const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"];
export const MARKETING_COOKIE_PREFIXES = ["_fbp", "_fbc"];

/**
 * Remove do domínio os cookies cujo nome bate com um dos prefixos passados.
 * Chamada por categoria (Análise ou Marketing) para que revogar uma não apague
 * cookies da outra categoria ainda consentida (Regra 6: revogar precisa zerar
 * de fato o rastreamento daquela categoria).
 */
export function clearTrackingCookies(prefixes: string[]) {
  const isPrefixed = (cookieName: string, prefix: string) =>
    cookieName === prefix || cookieName.startsWith(`${prefix}_`);

  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (!name) return;
    if (prefixes.some((prefix) => isPrefixed(name, prefix))) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
}
