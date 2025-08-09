import React, { useState, useRef } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Avatar,
    styled,
    useMediaQuery,
    useTheme,
    Tooltip,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';

import { Link, useLocation } from 'react-router-dom';

import {
    Dashboard as DashboardIcon,
    Event as EventIcon,
    Schedule as ScheduleIcon,
    Build as BuildIcon,
    ShoppingCart as ShoppingCartIcon,
    AttachMoney as AttachMoneyIcon,
    ListAlt as ListAltIcon,
    BarChart as BarChartIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    SmartToy as SmartToyIcon,
    Settings as SettingsIcon,
    AddPhotoAlternate as AddPhotoAlternateIcon
} from '@mui/icons-material';

import { useAuth } from "../../../contexts/AuthContext";
import { updateLogoImage, removeLogoImage, getCompanyApi } from "../../../services/api/company";
import { useCompany } from "../../../contexts/CompanyContext";

interface SidebarProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const drawerWidth = 240;

const SidebarContainer = styled(Box)(({}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
    position: 'relative',
}));

const AvatarContainer = styled(Box)({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: `2px solid ${theme.palette.primary.main}`,
    transition: theme.transitions.create(['width', 'height', 'transform'], {
        duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const EditOverlay = styled(Box)(({ }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        opacity: 1,
    },
}));


const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1.5),
    padding: theme.spacing(1, 2),
    '& .MuiListItemIcon-root': {
        minWidth: 'auto',
        marginRight: theme.spacing(2),
        color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    },
    '& .MuiListItemText-primary': {
        fontWeight: active ? 600 : 400,
        color: active ? theme.palette.primary.main : theme.palette.text.primary,
    },
    backgroundColor: active ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    transition: theme.transitions.create(['background-color', 'transform'], {
        duration: theme.transitions.duration.short,
    }),

    // Remove cor vermelha do ripple:
    '& .MuiTouchRipple-root span': {
        backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
    },
}));


const menuItems = [
    { text: 'Painel', to: '/painel', icon: <DashboardIcon />, id: "sidebar-dashboard" },
    
    // Parte operacional mais usada
    { text: 'Marcações', to: '/painel/horarios-disponiveis', icon: <ScheduleIcon />, id: "sidebar-schedules_slots" },
    { text: 'Agendamentos', to: '/painel/agendamentos', icon: <EventIcon />, id: "sidebar-schedules" },
    { text: 'Serviços', to: '/painel/servicos', icon: <BuildIcon />, id: "sidebar-services" },
    { text: 'Produtos', to: '/painel/produtos', icon: <ShoppingCartIcon />, id: "sidebar-products" },

    // Parte financeira e planos
    { text: 'Financeiro', to: '/painel/financeiro', icon: <AttachMoneyIcon />, id: "sidebar-finances" },
    { text: 'Meu Plano', to: '/painel/planos', icon: <ListAltIcon />, id: "sidebar-plans" },

    // Insights
    { text: 'Estatísticas', to: '/painel/estatisticas', icon: <BarChartIcon />, id: "sidebar-analytics" },

    // Administração
    { text: 'Minha Empresa', to: '/painel/empresa', icon: <BusinessIcon />, id: "sidebar-company" },
    { text: 'Meu Perfil', to: '/painel/perfil', icon: <PersonIcon />, id: "sidebar-profile" },
    { text: 'Assistente', to: '/painel/assistente', icon: <SmartToyIcon />, id: "sidebar-assistant" },
    { text: 'Configurações', to: '/painel/configuracoes', icon: <SettingsIcon />, id: "sidebar-settings" },
];


const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { state, getToken } = useAuth();
    const { companyData: globalCompany, updateCompanyData } = useCompany();
    const location = useLocation();
    const businessType = state.data?.company.business_type;
    const [openDialog, setOpenDialog] = useState(false);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showServicesTab = businessType === 'service' || businessType === 'service_product';
    const showProductsTab = businessType === 'product' || businessType === 'service_product';

    const token = getToken();
    
    const company_id = state.data?.company.id ?? 0;
    const company = globalCompany || state.data?.company;

    const getLogoUrl = () => {
        if (!company?.logo_url) return '/placeholder.jpg';
        return company.logo_url;
    };

    const refreshCompanyData = async () => {
        if (!token || !company_id) return;
        try {
            const updatedCompany = await getCompanyApi(token, company_id);
            updateCompanyData(updatedCompany);
        } catch (error) {
            console.error('Erro ao atualizar dados da empresa:', error);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setOpenDialog(true);
        }
    };

    const handleUploadImage = async () => {
        if (!selectedImage || !token) {
            console.error('Nenhuma imagem selecionada ou token inválido');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('image_file', selectedImage);
            
            await updateLogoImage(token, company_id, formData);
            await refreshCompanyData();
            
            setOpenDialog(false);
            setSelectedImage(null);
            setPreviewImage(null);
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            await removeLogoImage(token, company_id);
            await refreshCompanyData();
            
            setOpenRemoveDialog(false);
        } catch (error) {
            console.error('Erro ao remover a imagem:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const drawer = (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: theme.palette.background.paper,
        }}>
            <LogoContainer>
                <AvatarContainer>
                    <Box sx={{ position: 'relative' }} className="user-avatar">
                        <StyledAvatar 
                            alt="Logo da Empresa" 
                            src={company?.logo_url ? getLogoUrl() : '/placeholder.jpg'}
                        />
                        <EditOverlay onClick={handleImageClick}>
                            <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                            <Typography variant="caption" sx={{ color: 'white', mt: 1 }}>
                                {company?.logo_url ? 'Alterar Logo' : 'Adicionar Logo'}
                            </Typography>
                        </EditOverlay>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </Box>
                    
                </AvatarContainer>
            </LogoContainer>
            
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                <List>
                    {menuItems.map(({ text, to, icon, id }) => {
                        if ((text === 'Serviços' && !showServicesTab) || (text === 'Produtos' && !showProductsTab)) {
                            return null;
                        }

                        const active = location.pathname === to || 
                                     (to !== '/painel' && location.pathname.startsWith(to));

            
                        return (
                            <Tooltip key={to} title={text} placement="right" arrow>
                                <Link to={to} style={{ textDecoration: 'none' }}>
                                    <StyledListItemButton 
                                        id={id}
                                        active={active}
                                        onClick={() => isSmallScreen && handleDrawerToggle()}
                                    >
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText primary={text} />
                                    </StyledListItemButton>
                                </Link>
                            </Tooltip>
                        );
                    })}
                </List>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    v1.0.0
                </Typography>
            </Box>

            {/* Dialog para confirmação de upload */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Alterar Logo da Empresa</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pt: 3 }}>
                    {previewImage && (
                        <Avatar
                            src={previewImage}
                            sx={{ width: 120, height: 120, margin: '0 auto 20px' }}
                        />
                    )}
                    <Typography>
                        Deseja alterar a logo da sua empresa?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleUploadImage} 
                        color="primary"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {isLoading ? 'Enviando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmação de remoção */}
            <Dialog open={openRemoveDialog} onClose={() => setOpenRemoveDialog(false)}>
                <DialogTitle>Remover Logo da Empresa</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pt: 3 }}>
                    <Typography>
                        Tem certeza que deseja remover a logo da sua empresa?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRemoveDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleRemoveImage} 
                        color="error"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {isLoading ? 'Removendo...' : 'Remover'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

    return (
        <>
            <SidebarContainer
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: drawerWidth,
                }}
            >
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            borderRight: 'none',
                            boxShadow: theme.shadows[1],
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </SidebarContainer>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxShadow: theme.shadows[3],
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Sidebar;