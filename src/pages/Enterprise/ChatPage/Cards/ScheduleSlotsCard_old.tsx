import { Button, Card, CardContent, Typography, Box, Stack, Divider } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleSlot {
  id?: number;
  public_id?: string;
  start?: string;
  end?: string;
  all_day?: boolean;
  is_active?: boolean;
  is_recurring?: boolean;
  company_id?: number;
  service_id?: number | null;
  schedule_id?: number | null;
}

interface ScheduleSlotsCardProps {
  slots: ScheduleSlot[];
  onSchedule: (slotId: any) => void;
}

const ScheduleSlotsCard = ({ slots, onSchedule }: ScheduleSlotsCardProps) => {
  // Agrupa slots por dia
  const slotsByDay: Record<string, ScheduleSlot[]> = slots.reduce((acc, slot) => {
    if (!slot.start) return acc;
    const date = format(parseISO(slot.start), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, ScheduleSlot[]>);

  // const formatTime = (dateTime: string) => {
  //   return format(parseISO(dateTime), 'HH:mm');
  // };

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <Card sx={{ 
      mt: 2, 
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Horários Disponíveis
        </Typography>
        
        <Stack spacing={2}>
          {Object.entries(slotsByDay).map(([date, daySlots]) => (
            <Box key={date}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {formatDay(date)}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {daySlots.map((slot) => (
                  <Button
                    key={slot.public_id || slot.id}
                    variant="outlined"
                    size="small"
                    onClick={() => onSchedule(slot.public_id)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      minWidth: '100px',
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      '&:hover': {
                        backgroundColor: '#E8F5E9',
                        borderColor: '#2E7D32'
                      }
                    }}
                  >
                     {slot.start
                      ? format(parseISO(slot.start), "dd/MM/yyyy", { locale: ptBR })
                      : 'Horário indisponível'}
                  </Button>
                ))}

              </Stack>
              
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ScheduleSlotsCard;