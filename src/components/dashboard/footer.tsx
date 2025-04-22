'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCalendar, FiBarChart2, FiUser } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations('footer');
  // Botões: Home, Dias, Progresso, Perfil
  const buttons = [
    { href: '/dashboard', icon: <FiHome />, label: t('home', {default: 'Início'}) },
    { href: '/dashboard/days', icon: <FiCalendar />, label: t('days', {default: 'Dias'}) },
    { href: '/dashboard/progress', icon: <FiBarChart2 />, label: t('progress', {default: 'Progresso'}) },
    { href: '/dashboard/profile', icon: <FiUser />, label: t('profile', {default: 'Perfil'}) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--theme-color)] border-t border-[var(--accent-color)]/20 shadow-lg">
      <ul className="flex justify-around items-center h-16">
        {buttons.map((btn) => (
          <li key={btn.href}>
            <Link href={btn.href} className={`flex flex-col items-center justify-center text-xs transition-colors px-2 py-1 h-full w-full ${pathname === btn.href ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)] hover:text-[var(--accent-color)]'}`}
            >
              <span className="text-xl mb-1">{btn.icon}</span>
              {btn.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
