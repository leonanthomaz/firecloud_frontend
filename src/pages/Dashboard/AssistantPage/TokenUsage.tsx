import React from 'react';
import { Box, Typography, Card, CardContent, Stack, CircularProgress } from '@mui/material';
import { AssistantInfo } from '../../../types/assistant';

const TOKENS_PER_FIRECREDIT = 1000;

const calculateFireCredits = (usedTokens: number, limitTokens: number) => {
  const creditsUsed = Math.ceil((usedTokens / TOKENS_PER_FIRECREDIT) * 10) / 10;
  const totalCredits = Math.floor(limitTokens / TOKENS_PER_FIRECREDIT * 10) / 10;
  const creditsRemaining = Math.max(0, Math.floor((totalCredits - creditsUsed) * 10) / 10);
  const percentage = totalCredits > 0 ? Math.min(Math.round((creditsUsed / totalCredits) * 100), 100) : 0;

  return { creditsUsed, creditsRemaining, totalCredits, percentage };
};

interface FireCreditCircleProps {
  usage: number;
  limit: number;
  size?: number;
  thickness?: number;
}

const FireCreditCircle: React.FC<FireCreditCircleProps> = ({
  usage,
  limit,
  size = 120,
  thickness = 8,
}) => {
  const { percentage } = calculateFireCredits(usage, limit);

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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

      <CircularProgress
        variant="determinate"
        value={percentage}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          color: (theme) =>
            percentage > 90
              ? theme.palette.error.main
              : percentage > 70
              ? theme.palette.warning.main
              : theme.palette.primary.main,
          transform: 'rotate(90deg)',
        }}
      />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          {percentage}%
        </Typography>
        <Typography variant="caption" display="block">
          FireCréditos usados
        </Typography>
      </Box>
    </Box>
  );
};

export const FireCreditSection = ({ assistant }: { assistant: AssistantInfo }) => {
  const used = assistant.assistant_token_usage || 0;
  const limit = assistant.assistant_token_limit || 1;
  const resetDate = assistant.assistant_token_reset_date;

  const { creditsUsed, creditsRemaining, totalCredits } = calculateFireCredits(used, limit);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          FireCréditos
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <FireCreditCircle usage={used} limit={limit} />

          <Box>
            <Stack spacing={1}>
              <Typography variant="body1">
                <strong>{creditsUsed}</strong> usados
              </Typography>
              <Typography variant="body1">
                <strong>{creditsRemaining}</strong> restantes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {totalCredits} FireCréditos
              </Typography>
              {resetDate && (
                <Typography variant="body2" color="text.secondary">
                  Próximo reset: {new Date(resetDate).toLocaleDateString()}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
