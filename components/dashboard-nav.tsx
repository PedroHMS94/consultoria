'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  BarChart3,
  FileUp,
  FileDown,
} from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Alunos',
    href: '/dashboard/students',
    icon: Users,
  },
  {
    title: 'Relatórios',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Importar Dados',
    href: '/dashboard/import',
    icon: FileUp,
  },
  {
    title: 'Exportar Dados',
    href: '/dashboard/export',
    icon: FileDown,
  },
  {
    title: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Controle de Vendas
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{session?.user?.name || session?.user?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white shadow-lg">
        <nav className="flex flex-col h-full p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content spacer */}
      <div className="ml-64" />
    </>
  );
}
