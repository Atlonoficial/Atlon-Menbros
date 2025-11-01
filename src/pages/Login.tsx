import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showError, showSuccess } from '@/utils/toast';

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
      showError('Credenciais inválidas. Tente admin@atlon.com.br ou carlos@example.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0A0A0A] to-black p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-atlon-green/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-atlon-green/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md bg-[#1A1A1A]/80 backdrop-blur-xl border-atlon-green/10 relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/atlon-logo-profile.png" 
              alt="Atlon" 
              className="h-16 w-16"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center gradient-atlon-text">
            ATLON ACADEMY
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Entre com suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0B0B0B] border-atlon-green/10 text-white focus:border-atlon-green/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0B0B0B] border-atlon-green/10 text-white focus:border-atlon-green/50"
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
              className="w-full gradient-atlon hover:opacity-90 transition-opacity text-black font-bold"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-atlon-green hover:text-atlon-green-light transition-colors font-semibold">
              Cadastre-se
            </Link>
          </div>
          <div className="mt-4 p-3 bg-[#0B0B0B] rounded-lg border border-atlon-green/10">
            <p className="text-xs text-gray-400 text-center mb-2">
              <strong className="text-atlon-green">Contas de Demonstração:</strong>
            </p>
            <p className="text-xs text-gray-400 text-center">
              Admin: admin@atlon.com.br<br />
              Aluno: carlos@example.com ou ana@example.com<br />
              <span className="text-gray-500">(qualquer senha)</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;