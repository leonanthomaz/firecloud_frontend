import { useState } from 'react';
import { Box, Stack, Paper, Typography, Alert, IconButton } from '@mui/material';
import { JsonViewer } from '@textea/json-viewer';
import ChatWindow from './ChatWindow';
import Layout from '../../../components/Layout';
import { chatPostApi } from '../../../services/api/chat';
import { useAuth } from '../../../contexts/AuthContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChatPostParams, ChatResponseTest, ChatMessage } from '../../../types/chat';

const ChatTestPage = () => {
  const { state } = useAuth();
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [apiResponse, setApiResponse] = useState<ChatResponseTest | null>(null);

  const companyId = state.data?.company?.id || 1;

  const handleSendMessage = async (message: string) => {
    if (!companyId) {
      alert('Por favor, insira o ID da empresa.');
      return;
    }

    const newMessage: ChatMessage = { 
      sender: 'Você', 
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setChat(prev => [...prev, newMessage]);
    setLoading(true);
    setTyping(true);

    const chatData: ChatPostParams = {
      companyId: Number(companyId),
      message,
      chatCode: apiResponse?.chat_code || null
    };

    try {
      const response = await chatPostApi(chatData);
      setApiResponse(response);
      
      const botMessage: ChatMessage = {
        sender: 'Assistente',
        text: response.useful_context.user_response,
        timestamp: response.useful_context.timestamp,
      };
      
      setChat(prev => [...prev, botMessage]);
      
      // Salva o chat_code para continuidade da conversa
      if (response.chat_code) {
        localStorage.setItem('chat_code', response.chat_code);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        sender: 'Assistente',
        text: 'Erro ao obter resposta. Tente novamente!',
        timestamp: new Date().toISOString()
      };
      
      setChat(prev => [...prev, errorMessage]);
      setApiResponse({
        useful_context: {
          user_response: 'Erro no servidor',
          system_response: { function: 'error' },
          timestamp: new Date().toISOString()
        },
        status: 500,
        chat_code: apiResponse?.chat_code || undefined
      });
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const clearChat = () => {
    setChat([]);
    setApiResponse(null);
    localStorage.removeItem('chat_code');
  };

  return (
    <Layout withWhatsApp={true}>
      <Box sx={{ 
        p: 3, 
        maxWidth: '100%', 
        margin: '0 auto',
        height: 'calc(100vh - 64px)'
      }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ height: '100%' }}>
          {/* Painel do Chat */}
          <Paper elevation={3} sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '60vh',
            maxHeight: '100%'
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid rgba(0,0,0,0.12)'
            }}>
              <Typography variant="h6">Chat Interativo</Typography>
              <IconButton onClick={clearChat} size="small" title="Limpar conversa">
                <RefreshIcon />
              </IconButton>
            </Box>
            <ChatWindow
              chat={chat}
              loading={loading}
              typing={typing}
              onSendMessage={handleSendMessage}
            />
          </Paper>

          {/* Painel de Debug */}
          <Paper elevation={3} sx={{ 
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '100%'
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
              <Typography variant="h6">Debug da API</Typography>
              {apiResponse?.chat_code && (
                <Typography variant="caption" color="text.secondary">
                  Chat Code: {apiResponse.chat_code}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
              {!apiResponse ? (
                <Alert severity="info">
                  Envie uma mensagem para visualizar a resposta da API
                </Alert>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="subtitle2">
                        Status: <strong>{apiResponse.status}</strong>
                      </Typography>
                      {apiResponse.token_usage && (
                        <Typography variant="subtitle2">
                          Tokens: <strong>{apiResponse.token_usage.total_tokens}</strong>
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <JsonViewer 
                    value={apiResponse} 
                    rootName="apiResponse"
                    theme="dark"
                    displayDataTypes={false}
                    style={{ 
                      borderRadius: 4,
                      padding: 8,
                      backgroundColor: '#1E1E1E',
                      marginBottom: 16
                    }}
                  />

                  {apiResponse.useful_context.system_response?.function && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Ação detectada: <strong>{apiResponse.useful_context.system_response.function}</strong>
                    </Alert>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Layout>
  );
};

export default ChatTestPage;