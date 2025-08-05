// src/routes/AppRoute.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/Enterprise/HomePage';
import ServicePage from '../pages/Enterprise/ServicesPage';
import ContactPage from '../pages/Enterprise/ContactPage';
import LoginPage from '../pages/Enterprise/Login/LoginPage';

import DashboardLayout from '../pages/Dashboard/DashboardPage';
import DashboardPageContent from '../pages/Dashboard/DashboardPage/DashboardPage';

import WhatsappPage from '../pages/Dashboard/WhatsappPage';
import AnalyticsPage from '../pages/Dashboard/AnalyticsPage';
import CompanyPage from '../pages/Dashboard/CompanyPage';
import NotFoundPage from '../pages/NotFoundPage';

import { AuthProvider, useAuth } from '../contexts/AuthContext';

import PrivateRoute from './PrivateRoute';
import ChatPage from '../pages/Enterprise/ChatPage';
import ServicePageDashboard from '../pages/Dashboard/ServicePage';
import SchedulePage from '../pages/Dashboard/SchedulePage';
import ProductPage from '../pages/Dashboard/ProductPage';
import PlansPage from '../pages/Dashboard/PlanPage';
import SettingPage from '../pages/Dashboard/SettingPage';
import CategoryProductPage from '../pages/Dashboard/CategoryProductPage';
import CategoryServicePage from '../pages/Dashboard/CategoryServicePage';
import ForgotPasswordPage from '../pages/Enterprise/Login/ForgotPasswordPage';
import ChangePasswordPage from '../pages/Enterprise/Login/ChangePasswordPage';
import RegisterPage from '../pages/Enterprise/RegisterPage';
import BlockedPage from '../pages/Enterprise/BlockedPage';
import ProfilePage from '../pages/Dashboard/ProfilePage';
import AssistantPage from '../pages/Dashboard/AssistantPage';
import CompleteRegistration from '../pages/Enterprise/RegisterPage/CompleteRegistration';
import CreditPage from '../pages/Dashboard/CreditPage';
import FinancePlanPage from '../pages/Dashboard/FinancePage/FinancePlanPage';
import FinanceCreditPage from '../pages/Dashboard/FinancePage/FinanceCreditPage';
import FinanceRedirect from './FinanceRedirect';
import PaymentPage from '../pages/Dashboard/PaymentPage';
import ChatTestPage from '../pages/Enterprise/ChatTestPage';
import ScheduleSlotsPage from '../pages/Dashboard/ScheduleSlots';
import TestePage from '../pages/Dashboard/Teste';

const AppRoute: React.FC = () => {
    const { state } = useAuth();

return (
    <AuthProvider>
        <Routes>
            <Route path="/" element={state?.isAuthenticated ? <Navigate to="/painel" replace /> : <HomePage />} />
            
            <Route path="/chat/company/:company/:code" element={<ChatPage />} />
            <Route path="/chat/teste" element={<ChatTestPage />} />
            <Route path="/servicos" element={<ServicePage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route path="/alterar-senha/:token" element={<ChangePasswordPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/completar-cadastro" element={<CompleteRegistration/>} />
            <Route path="/bloqueado" element={<BlockedPage />} />
            <Route path="/teste" element={<TestePage />} />

            {/* Rotas protegidas */}
            <Route element={<PrivateRoute />}>
                <Route path="/painel" element={<DashboardLayout />}>
                    <Route index element={<DashboardPageContent />} />
                    <Route path="empresa" element={<CompanyPage />} />
                    <Route path="whatsapp" element={<WhatsappPage />} />
                    <Route path="estatisticas" element={<AnalyticsPage />} />
                    <Route path="financeiro" element={<FinanceRedirect />} />
                    <Route path="financeiro/plano" element={<FinancePlanPage />} />
                    <Route path="financeiro/credito" element={<FinanceCreditPage />} />
                    
                    <Route path="servicos" element={<ServicePageDashboard />} />
                    <Route path="produtos" element={<ProductPage />} />
                    <Route path="categorias-servicos" element={<CategoryServicePage />} />
                    <Route path="categorias-produtos" element={<CategoryProductPage />} />
                    
                    <Route path="pagamentos/:paymentId" element={<PaymentPage />} />
                    
                    <Route path="credito" element={<CreditPage />} />
                    <Route path="agendamentos" element={<SchedulePage />} />
                    <Route path="horarios-disponiveis" element={<ScheduleSlotsPage />} />
                    <Route path="planos" element={<PlansPage />} />
                    <Route path="configuracoes" element={<SettingPage />} />
                    <Route path="perfil" element={<ProfilePage />} />
                    <Route path="assistente" element={<AssistantPage />} />
                </Route>
            </Route>     
                       
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </AuthProvider>
);

};

export default AppRoute;