'use client'

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { FiBell, FiSettings } from 'react-icons/fi';

const HeaderComponent = () => {
  const t = useTranslations('dashboard');

  return (
    <nav className="w-full z-50 bg-[var(--theme-color)] border-b border-[var(--accent-color)]/20 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Image
              src="/icons/logo.png"
              alt={t('logoAlt', {default: 'Jejum Daniel Logo'})} 
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <h1 className="text-md font-semibold text-[var(--accent-color)]">
            {t('title', {default: 'Jejum de Daniel'})} 
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors">
            <FiBell className="h-6 w-6" />
          </button>
          <button className="text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors">
            <FiSettings className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;