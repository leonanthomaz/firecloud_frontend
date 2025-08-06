import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, useTheme, useMediaQuery } from '@mui/material';
import Layout from '../../../components/Layout';
import { CompanyOpen } from '../../../types/company';
import { changeCompanyStatusApi } from '../../../services/api/company';
import { useAuth } from '../../../contexts/AuthContext';

const SettingPage: React.FC = () => {
    // Mock data
    const [isAssistantEnabled, setIsAssistantEnabled] = useState(true);
    const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);
    const [isGoogleCalendarEnabled, setIsGoogleCalendarEnabled] = useState(true);
    const [companyOpenStatus, setCompanyOpenStatus] = useState<CompanyOpen>(CompanyOpen.OPEN);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { state, getToken } = useAuth();
    const token = getToken();
    const company = state.data?.company;

    useEffect(() => {
        if (company?.is_open) {
            setCompanyOpenStatus(company.is_open as CompanyOpen);
        }
    }, [company]);
    
    const handleAssistantToggle = () => setIsAssistantEnabled(!isAssistantEnabled);
    const handleSave = () => "";

    // Alterna status da loja
    const handleCompanyStatusChange = async (event: SelectChangeEvent) => {
        const newStatus = event.target.value as CompanyOpen;

        try {
            setCompanyOpenStatus(newStatus);
            if(token){
                await changeCompanyStatusApi(token, newStatus);
            }
            console.log('Status da empresa atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar status da empresa:', error);
        }
    };

    return (
        <Layout withSidebar={true}>
            <Box>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
                    Configurações do Sistema
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Aqui você pode gerenciar as configurações da sua empresa, incluindo a ativação da assistente IA,
                    preferências de atendimento e personalizações da plataforma.
                </Typography>

                {/* Seção Assistente IA */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Status da empresa
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="company-status-label">Status</InputLabel>
                            <Select
                            labelId="company-status-label"
                            value={companyOpenStatus}
                            label="Status"
                            onChange={(event) => handleCompanyStatusChange(event)}
                            >
                            <MenuItem value={CompanyOpen.OPEN}>Aberta</MenuItem>
                            <MenuItem value={CompanyOpen.CLOSE}>Fechada</MenuItem>
                            <MenuItem value={CompanyOpen.MAINTENANCE}>Em Manutenção</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>

                {/* Seção Assistente IA */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Assistente IA
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isAssistantEnabled}
                                    onChange={handleAssistantToggle}
                                    color="primary"
                                />
                            }
                            label={isAssistantEnabled ? 'Assistente Ativo' : 'Assistente Desativado'}
                        />
                    </CardContent>
                </Card>

                {/* Seção Preferências de Atendimento */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Preferências de Atendimento
                        </Typography>
                        <FormControlLabel
                            control={<Switch checked={isWhatsAppEnabled} onChange={() => setIsWhatsAppEnabled(!isWhatsAppEnabled)} color="primary" />}
                            label="Integração com WhatsApp"
                        />
                        <FormControlLabel
                            control={<Switch checked={isGoogleCalendarEnabled} onChange={() => setIsGoogleCalendarEnabled(!isGoogleCalendarEnabled)} color="primary" />}
                            label="Integração com Google Agenda"
                        />
                    </CardContent>
                </Card>

                {/* Botões de Ação */}
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
                    Salvar Configurações
                </Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }}>
                    Resetar Configurações
                </Button>

            </Box>
        </Layout>
    );
};

export default SettingPage;
