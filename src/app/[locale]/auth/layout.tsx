import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactNode } from 'react';
import '@/app/globals.css';

export default function AuthLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--theme-color)]">
        <div className="w-full max-w-md p-8 space-y-8 bg-[var(--theme-color-light)] rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
