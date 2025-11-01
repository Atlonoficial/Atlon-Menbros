import React from 'react';
import { Module } from '@/types';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0B0B0B] border-white/10 hover:border-[#A020F0]/50 transition-all duration-300 hover:scale-105"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={module.coverImage}
          alt={module.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-2 uppercase bg-gradient-to-r from-[#FF7A33] via-[#FF4DD2] to-[#A020F0] bg-clip-text text-transparent">
            {module.name}
          </h3>
          <div className="flex items-center text-gray-300 text-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{module.totalLessons} aulas</span>
          </div>
        </div>
      </div>
    </Card>
  );
};