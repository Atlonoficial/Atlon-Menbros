import React from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, PlaySquare, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { icon: BookOpen, label: 'Total de Cursos', value: '12', color: 'from-[#A020F0] to-[#FF4DD2]' },
    { icon: Users, label: 'Alunos Ativos', value: '1,234', color: 'from-[#FF4DD2] to-[#FF7A33]' },
    { icon: PlaySquare, label: 'Aulas Publicadas', value: '156', color: 'from-[#FF7A33] to-[#A020F0]' },
    { icon: TrendingUp, label: 'Taxa de Conclusão', value: '78%', color: 'from-[#A020F0] to-[#FF7A33]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
            DASHBOARD
          </h1>
          <p className="text-gray-400">Visão geral da plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-[#1A1A1A] border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#1A1A1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Cursos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 bg-[#0B0B0B] rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Curso de Design {i}</h4>
                      <p className="text-sm text-gray-400">12 módulos • 45 aulas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-[#A020F0]" />
                    <div>
                      <p className="text-sm text-white">Novo aluno matriculado</p>
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