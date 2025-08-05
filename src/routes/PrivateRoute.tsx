import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/Loading/LoadingPage';

const PrivateRoute: React.FC = () => {
    const { state, isAuthenticated } = useAuth();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const token = Cookies.get('FireCloudToken');
        if (token) {
            isAuthenticated();
        }
        setIsAuthChecked(true);
    }, [isAuthenticated]);

    if (!isAuthChecked || state.isLoading) {
        return <LoadingPage />;
    }

    if (state.isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;