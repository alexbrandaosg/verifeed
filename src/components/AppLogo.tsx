
import React from 'react';
import { BRAND } from '@/constants/brand';

interface AppLogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const AppLogo: React.FC<AppLogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-16',
    large: 'h-24'
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Erro ao carregar logo:', e);
    // Fallback para texto se a imagem não carregar
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = `<span class="text-xl font-bold text-green-600">${BRAND.name}</span>`;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={BRAND.logo}
        alt={`${BRAND.name} Logo`}
        className={`${sizeClasses[size]} w-auto`}
        onError={handleImageError}
      />
    </div>
  );
};

export default AppLogo;
