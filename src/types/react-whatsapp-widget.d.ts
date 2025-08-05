// src/types/react-whatsapp-widget.d.ts
declare module 'react-whatsapp-widget' {
    import React from 'react';
  
    interface WhatsAppWidgetProps {
      phoneNumber: string;
      message?: string;
      companyName?: string;
      style?: React.CSSProperties;
      widgetWidth?: string;
      widgetPosition?: 'left' | 'right';
      widgetBottom?: string;
      widgetRight?: string;
      widgetLeft?: string;
      widgetAnimation?: string;
      replyTime?: number;
      sendButtonText?: string;
      sendButtonBg?: string;
      sendButtonColor?: string;
      headerTitle?: string;
      headerBg?: string;
      headerColor?: string;
      chatPersonName?: string;
      chatPersonImg?: string;
      chatPersonOnline?: boolean;
      chatPersonOffline?: string;
      chatPersonOfflineTime?: string;
      chatPersonTyping?: string;
      chatPersonTypingTime?: string;
      chatPersonOnlineTime?: string;
      chatPersonOnlineTimeInterval?: number;
    }
  
    const WhatsAppWidget: React.FC<WhatsAppWidgetProps>;
    export { WhatsAppWidget };
  }