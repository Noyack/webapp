// components/Layout/DesktopLayout.tsx
import Navbar from './Navbar';
import { DashboardSearch } from '../UI/SearchInput';
import { DesktopLayoutProps } from '../../types';


export default function DesktopLayout({ children }: DesktopLayoutProps) {
  
  return (
    <div className="min-h-screen grid grid-cols-[256px_1fr] bg-gray-100 ">
      {/* Left Navbar - Fixed width */}
      <div className="h-screen sticky top-0">
        <Navbar />
      </div>
      
      {/* Main Content - Flexible middle column */}
      <main className="overflow-y-auto h-screen py-6 px-5">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <DashboardSearch />
          {children}
        </div>
      </main>
    </div>
  );
}