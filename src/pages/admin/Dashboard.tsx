import React from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats, useRecentActivity, useTopCourses } from '@/hooks/useDashboard';
import { BookOpen, Users, PlaySquare, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity();
  const { data: topCourses, isLoading: coursesLoading } = useTopCourses();

  const statsConfig = [
    { 
      icon: BookOpen, 
      label: 'Total de Cursos', 
      value: stats?.totalCourses || 0, 
      color: 'text-blue-400' 
    },
    { 
      icon: Users, 
      label: 'Alunos Ativos', 
      value: stats?.totalStudents || 0, 
      color: 'text-atlon-green' 
    },
    { 
      icon: PlaySquare, 
      label: 'Aulas Publicadas', 
      value: stats?.totalLessons || 0, 
      color: 'text-purple-400' 
    },
    { 
      icon: TrendingUp, 
      label: 'Taxa de Conclusão', 
      value: `${stats?.completionRate || 0}%`, 
      color: 'text-orange-400' 
    },
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-gray-700" />
                </CardContent>
              </Card>
            ))
          ) : (
            statsConfig.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-[#1A1A1A] border-atlon-green/10 card-glow hover:scale-105 transition-transform">
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
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <Card className="bg-[#1A1A1A] border-atlon-green/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-atlon-green" />
                Cursos Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full bg-gray-700" />
                  ))}
                </div>
              ) : topCourses && topCourses.length > 0 ? (
                <div className="space-y-4">
                  {topCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-3 bg-[#0B0B0B] rounded-lg border border-atlon-green/10 hover:border-atlon-green/30 transition-colors">
                      <img 
                        src={course.cover_image} 
                        alt={course.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{course.title}</h4>
                        <p className="text-sm text-gray-400">
                          {course.total_modules} módulos • {course.total_lessons} aulas • {course.total_students} alunos
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhum curso encontrado</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#1A1A1A] border-atlon-green/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="mr-2 h-5 w-5 text-atlon-green" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-gray-700" />
                  ))}
                </div>
              ) : activities && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-atlon-green flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp), { 
                            addSuffix: true,
                            locale: ptBR 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma atividade recente</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;