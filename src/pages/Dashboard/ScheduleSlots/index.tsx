import { Typography, Box, useMediaQuery, useTheme, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Layout from '../../../components/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';
import { 
  ScheduleSlot, 
  ScheduleSlotCreate, 
} from '../../../types/schedule_slot';
import { 
  createScheduleSlotApi, 
  updateScheduleSlotApi, 
  deleteScheduleSlotApi, 
  getAvailableScheduleSlotsByCompanyApi
} from '../../../services/api/schedule_slot';
import { EventClickArg, EventDropArg, EventInput, DateSelectArg } from '@fullcalendar/core';
import { useAuth } from '../../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import ScheduleSlotModal from './ScheduleSlotModal';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ServiceResponse } from '../../../types/service';
import { getServices } from '../../../services/api/service';

const ScheduleSlotsPage = () => {
    const { getToken, state } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [events, setEvents] = useState<EventInput[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState<{start: string, end: string} | null>(null);

    const [openHelp, setOpenHelp] = useState(false);
    const [services, setServices] = useState<ServiceResponse[]>([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = getToken() || '';
                const companyId = state.data?.company.id || 0;
                const servicesData = await getServices(token, companyId);
                setServices(servicesData);
            } catch (error) {
                console.error('Erro ao carregar serviços:', error);
                enqueueSnackbar('Erro ao carregar serviços', { variant: 'error' });
            }
        };
        
        fetchServices();
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const token = getToken() || '';
            const companyId = state.data?.company.id || 0;
            const slots = await getAvailableScheduleSlotsByCompanyApi(companyId, token);
            console.log("slots", slots)
            
            const formattedEvents = slots.map((slot: ScheduleSlot) => ({
                id: slot.id.toString(),
                title: slot.is_active ? 'Disponível' : 'Indisponível',
                start: slot.start,
                end: slot.end,
                allDay: slot.all_day,
                color: slot.is_active ? '#4CAF50' : '#F44336',
                extendedProps: {
                    is_active: slot.is_active,
                    is_recurring: slot.is_recurring,
                    company_id: slot.company_id,
                    service_id: slot.service_id,
                    schedule_id: slot.schedule_id
                }
            }));
            
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Erro ao carregar slots:', error);
            enqueueSnackbar('Erro ao carregar horários disponíveis', { variant: 'error' });
        }
    };

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const now = new Date();
        const selectedDate = new Date(selectInfo.startStr);

        if (selectedDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
            enqueueSnackbar('Não é possível criar slots no passado', { variant: 'warning' });
            selectInfo.view.calendar.unselect();
            return;
        }

        const isMonthView = selectInfo.view.type === 'dayGridMonth';

        let startDate = new Date(selectInfo.start);
        let endDate;

        if (isMonthView) {
            // força horário inicial padrão
            startDate.setHours(8, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setHours(9); // uma hora de duração
        } else {
            // pega os horários selecionados normalmente
            endDate = new Date(selectInfo.end);
        }

        const formatDate = (date: Date) => {
            // Formatação sem UTC, usando hora local
            const pad = (num: number) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        setSelectedDateInfo({
            start: formatDate(startDate),
            end: formatDate(endDate)
        });

        setSelectedSlot(null);
        setOpenModal(true);
        selectInfo.view.calendar.unselect();
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        
        const formatForDisplay = (date: Date | null) => {
            if (!date) return '';
            // Formata sem UTC
            const pad = (num: number) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        setSelectedSlot({
            id: parseInt(event.id),
            start: formatForDisplay(event.start),
            end: formatForDisplay(event.end),
            all_day: event.allDay || false,
            is_active: event.extendedProps.is_active,
            is_recurring: event.extendedProps.is_recurring,
            company_id: event.extendedProps.company_id || state.data?.company?.id || 0,
            service_id: event.extendedProps.service_id || null,
            schedule_id: event.extendedProps.schedule_id || null,
            public_id: '',
            created_at: '',
            updated_at: ''
        });
        setOpenModal(true);
    };

    const handleEventDrop = async (dropInfo: EventDropArg) => {
        try {
            const token = getToken() || '';
            const event = dropInfo.event;
            
            const formatForApi = (date: Date | null) => {
                if (!date) return '';
                // Formata sem UTC
                const pad = (num: number) => num.toString().padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            };

            await updateScheduleSlotApi(parseInt(event.id), {
                start: formatForApi(event.start),
                end: formatForApi(event.end),
                all_day: event.allDay
            }, token);
            
            await fetchSlots();
            enqueueSnackbar('Horário atualizado com sucesso', { variant: 'success' });
        } catch (error) {
            console.error('Erro ao atualizar slot:', error);
            enqueueSnackbar('Erro ao atualizar horário', { variant: 'error' });
            await fetchSlots();
        }
    };

    const handleSaveSlot = async (slotData: ScheduleSlotCreate | ScheduleSlot) => {
        try {
            const token = getToken() || '';
            
            if (selectedSlot) {
                await updateScheduleSlotApi(selectedSlot.id, {
                    ...slotData,
                    start: slotData.start,
                    end: slotData.end,
                    all_day: slotData.all_day,
                    is_active: slotData.is_active,
                    is_recurring: slotData.is_recurring,
                    company_id: state.data?.company?.id || 0,
                    service_id: slotData.service_id || null,
                    schedule_id: slotData.schedule_id || null
                }, token);
                enqueueSnackbar('Horário atualizado com sucesso', { variant: 'success' });
            } else if (selectedDateInfo) {
                await createScheduleSlotApi({
                    start: selectedDateInfo.start,
                    end: selectedDateInfo.end,
                    all_day: slotData.all_day || false,
                    is_active: slotData.is_active !== undefined ? slotData.is_active : true,
                    is_recurring: slotData.is_recurring || false,
                    company_id: state.data?.company?.id || 0,
                    service_id: slotData.service_id || null,
                    schedule_id: slotData.schedule_id || null
                }, token);
                enqueueSnackbar('Horário criado com sucesso', { variant: 'success' });
            }
            
            await fetchSlots();
            setOpenModal(false);
        } catch (error) {
            console.error('Erro ao salvar slot:', error);
            enqueueSnackbar('Erro ao salvar horário', { variant: 'error' });
        }
    };

    const handleDeleteSlot = async () => {
        if (selectedSlot) {
            try {
                const token = getToken() || '';
                await deleteScheduleSlotApi(selectedSlot.id, token);
                enqueueSnackbar('Horário removido com sucesso', { variant: 'success' });
                await fetchSlots();
                setOpenModal(false);
            } catch (error) {
                console.error('Erro ao deletar slot:', error);
                enqueueSnackbar('Erro ao remover horário', { variant: 'error' });
            }
        }
    };

    const toolbarOptions = isMobile ? {
        left: 'title',
        center: '',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    } : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    };

    return (
        <Layout withSidebar={true}>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" sx={{ mt: 8, color: 'primary.main', fontWeight: 'bold' }}>
                            Meus Horários Disponíveis
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={4}>
                            Defina aqui os horários em que você está disponível para atender clientes.
                        </Typography>
                    </Box>
                    <IconButton 
                        onClick={() => setOpenHelp(true)} 
                        size={isMobile ? 'small' : 'medium'}
                    >
                        <HelpOutlineIcon color="action" />
                    </IconButton>
                </Stack>
                <Box
                    sx={{
                        mt: 1,
                        '& .fc': {
                            fontSize: isMobile ? '0.6rem' : '1rem',
                        },
                        '& .fc-toolbar-title': {
                            fontSize: isMobile ? '0.8rem' : '1.4rem',
                        },
                        '& .fc-button': {
                            fontSize: isMobile ? '0.7rem' : '0.9rem',
                            padding: isMobile ? '4px 8px' : '6px 12px',
                        },
                        '& .fc-daygrid-day-number': {
                            fontSize: isMobile ? '0.7rem' : '1rem',
                        },
                        '& .fc-daygrid-event': {
                            fontSize: isMobile ? '0.7rem' : '0.95rem',
                            padding: '2px 4px',
                        },
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        initialView={isMobile ? 'timeGridDay' : 'dayGridMonth'}
                        locale={ptBrLocale}
                        selectable={true}
                        editable={true}
                        events={events}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
                        eventDrop={handleEventDrop}
                        height="auto"
                        headerToolbar={toolbarOptions}
                        selectMirror={true}
                        dayMaxEvents={true}
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        businessHours={{
                            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                            startTime: '08:00',
                            endTime: '20:00',
                        }}
                        nowIndicator={true}
                        selectConstraint={{
                            start: '00:00',
                            end: '24:00',
                        }}
                    />
                </Box>

                <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Como marcar seus dias disponíveis</DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            🗓️ <strong>Passo 1:</strong> Escolha um dia no calendário clicando diretamente na data desejada.
                        </Typography>
                        <Typography gutterBottom>
                            ⏰ <strong>Passo 2:</strong> Defina o horário de início e término em que estará disponível nesse dia.
                        </Typography>
                        <Typography gutterBottom>
                            📝 <strong>Passo 3:</strong> Se necessário, marque se o horário será <strong>recorrente</strong> ou apenas para o dia escolhido.
                        </Typography>
                        <Typography gutterBottom>
                            ✅ <strong>Passo 4:</strong> Salve para que os clientes possam visualizar esses horários disponíveis.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            Dica: você pode <strong>arrastar e soltar</strong> os horários já marcados para ajustá-los.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setOpenHelp(false)} 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: '8px' }}
                        >
                            Entendi
                        </Button>
                    </DialogActions>
                </Dialog>

                <ScheduleSlotModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    slot={selectedSlot}
                    dateInfo={selectedDateInfo}
                    onSave={handleSaveSlot}
                    onDelete={handleDeleteSlot}
                    services={services}
                />
            </Box>
        </Layout>
    );
};

export default ScheduleSlotsPage;