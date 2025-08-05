import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import SettingsForm from './CompanyForm';
import { CompanyInfo, CompanyUpdate } from '../../../types/company';
import { useSnackbar } from 'notistack';
import { useCompany } from '../../../contexts/CompanyContext';
import SocialLinks from './SocialLinks';

const CompanyPage: React.FC = () => {
    const { getUser, getToken } = useAuth();
    const user = getUser();
    const { enqueueSnackbar } = useSnackbar();
    const { updateCompany, updateCompanyData, syncWithAuthData } = useCompany();

    const initializeCompanyState = (): CompanyInfo => {
        const defaultCompanyInfo: CompanyInfo = {
            name: '',
            plan_id: null,
            description: null,
            industry: null,
            cnpj: null,
            phone: null,
            website: null,
            logo_url: null,
            contact_email: null,
            business_type: null,
            opening_time: '',
            closing_time: '',
            working_days: null,
            social_media_links: null,
            addresses: []
        };

        if (!user?.company) return defaultCompanyInfo;

        return {
            ...defaultCompanyInfo,
            ...user.company,
            addresses: user.company.addresses || []
        };
    };

    const [company, setCompany] = useState<CompanyInfo>(initializeCompanyState());

    const handleCompanyChange = (newCompany: CompanyInfo) => {
        setCompany(newCompany);
    };

    const handleCompanySubmit = async (companyRequest: CompanyUpdate) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('Token de autenticação ausente');
            }

            if (!user?.company?.id) {
                throw new Error('ID da empresa não encontrado');
            }

            await updateCompany(token, user.company.id, companyRequest);
            enqueueSnackbar('Dados da empresa atualizados com sucesso!', { variant: 'success' });
            updateCompanyData(company)
            syncWithAuthData();
        } catch (error: any) {
            console.error('Erro ao atualizar empresa:', error);
            enqueueSnackbar(error.message || 'Falha ao atualizar empresa', { 
                variant: 'error' 
            });
        }
    };


    return (
        <Layout withSidebar={true}>
            <Box>
                 <Typography variant="h5" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
                    Dados da sua Empresa
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Gerencie as informações básicas e configurações da sua empresa
                </Typography>
                <SocialLinks company={company} onCompanyChange={handleCompanyChange} />
                <SettingsForm 
                    company={company} 
                    onCompanyChange={handleCompanyChange} 
                    handleCompanySubmit={handleCompanySubmit} 
                />
            </Box>
        </Layout>
    );
};

export default CompanyPage;