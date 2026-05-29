
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLogo from '@/components/AppLogo';
import LoginForm from '@/components/auth/LoginForm';
import { BRAND } from '@/constants/brand';

const Login = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-purple-50 to-brand-100 flex flex-col items-center justify-center p-4">
        {/* Logo centralizado acima do formulário */}
        <div className="text-center mb-8">
          <AppLogo size="medium" className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso ao Sistema</h1>
          <p className="text-gray-600">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>
        
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Login;
