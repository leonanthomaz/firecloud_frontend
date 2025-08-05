import { forwardRef, useEffect, useState } from 'react';
import {
  Avatar,
  Typography,
  Box,
  Slide,
  styled,
  useTheme
} from '@mui/material';
import { ServiceCard } from './Cards/ServiceCard';
import { FeedbackCard } from './Cards/FeedbackCard';
import { ThankYouDialog } from './Modal/Thanks'; 
import { sendRatingApi } from '../../../services/api/chat';
import ScheduleSlotsCard from './Cards/ScheduleSlotsCard';
import ScheduleCard from './Cards/ScheduleCard';

interface MessageProps {
  sender: string;
  text: React.ReactNode;
  companyName?: string;
  timestamp?: string;
  isUser?: string;
  data: any; 
}

const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sender',
})<{ sender: string }>(({ theme, sender }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  flexDirection: sender === 'Você' ? 'row-reverse' : 'row',
  padding: theme.spacing(0.3),
  width: '100%',
  gap: theme.spacing(1),
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sender',
})<{ sender: string }>(({ theme, sender }) => ({
  backgroundColor: sender === 'Você' 
    ? theme.palette.primary.contrastText 
    : theme.palette.grey[200],
  color: theme.palette.text.primary,
  padding: theme.spacing(2.5, 2.5),
  borderRadius: sender === 'Você'
    ? '18px 18px 4px 18px'
    : '18px 18px 18px 4px',
  maxWidth: '80%',
  wordWrap: 'break-word',
  boxShadow: theme.shadows[1],
  position: 'relative',
}));

const MessageTime = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(0.4),
  right: theme.spacing(1.8),
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
}));

const AvatarContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '40px',
  marginTop: '10px',
}));

const SenderName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: 'center',
  maxWidth: '80px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const Message = forwardRef<HTMLDivElement, MessageProps>(({ sender, data, text, companyName }, ref) => {
  const theme = useTheme();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [rating, setRating] = useState<number | null>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSchedule = (slotId: number) => {
    console.log('Agendando slot:', slotId);
    // Aqui você pode chamar a API para confirmar o agendamento
    // e atualizar o estado conforme necessário
  };

  const handleRatingChange = async (newRating: number) => {
    setRating(newRating);
    try {
      await sendRatingApi({ chatId: 1, rating: 5 });
      setDialogOpen(true);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    }
  };

  const hasService = data?.function === 'show_service' && (data?.service || data?.services);
  const isFeedback = data?.function === 'feedback';
  const isSchedule = data?.function === 'schedule';
  const isScheduleSlots = data?.function === 'schedule_slots';
  const isCloseChat = data?.function === 'close_chat';

  // console.log("isSchedule:", isSchedule);

  useEffect(() => {
    if (isCloseChat) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCloseChat]);


  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <MessageContainer ref={ref} sender={sender}>
        <AvatarContainer>
          <Avatar 
            src={sender === 'Você' ? '/user.png' : '/assistant.png'} 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: sender === 'Você' 
                ? theme.palette.primary.main 
                : theme.palette.secondary.main
            }} 
          />
          <SenderName>
            {sender === 'Você' ? 'Você' : companyName}
          </SenderName>
        </AvatarContainer>
        
        <MessageBubble sender={sender}>
          <Typography variant="body2" component="div" sx={{ mb: hasService ? 2 : 0 }}>
            {text}
          </Typography>

          {/* Mostra o card se tiver serviço */}
          {hasService && (
            Array.isArray(data.service || data.services)
              ? (data.services || data.service).map((srv: any, idx: number) => (
                  <ServiceCard
                    key={idx}
                    name={srv?.name}
                    description={srv?.description}
                    price={srv?.price}
                    duration={srv?.duration}
                    availability={srv?.availability}
                    image={srv?.image}
                  />
                ))
              : (
                <ServiceCard
                  name={data?.service.name}
                  description={data?.service.description}
                  price={data?.service.price}
                  duration={data?.service.duration}
                  availability={data.service.availability}
                  image={data?.service.image}
                />
              )
          )}


          {isFeedback && (
            <FeedbackCard
              rating={rating || 0}
              onChange={handleRatingChange}
              comment="Clique nas estrelas para avaliar o atendimento"
            />
          )}

          {/* Mostra os horários disponíveis */}
          {isSchedule && data?.schedule && (
            <ScheduleCard schedule={data.schedule} />
          )}

          {/* Mostra os horários disponíveis */}
          {isScheduleSlots && (
            <ScheduleSlotsCard 
              slots={data?.schedule_slots} 
              onSchedule={handleSchedule}
            />
          )}

          <ThankYouDialog
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
              window.location.reload();
            }}
          />

          <MessageTime>{time}</MessageTime>
        </MessageBubble>
      </MessageContainer>
    </Slide>
  );
});

Message.displayName = 'Message';

export default Message;
