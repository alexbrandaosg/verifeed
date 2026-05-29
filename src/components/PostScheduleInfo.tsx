
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostScheduleInfoProps {
  scheduledDate?: Date;
}

const PostScheduleInfo: React.FC<PostScheduleInfoProps> = ({ scheduledDate }) => {
  if (!scheduledDate) return null;

  const formatDateWithWeekday = (date: Date) => {
    const weekday = format(date, "EEEE", { locale: ptBR });
    const formattedDate = format(date, "PPP", { locale: ptBR });
    return { weekday, formattedDate };
  };

  const { weekday, formattedDate } = formatDateWithWeekday(scheduledDate);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
      <Calendar className="w-4 h-4 text-blue-600" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">Data de publicação:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="text-xs text-blue-600 font-medium capitalize">
          {weekday}
        </div>
      </div>
    </div>
  );
};

export default PostScheduleInfo;
