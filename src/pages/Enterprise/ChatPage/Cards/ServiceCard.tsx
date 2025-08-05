// components/chat/cards/ServiceCard.tsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface ServiceCardProps {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  availability?: boolean;
  image?: string | null;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  price,
  duration,
  availability,
  image,
}) => {
  return (
    <Card sx={{ display: 'flex', mb: 2, maxWidth: '100%' }}>
      {image && (
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>{name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Preço:</strong> R$ {price?.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Duração:</strong> {duration} minutos
        </Typography>
        <Chip
          label={availability ? 'Disponível' : 'Indisponível'}
          color={availability ? 'success' : 'default'}
          size="small"
        />
      </CardContent>
    </Card>
  );
};
