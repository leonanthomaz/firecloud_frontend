import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Switch, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { CompanyInfo } from '../../../types/company';

interface CompanyContactInfoProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
}

const CompanyContactInfo: React.FC<CompanyContactInfoProps> = ({ company, onCompanyChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [addresses, setAddresses] = useState(
    company.addresses?.length
      ? company.addresses
      : [{ street: '', number: '', zip_code: '', neighborhood: '', is_company_address: true, is_main_address: false }]
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [name]: value };
    setAddresses(newAddresses);
    onCompanyChange({ ...company, addresses: newAddresses });
  };

  const handleToggleMainAddress = (index: number) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      is_main_address: i === index ? !addr.is_main_address : false
    }));
    setAddresses(newAddresses);
    onCompanyChange({ ...company, addresses: newAddresses });
  };

  const handleAddAddress = () => {
    const newAddress = {
      street: '',
      number: '',
      neighborhood: '',
      zip_code: '',
      complement: '',
      city: '',
      state: '',
      reference: '',
      is_company_address: true,
      is_main_address: false
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    onCompanyChange({ ...company, addresses: updated });
  };

  return (
    <Box sx={{ mb: 2 }}>
      {addresses.map((address, index) => (
        <Box 
          key={index} 
          sx={{ 
            mb: 3, 
            p: 2, 
            border: '1px solid', 
            borderColor: address.is_main_address ? 'primary.main' : '#ccc',
            borderRadius: 1,
            backgroundColor: address.is_main_address ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
            boxShadow: address.is_main_address ? '0px 2px 4px -1px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              {address.is_main_address ? 'Endereço Principal' : 'Endereço'}
            </Typography>
            
            {address.is_company_address && (
              <FormControlLabel
                control={
                  <Switch
                    checked={address.is_main_address || false}
                    onChange={() => handleToggleMainAddress(index)}
                    color="primary"
                  />
                }
                label= {isMobile ? "Principal?" : "Marcar como principal"}
                labelPlacement="start"
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Rua"
                name="street"
                value={address.street}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '1 1 300px' }}
              />
              <TextField
                label="Número"
                name="number"
                value={address.number}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '0 1 150px' }}
              />
              <TextField
                label="CEP"
                name="zip_code"
                value={address.zip_code}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '0 1 150px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Bairro"
                name="neighborhood"
                value={address.neighborhood || ''}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '1 1 200px' }}
              />
              <TextField
                label="Cidade"
                name="city"
                value={address.city || ''}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '1 1 200px' }}
              />
              <TextField
                label="Estado"
                name="state"
                value={address.state || ''}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '0 1 100px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Complemento"
                name="complement"
                value={address.complement || ''}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '1 1 300px' }}
              />
              <TextField
                label="Referência"
                name="reference"
                value={address.reference || ''}
                onChange={(e) => handleInputChange(e, index)}
                sx={{ flex: '1 1 300px' }}
              />
            </Box>
          </Box>
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddAddress} sx={{ mt: 1 }}>
        Adicionar Endereço
      </Button>
    </Box>
  );
};

export default CompanyContactInfo;