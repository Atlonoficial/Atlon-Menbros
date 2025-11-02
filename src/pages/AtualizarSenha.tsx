import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, KeyRound } from 'lucide-react';

const AtualizarSenha = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canUpdate, setCanUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setCanUpdate(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }
    if (!canUpdate) {
      showError('Sessão inválida. Por favor, solicite um novo link de recuperação.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showSuccess('Senha atualizada com sucesso! Você já pode fazer login.');
      navigate('/login');
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar a senha.');
      showError(error.message || 'Erro ao atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 tech-grid">
      <Card className="w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-xl border-atlon-green/20 card-glow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center gradient-atlon-text">
            Atualizar Senha
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Digite sua nova senha abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canUpdate ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-400">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="bg-[#060606] border-atlon-green/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-400">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  className="bg-[#060606] border-atlon-green/20 text-white"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-atlon hover:opacity-90 text-black font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Nova Senha'
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center text-gray-400">
              <KeyRound className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>Aguardando token de recuperação...</p>
              <p className="text-sm mt-2">Você deve chegar a esta página através do link enviado para o seu e-mail.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AtualizarSenha;