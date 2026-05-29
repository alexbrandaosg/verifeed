
import React from 'react';
import { BarChart3 } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma campanha encontrada</h3>
      <p className="text-gray-500">Crie sua primeira campanha para começar.</p>
    </div>
  );
};

export default EmptyState;
