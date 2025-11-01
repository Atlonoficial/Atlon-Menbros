import React from 'react';
import { Module } from '@/types';
import { Card } from '@/components/ui/card';
import { BookOpen, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-[#1A1A1A] border-atlon-green/10 hover:border-atlon-green/30 transition-all duration-300 hover:scale-105 card-glow"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={module.coverImage}
          alt={module.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {module.isLocked && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
              <Lock className="h-3 w-3 mr-1" />
              Bloqueado
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-2 uppercase">
            {module.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{module.description}</p>
          <div className="flex items-center text-atlon-green text-sm font-semibold">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{module.totalLessons} aulas</span>
          </div>
        </div>
      </div>
    </Card>
  );
};