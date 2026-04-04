'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Search, Globe, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getMe, type ApiUser } from '@/lib/api';

export default function TopBar() {
  const t = useTranslations('common');
  const [user, setUser] = useState<ApiUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => null);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  function handleSearch(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
  }

  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username
    : '—';
  const initials = user
    ? [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join('').toUpperCase() ||
      user.username.slice(0, 2).toUpperCase()
    : '··';
  return (
    <header
      className="flex justify-between items-center w-full px-8 py-3 sticky top-0 z-40"
      style={{ backgroundColor: '#f8fafc', fontFamily: 'var(--font-manrope), sans-serif', fontSize: '14px', fontWeight: 500 }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--on-surface-variant)' }} />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full text-xs"
            style={{ backgroundColor: 'var(--surface-container-high)', border: 'none', borderRadius: '0.5rem', padding: '8px 16px 8px 40px' }}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="icon" className="relative" style={{ color: 'var(--on-surface-variant)' }}>
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2" style={{ backgroundColor: 'var(--error)', borderColor: '#f8fafc' }} />
          </Button>
          <Button variant="icon" style={{ color: 'var(--on-surface-variant)' }}>
            <Globe size={20} strokeWidth={1.8} />
          </Button>
          <Button variant="icon" style={{ color: 'var(--on-surface-variant)' }}>
            <RefreshCw size={20} strokeWidth={1.8} />
          </Button>
        </div>
        <div className="h-8 w-px" style={{ backgroundColor: 'rgba(171,179,183,0.3)' }} />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none" style={{ color: 'var(--on-surface)' }}>{fullName}</p>
            <p className="font-medium mt-0.5" style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>Plan Premium</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 border-2"
            style={{ background: 'linear-gradient(135deg, #003f3f 0%, #166969 100%)', color: 'var(--primary-container)', fontFamily: 'var(--font-manrope), sans-serif', borderColor: 'var(--primary-container)' }}>
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
