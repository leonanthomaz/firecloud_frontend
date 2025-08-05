import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Switch, TextField, FormControlLabel } from '@mui/material';
import Layout from '../../../components/Layout';

const SettingPage: React.FC = () => {
    // Mock data
    const [isAssistantEnabled, setIsAssistantEnabled] = useState(true);
    const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);
    const [isGoogleCalendarEnabled, setIsGoogleCalendarEnabled] = useState(true);
    
    const handleAssistantToggle = () => setIsAssistantEnabled(!isAssistantEnabled);
    const handleSave = () => "";

    return (
        <Layout withSidebar={true}>
            <Box>
                <Typography variant="h5" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
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

                {/* Configuração de Segurança */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Segurança
                        </Typography>
                        <TextField
                            fullWidth
                            label="Alterar Senha"
                            type="password"
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                            control={<Switch color="primary" />}
                            label="Ativar Autenticação de Dois Fatores"
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
