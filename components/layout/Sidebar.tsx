'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Target,
  CreditCard, BarChart3, Settings,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import IconBox from '@/components/ui/IconBox';

export default function Sidebar() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard' as const, icon: LayoutDashboard, label: t('dashboard') },
    { href: '/dashboard/transactions' as const, icon: ArrowLeftRight, label: t('transactions') },
    { href: '/dashboard/budgets' as const, icon: PieChart, label: t('budgets') },
    { href: '/dashboard/goals' as const, icon: Target, label: t('goals') },
    { href: '/dashboard/accounts' as const, icon: CreditCard, label: t('accounts') },
    { href: '/dashboard/reports' as const, icon: BarChart3, label: t('reports') },
    { href: '/dashboard/settings' as const, icon: Settings, label: t('settings') },
  ];

  return (
    <aside className="flex flex-col h-screen sticky top-0 w-64 shrink-0 py-6 space-y-2" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Brand */}
      <div className="px-8 mb-8">
        <div className="flex items-center gap-3">
          <IconBox bg="var(--primary)" color="var(--on-primary)" size="lg" shape="rounded-xl">
            <CreditCard size={18} />
          </IconBox>
          <div>
            <h1
              className="text-lg font-black uppercase tracking-widest leading-none"
              style={{ fontFamily: 'var(--font-manrope), sans-serif', color: '#166969' }}
            >
              {tCommon('appName')}
            </h1>
            <p className="font-bold uppercase tracking-tighter opacity-70" style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>
              {tCommon('appTagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 ml-4 pl-4 py-3 text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                borderRadius: isActive ? '9999px 0 0 9999px' : '0',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#006A6A' : '#64748b',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Add Transaction CTA */}
      <div className="px-6 mt-auto">
        <Button variant="primary" size="lg" style={{ width: '100%', justifyContent: 'center' }}>
          {t('addTransaction')}
        </Button>
      </div>
    </aside>
  );
}
