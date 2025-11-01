import React from 'react';
import { Link } from 'react-router-dom';
import { Course, StudentProgress } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Users, Star, Lock } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  progress?: StudentProgress;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progress, isEnrolled = true }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      dashboard: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      vendas: 'bg-green-500/20 text-green-400 border-green-500/30',
      gestao: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      tecnico: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[category as keyof typeof colors] || colors.dashboard;
  };

  const getCategoryName = (category: string) => {
    const names = {
      dashboard: 'Dashboard',
      marketing: 'Marketing',
      vendas: 'Vendas',
      gestao: 'Gestão',
      tecnico: 'Técnico'
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <Card className="group overflow-hidden bg-[#1A1A1A] border-atlon-green/10 hover:border-atlon-green/30 transition-all duration-300 card-glow">
      <Link to={`/curso/${course.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant="outline" className={getCategoryColor(course.category)}>
              {getCategoryName(course.category)}
            </Badge>
            {course.isPremium && (
              <Badge variant="outline" className="bg-atlon-green/20 text-atlon-green border-atlon-green/30">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Rating */}
          {course.rating && (
            <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white font-medium">{course.rating}</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{course.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-1">{course.subtitle}</p>
          </div>
        </div>
      </Link>
      
      <div className="p-4 space-y-4">
        {/* Course Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{course.totalStudents} alunos</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progresso</span>
              <span className="text-atlon-green font-semibold">
                {progress.progressPercentage}%
              </span>
            </div>
            <Progress 
              value={progress.progressPercentage} 
              className="h-2 bg-gray-800"
            />
          </div>
        )}
        
        {/* CTA Button */}
        <Link to={`/curso/${course.id}`}>
          <Button className="w-full gradient-atlon hover:opacity-90 transition-opacity text-black font-semibold">
            <Play className="mr-2 h-4 w-4" />
            {isEnrolled 
              ? (progress && progress.progressPercentage > 0 ? 'Continuar' : 'Começar')
              : (course.isPremium ? `Comprar - R$ ${course.price}` : 'Acessar Grátis')
            }
          </Button>
        </Link>
      </div>
    </Card>
  );
};