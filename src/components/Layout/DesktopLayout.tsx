// components/Layout/DesktopLayout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Aside from './Aside';

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr_300px] bg-gray-100">
      {/* Left Navbar - Fixed width */}
      <div className="h-screen sticky top-0">
        <Navbar />
      </div>
      
      {/* Main Content - Flexible middle column */}
      <main className="overflow-y-auto h-screen py-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Right Aside - Fixed width */}
      <div className="h-screen sticky top-0">
        <Aside />
      </div>
    </div>
  );
}