
import React from 'react';
import AppLogo from '@/components/AppLogo';
import { HeaderProps } from '@/types/ui';

const AppHeader: React.FC<HeaderProps> = ({ 
  className = '', 
  title, 
  showLogo = true, 
  actions,
  children 
}) => {
  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showLogo && <AppLogo size="medium" />}
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        </div>
        {children}
      </div>
    </header>
  );
};

export default AppHeader;
