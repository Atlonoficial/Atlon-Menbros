import React, { useEffect } from 'react';
import { useActiveBanners, useRecordBannerEvent } from '@/hooks/useMarketing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const MarketingSpot: React.FC = () => {
  const { data: banners } = useActiveBanners();
  const record = useRecordBannerEvent();

  const banner = banners && banners.length > 0 ? banners[0] : null;

  useEffect(() => {
    if (banner) {
      record.mutate({ bannerId: banner.id, event: 'impression' });
    }
  }, [banner, record]);

  if (!banner) return null;

  const onClick = () => {
    record.mutate({ bannerId: banner.id, event: 'click' });
    if (banner.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden bg-[#0B0B0B] border-atlon-green/10 mb-8 card-glow">
      <div className="relative w-full">
        {banner.type === 'video' ? (
          <div className="aspect-video">
            <video src={banner.asset_url} className="w-full h-full" controls poster={undefined} />
          </div>
        ) : (
          <div className="relative">
            <img src={banner.asset_url} alt={banner.title} className="w-full h-auto object-cover" />
            {banner.link_url && (
              <div className="absolute bottom-4 right-4">
                <Button onClick={onClick} className="gradient-atlon text-black font-bold">
                  <Play className="h-4 w-4 mr-1" />
                  Saiba mais
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MarketingSpot;