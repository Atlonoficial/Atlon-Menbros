import { Course, Module, Lesson, CourseAccess, StudentProgress } from '@/types';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Operação Designer',
    subtitle: 'Faça mais de R$ 5.000 por mês com Design',
    description: 'Curso completo de design profissional com foco em resultados práticos e mercado de trabalho.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    bannerImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920',
    category: 'Design',
    level: 'intermediario',
    status: 'publicado',
    totalModules: 4,
    totalStudents: 150,
    createdAt: '2024-01-01'
  }
];

export const mockModules: Module[] = [
  {
    id: '1',
    courseId: '1',
    name: 'Manual do Photoshop',
    description: 'Aprenda todos os fundamentos do Photoshop',
    order: 1,
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    totalLessons: 12
  },
  {
    id: '2',
    courseId: '1',
    name: 'Missão Photoshop',
    description: 'Projetos práticos para dominar o Photoshop',
    order: 2,
    coverImage: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400',
    totalLessons: 8
  },
  {
    id: '3',
    courseId: '1',
    name: 'Design Funcional',
    description: 'Design que vende e converte',
    order: 3,
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400',
    totalLessons: 10
  },
  {
    id: '4',
    courseId: '1',
    name: 'Photoshop Hacks',
    description: 'Truques e atalhos profissionais',
    order: 4,
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    totalLessons: 6
  }
];

export const mockLessons: Lesson[] = [
  {
    id: '1',
    moduleId: '1',
    title: 'Introdução ao Photoshop',
    description: 'Conheça a interface e as ferramentas básicas',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:30',
    order: 1,
    isUnlocked: true,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300'
  },
  {
    id: '2',
    moduleId: '1',
    title: 'Camadas e Máscaras',
    description: 'Domine o sistema de camadas',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '22:45',
    order: 2,
    isUnlocked: true,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300'
  },
  {
    id: '3',
    moduleId: '1',
    title: 'Ferramentas de Seleção',
    description: 'Aprenda todas as técnicas de seleção',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:20',
    order: 3,
    isUnlocked: true,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300'
  }
];

export const mockCourseAccess: CourseAccess[] = [
  {
    userId: '2',
    courseId: '1',
    grantedAt: '2024-01-15'
  }
];

export const mockProgress: StudentProgress[] = [
  {
    userId: '2',
    courseId: '1',
    completedLessons: ['1'],
    progressPercentage: 8
  }
];