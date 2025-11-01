import React from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, PlaySquare, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { icon: BookOpen, label: 'Total de Cursos', value: '12', color: 'text-blue-400' },
    { icon: Users, label: 'Alunos Ativos', value: '1,234', color: 'text-atlon-green' },
    { icon: PlaySquare, label: 'Aulas Publicadas', value: '156', color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Taxa de Conclusão', value: '78%', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Dashboard
          </h1>
          <p className="text-gray-400">Visão geral da plataforma Atlon Academy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-[#1A1A1A] border-atlon-green/10 card-glow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#1A1A1A] border-atlon-green/10">
            <CardHeader>
              <CardTitle className="text-white">Cursos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 bg-[#0B0B0B] rounded-lg border border-atlon-green/10">
                    <div className="w-16 h-16 gradient-atlon rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Curso de Dashboard Atlon {i}</h4>
                      <p className="text-sm text-gray-400">12 módulos • 45 aulas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-atlon-green/10">
            <CardHeader>
              <CardTitle className="text-white">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-atlon-green" />
                    <div>
                      <p className="text-sm text-white">Novo aluno matriculado no curso</p>
                      <p className="text-xs text-gray-500">há {i} hora(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;