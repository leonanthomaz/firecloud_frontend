import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  IconButton, 
  CircularProgress, 
  Box, 
  styled, 
  keyframes, 
  Skeleton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from './Message';

interface ChatWindowProps {
  chat: { sender: string; text: string; systemResponse?: any; timestamp: string }[];
  loading: boolean;
  typing: boolean;
  onSendMessage: (message: string) => void;
}

const typingAnimation = keyframes`
  0% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-5px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.6; }
`;

const ChatWindowContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  scrollBehavior: 'smooth',
  background: '#c3c3c3',
  borderRadius: '8px',
  maxHeight: '60vh',
});

const InputArea = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid #ddd',
  padding: '10px',
  background: '#fff',
  borderRadius: '8px',
});

const TypingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginLeft: '15px',
  '& span': {
    width: '8px',
    height: '8px',
    backgroundColor: '#666',
    borderRadius: '50%',
    margin: '0 3px',
    animation: `${typingAnimation} 1.2s infinite ease-in-out`,
    '&:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
});

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, loading, typing, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <Box display="flex" flexDirection="column" height="100%" alignItems="center" justifyContent="center">
      <ChatWindowContainer ref={chatRef}>
        {loading && <Skeleton variant="rectangular" width="100%" height={50} />}
        {chat.map((msg, index) => (
          <Message key={index} sender={msg.sender} service={msg.systemResponse} text={msg.text} />
        ))}
        {typing && (
          <TypingIndicator>
            <span />
            <span />
            <span />
          </TypingIndicator>
        )}
      </ChatWindowContainer>

      <InputArea>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={loading ? 'Aguarde a resposta...' : 'Digite sua mensagem...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
          sx={{ fontFamily: 'Inter, sans-serif' }}
        />
        <IconButton onClick={handleSendMessage} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </InputArea>
    </Box>
  );
};

export default ChatWindow;