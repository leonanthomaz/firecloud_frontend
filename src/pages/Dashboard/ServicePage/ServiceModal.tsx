import React, { useEffect, useState } from 'react';
import { 
    Modal, 
    Box, 
    Typography, 
    Button, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Stack,
    Paper,
    Divider,
    Switch,
    FormControlLabel,
    useMediaQuery,
    Theme,
    CircularProgress
} from '@mui/material';
import { Spa, AccessTime, AttachMoney, Close } from '@mui/icons-material';
import { ServiceResponse, ServiceCreate, ServiceUpdate } from '../../../types/service';
import { CategoryType } from '../../../types/category_product';
import { useAuth } from '../../../contexts/AuthContext';
import { createService, updateService } from '../../../services/api/service';
import { useSnackbar } from 'notistack';

interface ServiceFormProps {
    open: boolean;
    onClose: () => void;
    service: ServiceResponse | null;
    categories: CategoryType[];
    onServiceCreated: (service: ServiceResponse) => void;
    onServiceUpdated: (service: ServiceResponse) => void;
}

const ServiceModal: React.FC<ServiceFormProps> = ({ 
    open, 
    onClose, 
    service, 
    categories, 
    onServiceCreated, 
    onServiceUpdated 
}) => {
    const [formData, setFormData] = useState<Partial<ServiceResponse>>(service || {
        name: '',
        description: '',
        price: 0,
        category_id: categories[0]?.id || 0,
        duration: 0,
        availability: true
    });
    const [loading, setLoading] = useState(false);
    const { getToken, state } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Corrige o preenchimento ao abrir modal
    useEffect(() => {
        if (service) {
            setFormData(service);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                category_id: categories[0]?.id || 0,
                duration: 0,
                availability: true
            });
        }
    }, [service, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const token = getToken();
        const companyId = state.data?.company.id;
        
        if (!token || !companyId) {
            enqueueSnackbar('Autenticação necessária', { variant: 'error' });
            setLoading(false);
            return;
        }

        try {
            // Preparar os dados do serviço
            const serviceData = {
                name: formData.name || '',
                description: formData.description || '',
                price: Number(formData.price) || 0,
                category_id: Number(formData.category_id) || categories[0]?.id || 0,
                duration: Number(formData.duration) || 0,
                availability: Boolean(formData.availability),
                company_id: companyId
            } as ServiceCreate;

            if (service) {
                // Atualizar serviço existente
                const updatedService = await updateService(
                    token,
                    companyId,
                    service.id,
                    serviceData as ServiceUpdate
                );
                onServiceUpdated(updatedService);
                enqueueSnackbar('Serviço atualizado com sucesso!', { variant: 'success' });
            } else {
                // Criar novo serviço
                const newService = await createService(token, companyId, serviceData);
                onServiceCreated(newService);
                enqueueSnackbar('Serviço criado com sucesso!', { variant: 'success' });
            }
            
            onClose();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            enqueueSnackbar(
                `Erro ao ${service ? 'atualizar' : 'criar'} serviço: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: '95%', 
                maxWidth: 800,
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <Paper sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Spa color="primary" />
                            {service ? 'Editar Serviço' : 'Novo Serviço'}
                        </Typography>
                        <Button 
                            onClick={onClose} 
                            color="inherit"
                            sx={{ minWidth: 'auto' }}
                            disabled={loading}
                        >
                            <Close />
                        </Button>
                    </Stack>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Nome do Serviço"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                size={isMobile ? 'small' : 'medium'}
                                disabled={loading}
                            />

                            <TextField
                                label="Descrição"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={isMobile ? 3 : 4}
                                size={isMobile ? 'small' : 'medium'}
                                disabled={loading}
                            />

                            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                                <TextField
                                    label="Preço (R$)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <AttachMoney fontSize="small" color="action" sx={{ mr: 1 }}/>
                                    }}
                                    size={isMobile ? 'small' : 'medium'}
                                    disabled={loading}
                                    inputProps={{
                                        min: 0,
                                        step: 0.01
                                    }}
                                />

                                <TextField
                                    label="Duração (em minutos - opcional)"
                                    name="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <AccessTime fontSize="small" color="action" sx={{ mr: 1 }}/>
                                    }}
                                    size={isMobile ? 'small' : 'medium'}
                                    disabled={loading}
                                    inputProps={{
                                        min: 1
                                    }}
                                />
                            </Stack>

                            <FormControl fullWidth size={isMobile ? 'small' : 'medium'} disabled={loading}>
                                <InputLabel>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <span>Categoria</span>
                                    </Stack>
                                </InputLabel>
                                <Select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleSelectChange}
                                    required
                                    label="Categoria"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Switch
                                        name="availability"
                                        checked={!!formData.availability}
                                        onChange={handleChange}
                                        color="primary"
                                        disabled={loading}
                                    />
                                }
                                label="Disponível para agendamento"
                                sx={{ mt: 1 }}
                            />

                            <Divider sx={{ my: 2 }} />

                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button 
                                    variant="outlined" 
                                    onClick={onClose}
                                    sx={{ borderRadius: 2 }}
                                    size={isMobile ? 'small' : 'medium'}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    sx={{ borderRadius: 2 }}
                                    size={isMobile ? 'small' : 'medium'}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {loading ? 'Salvando...' : service ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Paper>
            </Box>
        </Modal>
    );
};

export default ServiceModal;