
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';

interface CampaignFiltersProps {
  statusFilter: string;
  clientFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClientFilterChange: (value: string) => void;
}

const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  statusFilter,
  clientFilter,
  onStatusFilterChange,
  onClientFilterChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="font-medium">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status dos Posts</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="revision_requested">Revisão Solicitada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-filter">Cliente</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="client-filter"
              placeholder="Buscar por nome do cliente..."
              value={clientFilter}
              onChange={(e) => onClientFilterChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignFilters;
