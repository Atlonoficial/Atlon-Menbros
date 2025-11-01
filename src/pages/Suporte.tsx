import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Mail, Phone } from 'lucide-react';

const Suporte: React.FC = () => {
  const faqs = [
    {
      question: 'Como acesso meus cursos?',
      answer: 'Após fazer login, você pode acessar todos os seus cursos na página "Meus Cursos". Basta clicar no curso desejado para começar a assistir as aulas.'
    },
    {
      question: 'Posso baixar as aulas?',
      answer: 'Sim! Cada aula possui um botão de download para materiais complementares. Os vídeos podem ser assistidos online a qualquer momento.'
    },
    {
      question: 'Como marco uma aula como concluída?',
      answer: 'Durante a reprodução da aula, você verá um botão "Marcar como concluída". Clique nele para registrar seu progresso.'
    },
    {
      question: 'Tenho acesso vitalício aos cursos?',
      answer: 'Sim! Todos os cursos adquiridos têm acesso vitalício, incluindo futuras atualizações de conteúdo.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
            CENTRAL DE SUPORTE
          </h1>
          <p className="text-gray-400">Estamos aqui para ajudar você</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#1A1A1A] border-white/10">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-[#A020F0] mb-2" />
              <CardTitle className="text-white">WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Fale conosco diretamente pelo WhatsApp</p>
              <Button className="w-full bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90">
                Abrir WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/10">
            <CardHeader>
              <Mail className="h-8 w-8 text-[#FF4DD2] mb-2" />
              <CardTitle className="text-white">E-mail</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Envie sua dúvida por e-mail</p>
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
                suporte@operacaodesigner.com
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/10">
            <CardHeader>
              <Phone className="h-8 w-8 text-[#FF7A33] mb-2" />
              <CardTitle className="text-white">Telefone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Ligue para nossa central</p>
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
                (11) 9999-9999
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1A1A1A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-white hover:text-[#A020F0]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Suporte;