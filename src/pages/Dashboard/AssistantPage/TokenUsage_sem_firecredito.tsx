import React from 'react';
import { Box, Typography, Card, CardContent, Stack, CircularProgress } from '@mui/material';
import { AssistantInfo } from '../../../types/assistant';

interface TokenUsageCircleProps {
  usage: number;
  limit: number;
  size?: number;
  thickness?: number;
}

const TokenUsageCircle: React.FC<TokenUsageCircleProps> = ({ 
  usage, 
  limit, 
  size = 120, 
  thickness = 8 
}) => {
  const percentage = limit > 0 ? Math.min(Math.round((usage / limit) * 100), 100) : 0;

  return (
    <Box sx={{ 
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Círculo de fundo */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          color: (theme) => theme.palette.grey[300],
        }}
      />
      
      {/* Círculo de progresso */}
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          color: (theme) => 
            percentage > 90 ? theme.palette.error.main : 
            percentage > 70 ? theme.palette.warning.main : 
            theme.palette.primary.main,
          transform: 'rotate(90deg)',
        }}
      />
      
      {/* Texto central */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          {percentage}%
        </Typography>
        <Typography variant="caption" display="block">
          utilizado
        </Typography>
      </Box>
    </Box>
  );
};

export const TokenUsageSection = ({ assistant }: { assistant: AssistantInfo }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Estatísticas de Uso
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
        <TokenUsageCircle 
          usage={assistant.assistant_token_usage || 0} 
          limit={assistant.assistant_token_limit || 1} 
        />
        
        <Box>
          <Stack spacing={1}>
            <Typography variant="body1">
              <strong>{assistant.assistant_token_usage?.toLocaleString() || 0}</strong> tokens usados
            </Typography>
            <Typography variant="body1">
              <strong>{assistant.assistant_token_limit?.toLocaleString() || '∞'}</strong> tokens disponíveis
            </Typography>
            {assistant.assistant_token_reset_date && (
              <Typography variant="body2" color="text.secondary">
                Próximo reset: {new Date(assistant.assistant_token_reset_date).toLocaleDateString()}
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);