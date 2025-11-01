import { Course, Module, Lesson, Enrollment, StudentProgress, User, Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Dashboard Atlon',
    slug: 'dashboard-atlon',
    description: 'Aprenda a usar todas as funcionalidades do app Atlon',
    icon: 'LayoutDashboard',
    order: 1
  },
  {
    id: '2',
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    description: 'Estratégias de marketing para profissionais fitness',
    icon: 'TrendingUp',
    order: 2
  },
  {
    id: '3',
    name: 'Vendas e Conversão',
    slug: 'vendas-conversao',
    description: 'Técnicas de vendas e fechamento de clientes',
    icon: 'DollarSign',
    order: 3
  },
  {
    id: '4',
    name: 'Gestão de Negócios',
    slug: 'gestao-negocios',
    description: 'Administre seu negócio fitness com eficiência',
    icon: 'Briefcase',
    order: 4
  },
  {
    id: '5',
    name: 'Técnico e Especialização',
    slug: 'tecnico-especializacao',
    description: 'Conteúdo técnico avançado para profissionais',
    icon: 'GraduationCap',
    order: 5
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Atlon',
    email: 'admin@atlon.com.br',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    createdAt: '2024-01-01T00:00:00Z',
    xp: 0,
    level: 1
  },
  {
    id: '2',
    name: 'Carlos Silva',
    email: 'carlos@example.com',
    role: 'student',
    profession: 'personal_trainer',
    appPlan: 'pro',
    appPurchaseDate: '2024-01-15T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-01-20T10:30:00Z',
    xp: 450,
    level: 3,
    streak: 7
  },
  {
    id: '3',
    name: 'Ana Paula',
    email: 'ana@example.com',
    role: 'student',
    profession: 'nutritionist',
    appPlan: 'premium',
    appPurchaseDate: '2024-01-10T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-20T14:15:00Z',
    xp: 680,
    level: 4,
    streak: 12
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Primeiros Passos no App Atlon',
    subtitle: 'Configure e domine as funcionalidades básicas do seu app',
    description: 'Curso completo para você começar a usar o app Atlon da melhor forma possível. Aprenda a configurar seu perfil, criar treinos, gerenciar alunos e muito mais.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    bannerImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920',
    category: 'dashboard',
    level: 'iniciante',
    status: 'published',
    isPremium: false,
    targetAudience: ['personal_trainer', 'nutritionist'],
    totalDuration: 120,
    totalModules: 4,
    totalLessons: 16,
    totalStudents: 342,
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    instructorId: '1',
    instructorName: 'Equipe Atlon'
  },
  {
    id: '2',
    title: 'Dominando o Dashboard Atlon',
    subtitle: 'Funcionalidades avançadas para maximizar seus resultados',
    description: 'Aprenda a usar recursos avançados do app Atlon: automações, relatórios detalhados, integrações e muito mais para escalar seu negócio.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920',
    category: 'dashboard',
    level: 'intermediario',
    status: 'published',
    isPremium: false,
    targetAudience: ['personal_trainer', 'nutritionist'],
    totalDuration: 180,
    totalModules: 5,
    totalLessons: 22,
    totalStudents: 256,
    rating: 4.9,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    instructorId: '1',
    instructorName: 'Equipe Atlon'
  },
  {
    id: '3',
    title: 'Marketing Digital para Personal Trainers',
    subtitle: 'Atraia mais clientes e construa sua autoridade online',
    description: 'Estratégias completas de marketing digital focadas em personal trainers. Aprenda a criar conteúdo, usar Instagram, fazer anúncios e converter seguidores em clientes.',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    bannerImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920',
    category: 'marketing',
    level: 'intermediario',
    status: 'published',
    isPremium: true,
    price: 297,
    targetAudience: ['personal_trainer'],
    totalDuration: 240,
    totalModules: 6,
    totalLessons: 28,
    totalStudents: 189,
    rating: 4.7,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
    instructorId: '1',
    instructorName: 'Equipe Atlon'
  },
  {
    id: '4',
    title: 'Vendas e Conversão para Nutricionistas',
    subtitle: 'Técnicas comprovadas para fechar mais consultorias',
    description: 'Aprenda a vender seus serviços de nutrição com confiança. Desde a primeira conversa até o fechamento, domine todas as etapas do processo de vendas.',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    bannerImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920',
    category: 'vendas',
    level: 'intermediario',
    status: 'published',
    isPremium: true,
    price: 347,
    targetAudience: ['nutritionist'],
    totalDuration: 200,
    totalModules: 5,
    totalLessons: 24,
    totalStudents: 145,
    rating: 4.8,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    instructorId: '1',
    instructorName: 'Equipe Atlon'
  },
  {
    id: '5',
    title: 'Gestão Financeira para Profissionais Fitness',
    subtitle: 'Organize suas finanças e escale seu faturamento',
    description: 'Aprenda a gerenciar o financeiro do seu negócio fitness: precificação, controle de custos, investimentos e planejamento para crescimento sustentável.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    bannerImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920',
    category: 'gestao',
    level: 'avancado',
    status: 'published',
    isPremium: true,
    price: 397,
    targetAudience: ['personal_trainer', 'nutritionist'],
    totalDuration: 280,
    totalModules: 7,
    totalLessons: 32,
    totalStudents: 98,
    rating: 4.9,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    instructorId: '1',
    instructorName: 'Equipe Atlon'
  }
];

export const mockModules: Module[] = [
  // Módulos do Curso 1: Primeiros Passos no App Atlon
  {
    id: '1',
    courseId: '1',
    title: 'Configuração Inicial',
    description: 'Configure seu perfil e personalize seu app',
    order: 1,
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
    totalLessons: 4,
    isLocked: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    courseId: '1',
    title: 'Gerenciando Alunos',
    description: 'Adicione e organize seus alunos no app',
    order: 2,
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    totalLessons: 5,
    isLocked: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    courseId: '1',
    title: 'Criando Treinos e Dietas',
    description: 'Monte treinos e planos alimentares personalizados',
    order: 3,
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    totalLessons: 4,
    isLocked: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    courseId: '1',
    title: 'Acompanhamento e Resultados',
    description: 'Monitore o progresso dos seus alunos',
    order: 4,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    totalLessons: 3,
    isLocked: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Módulos do Curso 2: Dominando o Dashboard
  {
    id: '5',
    courseId: '2',
    title: 'Automações Inteligentes',
    description: 'Configure automações para economizar tempo',
    order: 1,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    totalLessons: 5,
    isLocked: false,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    courseId: '2',
    title: 'Relatórios Avançados',
    description: 'Analise métricas e tome decisões baseadas em dados',
    order: 2,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    totalLessons: 4,
    isLocked: false,
    createdAt: '2024-01-05T00:00:00Z'
  }
];

export const mockLessons: Lesson[] = [
  // Aulas do Módulo 1: Configuração Inicial
  {
    id: '1',
    moduleId: '1',
    title: 'Bem-vindo ao Atlon',
    description: 'Conheça a plataforma e suas possibilidades',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 480,
    order: 1,
    isPreview: true,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    moduleId: '1',
    title: 'Configurando seu Perfil',
    description: 'Personalize suas informações e foto de perfil',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 600,
    order: 2,
    isPreview: false,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    moduleId: '1',
    title: 'Personalizando a Interface',
    description: 'Ajuste cores, logo e layout do seu app',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 720,
    order: 3,
    isPreview: false,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    moduleId: '1',
    title: 'Configurações Avançadas',
    description: 'Notificações, integrações e preferências',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 540,
    order: 4,
    isPreview: false,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    userId: '2',
    courseId: '1',
    enrolledAt: '2024-01-15T00:00:00Z',
    status: 'active',
    paymentStatus: 'free'
  },
  {
    id: '2',
    userId: '2',
    courseId: '2',
    enrolledAt: '2024-01-16T00:00:00Z',
    status: 'active',
    paymentStatus: 'free'
  },
  {
    id: '3',
    userId: '3',
    courseId: '1',
    enrolledAt: '2024-01-10T00:00:00Z',
    status: 'active',
    paymentStatus: 'free'
  },
  {
    id: '4',
    userId: '3',
    courseId: '4',
    enrolledAt: '2024-01-12T00:00:00Z',
    status: 'active',
    paymentStatus: 'paid'
  }
];

export const mockProgress: StudentProgress[] = [
  {
    id: '1',
    userId: '2',
    courseId: '1',
    enrolledAt: '2024-01-15T00:00:00Z',
    lastAccessedAt: '2024-01-20T10:30:00Z',
    completedLessons: ['1', '2'],
    currentLessonId: '3',
    progressPercentage: 12,
    certificateIssued: false,
    totalWatchTime: 1080
  },
  {
    id: '2',
    userId: '3',
    courseId: '1',
    enrolledAt: '2024-01-10T00:00:00Z',
    lastAccessedAt: '2024-01-20T14:15:00Z',
    completedLessons: ['1', '2', '3', '4'],
    currentLessonId: '5',
    progressPercentage: 25,
    certificateIssued: false,
    totalWatchTime: 2340
  }
];