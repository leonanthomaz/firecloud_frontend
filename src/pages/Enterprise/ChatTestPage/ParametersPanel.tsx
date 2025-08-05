import React, { useState, ChangeEvent } from 'react';
import {
  Typography,
  TextField,
  styled,
  Box,
  Input,
} from '@mui/material';

interface ParametersPanelProps {
  onCompanyConfigChange: (config: any) => void;
}

const StyledPaper = styled(Box)`
  padding: 20px;
`;

const ParametersPanel: React.FC<ParametersPanelProps> = ({ onCompanyConfigChange }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleCompanyNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
    updateConfig();
  };

  const handleCompanyDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompanyDescription(event.target.value);
    updateConfig();
  };

  const handleCompanyContextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompanyContext(event.target.value);
    updateConfig();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
      updateConfig();
    }
  };

  const updateConfig = () => {
    const config = {
      companyName,
      companyDescription,
      companyContext,
      uploadedFile,
    };
    onCompanyConfigChange(config);
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Configurações da Empresa
      </Typography>

      <TextField
        label="Nome da Empresa"
        value={companyName}
        onChange={handleCompanyNameChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Descrição da Empresa"
        value={companyDescription}
        onChange={handleCompanyDescriptionChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />

      <TextField
        label="Contexto da Empresa"
        value={companyContext}
        onChange={handleCompanyContextChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <Typography variant="subtitle1" style={{ marginTop: '15px' }}>
        Upload de Arquivo (Opcional)
      </Typography>
      <Input type="file" onChange={handleFileUpload} />
    </StyledPaper>
  );
};

export default ParametersPanel;