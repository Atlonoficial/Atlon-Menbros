export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'aluno';
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  category: string;
  level: 'iniciante' | 'intermediario' | 'avancado';
  status: 'rascunho' | 'publicado';
  totalModules: number;
  totalStudents: number;
  createdAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  name: string;
  description: string;
  order: number;
  coverImage: string;
  totalLessons: number;
  completedLessons?: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'text';
  contentUrl: string;
  duration: string;
  order: number;
  isUnlocked: boolean;
  isCompleted?: boolean;
  thumbnail?: string;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  progressPercentage: number;
}

export interface CourseAccess {
  userId: string;
  courseId: string;
  grantedAt: string;
}