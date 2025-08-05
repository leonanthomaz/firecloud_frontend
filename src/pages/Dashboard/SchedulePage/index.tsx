import { Typography, Box, useMediaQuery, useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Chip } from '@mui/material';
import Layout from '../../../components/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';
import { Schedule, ScheduleCreate } from '../../../types/schedule';
import { createScheduleApi, getAvailableScheduleByCompanyApi } from '../../../services/api/schedule';
import { getAvailableScheduleSlotsByCompanyApi } from '../../../services/api/schedule_slot';
import { EventClickArg, EventInput, DateSelectArg } from '@fullcalendar/core';
import ScheduleModal from './ScheduleModal';
import { ServiceResponse } from '../../../types/service';
import { getServices } from '../../../services/api/service';
import { useAuth } from '../../../contexts/AuthContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { format } from 'date-fns';

const SchedulePage = () => {
    const { state, getToken } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [events, setEvents] = useState<EventInput[]>([]);
    const [availableSlots, setAvailableSlots] = useState<EventInput[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState<{start: string, end: string} | null>(null);
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [openHelp, setOpenHelp] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken() || '';
                const companyId = state.data?.company.id || 0;
                
                const [servicesData, slotsData, schedulesData] = await Promise.all([
                    getServices(token, companyId),
                    getAvailableScheduleSlotsByCompanyApi(companyId, token),
                    getAvailableScheduleByCompanyApi(companyId, token),
                ]);

                setServices(servicesData);

                // Format available slots - make them clickable
                const formattedSlots = slotsData.map((slot: any) => ({
                    id: `slot-${slot.id}`,
                    start: slot.start,
                    end: slot.end,
                    display: 'auto', // Changed from 'background' to make clickable
                    color: slot.is_active ? '#4CAF50' : '#F44336',
                    extendedProps: {
                        is_active: slot.is_active,
                        service_id: slot.service_id,
                        is_slot: true // Mark as slot
                    }
                }));

                setAvailableSlots(formattedSlots);

                // Format scheduled events
                const formattedEvents = schedulesData.map((schedule: Schedule) => {
                    const service = servicesData.find(s => s.id === schedule.service_id);
                    return {
                        id: schedule.id.toString(),
                        title: service ? `${service.name} - ${schedule.customer_name}` : `Agendamento - ${schedule.customer_name}`,
                        start: schedule.start,
                        end: schedule.end || undefined,
                        color: '#3f51b5',
                        extendedProps: {
                            description: schedule.description,
                            customer_name: schedule.customer_name,
                            customer_contact: schedule.customer_contact,
                            status: schedule.status,
                            location: schedule.location,
                            service_id: schedule.service_id
                        }
                    };
                });

                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const selectedStart = new Date(selectInfo.startStr);
        const selectedEnd = new Date(selectInfo.endStr);
        
        // Check if selected time is within an available slot
        const isAvailable = availableSlots.some(slot => {
            const slotStart = new Date(slot.start as string);
            const slotEnd = new Date(slot.end as string);
            
            return (
                slot.extendedProps?.is_active &&
                selectedStart >= slotStart && 
                selectedEnd <= slotEnd
            );
        });

        if (!isAvailable) {
            alert('Este horário não está disponível para agendamento');
            selectInfo.view.calendar.unselect();
            return;
        }

        setSelectedSlotInfo({
            start: selectInfo.startStr,
            end: selectInfo.endStr
        });
        setSelectedEvent(null);
        setOpenModal(true);
        selectInfo.view.calendar.unselect();
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        
        if (event.extendedProps.is_slot) {
            // Handle click on available slot
            setSelectedSlotInfo({
                start: event.startStr,
                end: event.endStr
            });
            setSelectedEvent(null);
            setOpenModal(true);
            return;
        }
        
        // Handle click on scheduled event
        setSelectedEvent({
            id: parseInt(event.id),
            title: event.title,
            start: event.start?.toISOString() || '',
            end: event.end?.toISOString() || null,
            all_day: false,
            color: event.backgroundColor || '#3f51b5',
            description: event.extendedProps.description,
            customer_name: event.extendedProps.customer_name,
            customer_contact: event.extendedProps.customer_contact,
            status: event.extendedProps.status,
            location: event.extendedProps.location,
            service_id: event.extendedProps.service_id,
            company_id: state.data?.company?.id || 0,
            public_id: '',
            created_at: '',
            updated_at: ''
        });
        setOpenModal(true);
    };

    const handleSaveEvent = async (scheduleData: ScheduleCreate) => {
        try {
            const token = getToken() || '';
            const companyId = state.data?.company.id || 0;
            
            if (selectedSlotInfo) {
                await createScheduleApi({
                    ...scheduleData,
                    start: selectedSlotInfo.start,
                    end: selectedSlotInfo.end,
                    all_day: false,
                    company_id: companyId
                }, token);
            }
            
            // Refresh data
            const schedules = await getAvailableScheduleByCompanyApi(companyId, token);
            const formattedEvents = schedules.map((schedule: Schedule) => {
                const service = services.find(s => s.id === schedule.service_id);
                return {
                    id: schedule.id.toString(),
                    title: service ? `${service.name} - ${schedule.customer_name}` : `Agendamento - ${schedule.customer_name}`,
                    start: schedule.start,
                    end: schedule.end || undefined,
                    color: '#3f51b5',
                    extendedProps: {
                        description: schedule.description,
                        customer_name: schedule.customer_name,
                        customer_contact: schedule.customer_contact,
                        status: schedule.status,
                        location: schedule.location,
                        service_id: schedule.service_id
                    }
                };
            });
            
            setEvents(formattedEvents);
            setOpenModal(false);
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    // Custom render for month view - simplified
    const dayCellContent = (arg: any) => {
        const hasAvailableSlots = availableSlots.some(slot => {
            const slotDate = new Date(slot.start as string);
            return (
                slot.extendedProps?.is_active &&
                slotDate.getDate() === arg.date.getDate() &&
                slotDate.getMonth() === arg.date.getMonth() &&
                slotDate.getFullYear() === arg.date.getFullYear()
            );
        });

        return (
            <div style={{
                backgroundColor: hasAvailableSlots ? '#e8f5e9' : 'transparent',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
            }}>
                <div style={{
                    color: hasAvailableSlots ? '#2e7d32' : 'inherit',
                    fontWeight: hasAvailableSlots ? 'bold' : 'normal'
                }}>
                    {arg.dayNumberText}
                </div>
            </div>
        );
    };

    // Custom event content for mobile
    const eventContent = (arg: any) => {
        if (isMobile) {
            // Simplified mobile view
            return (
                <div style={{
                    padding: '2px',
                    fontSize: '0.7rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {arg.event.extendedProps.is_slot ? 'Disponível' : arg.event.title.split('-')[0]}
                </div>
            );
        }

        // Desktop view
        if (arg.event.extendedProps.is_slot) {
            // Available slots
            const start = format(arg.event.start, 'HH:mm');
            const end = format(arg.event.end, 'HH:mm');
            const service = services.find(s => s.id === arg.event.extendedProps.service_id);
            
            return (
                <div style={{
                    padding: '4px',
                    fontSize: '0.8rem'
                }}>
                    <div><strong>{service?.name || 'Disponível'}</strong></div>
                    <div>{start} - {end}</div>
                </div>
            );
        } else {
            // Scheduled events
            return (
                <div style={{
                    padding: '4px',
                    fontSize: '0.8rem'
                }}>
                    <div><strong>{arg.event.title.split('-')[0]}</strong></div>
                    <div>{arg.event.title.split('-')[1]}</div>
                </div>
            );
        }
    };

    const toolbarOptions = isMobile ? {
        left: 'title',
        center: '',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    } : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    };

    return (
        <Layout withSidebar={true}>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" sx={{ mt: 8, color: 'primary.main', fontWeight: 'bold' }}>
                            Agendamentos
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={4}>
                            Agende seu horário nos períodos disponíveis
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setOpenHelp(true)}>
                        <HelpOutlineIcon color="action" />
                    </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} mb={3}>
                    <Chip label="Disponível" sx={{ backgroundColor: '#e8f5e9' }} size="small" />
                    <Chip label="Agendado" sx={{ backgroundColor: '#3f51b5', color: 'white' }} size="small" />
                </Stack>

                <Box sx={{
                    '& .fc': { fontSize: isMobile ? '0.6rem' : '1rem' },
                    '& .fc-toolbar-title': { 
                        fontSize: isMobile ? '0.8rem' : '1.4rem',
                    },
                    '& .fc-button': {
                        fontSize: isMobile ? '0.7rem' : '0.9rem',
                        padding: isMobile ? '4px 8px' : '6px 12px',
                    },
                    '& .fc-daygrid-day': { cursor: 'pointer' },
                    '& .fc-event': { 
                        cursor: 'pointer',
                        // Better mobile event styling
                        ...(isMobile && {
                            margin: '1px',
                            padding: '0 2px'
                        })
                    },
                    // Prevent event overflow in mobile
                    ...(isMobile && {
                        '& .fc-daygrid-event': {
                            margin: '1px 0'
                        },
                        '& .fc-timegrid-event': {
                            margin: '1px 0'
                        }
                    })
                }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        initialView={isMobile ? 'timeGridDay' : 'dayGridMonth'}
                        locale={ptBrLocale}
                        selectable={true}
                        editable={false}
                        events={[...availableSlots, ...events]}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
                        height="auto"
                        headerToolbar={toolbarOptions}
                        selectMirror={true}
                        dayMaxEvents={isMobile ? 1 : true} // Limit events in mobile
                        nowIndicator={true}
                        dayCellContent={dayCellContent}
                        eventContent={eventContent}
                        selectConstraint={{
                            startTime: state.data?.company.opening_time || '08:00',
                            endTime: state.data?.company.closing_time || '17:00',
                            daysOfWeek: [1,2,3,4,5,6] // Including Saturday
                        }}
                        businessHours={{
                            daysOfWeek: [1,2,3,4,5,6], // Including Saturday
                            startTime: state.data?.company.opening_time || '08:00',
                            endTime: state.data?.company.closing_time || '17:00',
                        }}
                    />
                </Box>

                <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Como agendar</DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            🟢 <strong>Dias verdes:</strong> Possuem horários disponíveis
                        </Typography>
                        <Typography gutterBottom>
                            🔵 <strong>Modo semana/dia:</strong> Mostra os horários disponíveis
                        </Typography>
                        <Typography gutterBottom>
                            🕒 <strong>Para agendar:</strong> Clique em um horário verde
                        </Typography>
                        {isMobile && (
                            <Typography gutterBottom>
                                📱 <strong>Mobile:</strong> Toque nos eventos para mais detalhes
                            </Typography>
                        )}
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

                <ScheduleModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    event={selectedEvent}
                    dateInfo={selectedSlotInfo}
                    onSave={handleSaveEvent}
                    services={services}
                />
            </Box>
        </Layout>
    );
};

export default SchedulePage;