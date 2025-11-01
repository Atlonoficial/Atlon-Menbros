import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

const Ofertas: React.FC = () => {
  const offers = [
    {
      id: '1',
      name: 'Pacote Completo Design',
      price: 'R$ 497,00',
      originalPrice: 'R$ 997,00',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      discount: '50% OFF'
    },
    {
      id: '2',
      name: 'Curso Avançado Photoshop',
      price: 'R$ 197,00',
      originalPrice: 'R$ 397,00',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
      discount: '50% OFF'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0B0B0B] to-[#060606]">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#A020F0] via-[#FF4DD2] to-[#FF7A33] bg-clip-text text-transparent">
            OFERTAS ESPECIAIS
          </h1>
          <p className="text-gray-400">Aproveite nossas promoções exclusivas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="bg-[#1A1A1A] border-white/10 overflow-hidden">
              <div className="relative aspect-video">
                <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-[#FF7A33] text-white border-0">
                  {offer.discount}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-white">{offer.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-400">(4.9)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">{offer.price}</span>
                    <span className="text-sm text-gray-500 line-through">{offer.originalPrice}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-[#A020F0] to-[#FF4DD2] hover:opacity-90">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Ofertas;