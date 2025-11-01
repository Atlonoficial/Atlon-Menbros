import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-black p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-atlon-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-atlon-green/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="text-center max-w-5xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/atlon-logo-complete.png" 
            alt="Atlon Academy" 
            className="h-24 md:h-32"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 uppercase">
          <span className="gradient-atlon-text">ATLON ACADEMY</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-300 mb-4 font-medium">
          Educação para Profissionais de Saúde e Fitness
        </p>
        
        <p className="text-gray-400 mb-12 max-w-3xl mx-auto text-lg md:text-xl">
          Domine seu aplicativo Atlon e aprenda estratégias comprovadas de marketing, vendas e gestão para escalar seu negócio fitness.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <BookOpen className="h-10 w-10 text-atlon-green mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Cursos Práticos</h3>
            <p className="text-gray-400 text-sm">Aprenda com conteúdo direto ao ponto e aplicável</p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <Users className="h-10 w-10 text-atlon-green mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Comunidade Ativa</h3>
            <p className="text-gray-400 text-sm">Conecte-se com outros profissionais</p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-atlon-green/10 rounded-lg p-6 card-glow">
            <Award className="h-10 w-10 text-atlon-green mx-auto mb-4" />
            <h3 className="text-white font-bold mb-2">Certificados</h3>
            <p className="text-gray-400 text-sm">Receba certificados ao concluir os cursos</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="gradient-atlon hover:opacity-90 transition-opacity text-lg px-8 py-6 text-black font-bold"
          >
            Acessar Plataforma
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/cadastro')}
            className="border-atlon-green/30 text-atlon-green hover:bg-atlon-green/10 text-lg px-8 py-6 font-bold"
          >
            Criar Conta
          </Button>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Exclusivo para clientes Atlon
        </p>
      </div>
    </div>
  );
};

export default Index;