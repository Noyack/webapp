// components/Layout/DesktopLayout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Aside from './Aside';

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-[auto_1fr_auto]">
      {/* Left Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        {children}
      </main>
      
      {/* Right Aside */}
      <Aside />
    </div>
  );
}