import React from 'react';
import { TextField } from '@mui/material';
import { CompanyInfo } from '../../../types/company';

interface CompanyDescriptionProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({ company, onCompanyChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onCompanyChange({ ...company, [name]: value || null });
  };

  return (
    <TextField
      label="Descrição"
      name="description"
      value={company.description || ''}
      onChange={handleInputChange}
      fullWidth
      multiline
      rows={4}
      sx={{ mb: 2 }}
    />
  );
};

export default CompanyDescription;