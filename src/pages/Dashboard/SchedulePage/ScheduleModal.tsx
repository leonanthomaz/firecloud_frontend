import { 
    Modal, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Stack, 
    MenuItem, 
    Divider,
    useMediaQuery,
    useTheme,
    Autocomplete,
    Chip
} from '@mui/material';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Schedule, ScheduleCreate } from '../../../types/schedule';
import { ServiceResponse } from '../../../types/service';

interface ScheduleModalProps {
    open: boolean;
    onClose: () => void;
    event: Schedule | null;
    dateInfo: {start: string, end: string} | null;
    onSave: (data: ScheduleCreate) => void;
    services: ServiceResponse[];
}

const ScheduleModal = ({ open, onClose, event, dateInfo, onSave, services }: ScheduleModalProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_contact: '',
        status: 'agendado',
        location: '',
    });

    useEffect(() => {
        if (event) {
            setFormData({
                customer_name: event.customer_name || '',
                customer_contact: event.customer_contact || '',
                status: event.status || 'agendado',
                location: event.location || '',
            });
            // Find the corresponding service
            const service = services.find(s => s.id === event.service_id);
            setSelectedService(service || null);
        } else {
            setFormData({
                customer_name: '',
                customer_contact: '',
                status: 'agendado',
                location: '',
            });
            setSelectedService(null);
        }
    }, [event, services]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!selectedService) {
            alert('Por favor, selecione um serviço');
            return;
        }

        onSave({
          ...formData,
          title: selectedService.name,
          service_id: selectedService.id,
          color: '#3f51b5',
          start: '',
          company_id: 0
        });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        const date = parseISO(dateString);
        return format(date, "PPpp", { locale: ptBR });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '90%' : 500,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 3,
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {event ? 'Detalhes do Agendamento' : 'Novo Agendamento'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={3}>
                    {/* Horário */}
                    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Horário</Typography>
                        <TextField
                            fullWidth
                            label="Início"
                            value={event ? formatDateTime(event.start) : (dateInfo ? formatDateTime(dateInfo.start) : '')}
                            margin="normal"
                            size="small"
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Término"
                            value={event ? (event.end ? formatDateTime(event.end) : '') : (dateInfo ? formatDateTime(dateInfo.end) : '')}
                            margin="normal"
                            size="small"
                            disabled
                        />
                        <Chip 
                            label="Horário fixo" 
                            color="primary" 
                            size="small" 
                            sx={{ mt: 1 }}
                        />
                    </Box>

                    {/* Serviço */}
                    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Serviço</Typography>
                        <Autocomplete
                            options={services}
                            getOptionLabel={(option) => option.name}
                            value={selectedService}
                            onChange={(_, newValue) => setSelectedService(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Selecione um serviço*"
                                    margin="normal"
                                    size="small"
                                    fullWidth
                                />
                            )}
                        />
                        {selectedService && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Duração:</strong> {selectedService.duration} minutos
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Preço:</strong> R$ {selectedService.price.toFixed(2)}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Cliente */}
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Informações do Cliente</Typography>
                        <TextField
                            fullWidth
                            label="Nome do Cliente*"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Contato*"
                            name="customer_contact"
                            value={formData.customer_contact}
                            onChange={handleChange}
                            margin="normal"
                            size="small"
                        />
                    </Box>

                    {/* Detalhes */}
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Detalhes</Typography>
                        <TextField
                            fullWidth
                            label="Status"
                            name="status"
                            select
                            value={formData.status}
                            onChange={handleChange}
                            margin="normal"
                            size="small"
                        >
                            <MenuItem value="agendado">Agendado</MenuItem>
                            <MenuItem value="confirmado">Confirmado</MenuItem>
                            <MenuItem value="cancelado">Cancelado</MenuItem>
                            <MenuItem value="concluido">Concluído</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Local"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            margin="normal"
                            size="small"
                        />
                    </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        color="primary"
                    >
                        {event ? 'Atualizar' : 'Agendar'}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ScheduleModal;