import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  Users, 
  DollarSign, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BookOpen, label: 'Cursos', path: '/admin/cursos' },
  { icon: Layers, label: 'Módulos', path: '/admin/modulos' },
  { icon: PlaySquare, label: 'Aulas', path: '/admin/aulas' },
  { icon: Users, label: 'Alunos', path: '/admin/alunos' },
  { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro' },
  { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#0B0B0B] border-r border-white/10 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};