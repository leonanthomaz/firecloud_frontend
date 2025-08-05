import React from 'react';
import { Button } from '@mui/material';
import { CompanyInfo, CompanyUpdate } from '../../../types/company';
import CompanyBasicInfo from './CompanyBasicInfo';
import CompanyContactInfo from './CompanyContactInfo';
import CompanyDescription from './CompanyDescription';
import CompanyWorkingHours from './CompanyWorkingHours';
import CompanyWorkingDays from './CompanyWorkingDays';

export interface SettingsFormProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
  handleCompanySubmit: (companyRequest: CompanyUpdate) => Promise<void>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ company, onCompanyChange, handleCompanySubmit }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleCompanySubmit(company as CompanyUpdate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CompanyBasicInfo company={company} onCompanyChange={onCompanyChange} />
      <CompanyContactInfo company={company} onCompanyChange={onCompanyChange} />
      <CompanyDescription company={company} onCompanyChange={onCompanyChange} />
      <CompanyWorkingHours company={company} onCompanyChange={onCompanyChange} />
      <CompanyWorkingDays company={company} onCompanyChange={onCompanyChange} />

      <Button type="submit" variant="contained" color="primary">
        Salvar Alterações
      </Button>
    </form>
  );
};

export default SettingsForm;