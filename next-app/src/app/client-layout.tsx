'use client';

import { LangProvider } from '@/context/LangContext';
import SessionProvider from '@/components/SessionProvider';
import ScrollProgress from '@/components/ScrollProgress';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LangProvider>
        <ScrollProgress />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </LangProvider>
    </SessionProvider>
  );
}
