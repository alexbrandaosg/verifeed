
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/types/campaign';
import { Users, Copy, ExternalLink, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import CampaignPostsList from '@/components/CampaignPostsList';

interface CampaignCardProps {
  campaign: Campaign;
  statusFilter: string;
  onCopyShareLink: (shareLink: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onSelectCampaign: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  statusFilter,
  onCopyShareLink,
  onDeleteCampaign,
  onSelectCampaign
}) => {
  const getCampaignStats = (campaign: Campaign) => {
    const total = campaign.posts.length;
    const pending = campaign.posts.filter(p => p.status === 'pending').length;
    const revisionRequested = campaign.posts.filter(p => p.status === 'revision_requested').length;
    const approved = campaign.posts.filter(p => p.status === 'approved').length;
    
    return { total, pending, revisionRequested, approved };
  };

  const stats = getCampaignStats(campaign);
  const allApproved = stats.total > 0 && stats.approved === stats.total;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 rounded-xl">
      <CardHeader className={`${allApproved ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white rounded-t-xl`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              {campaign.title}
              {allApproved && <CheckCircle className="w-5 h-5 text-green-200" />}
            </CardTitle>
            <div className="flex items-center gap-2 text-blue-100">
              <Users className="w-4 h-4" />
              <span className="text-sm">{campaign.clientName}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {allApproved ? (
                <Badge className="bg-green-200 text-green-800 hover:bg-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Todos Aprovados!
                </Badge>
              ) : (
                <>
                  {stats.pending > 0 && (
                    <Badge className="bg-yellow-500 text-white hover:bg-yellow-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {stats.pending} Pendente{stats.pending > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {stats.revisionRequested > 0 && (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {stats.revisionRequested} Revisão{stats.revisionRequested > 1 ? '' : ''}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 justify-end sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyShareLink(`${window.location.origin}/review/${campaign.shareLink || campaign.id}`)}
              className="text-white hover:bg-white/20"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`${window.location.origin}/review/${campaign.shareLink || campaign.id}`, '_blank')}
              className="text-white hover:bg-white/20"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteCampaign(campaign.id)}
              className="text-white hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6">
        {campaign.description && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Descrição:</h4>
            <p className="text-sm text-muted-foreground">{campaign.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-blue-600">Total</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-green-600">Aprovados</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Pendentes</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{stats.revisionRequested}</div>
            <div className="text-xs text-orange-600">Revisões</div>
          </div>
        </div>

        <div className="mb-4">
          <CampaignPostsList posts={campaign.posts} statusFilter={statusFilter} />
        </div>

        <Button
          onClick={() => onSelectCampaign(campaign)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Gerenciar Campanha
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
