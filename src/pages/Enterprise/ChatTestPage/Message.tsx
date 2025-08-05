import React from 'react';
import { Avatar, Typography, useTheme, Box } from '@mui/material';
import styled from 'styled-components';

interface MessageProps {
  sender: string;
  text: string;
}

const MessageContainer = styled(Box)<{ $sender: string }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-direction: ${({ $sender }) => ($sender === 'Você' ? 'row-reverse' : 'row')};
`;

const AvatarStyled = styled(Avatar)`
  margin: 0 10px;
`;

const MessageText = styled(Typography)`
  background-color: ${({ theme }) => theme.palette.primary.light};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
`;

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  const theme = useTheme();

  return (
    <MessageContainer $sender={sender}>
      <AvatarStyled src={sender === 'Você' ? '/user.png' : '/assistant.png'} />
      <MessageText theme={theme}>{text}</MessageText>
    </MessageContainer>
  );
};

export default Message;