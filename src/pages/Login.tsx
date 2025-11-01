import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      showSuccess('Login realizado com sucesso!');
      
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/meus-cursos');
      }
    } catch (error) {
      showError('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden tech-grid">
      {/* Efeitos de fundo futuristas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-atlon-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-atlon-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-atlon-green/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-atlon-green/5 rounded-full"></div>
      </div>

      <Card className="w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-xl border-atlon-green/20 relative z-10 card-glow">
        <CardHeader className="space-y-4">
          <div className="flex justify-center mb-4 relative">
            <div className="relative group">
              <img 
                src="/Logo perfil Atlon!.png" 
                alt="Atlon" 
                className="h-20 w-20 transition-transform group-hover:scale-110 animate-float"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-atlon-green/30 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center gradient-atlon-text tracking-wider flex items-center justify-center space-x-2">
            <span>ATLON ACADEMY</span>
            <Sparkles className="h-5 w-5 text-atlon-green animate-pulse" />
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Entre com suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#060606] border-atlon-green/20 text-white focus:border-atlon-green/50 focus:ring-atlon-green/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-400">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#060606] border-atlon-green/20 text-white focus:border-atlon-green/50 focus:ring-atlon-green/20"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link to="/recuperar-senha" className="text-atlon-green hover:text-atlon-green-light transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-atlon hover:opacity-90 transition-opacity text-black font-bold btn-neon relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-atlon-green hover:text-atlon-green-light transition-colors font-semibold">
              Cadastre-se
            </Link>
          </div>
          <div className="mt-4 p-3 bg-[#060606] rounded-lg border border-atlon-green/10">
            <p className="text-xs text-gray-500 text-center mb-2">
              <strong className="text-atlon-green">Ambiente de Desenvolvimento</strong>
            </p>
            <p className="text-xs text-gray-600 text-center">
              Use o Supabase para criar sua conta ou entre em contato com o administrador
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;