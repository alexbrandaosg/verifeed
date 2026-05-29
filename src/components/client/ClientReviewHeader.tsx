
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLogo from '@/components/AppLogo';
import { CheckCircle, Users, Clock } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface ClientReviewHeaderProps {
  campaign: Campaign;
  stats: {
    total: number;
    approved: number;
    pending: number;
    revision: number;
  };
  allApproved: boolean;
  onApproveAll: () => void;
}

const ClientReviewHeader: React.FC<ClientReviewHeaderProps> = ({
  campaign,
  stats,
  allApproved,
  onApproveAll
}) => {
  return (
    <div className={`${allApproved ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Logo centralizado no header */}
        <div className="flex justify-center mb-8">
          <AppLogo size="large" className="" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Users className="w-6 h-6" />
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {campaign.title}
              {allApproved && <CheckCircle className="w-8 h-8 text-green-200" />}
            </h1>
          </div>
          
          <p className="text-xl text-blue-100 text-center">Cliente: {campaign.clientName}</p>
          
          {campaign.description && (
            <p className="text-blue-100 max-w-2xl text-center mx-auto">{campaign.description}</p>
          )}

          {allApproved && (
            <div className="mt-4 p-4 bg-green-100/20 rounded-lg">
              <h3 className="text-xl font-bold text-green-100 mb-2 text-center">🎉 Parabéns!</h3>
              <p className="text-green-100 text-center">Todos os posts desta campanha foram aprovados! A agência foi notificada e os posts estão prontos para publicação.</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-blue-100">Total de Posts</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-300">{stats.approved}</div>
              <div className="text-sm text-blue-100">Aprovados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-sm text-blue-100">Pendentes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-300">{stats.revision}</div>
              <div className="text-sm text-blue-100">Em Revisão</div>
            </div>
          </div>

          {/* Action Buttons */}
          {campaign.posts.length > 0 && !allApproved && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={onApproveAll}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={stats.approved === stats.total}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar Todos ({stats.total - stats.approved} restantes)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientReviewHeader;
