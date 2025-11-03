export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
  profession?: 'personal_trainer' | 'nutritionist';
  appPurchaseDate?: string;
  appPlan?: 'basic' | 'pro' | 'premium';
  createdAt: string;
  lastLogin?: string;
  xp?: number;
  level?: number;
  streak?: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  bannerVideo?: string | null;
  category: 'dashboard' | 'marketing' | 'vendas' | 'gestao' | 'tecnico';
  level: 'iniciante' | 'intermediario' | 'avancado';
  status: 'draft' | 'published';
  isPremium: boolean;
  price?: number;
  targetAudience: ('personal_trainer' | 'nutritionist')[];
  totalDuration: number;
  totalModules: number;
  totalLessons: number;
  totalStudents: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  instructorId: string;
  instructorName?: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  coverImage: string;
  totalLessons: number;
  isLocked: boolean;
  unlockCondition?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'text' | 'quiz';
  contentUrl: string;
  duration: number;
  order: number;
  thumbnail?: string;
  isPreview: boolean;
  attachments?: Attachment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  lessonId?: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface StudentProgress {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: string[];
  currentLessonId?: string;
  progressPercentage: number;
  certificateIssued: boolean;
  certificateIssuedAt?: string;
  totalWatchTime: number;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  watchedDuration: number;
  completed: boolean;
  completedAt?: string;
  lastWatchedAt: string;
}

export interface Comment {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentId?: string;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  certificateUrl: string;
  verificationCode: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
  category: 'progress' | 'engagement' | 'achievement';
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'free';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}