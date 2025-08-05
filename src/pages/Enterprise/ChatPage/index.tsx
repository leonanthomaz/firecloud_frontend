import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  CircularProgress, 
  Typography,  
  useTheme,
  styled,
  Avatar,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Message from './Message';
import { CompanyInfo } from '../../../types/company';
import { getCompanyForChatApi } from '../../../services/api/company';
import { chatPostApi } from '../../../services/api/chat';
import { ChatResponse } from '../../../types/chat';
import { useMediaQuery } from '@mui/material';

// Componentes estilizados
const ChatContainer = styled(Box)({
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f5f5f5',
});

const ChatHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '3px',
  },
}));

const InputArea = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  position: 'sticky',
  bottom: 0,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    paddingRight: '8px',
    backgroundColor: theme.palette.background.default,
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 16px',
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.action.hover,
  borderRadius: '18px',
  alignSelf: 'flex-start',
}));

const WelcomeMessage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  borderRadius: '8px',
  alignSelf: 'center',
  textAlign: 'center',
  maxWidth: '80%',
}));

const ChatPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [chat, setChat] = useState<{ sender: string; text: string; systemResponse?: any; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [welcome, setWelcome] = useState(true);
  const theme = useTheme();
  const [chatCode, setChatCode] = useState<string | null>(null);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedChatCode = localStorage.getItem('chat_code');
    if (storedChatCode) {
      setChatCode(storedChatCode);
    }
  }, []);

  useEffect(() => {
    if (code) {
      getCompanyForChatApi(code)
        .then(setCompany)
        .catch((error) => {
          console.error('Erro ao buscar informações da empresa:', error);
          setCompany(null);
        });
    }
  }, [code]);

  useEffect(() => {
    if (company && chatCode && !chatCode.startsWith(`chat_${company.id}_`)) {
      console.warn('Chat code não pertence a essa empresa. Limpando...');
      localStorage.removeItem('chat_code');
      setChatCode(null);
    }
  }, [company, chatCode]);


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const getLogoUrl = () => {
    return company?.logo_url || '';
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !company?.id) return;

    const newChat = [...chat, { 
      sender: 'Você', 
      text: message,
      timestamp: getCurrentTime()
    }];
    setChat(newChat);
    setMessage('');
    setLoading(true);
    setWelcome(false);

    try {
      const response: ChatResponse = await chatPostApi({
        companyId: company.id,
        message,
        chatCode: chatCode || null
      });
      console.log("response", response)


      if (response.chat_code) {
        localStorage.setItem('chat_code', response.chat_code);
        setChatCode(response.chat_code);
      }
      
      const assistantResponse = response.useful_context.user_response;


      setChat([...newChat, { 
        sender: 'Assistente', 
        text: assistantResponse || 'Sem resposta disponível.',
        systemResponse: response.useful_context.system_response || null,
        timestamp: getCurrentTime()
      }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setChat([...newChat, { 
        sender: 'Assistente', 
        text: 'Erro ao obter resposta. Tente novamente!',
        timestamp: getCurrentTime()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Box display="flex" alignItems="center" gap={2}>
          {company?.logo_url && (
            <Avatar 
              src={getLogoUrl()} 
              sx={{ width: 80, height: 40 }} 
              alt={company.name}
            />
          )}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {company?.name || 'Chat de Suporte'}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <FiberManualRecordIcon 
                fontSize="small" 
                color={loading ? 'warning' : 'success'} 
                sx={{ fontSize: '0.8rem' }}
              />
              <Typography variant="caption">
                {loading ? 'Digitando...' : 'Online'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Tooltip title="Recarregar">
            <IconButton size="small" onClick={handleReload}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mais opções">
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </ChatHeader>

      <MessagesContainer ref={chatRef}>
        {welcome && company && (
          <WelcomeMessage>
            <Typography variant="body1" color="text.secondary">
              Olá! Sou o assistente virtual da {company.name}. Como posso ajudar?
            </Typography>
          </WelcomeMessage>
        )}
        
        {chat.map((msg, idx) => (
          <Message 
            key={idx} 
            sender={msg.sender} 
            text={msg.text} 
            companyName={company?.name}
            timestamp={msg.timestamp}
            isUser={msg.sender === 'Você' ? 'true' : 'false'}
            data={msg.systemResponse || null}
          />
        ))}
        
        {loading && (
          <TypingIndicator>
            <CircularProgress size={16} />
            <Typography variant="caption">Digitando...</Typography>
          </TypingIndicator>
        )}
      </MessagesContainer>

      <InputArea>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder={loading 
            ? 'Aguarde a resposta...' 
            : isSmallScreen 
              ? 'Mensagem...' 
              : 'Digite sua mensagem...'}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={4}
          InputProps={{
            startAdornment: null,
            endAdornment: (
              <InputAdornment position="end">
                <Box display="flex" alignItems="center" gap={0.5}>
                  {/* Botão de Enviar */}
                  <IconButton 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || loading}
                    color="primary"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.action.disabledBackground,
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </InputArea>
    </ChatContainer>
  );
};

export default ChatPage;