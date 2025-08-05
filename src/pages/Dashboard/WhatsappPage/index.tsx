import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react'; // Importação corrigida
import Layout from '../../../components/Layout';

const WhatsappPage: React.FC = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null); // Dados do QR Code
  const [isConnected, setIsConnected] = useState(false); // Status da conexão
  const [conversas, setConversas] = useState<any[]>([]); // Lista de conversas
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Simula a geração do QR Code para conexão com o WhatsApp Business
  const gerarQRCode = () => {
    setLoading(true);
    setTimeout(() => {
      const fakeQRCodeData = 'https://web.whatsapp.com/1234567890'; // Dados fictícios do QR Code
      setQrCodeData(fakeQRCodeData);
      setLoading(false);
    }, 2000); // Simula um delay de 2 segundos
  };

  // Simula a conexão com o WhatsApp Business
  const verificarConexao = () => {
    setLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
    }, 2000); // Simula um delay de 2 segundos
  };

  // Simula a captura de conversas processadas pela assistente virtual
  const carregarConversas = () => {
    setLoading(true);
    setTimeout(() => {
      const fakeConversas = [
        { id: 1, contato: 'Cliente 1', mensagem: 'Olá, preciso de ajuda!', data: '2023-10-01 10:00' },
        { id: 2, contato: 'Cliente 2', mensagem: 'Qual o status do meu pedido?', data: '2023-10-01 11:00' },
        { id: 3, contato: 'Cliente 3', mensagem: 'Obrigado pelo suporte!', data: '2023-10-01 12:00' },
      ];
      setConversas(fakeConversas);
      setLoading(false);
    }, 2000); // Simula um delay de 2 segundos
  };

  useEffect(() => {
    if (isConnected) {
      carregarConversas(); // Carrega as conversas quando a conexão é estabelecida
    }
  }, [isConnected]);

  return (
    <Layout withSidebar={true}>
      <Box>

        <Typography variant="h5" sx={{ mt:8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
          Conexão com WhatsApp Business
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Aqui está um resumo das atividades recentes e informações importantes.
        </Typography>

        {/* Seção de Conexão */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Status da Conexão: {isConnected ? 'Conectado' : 'Desconectado'}
            </Typography>

            {!isConnected && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Escaneie o QR Code abaixo para conectar sua conta do WhatsApp Business:
                </Typography>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {qrCodeData ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <QRCodeSVG value={qrCodeData} size={200} /> {/* Uso correto do componente */}
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={gerarQRCode}
                        disabled={loading}
                      >
                        Gerar QR Code
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={verificarConexao}
                  disabled={loading || !qrCodeData}
                  sx={{ mt: 2 }}
                >
                  Verificar Conexão
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Seção de Configurações */}
        {isConnected && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Configurações
              </Typography>

              <TextField
                label="Mensagem Automática"
                fullWidth
                multiline
                rows={4}
                placeholder="Digite a mensagem automática para novos contatos"
                sx={{ mb: 2 }}
              />

              <Button variant="contained" color="primary">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Seção de Conversas */}
        {isConnected && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Conversas Processadas
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {conversas.map((conversa) => (
                    <ListItem key={conversa.id} sx={{ borderBottom: '1px solid #ddd' }}>
                      <ListItemText
                        primary={conversa.contato}
                        secondary={`${conversa.mensagem} - ${conversa.data}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Layout>
  );
};

export default WhatsappPage;