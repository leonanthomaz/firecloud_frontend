import { api } from '.';
import { ChatPostParams, ChatRatingParams, ChatResponse } from '../../types/chat';

export const chatPostApi = async (data: ChatPostParams): Promise<ChatResponse> => {
  try {
    const response = await api.post(`/chat/company/${data.companyId}`, {
      message: data.message,
      chat_code: data.chatCode
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

export const sendRatingApi = async (data: ChatRatingParams): Promise<ChatResponse> => {
  try {
    const response = await api.post(`/chat/feedback/${data.chatId}`, {
      chatId: data.chatId,
      rating: data.rating
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};