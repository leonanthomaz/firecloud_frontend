import React, { useState, useEffect } from 'react';
import { 
    Typography,
    Button,
    Stack,
    Paper,
    Avatar,
    Chip,
    Divider,
    Box,
    CircularProgress,
    useMediaQuery,
    Theme
} from '@mui/material';
import { Spa, Add, Category, AccessTime, CheckCircle, Cancel } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { ServiceResponse } from '../../../types/service';
import { getServices } from '../../../services/api/service';
import { getServiceCategories } from '../../../services/api/category_service';
import CategoryModal from './CategoryModal';
import { useCompany } from '../../../contexts/CompanyContext';
import ServiceModal from './ServiceModal';
import { useNavigate } from 'react-router-dom';

const ServicePage: React.FC = () => {
    const { companyData: globalCompany } = useCompany();
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null);
    const navigate = useNavigate();
    
    const { enqueueSnackbar } = useSnackbar();
    const { getToken, state } = useAuth();
    const companyData = globalCompany || state.data?.company;
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token || !companyData?.id) return;

                const [servicesData, categoriesData] = await Promise.all([
                    getServices(token, companyData.id),
                    getServiceCategories(token, companyData.id)
                ]);

                setServices(servicesData);
                setCategories(categoriesData);

            } catch (error) {
                enqueueSnackbar('Erro ao carregar serviços', { variant: 'error' });
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyData, getToken, enqueueSnackbar]);

    const handleOpenForm = (service: ServiceResponse | null = null) => {
        if (categories.length === 0 || (categories.length === 1 && categories[0].name === 'Geral')) {
            setOpenCategoryModal(true);
            return;
        }
        
        setSelectedService(service);
        setOpenForm(true);
    };

    const handleServiceCreated = (newService: ServiceResponse) => {
        services.length === 0 ? setOpenCategoryModal(true) : setServices(prev => [...prev, newService]);
        enqueueSnackbar('Serviço criado com sucesso!', { variant: 'success' });
    };

    const handleServiceUpdated = (updatedService: ServiceResponse) => {
        setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
        enqueueSnackbar('Serviço atualizado com sucesso!', { variant: 'success' });
    };

    return (
        <Layout withSidebar={true}>
            <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
                    Gerenciamento de Serviços
                </Typography>
                {/* Header Section */}
                <Stack 
                    direction={isMobile ? 'column' : 'row'} 
                    justifyContent="space-between" 
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    spacing={2}
                    mb={4}
                >
                    
                    <Stack direction="row" spacing={2} sx={{ width: isMobile ? '100%' : 'auto' }}>
                        <Button 
                            variant="contained" 
                            startIcon={<Add />}
                            onClick={() => handleOpenForm(null)}
                            fullWidth={isMobile}
                            sx={{ borderRadius: 2 }}
                        >
                            Novo Serviço
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<Category />}
                            onClick={() => navigate('/painel/categorias-servicos')}
                            fullWidth={isMobile}
                            sx={{ borderRadius: 2 }}
                        >
                            Categorias
                        </Button>
                    </Stack>
                </Stack>

                {/* Content Section */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress size={60} />
                    </Box>
                ) : services.length === 0 ? (
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 6, 
                            textAlign: 'center',
                            border: '1px dashed',
                            borderColor: 'divider',
                            borderRadius: 3
                        }}
                    >
                        <Spa sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" mb={3}>
                            Nenhum serviço cadastrado ainda
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            startIcon={<Add />}
                            onClick={() => handleOpenForm(null)}
                            sx={{ borderRadius: 2 }}
                        >
                            Criar Primeiro Serviço
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={3}>
                        {services.map((service) => (
                            <Paper 
                                key={service.id} 
                                sx={{ 
                                    p: 3, 
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3
                                    }
                                }}
                                onClick={() => handleOpenForm(service)}
                                elevation={1}
                            >
                                <Stack 
                                    direction={isMobile ? 'column' : 'row'} 
                                    spacing={3} 
                                    alignItems={isMobile ? 'flex-start' : 'center'}
                                >
                                    <Avatar 
                                        src={service.image} 
                                        sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText'
                                        }}
                                    >
                                        <Spa />
                                    </Avatar>
                                    
                                    <Box flex={1} sx={{ width: '100%' }}>
                                        <Stack 
                                            direction={isMobile ? 'column' : 'row'} 
                                            justifyContent="space-between" 
                                            alignItems={isMobile ? 'flex-start' : 'center'}
                                            spacing={1}
                                        >
                                            <Typography variant="h6" fontWeight={600}>
                                                {service.name}
                                            </Typography>
                                            <Chip 
                                                label={`R$ ${service.price.toFixed(2)}`} 
                                                color="primary"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Stack>
                                        
                                        <Typography variant="body2" color="text.secondary" my={1}>
                                            {service.description}
                                        </Typography>
                                        
                                        <Stack 
                                            direction={isMobile ? 'column' : 'row'} 
                                            spacing={isMobile ? 1 : 2} 
                                            divider={!isMobile ? <Divider orientation="vertical" flexItem /> : null}
                                            flexWrap="wrap"
                                        >
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AccessTime fontSize="small" color="action" />
                                                <Typography variant="caption">
                                                    {service.duration} minutos
                                                </Typography>
                                            </Stack>
                                            
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Category fontSize="small" color="action" />
                                                <Typography variant="caption">
                                                    {categories.find(c => c.id === service.category_id)?.name || 'Sem categoria'}
                                                </Typography>
                                            </Stack>
                                            
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {service.availability ? (
                                                    <CheckCircle fontSize="small" color="success" />
                                                ) : (
                                                    <Cancel fontSize="small" color="error" />
                                                )}
                                                <Typography variant="caption">
                                                    {service.availability ? 'Disponível' : 'Indisponível'}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}

                {/* Modals */}
                <ServiceModal
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    service={selectedService}
                    categories={categories}
                    onServiceCreated={handleServiceCreated}
                    onServiceUpdated={handleServiceUpdated}
                />

                <CategoryModal
                    open={openCategoryModal}
                    onClose={() => setOpenCategoryModal(false)}
                />
            </Box>
        </Layout>
    );
};

export default ServicePage;