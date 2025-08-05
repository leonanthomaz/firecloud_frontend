import { AxiosResponse } from 'axios';
import { api } from '.';
import { PaymentPixProcess, PaymentQRCodeResponse } from '../../types/payment';


export const generateQrCodeApi = async (
    token: string,
    paymentData: PaymentPixProcess
): Promise<PaymentQRCodeResponse> => {
    try {
        const response: AxiosResponse<PaymentQRCodeResponse> = await api.post(
            '/pix/qrcode',
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar QR Code de pagamento:', error);
        throw error;
    }
};