import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import MeusCursos from "./pages/MeusCursos";
import CursoDetalhes from "./pages/CursoDetalhes";
import ModuloAulas from "./pages/ModuloAulas";
import Ofertas from "./pages/Ofertas";
import Suporte from "./pages/Suporte";
import Dashboard from "./pages/admin/Dashboard";
import Cursos from "./pages/admin/Cursos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/meus-cursos" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Rotas do Aluno */}
            <Route path="/meus-cursos" element={<ProtectedRoute><MeusCursos /></ProtectedRoute>} />
            <Route path="/curso/:courseId" element={<ProtectedRoute><CursoDetalhes /></ProtectedRoute>} />
            <Route path="/curso/:courseId/modulo/:moduleId" element={<ProtectedRoute><ModuloAulas /></ProtectedRoute>} />
            <Route path="/ofertas" element={<ProtectedRoute><Ofertas /></ProtectedRoute>} />
            <Route path="/suporte" element={<ProtectedRoute><Suporte /></ProtectedRoute>} />
            
            {/* Rotas do Admin */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/cursos" element={<ProtectedRoute adminOnly><Cursos /></ProtectedRoute>} />
            <Route path="/admin/modulos" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/aulas" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/alunos" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/financeiro" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/configuracoes" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;