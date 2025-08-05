import React from 'react';
import { 
    Modal, 
    Box, 
    Typography, 
    Button, 
    Stack,
    Paper,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Category, ArrowForward } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useMediaQuery, Theme } from '@mui/material';

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const handleCreateCategories = () => {
        onClose();
        navigate('/painel/categorias-servicos');
        enqueueSnackbar('Redirecionando para criação de categorias', { variant: 'info' });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: '95%', 
                maxWidth: 500 
            }}>
                <Paper sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
                    <Stack spacing={3}>
                        <Box textAlign="center">
                            <Category color="primary" sx={{ fontSize: 48 }} />
                            <Typography variant="h5" component="h2" sx={{ mt: 1, fontWeight: 600 }}>
                                Categorias Necessárias
                            </Typography>
                        </Box>

                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Para cadastrar serviços, você precisa primeiro criar pelo menos uma categoria.
                        </Alert>

                        <Typography variant="body1" color="text.secondary">
                            As categorias ajudam a organizar seus serviços e facilitam a navegação para seus clientes.
                        </Typography>

                        <Stack 
                            direction={isMobile ? 'column' : 'row'} 
                            spacing={2} 
                            justifyContent="flex-end"
                            sx={{ mt: 3 }}
                        >
                            <Button 
                                variant="outlined" 
                                onClick={onClose}
                                sx={{ borderRadius: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            >
                                Fechar
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleCreateCategories}
                                endIcon={<ArrowForward />}
                                sx={{ borderRadius: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            >
                                Criar Categorias
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
};

export default CategoryModal;