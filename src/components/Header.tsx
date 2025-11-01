import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/meus-cursos'} className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
              OPERAÇÃO DESIGNER
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/meus-cursos" className="text-gray-300 hover:text-white transition-colors">
              Meus Cursos
            </Link>
            <Link to="/ofertas" className="text-gray-300 hover:text-white transition-colors">
              Ofertas
            </Link>
            <Link to="/suporte" className="text-gray-300 hover:text-white transition-colors">
              Suporte
            </Link>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/10">
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/10">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-gray-300 focus:text-white focus:bg-white/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link to="/meus-cursos" className="text-gray-300 hover:text-white transition-colors">
                Meus Cursos
              </Link>
              <Link to="/ofertas" className="text-gray-300 hover:text-white transition-colors">
                Ofertas
              </Link>
              <Link to="/suporte" className="text-gray-300 hover:text-white transition-colors">
                Suporte
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-gray-300 hover:text-white transition-colors"
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