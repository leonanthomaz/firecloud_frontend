import React from 'react';
import { Box, TextField } from '@mui/material';
import { CompanyInfo } from '../../../types/company';

interface CompanyWorkingHoursProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
}

const CompanyWorkingHours: React.FC<CompanyWorkingHoursProps> = ({ company, onCompanyChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onCompanyChange({ ...company, [name]: value || null });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Horário de Abertura"
        name="opening_time"
        type='time'
        value={company.opening_time || ''}
        onChange={handleInputChange}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Horário de Fechamento"
        name="closing_time"
        type='time'
        value={company.closing_time || ''}
        onChange={handleInputChange}
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

export default CompanyWorkingHours;