import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, User, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-atlon-green/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/meus-cursos'} className="flex items-center space-x-3">
            <img 
              src="/atlon-logo-profile.png" 
              alt="Atlon" 
              className="h-10 w-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold gradient-atlon-text">
                ATLON ACADEMY
              </h1>
              <span className="text-[10px] text-gray-400 -mt-1">Educação para Profissionais</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/meus-cursos" 
              className="text-gray-300 hover:text-atlon-green transition-colors flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Meus Cursos</span>
            </Link>
            <Link 
              to="/ofertas" 
              className="text-gray-300 hover:text-atlon-green transition-colors"
            >
              Ofertas
            </Link>
            <Link 
              to="/suporte" 
              className="text-gray-300 hover:text-atlon-green transition-colors"
            >
              Suporte
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300 hover:text-atlon-green hover:bg-atlon-green/10"
            >
              <Search className="h-5 w-5" />
            </Button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                    <span>Nível {user.level || 1}</span>
                    <Badge variant="outline" className="border-atlon-green/30 text-atlon-green text-[10px] px-1 py-0">
                      {user.xp || 0} XP
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative hover:opacity-80 transition-opacity">
                      <Avatar className="border-2 border-atlon-green/30">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-atlon-green/20 text-atlon-green">
                          {user?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {user.streak && user.streak > 0 && (
                        <div className="absolute -top-1 -right-1 bg-atlon-green text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {user.streak}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-atlon-green/10">
                    <div className="px-2 py-3 border-b border-atlon-green/10">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {user.profession && (
                        <Badge variant="outline" className="mt-2 border-atlon-green/30 text-atlon-green text-xs">
                          {user.profession === 'personal_trainer' ? 'Personal Trainer' : 'Nutricionista'}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-atlon-green/10">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-atlon-green/10">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Meus Certificados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-atlon-green/10" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-atlon-green/10">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/meus-cursos" 
                className="text-gray-300 hover:text-atlon-green transition-colors flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Meus Cursos</span>
              </Link>
              <Link 
                to="/ofertas" 
                className="text-gray-300 hover:text-atlon-green transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ofertas
              </Link>
              <Link 
                to="/suporte" 
                className="text-gray-300 hover:text-atlon-green transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Suporte
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:text-red-300 transition-colors"
              >
                Sair
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};