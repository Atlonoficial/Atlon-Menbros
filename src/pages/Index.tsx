import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/meus-cursos');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606] p-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 uppercase bg-gradient-to-r from-[#FF7A33] via-[#FF4DD2] to-[#A020F0] bg-clip-text text-transparent">
          OPERAÇÃO DESIGNER
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Faça mais de R$ 5.000 por mês com Design
        </p>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Plataforma completa de cursos online para você se tornar um designer profissional e conquistar sua independência financeira.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90 transition-opacity text-lg px-8"
          >
            Acessar Plataforma
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/cadastro')}
            className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
          >
            Criar Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;