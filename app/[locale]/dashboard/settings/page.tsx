import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/settings/LanguageSwitcher";

export default async function SettingsPage() {
  const t = await getTranslations('settings');
  return (
    <div style={{ padding: '1.5rem', maxWidth: '40rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          color: 'var(--on-surface)',
          fontSize: '1.5rem',
          fontWeight: 700,
        }}
      >
        {t('title')}
      </h1>
      <LanguageSwitcher />
    </div>
  );
}
