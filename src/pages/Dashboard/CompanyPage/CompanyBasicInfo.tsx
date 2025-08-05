import React from 'react';
import { Box, TextField } from '@mui/material';
import { CompanyInfo } from '../../../types/company';

interface CompanyBasicInfoProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
}

const CompanyBasicInfo: React.FC<CompanyBasicInfoProps> = ({ company }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField label="Nome" name="name" value={company.name || ''} disabled fullWidth sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="CNPJ" name="cnpj" value={company.cnpj || ''} disabled sx={{ flex: 1 }} />
        <TextField label="Setor" name="industry" value={company.industry || ''} disabled sx={{ flex: 1 }} />
      </Box>
    </Box>
  );
};

export default CompanyBasicInfo;
