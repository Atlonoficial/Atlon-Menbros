import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

type MarketingPreviewProps = {
  assetUrl?: string;
  title?: string;
  type?: 'image' | 'video';
  linkUrl?: string;
};

const MarketingPreview: React.FC<MarketingPreviewProps> = ({
  assetUrl,
  title,
  type = 'image',
  linkUrl,
}) => {
  const hasAsset = Boolean(assetUrl);

  return (
    <Card className="bg-[#0B0B0B] border-atlon-green/10 overflow-hidden">
      <div className="p-4 border-b border-atlon-green/10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-atlon-green">
          Pré-visualização do aluno
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Veja como este banner será exibido na página de Meus Cursos.
        </p>
      </div>

      <div className="relative">
        {hasAsset ? (
          type === 'video' ? (
            <div className="aspect-video bg-black">
              <video
                src={assetUrl}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
            </div>
          ) : (
            <img
              src={assetUrl}
              alt={title || 'Pré-visualização do banner'}
              className="w-full h-auto object-cover"
            />
          )
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center bg-[#060606] text-gray-500 space-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-atlon-green/10 text-atlon-green">
              <Play className="h-5 w-5" />
            </div>
            <p className="text-sm text-center px-6">
              Envie uma imagem ou vídeo para visualizar como o aluno verá este conteúdo.
            </p>
          </div>
        )}

        {linkUrl && hasAsset && (
          <div className="absolute bottom-4 right-4">
            <Button
              type="button"
              className="gradient-atlon text-black font-semibold shadow-neon hover:opacity-90"
              onClick={() => window.open(linkUrl, '_blank')}
            >
              <Play className="h-4 w-4 mr-2" />
              Saiba mais
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-1">
        <p className="text-white font-semibold text-sm line-clamp-1">
          {title || 'Título do banner'}
        </p>
        <p className="text-xs text-gray-500">
          Este conteúdo ficará visível para todos os alunos ativos.
        </p>
      </div>
    </Card>
  );
};

export default MarketingPreview;