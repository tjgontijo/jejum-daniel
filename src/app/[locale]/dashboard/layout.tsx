import { ReactNode } from 'react';
import Header from '@/components/dashboard/header';
import Footer from '@/components/dashboard/footer';

export default function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--theme-color-dark)]">
      <Header />                
      <main className="w-full flex-1 bg-[var(--theme-color-dark)] px-4 py-4">            
        {children}            
      </main>
      <Footer />          
    </div>
  );
}
