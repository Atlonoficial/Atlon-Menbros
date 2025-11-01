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
      await login(email, password);
      showSuccess('Login realizado com sucesso!');
      
      // Redirecionar baseado no tipo de usuário
      if (email === 'admin@example.com') {
        navigate('/admin');
      } else {
        navigate('/meus-cursos');
      }
    } catch (error) {
      showError('Credenciais inválidas. Tente admin@example.com ou aluno@example.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606] p-4">
      <Card className="w-full max-w-md bg-[#1A1A1A]/50 backdrop-blur-xl border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
            OPERAÇÃO DESIGNER
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
                className="bg-[#0B0B0B] border-white/10 text-white"
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
                className="bg-[#0B0B0B] border-white/10 text-white"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link to="/recuperar-senha" className="text-[#A020F0] hover:text-[#FF4DD2] transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90 transition-opacity"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-[#A020F0] hover:text-[#FF4DD2] transition-colors">
              Cadastre-se
            </Link>
          </div>
          <div className="mt-4 p-3 bg-[#0B0B0B] rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 text-center">
              <strong>Demo:</strong> admin@example.com ou aluno@example.com (qualquer senha)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;