
import React from 'react';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/AppLogo';
import { LogOut, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  username?: string;
  onCreateCampaign: () => void;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  username,
  onCreateCampaign,
  onSignOut
}) => {
  return (
    <div className="space-y-4">
      {/* Logo centralizado no mobile */}
      <div className="flex justify-center md:justify-start">
        <AppLogo className="h-16 md:h-20" />
      </div>
      
      {/* Título e usuário centralizados no mobile */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel da Agência</h1>
        <p className="text-gray-600">Bem-vindo, {username}</p>
      </div>
      
      {/* Botões empilhados no mobile, lado a lado no desktop */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
        <Button 
          onClick={onCreateCampaign}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>

        <Button
          onClick={onSignOut}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
