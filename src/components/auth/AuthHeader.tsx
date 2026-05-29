
import React from 'react';
import AppLogo from '@/components/AppLogo';
import { BRAND } from '@/constants/brand';

const AuthHeader: React.FC = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      <div className="flex justify-center">
        <AppLogo size="medium" className="mb-4" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Acesso ao Sistema</h1>
        <p className="text-gray-600 mt-2">
          Entre com suas credenciais para acessar o painel
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;
