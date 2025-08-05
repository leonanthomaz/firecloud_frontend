import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface FeedbackCardProps {
  rating: number;             // Nota atual
  onChange?: (rating: number) => void;  // Callback ao clicar na estrela
  disabled?: boolean;         // Só visualiza (não clicável)
  comment?: string;           // Texto para mostrar abaixo das estrelas
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  rating,
  onChange,
  disabled = false,
  comment,
}) => {
  const theme = useTheme();

  // Gera as 5 estrelas, preenchidas ou vazias
  const stars = Array.from({ length: 5 }, (_, i) => {
    const index = i + 1;
    const filled = index <= rating;

    if (disabled) {
      // Se desabilitado, só mostra a estrela (sem botão)
      return filled ? (
        <StarIcon key={index} sx={{ color: theme.palette.warning.main }} />
      ) : (
        <StarBorderIcon key={index} sx={{ color: theme.palette.warning.main }} />
      );
    }

    return (
      <IconButton
        key={index}
        size="small"
        onClick={() => onChange && onChange(index)}
        aria-label={`Avaliar ${index} estrelas`}
        sx={{ color: filled ? theme.palette.warning.main : theme.palette.grey[400] }}
      >
        {filled ? <StarIcon /> : <StarBorderIcon />}
      </IconButton>
    );
  });

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: theme.palette.background.paper,
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        Avalie nosso atendimento
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {stars}
      </Box>
      {comment && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          {comment}
        </Typography>
      )}
    </Box>
  );
};
