import { Container, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import Layout from '../../../components/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const TestePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDateClick = (arg: any) => {
        alert(`Você clicou em: ${arg.dateStr}`);
    };

    return (
        <Layout>
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Agenda de Atendimentos
                </Typography>

                <Box
                    sx={{
                        mt: 4,
                        '& .fc': {
                            fontSize: isMobile ? '0.8rem' : '1rem',
                        },
                        '& .fc-toolbar-title': {
                            fontSize: isMobile ? '1rem' : '1.4rem',
                        },
                        '& .fc-daygrid-day-number': {
                            fontSize: isMobile ? '0.7rem' : '1rem',
                        },
                        '& .fc-daygrid-event': {
                            fontSize: isMobile ? '0.75rem' : '0.95rem',
                            padding: '2px 4px',
                        },
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        locale={ptBrLocale}
                        dateClick={handleDateClick}
                        events={[
                            {
                                title: 'Consulta - João',
                                date: '2025-08-02',
                                color: '#1976d2',
                            },
                        ]}
                        height="auto"
                    />
                </Box>
            </Container>
        </Layout>
    );
};

export default TestePage;
