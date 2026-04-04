'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const t = useTranslations('settings.language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <section
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        boxShadow: '0px 10px 30px rgba(43, 52, 55, 0.06)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--on-surface)',
          marginBottom: '0.25rem',
        }}
      >
        {t('sectionTitle')}
      </h2>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--on-surface-variant)',
          marginBottom: '1rem',
        }}
      >
        {t('sectionDescription')}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {routing.locales.map((loc) => {
          const isActive = loc === locale;
          return (
            <button
              key={loc}
              onClick={() => handleChange(loc)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: isActive ? 'default' : 'pointer',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--primary)' : 'var(--surface-container-high)',
                color: isActive ? 'var(--on-primary)' : 'var(--on-surface)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {t(loc as 'en' | 'fr')}
            </button>
          );
        })}
      </div>
    </section>
  );
}
