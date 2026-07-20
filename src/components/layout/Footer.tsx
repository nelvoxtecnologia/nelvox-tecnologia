import { Wordmark } from "@/components/brand/Wordmark";
import { EMAIL, FOOTER } from "@/content/site";

/* ===== FOOTER ===== */
export function Footer() {
  return (
    <footer className="border-t hairline bg-navy-950 py-16">
      <div className="brand-container flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Wordmark tone="papel" />
          <p className="mt-4 font-display text-h3 font-light italic text-gold-400">
            {FOOTER.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <a
            href={`mailto:${EMAIL}`}
            className="font-body text-body text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
          >
            {EMAIL}
          </a>
          <p className="font-body text-caption text-papel-700">
            {FOOTER.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
