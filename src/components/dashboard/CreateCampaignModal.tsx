
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaignData: {
    title: string;
    description: string;
    clientName: string;
  };
  onCampaignDataChange: (data: { title: string; description: string; clientName: string; }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onOpenChange,
  campaignData,
  onCampaignDataChange,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl mx-4 max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Campanha</Label>
            <Input
              id="title"
              placeholder="Ex: Campanha de Verão 2024"
              value={campaignData.title}
              onChange={(e) => onCampaignDataChange({...campaignData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva os objetivos da campanha..."
              value={campaignData.description}
              onChange={(e) => onCampaignDataChange({...campaignData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              placeholder="Nome da empresa ou cliente"
              value={campaignData.clientName}
              onChange={(e) => onCampaignDataChange({...campaignData, clientName: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Criar Campanha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignModal;
