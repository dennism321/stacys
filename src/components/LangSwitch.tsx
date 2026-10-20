import { useLang, useT } from '../i18n';
import { pagePath } from '../paths';

/** Links to the same page in the other language (English ⇄ Español). */
export default function LangSwitch({ slug, className = '' }: { slug?: string; className?: string }) {
  const lang = useLang();
  const t = useT();
  const other = lang === 'en' ? 'es' : 'en';

  return (
    <a className={`lang-switch ${className}`} href={pagePath(other, slug)} hrefLang={other} lang={other} title={t.switchLabel} aria-label={t.switchLabel}>
      <span className="lang-switch-full">{t.switchTo}</span>
      <span className="lang-switch-short" aria-hidden="true">{t.switchToShort}</span>
    </a>
  );
}
