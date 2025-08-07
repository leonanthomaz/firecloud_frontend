import { api } from ".";

// Novas rotas de estatísticas
export const getUserStatsApi = async (token: string) => {
    try {
        const response = await api.get('/admin/user-stats', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCompanyStatsApi = async (token: string) => {
    try {
        const response = await api.get('/admin/company-stats', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReportApi = async (token: string, companyId: number) => {
  try {
    const response = await api.get(`/analytics/report/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob', // ESSENCIAL AQUI
    });
    return response;
  } catch (error) {
    throw error;
  }
};
