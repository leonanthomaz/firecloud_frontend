import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { getServiceCategories } from '../../../services/api/category_service';
import { getServices } from '../../../services/api/service';
import { CategoryType } from '../../../types/category_product';
import { ServiceResponse } from '../../../types/service';
import { useAuth } from '../../../contexts/AuthContext';

export const useServiceData = (companyId: number) => {
    const { getToken } = useAuth();
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const token = getToken()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (!token) {
                    enqueueSnackbar('Sessão expirada. Faça login novamente.', { variant: 'warning' });
                    setLoading(false);
                    return;
                }
                const [categoriesData, servicesData] = await Promise.all([
                    getServiceCategories(token, companyId),
                    getServices(token, companyId)
                ]);

                setCategories(categoriesData);
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching service data:', error);
                enqueueSnackbar('Erro ao carregar dados dos serviços', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchData();
        }
    }, [companyId, enqueueSnackbar]);

    return { services, categories, loading };
};