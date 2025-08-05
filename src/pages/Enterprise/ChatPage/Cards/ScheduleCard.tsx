import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Schedule {
  id?: number;
  public_id?: string;
  title?: string;
  start?: string;
  end?: string;
  all_day?: boolean;
  color?: string;
  company_id?: number;
  status?: string;
  description?: string;
  customer_name?: string;
  customer_contact?: string;
}

interface ScheduleCardProps {
  schedule: Schedule;
}

const ScheduleCard = ({ schedule }: ScheduleCardProps) => {
  const formatDateTime = (dateTime: string) => {
    return format(parseISO(dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Card
      sx={{
        mt: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {schedule.title || 'Agendamento'}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {schedule.description || 'Sem descrição'}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>Início:</strong> {schedule.start ? formatDateTime(schedule.start) : 'Data não informada'}
          </Typography>
          <Typography variant="body2">
            <strong>Fim:</strong> {schedule.end ? formatDateTime(schedule.end) : 'Data não informada'}
          </Typography>
        </Box>

        <Chip
          label={schedule.status}
          color={schedule.status === 'CONFIRMED' ? 'success' : 'default'}
          size="small"
        />
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
