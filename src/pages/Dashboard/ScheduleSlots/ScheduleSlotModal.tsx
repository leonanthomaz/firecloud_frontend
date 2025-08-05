import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    Stack,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Switch,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Divider,
    Paper,
} from '@mui/material';
import { ScheduleSlot, ScheduleSlotCreate } from '../../../types/schedule_slot';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ServiceResponse } from '../../../types/service';
import { format } from 'date-fns';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '85%', md: '500px' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: '12px',
    maxHeight: '95vh',
    overflowY: 'auto',
};

const timePickerStyle = {
    '& .MuiInputBase-root': {
        borderRadius: '8px',
    }
};

interface ScheduleSlotModalProps {
    open: boolean;
    onClose: () => void;
    slot: ScheduleSlot | null;
    dateInfo: { start: string; end: string } | null;
    onSave: (data: ScheduleSlotCreate | ScheduleSlot) => void;
    onDelete: () => void;
    services: ServiceResponse[];
}

const ScheduleSlotModal = ({ open, onClose, slot, dateInfo, onSave, onDelete, services }: ScheduleSlotModalProps) => {
    const [formData, setFormData] = useState<ScheduleSlotCreate>({
        start: '',
        end: '',
        all_day: false,
        is_active: true,
        is_recurring: false,
        company_id: 0,
        service_id: null,
        schedule_id: null
    });
    
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    
    useEffect(() => {
        if (slot) {
            setFormData(slot);
        } else if (dateInfo) {
            setFormData({
                start: dateInfo.start,
                end: dateInfo.end,
                all_day: false,
                is_active: true,
                is_recurring: false,
                company_id: 0,
                service_id: null,
                schedule_id: null
            });
        } else {
            setFormData({
                start: '',
                end: '',
                all_day: false,
                is_active: true,
                is_recurring: false,
                company_id: 0,
                service_id: null,
                schedule_id: null
            });
        }
    }, [slot, dateInfo]);

    const handleTimeChange = (field: 'start' | 'end') => (newValue: Date | null) => {
        if (!newValue) return;

        // Formata para string no formato ISO sem timezone (hora local)
        const formattedDate = format(newValue, "yyyy-MM-dd'T'HH:mm:ss");
        
        // Cria nova data com os valores locais
       setFormData(prev => ({
            ...prev,
            [field]: formattedDate
        }));
    };

    const handleSwitchChange = (field: 'all_day' | 'is_active' | 'is_recurring') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.checked
        }));
    };

    const handleServiceChange = (event: any) => {
        setFormData(prev => ({
            ...prev,
            service_id: event.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const parseTimeFromISO = (dateString: string) => {
        try {
            if (!dateString) return null;
            
            // Converte a string para Date (interpreta como hora local)
            const date = new Date(dateString);
            
            // Verifica se a data é válida
            if (isNaN(date.getTime())) return null;
            
            return date;
        } catch {
            return null;
        }
    };

    const formatDisplayTime = (dateString: string) => {
        try {
            if (!dateString) return '--:--';
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '--:--';
            
            return format(date, 'HH:mm');
        } catch {
            return '--:--';
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h5" component="h2" mb={2} fontWeight="medium">
                    {slot ? 'Editar Horário' : 'Novo Horário'}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="service-label">Serviço</InputLabel>
                                    <Select
                                        labelId="service-label"
                                        id="service-select"
                                        value={formData.service_id || ''}
                                        label="Serviço"
                                        onChange={handleServiceChange}
                                        required
                                        sx={timePickerStyle}
                                    >
                                        {services.map((service) => (
                                            <MenuItem key={service.id} value={service.id}>
                                                {service.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                            <Stack spacing={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="Hora de início"
                                        value={parseTimeFromISO(formData.start)}
                                        onChange={handleTimeChange('start')}
                                        slotProps={{
                                            textField: { 
                                                fullWidth: true, 
                                                required: true,
                                                sx: timePickerStyle,
                                                helperText: `Horário selecionado: ${formatDisplayTime(formData.start)}`
                                            }
                                        }}
                                        disabled={formData.all_day}
                                        ampm={false}
                                        views={['hours', 'minutes']}
                                    />
                                    <TimePicker
                                        label="Hora de término"
                                        value={parseTimeFromISO(formData.end)}
                                        onChange={handleTimeChange('end')}
                                        slotProps={{
                                            textField: { 
                                                fullWidth: true, 
                                                required: true,
                                                sx: timePickerStyle,
                                                helperText: `Horário selecionado: ${formatDisplayTime(formData.end)}`
                                            }
                                        }}
                                        minTime={parseTimeFromISO(formData.start) ?? undefined}
                                        disabled={formData.all_day}
                                        ampm={false}
                                        views={['hours', 'minutes']}
                                    />
                                </LocalizationProvider>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                            <Stack spacing={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.all_day}
                                            onChange={handleSwitchChange('all_day')}
                                            color="primary"
                                        />
                                    }
                                    label="Dia inteiro"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.is_active}
                                            onChange={handleSwitchChange('is_active')}
                                            color="primary"
                                        />
                                    }
                                    label="Disponível para agendamento"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.is_recurring}
                                            onChange={handleSwitchChange('is_recurring')}
                                            color="primary"
                                        />
                                    }
                                    label="Recorrente (semanal)"
                                />
                            </Stack>
                        </Paper>

                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                            {slot && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    sx={{ borderRadius: '8px' }}
                                >
                                    Excluir
                                </Button>
                            )}
                            <Button 
                                variant="outlined" 
                                onClick={onClose}
                                sx={{ borderRadius: '8px' }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                sx={{ borderRadius: '8px' }}
                            >
                                Salvar
                            </Button>
                        </Stack>
                    </Stack>
                </form>

                <Dialog
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    PaperProps={{ sx: { borderRadius: '12px' } }}
                >
                    <DialogTitle fontWeight="medium">Confirmar exclusão</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Tem certeza que deseja excluir este horário disponível?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setDeleteConfirmOpen(false)}
                            sx={{ borderRadius: '6px' }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => {
                                setDeleteConfirmOpen(false);
                                onDelete();
                            }} 
                            color="error" 
                            autoFocus
                            sx={{ borderRadius: '6px' }}
                        >
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default ScheduleSlotModal;