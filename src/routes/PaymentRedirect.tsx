import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentRedirect = () => {
    const navigate = useNavigate();
    const { state } = useAuth();
    const { companyData: globalCompany } = useCompany();

    const companyData = globalCompany || state.data?.company;

    useEffect(() => {
        if (!companyData) return;

        const isPrepaidPlan = companyData.plan_id === 1;

        if (isPrepaidPlan) {
            navigate('/painel/pagamentos/credito/:creditId', { replace: true });
        } else {
            navigate('/painel/pagamentos/plano/:planId', { replace: true });
        }
    }, [companyData, navigate]);

    return null; // Ou um loader se quiser
};

export default PaymentRedirect;
