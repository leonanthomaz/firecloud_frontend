import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  getCompanyForChatApi, 
  getCompanyApi, 
  updateCompanyApi, 
  associateCompanyForPlanApi, 
  updateLogoImage, 
  removeLogoImage 
} from '../services/api/company';
import { CompanyInfo, CompanyUpdate } from '../types/company';
import { useAuth } from './AuthContext';
import { useGlobal } from './GlobalContext';

interface CompanyContextType {
  companyData: CompanyInfo | null;
  error: string | null;
  getCompanyForChat: (code: string) => Promise<void>;
  getCompany: (token: string, companyId: number) => Promise<void>;
  updateCompany: (token: string, companyId: number, companyData: CompanyUpdate) => Promise<void>;
  updateCompanyData: (company: CompanyInfo) => void;
  associateCompanyPlan: (token: string, companyId: number, planId: number) => Promise<void>;
  uploadLogo: (token: string, companyId: number, imageData: FormData) => Promise<void>;
  deleteLogo: (token: string, companyId: number) => Promise<void>;
  syncWithAuthData: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state: authState } = useAuth();
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const { setLoading } = useGlobal();
  const [error, setError] = useState<string | null>(null);

  // Sincroniza com os dados da empresa do AuthContext quando monta ou quando authState muda
  useEffect(() => {
    if (authState.data?.company) {
      setCompanyData(authState.data.company);
    }
  }, [authState.data?.company]);

  const updateCompanyData = (companyData: CompanyInfo) => {
    setCompanyData(companyData);
  };

  const handleRequest = async (requestFn: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await requestFn();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncWithAuthData = () => {
    if (authState.data?.company) {
      setCompanyData(authState.data.company);
    }
  };

  const getCompanyForChat = async (code: string) => {
    const data = await handleRequest(() => getCompanyForChatApi(code));
    setCompanyData(data);
  };

  const getCompany = async (token: string, companyId: number) => {
    const data = await handleRequest(() => getCompanyApi(token, companyId));
    setCompanyData(data);
  };

  const updateCompany = async (token: string, companyId: number, data: CompanyUpdate) => {
    const updatedData = await handleRequest(() => updateCompanyApi(token, companyId, data));
    setCompanyData(updatedData);
  };

  const associateCompanyPlan = async (token: string, companyId: number, planId: number) => {
    const result = await handleRequest(() => associateCompanyForPlanApi(token, companyId, planId));
    setCompanyData(result.company);
  };

  const uploadLogo = async (token: string, companyId: number, imageData: FormData) => {
    const updatedData = await handleRequest(() => updateLogoImage(token, companyId, imageData));
    setCompanyData(updatedData);
  };

  const deleteLogo = async (token: string, companyId: number) => {
    const updatedData = await handleRequest(() => removeLogoImage(token, companyId));
    setCompanyData(updatedData);
  };

  return (
    <CompanyContext.Provider 
      value={{ 
        companyData: companyData || authState.data?.company || null,
        error,
        getCompanyForChat,
        getCompany,
        updateCompany,
        updateCompanyData,
        associateCompanyPlan,
        uploadLogo,
        deleteLogo,
        syncWithAuthData
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};