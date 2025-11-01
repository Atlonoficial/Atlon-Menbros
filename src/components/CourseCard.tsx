import React from 'react';
import { Link } from 'react-router-dom';
import { Course, StudentProgress } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  progress?: StudentProgress;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progress }) => {
  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0B0B0B] border-white/10 hover:border-[#A020F0]/50 transition-all duration-300">
      <Link to={`/curso/${course.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.coverImage}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1">{course.name}</h3>
            <p className="text-sm text-gray-300">{course.subtitle}</p>
          </div>
        </div>
      </Link>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progresso</span>
            <span className="text-[#A020F0] font-semibold">
              {progress?.progressPercentage || 0}%
            </span>
          </div>
          <Progress value={progress?.progressPercentage || 0} className="h-2" />
        </div>
        
        <Link to={`/curso/${course.id}`}>
          <Button className="w-full bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90 transition-opacity">
            <Play className="mr-2 h-4 w-4" />
            {progress && progress.progressPercentage > 0 ? 'Continuar' : 'Começar'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};