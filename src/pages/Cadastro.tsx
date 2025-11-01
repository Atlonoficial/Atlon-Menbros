import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';

const Cadastro: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Cadastro realizado com sucesso!');
    navigate('/login');
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
            CRIAR CONTA
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#0B0B0B] border-atlon-green/10 text-white focus:border-atlon-green/50"
              />
            </div>
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
              <Label htmlFor="profession" className="text-gray-300">Profissão</Label>
              <Select value={profession} onValueChange={setProfession}>
                <SelectTrigger className="bg-[#0B0B0B] border-atlon-green/10 text-white focus:border-atlon-green/50">
                  <SelectValue placeholder="Selecione sua profissão" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-atlon-green/10">
                  <SelectItem value="personal_trainer">Personal Trainer</SelectItem>
                  <SelectItem value="nutritionist">Nutricionista</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-[#0B0B0B] border-atlon-green/10 text-white focus:border-atlon-green/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-atlon hover:opacity-90 transition-opacity text-black font-bold"
            >
              Criar Conta
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-atlon-green hover:text-atlon-green-light transition-colors font-semibold">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadastro;