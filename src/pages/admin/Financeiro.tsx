import React from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useFinanceStats, useTransactions } from '@/hooks/useFinance';
import { DollarSign, ShoppingCart, Users } from 'lucide-react';

const Financeiro: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useFinanceStats();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const statsCards = [
    {
      title: 'Receita Total',
      value: formatCurrency(stats?.total_revenue),
      icon: DollarSign,
      color: 'text-atlon-green',
    },
    {
      title: 'Vendas Hoje',
      value: stats?.sales_today || 0,
      icon: ShoppingCart,
      color: 'text-blue-400',
    },
    {
      title: 'Matrículas Pagas',
      value: stats?.total_paid_enrollments || 0,
      icon: Users,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0A0A0A] to-black">
      <Header />
      <AdminSidebar />
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-atlon-text uppercase">
            Financeiro
          </h1>
          <p className="text-gray-400">Acompanhe as vendas e a receita da plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-[#1A1A1A] border-atlon-green/10">
                <CardHeader className="pb-2"><Skeleton className="h-4 w-24 bg-gray-700" /></CardHeader>
                <CardContent><Skeleton className="h-8 w-16 bg-gray-700" /></CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="bg-[#1A1A1A] border-atlon-green/10 card-glow hover:scale-105 transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">{card.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{card.value}</div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Card className="bg-[#1A1A1A] border-atlon-green/10">
          <CardHeader>
            <CardTitle className="text-white">Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-atlon-green/10 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-atlon-green/10 hover:bg-transparent">
                    <TableHead className="text-white">Aluno</TableHead>
                    <TableHead className="text-white">Curso</TableHead>
                    <TableHead className="text-white">Data</TableHead>
                    <TableHead className="text-right text-white">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-atlon-green/10">
                        <TableCell><Skeleton className="h-4 w-32 bg-gray-700" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48 bg-gray-700" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24 bg-gray-700" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 bg-gray-700 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : transactions && transactions.length > 0 ? (
                    transactions.map(tx => (
                      <TableRow key={tx.id} className="border-atlon-green/10">
                        <TableCell className="font-medium text-gray-300">{tx.profiles?.name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-300">{tx.courses?.title || 'N/A'}</TableCell>
                        <TableCell className="text-gray-400">{new Date(tx.enrolled_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right font-semibold text-atlon-green">{formatCurrency(tx.courses?.price)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-8">Nenhuma transação encontrada.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Financeiro;