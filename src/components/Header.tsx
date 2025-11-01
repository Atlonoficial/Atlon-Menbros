import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, User, BookOpen, Zap } from 'lucide-react';
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-atlon-green/20 scan-line">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-atlon-green/5 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/meus-cursos'} className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/Logo perfil Atlon!.png" 
                alt="Atlon" 
                className="h-10 w-10 transition-transform group-hover:scale-110 animate-float"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-atlon-green/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold gradient-atlon-text tracking-wider">
                ATLON ACADEMY
              </h1>
              <span className="text-[9px] text-gray-500 tracking-widest uppercase">Powered by AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/meus-cursos" 
              className="text-gray-400 hover:text-atlon-green transition-all flex items-center space-x-2 group relative"
            >
              <BookOpen className="h-4 w-4 group-hover:animate-pulse" />
              <span className="font-medium">Meus Cursos</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-atlon-green group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link 
              to="/ofertas" 
              className="text-gray-400 hover:text-atlon-green transition-all group relative"
            >
              <span className="font-medium">Ofertas</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-atlon-green group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link 
              to="/suporte" 
              className="text-gray-400 hover:text-atlon-green transition-all group relative"
            >
              <span className="font-medium">Suporte</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-atlon-green group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-atlon-green hover:bg-atlon-green/10 relative group"
            >
              <Search className="h-5 w-5" />
              <div className="absolute inset-0 bg-atlon-green/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-end space-x-1">
                    <Zap className="h-3 w-3 text-atlon-green" />
                    <span>Nível {user.level || 1}</span>
                    <Badge variant="outline" className="border-atlon-green/30 text-atlon-green text-[10px] px-1 py-0 ml-1">
                      {user.xp || 0} XP
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative hover:opacity-80 transition-opacity group">
                      <Avatar className="border-2 border-atlon-green/30 group-hover:border-atlon-green transition-all">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-atlon-green/20 text-atlon-green font-bold">
                          {user?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {user.streak && user.streak > 0 && (
                        <div className="absolute -top-1 -right-1 bg-atlon-green text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-neon">
                          {user.streak}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-atlon-green/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#0A0A0A]/95 backdrop-blur-xl border-atlon-green/20">
                    <div className="px-2 py-3 border-b border-atlon-green/10">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.profession && (
                        <Badge variant="outline" className="mt-2 border-atlon-green/30 text-atlon-green text-xs">
                          {user.profession === 'personal_trainer' ? 'Personal Trainer' : 'Nutricionista'}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuItem className="text-gray-400 focus:text-white focus:bg-atlon-green/10 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-400 focus:text-white focus:bg-atlon-green/10 cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Meus Certificados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-atlon-green/10" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
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
            className="md:hidden text-white relative group"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <div className="absolute inset-0 bg-atlon-green/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-atlon-green/10 bg-black/50 backdrop-blur-xl">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/meus-cursos" 
                className="text-gray-400 hover:text-atlon-green transition-colors flex items-center space-x-2 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Meus Cursos</span>
              </Link>
              <Link 
                to="/ofertas" 
                className="text-gray-400 hover:text-atlon-green transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ofertas
              </Link>
              <Link 
                to="/suporte" 
                className="text-gray-400 hover:text-atlon-green transition-colors px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Suporte
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:text-red-300 transition-colors px-2"
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