
import React from 'react';
import AppHeader from '@/components/common/AppHeader';

interface ClientHeaderProps {
  campaignName?: string;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ campaignName }) => {
  return (
    <AppHeader 
      title={campaignName ? `Revisão: ${campaignName}` : "Revisão de Campanha"}
      showLogo={true}
    />
  );
};

export default ClientHeader;
