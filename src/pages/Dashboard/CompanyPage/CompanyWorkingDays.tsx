import React from 'react';
import { Box, FormControl, FormControlLabel, Checkbox } from '@mui/material';
import { CompanyInfo } from '../../../types/company';

interface CompanyWorkingDaysProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
}

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

const CompanyWorkingDays: React.FC<CompanyWorkingDaysProps> = ({ company, onCompanyChange }) => {
  const handleCheckboxChange = (day: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDays = event.target.checked
      ? [...(company.working_days || []), day]
      : (company.working_days || []).filter((d) => d !== day);
    onCompanyChange({ ...company, working_days: updatedDays.length ? updatedDays : null });
  };

  return (
    <FormControl component="fieldset" sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {DAYS_OF_WEEK.map((day) => (
          <FormControlLabel
            key={day}
            control={<Checkbox checked={(company.working_days || []).includes(day)} onChange={handleCheckboxChange(day)} />}
            label={day}
          />
        ))}
      </Box>
    </FormControl>
  );
};

export default CompanyWorkingDays;