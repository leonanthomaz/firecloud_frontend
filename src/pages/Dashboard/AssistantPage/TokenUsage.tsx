import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  CircularProgress,
  Button,
  useTheme,
  LinearProgress,
  Tooltip,
  Alert
} from '@mui/material';
import { AssistantInfo } from '../../../types/assistant';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

interface TokenUsageCircleProps {
  percentage: number;
  size?: number;
  thickness?: number;
}

const TokenUsageCircle: React.FC<TokenUsageCircleProps> = ({ 
  percentage,
  size = 180, 
  thickness = 7
}) => {
  const theme = useTheme();
  
  // Define a cor com base na porcentagem
  const getColor = () => {
    if (percentage > 90) return theme.palette.error.main;
    if (percentage > 70) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  // Define o ícone de alerta
  const getAlertIcon = () => {
    if (percentage > 90) return <ErrorIcon color="error" sx={{ fontSize: '1.5rem' }} />;
    if (percentage > 70) return <WarningIcon color="warning" sx={{ fontSize: '1.5rem' }} />;
    return <InfoIcon color="info" sx={{ fontSize: '1.5rem' }} />;
  };

  return (
    <Box sx={{ 
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto'
    }}>
      {/* Círculo de fundo */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          color: theme.palette.grey[200],
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
          color: getColor(),
          transform: 'rotate(90deg)',
        }}
      />
      
      {/* Conteúdo central */}
      <Box sx={{ 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%', // Garante que o conteúdo ocupe toda a largura
        px: 2 // Adiciona um pequeno padding lateral
      }}>
        {percentage > 70 && (
          <Box sx={{ mb: 1 }}>
            {getAlertIcon()}
          </Box>
        )}
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' }, // Tamanho responsivo
            lineHeight: 1.2
          }}
        >
          {percentage}%
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' } // Tamanho responsivo
          }}
        >
          Limite
        </Typography>
      </Box>
    </Box>
  );
};

export const TokenUsageSection = ({ assistant }: { assistant: AssistantInfo }) => {
  const theme = useTheme();
  const usage = assistant.assistant_token_usage || 0;
  const limit = assistant.assistant_token_limit || 1;
  const percentage = Math.min(Math.round((usage / limit) * 100), 100);
  const remaining = limit - usage;
  const resetDate = assistant.assistant_token_reset_date 
    ? new Date(assistant.assistant_token_reset_date) 
    : null;

  // Verifica se está crítico (últimos 10%)
  const isCritical = percentage > 90;
  const isWarning = percentage > 70 && !isCritical;

  return (
    <Card sx={{ mb: 3, border: isCritical ? `2px solid ${theme.palette.error.main}` : 'none' }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
          {/* Círculo de porcentagem */}
          <TokenUsageCircle percentage={percentage} />
          
          {/* Detalhes de uso */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Uso de Tokens
            </Typography>
            
            {isCritical && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Seu limite de tokens está quase esgotado! Atualize seu plano para continuar usando.
              </Alert>
            )}
            
            {isWarning && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Seu uso de tokens está alto. Considere atualizar seu plano.
              </Alert>
            )}
            
            {/* Barra de progresso linear */}
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2">
                  {usage.toLocaleString()} tokens usados
                </Typography>
                <Typography variant="body2">
                  {remaining.toLocaleString()} restantes
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={percentage} 
                color={
                  percentage > 90 ? 'error' :
                  percentage > 70 ? 'warning' :
                  'primary'
                }
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" color="text.secondary">
                Limite total: {limit.toLocaleString()} tokens
              </Typography>
            </Box>
            
            {/* Informações adicionais */}
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Próximo reset
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {resetDate ? resetDate.toLocaleDateString() : 'Não definido'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Modelo
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {assistant.assistant_model || 'Não especificado'}
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          {/* Botão de ação */}
          <Box>
            <Tooltip title={isCritical ? "Você precisa adquirir mais tokens" : "Adquira mais tokens para aumentar seu limite"} arrow>
              <span>
                <Button 
                  variant="contained" 
                  color={isCritical ? 'error' : isWarning ? 'warning' : 'primary'}
                  size="large"
                  sx={{ minWidth: 180 }}
                  disabled={percentage < 70}
                >
                  {isCritical ? 'Comprar Tokens' : 'Adicionar Tokens'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};