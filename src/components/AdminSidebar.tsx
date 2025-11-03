import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  Users, 
  DollarSign, 
  Settings,
  Sparkles,
  Megaphone
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BookOpen, label: 'Cursos', path: '/admin/cursos' },
  { icon: Layers, label: 'Módulos', path: '/admin/modulos' },
  { icon: PlaySquare, label: 'Aulas', path: '/admin/aulas' },
  { icon: Users, label: 'Alunos', path: '/admin/alunos' },
  { icon: Megaphone, label: 'Marketing', path: '/admin/marketing' },
  { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro' },
  { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#060606] border-r border-atlon-green/10 overflow-y-auto tech-grid">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-atlon-green to-transparent"></div>
      
      <nav className="p-4 space-y-2">
        <div className="mb-6 px-4 py-3 bg-gradient-to-r from-atlon-green/10 to-transparent rounded-lg border border-atlon-green/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-atlon-green animate-pulse" />
            <span className="text-xs font-bold text-atlon-green tracking-wider uppercase">Painel Admin</span>
          </div>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'bg-atlon-green text-black font-bold shadow-neon'
                  : 'text-gray-400 hover:text-atlon-green hover:bg-atlon-green/5'
              }`}
            >
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-atlon-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
              )}
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                isActive ? 'bg-black' : 'bg-transparent group-hover:bg-atlon-green'
              }`}></div>
              
              <Icon className={`h-5 w-5 relative z-10 transition-transform group-hover:scale-110 ${
                isActive ? 'text-black' : ''
              }`} />
              <span className="font-medium relative z-10">{item.label}</span>
              {isActive && (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-atlon-green/20 blur-xl rounded-full"></div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full animate-pulse"></div>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-atlon-green/10 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <div className="w-2 h-2 bg-atlon-green rounded-full animate-pulse"></div>
          <span>Sistema Online</span>
        </div>
      </div>
    </aside>
  );
};