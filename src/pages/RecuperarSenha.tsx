import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Mail } from 'lucide-react';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/atualizar-senha`,
      });
      if (error) throw error;
      showSuccess('Link de recuperação enviado! Verifique seu e-mail.');
      setSent(true);
    } catch (error: any) {
      showError(error.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 tech-grid">
      <Card className="w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-xl border-atlon-green/20 card-glow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center gradient-atlon-text">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {sent
              ? 'Um link para redefinir sua senha foi enviado para o seu e-mail.'
              : 'Digite seu e-mail para receber o link de recuperação.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center">
              <Mail className="h-16 w-16 text-atlon-green mx-auto mb-4" />
              <p className="text-white">Verifique sua caixa de entrada e spam.</p>
            </div>
          ) : (
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
                  disabled={loading}
                  className="bg-[#060606] border-atlon-green/20 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-atlon hover:opacity-90 text-black font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm text-gray-500">
            Lembrou a senha?{' '}
            <Link to="/login" className="text-atlon-green hover:text-atlon-green-light font-semibold">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecuperarSenha;