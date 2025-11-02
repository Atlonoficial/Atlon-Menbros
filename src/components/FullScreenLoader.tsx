import React from 'react';

export const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center space-y-4">
        <div className="loader-ring"></div>
        <p className="text-atlon-green text-lg font-medium">Carregando...</p>
      </div>
    </div>
  );
};