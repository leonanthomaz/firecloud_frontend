import { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Business, 
  Phone, 
  Language,
  Numbers,
  CheckCircle,
  SupportAgent,
  PersonSearch,
  ReceiptLong,
  CalendarMonth,
  Badge
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Layout from '../../../components/Layout';
import Navbar from '../../../components/Enterprise/Navbar';
import { PlanInfo } from '../../../types/plan';
import { getPlansApi } from '../../../services/api/plan';
import { getRegisterApi, completeRegisterApi } from '../../../services/api/register';
import { useNavigate } from 'react-router-dom';

const businessTypes = [
  { value: 'service', label: 'Serviços' },
  { value: 'product', label: 'Produtos' },
  { value: 'service_product', label: 'Serviços e Produtos' }
];

const industries = [
  'Tecnologia',
  'Saúde',
  'Educação',
  'Construção',
  'Alimentação',
  'Varejo',
  'Petshop',
  'Tarô',
  'RH',
  'Outros'
];

const assistantPreferences = [
  { value: 'receptionist', label: 'Recepcionista', icon: <SupportAgent /> },
  { value: 'sales_assistant', label: 'Assistente de Vendas', icon: <PersonSearch /> },
  { value: 'support_assistant', label: 'Assistente de Suporte', icon: <SupportAgent /> },
  { value: 'booking_agent', label: 'Agente de Reservas', icon: <CalendarMonth /> },
  { value: 'hr_assistant', label: 'Assistente de RH', icon: <Badge /> },
  { value: 'personal_assistant', label: 'Assistente Pessoal', icon: <ReceiptLong /> }
];

const CompleteRegistration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [registerData, setRegisterData] = useState({
    company_name: '',
    phone: '',
    website: '',
    cnpj: '',
    business_type: '',
    industry: '', 
    custom_business_type: '',
    plan_interest: '',
    assistant_preference: '',
    additional_info: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await getPlansApi();
        setPlans(plansData);
      } catch (error) {
        enqueueSnackbar('Erro ao carregar planos', { variant: 'error' });
      }
    };
    loadPlans();
  }, [enqueueSnackbar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (activeTab === 0 && !registerData.company_name) {
      enqueueSnackbar('Preencha o nome da empresa', { variant: 'error'});
      return;
    }
    if (activeTab === 1) {
      if (!registerData.business_type) {
        enqueueSnackbar('Selecione o tipo de negócio', { variant: 'error'});
        return;
      }
      if (registerData.business_type === 'Outro' && !registerData.custom_business_type) {
        enqueueSnackbar('Informe o tipo de negócio', { variant: 'error'});
        return;
      }
    }
    setActiveTab(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveTab(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      enqueueSnackbar('Você precisa aceitar os termos', { variant: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      let registerId: number | null = null;
      let userEmail: string | null = null;

      try {
        const item = localStorage.getItem('pendingRegister');
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && parsed.id) {
            registerId = parsed.id;
            userEmail = parsed.email
          }
        }
      } catch (e) {
        console.error('Erro ao tentar recuperar o ID do pré-cadastro:', e);
      }

      if (!registerId) {
        throw new Error('ID do pré-cadastro não encontrado');
      }

      // 1. Verifica se existe no backend e se o email bate
      const register = await getRegisterApi(registerId);

      if (register.email !== userEmail) {
        enqueueSnackbar('E-mail não corresponde ao cadastro em andamento.', { variant: 'error' });
        localStorage.removeItem('pendingRegister');
        return;
      }

      const completeData = {
        ...registerData,
        business_type: registerData.business_type === 'Outro' 
          ? registerData.custom_business_type 
          : registerData.business_type,
        industry: registerData.industry,
        plan_interest: selectedPlan?.slug || '',
        privacy_policy_version: '1.0',
        privacy_policy_accepted_at: new Date().toISOString()
      };

      await completeRegisterApi(registerId, completeData);

      enqueueSnackbar('Cadastro completado com sucesso!', { variant: 'success' });
      localStorage.removeItem('pendingRegister');
      navigate('/login');
    } catch (error) {
      enqueueSnackbar('Erro ao completar cadastro', { variant: 'error' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCompanyInfoTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        label="Nome da Empresa *"
        name="company_name"
        value={registerData.company_name}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Business />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Telefone"
        name="phone"
        value={registerData.phone}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Website"
        name="website"
        value={registerData.website}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Language />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const renderBusinessDetailsTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormControl fullWidth>
        <InputLabel>Tipo de Negócio *</InputLabel>
        <Select
          name="business_type"
          value={registerData.business_type}
          onChange={(e) => setRegisterData(prev => ({
            ...prev,
            business_type: e.target.value
          }))}
          label="Tipo de Negócio *"
          required
        >
          {businessTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {registerData.business_type === 'Outro' && (
        <TextField
          fullWidth
          label="Especifique o tipo de negócio *"
          name="custom_business_type"
          value={registerData.custom_business_type}
          onChange={handleChange}
          required
        />
      )}

      <TextField
        fullWidth
        label="CNPJ"
        name="cnpj"
        value={registerData.cnpj}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Numbers />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Preferência de Assistente</InputLabel>
        <Select
          name="assistant_preference"
          value={registerData.assistant_preference}
          onChange={(e) => setRegisterData(prev => ({
            ...prev,
            assistant_preference: e.target.value as string
          }))}
          required
          label="Preferência de Assistente"
          startAdornment={
            <InputAdornment position="start">
              <SupportAgent />
            </InputAdornment>
          }
        >
          {assistantPreferences.map((pref) => (
            <MenuItem key={pref.value} value={pref.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {pref.icon}
                {pref.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Indústria</InputLabel>
        <Select
          name="industry"
          value={registerData.industry}
          onChange={(e) => setRegisterData(prev => ({
            ...prev,
            industry: e.target.value
          }))}
          required
          label="Indústria"
        >
          {industries.map((industryOption) => (
            <MenuItem key={industryOption} value={industryOption}>
              {industryOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Informações Adicionais"
        name="additional_info"
        value={registerData.additional_info}
        onChange={handleChange}
        multiline
        rows={3}
        helperText="Alguma informação extra que queira compartilhar conosco?"
      />
    </Box>
  );

  const renderPlanSelectionTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {plans.map((plan) => (
          <Box
            key={plan.id}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: selectedPlan?.id === plan.id ? 'primary.main' : 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main'
              }
            }}
            onClick={() => setSelectedPlan(plan)}
          >
            <Typography fontWeight="bold">{plan.name}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {plan.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              R$ {plan.price.toFixed(2).replace('.', ',')}/mês
            </Typography>
            {selectedPlan?.id === plan.id && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'success.main' }}>
                <CheckCircle sx={{ mr: 1 }} />
                <Typography>Selecionado</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            color="primary"
          />
        }
        label="Eu concordo com os Termos de Serviço e Política de Privacidade"
      />
    </Box>
  );

  const tabsContent = useMemo(() => [
    { label: 'Informações da Empresa', content: renderCompanyInfoTab() },
    { label: 'Detalhes do Negócio', content: renderBusinessDetailsTab() },
    { label: 'Plano', content: renderPlanSelectionTab() }
  ], [registerData, selectedPlan, acceptedTerms, plans]);

  return (
    <Layout>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 12 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete seu cadastro
        </Typography>
        
        {isMobile ? (
          <Stepper activeStep={activeTab} alternativeLabel sx={{ mb: 4 }}>
            {tabsContent.map((tab) => (
              <Step key={tab.label}>
                <StepLabel>{tab.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 4 }}
          >
            {tabsContent.map((tab) => (
              <Tab key={tab.label} label={tab.label} />
            ))}
          </Tabs>
        )}

        <Box sx={{ mb: 4 }}>
          {tabsContent[activeTab].content}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeTab === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Voltar
          </Button>
          
          {activeTab === tabsContent.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading || !acceptedTerms || !selectedPlan}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Finalizar Cadastro'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Próximo
            </Button>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default CompleteRegistration;