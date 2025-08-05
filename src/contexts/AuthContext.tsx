import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useGlobal } from '../contexts/GlobalContext';
import { MeResponse } from '../types/auth';
import { getUserDetailsApi, loginApi, loginWithGoogleApi } from '../services/api/auth';
import { UserResponse } from '../types/user';
import { updateUserApi } from '../services/api/user';
import { useSnackbar } from 'notistack';

interface UpdateUserData {
  first_name?: string;
  username?: string;
  is_admin?: boolean;
}

interface AuthState {
    isAuthenticated: boolean;
    data: MeResponse | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
    login: (username: string, password: string) => Promise<void>;
    loginWithGoogle: (token: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null;
    getUser: () => MeResponse | null;
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
    user: () => UserResponse | undefined;
    updateUser: (userData: UpdateUserData) => Promise<void>; 

}

type AuthAction =
    | { type: 'LOGIN_REQUEST' }
    | { type: 'LOGIN_SUCCESS'; payload: { data: MeResponse } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: MeResponse }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
    isAuthenticated: false,
    data: null,
    isLoading: false,
    error: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return { ...state, isLoading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                data: action.payload.data,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return { ...state, isLoading: false, error: action.payload, data: null, isAuthenticated: false };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, data: null };
        case 'SET_USER':
            return { ...state, data: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [token, setToken] = useState<string | null>(Cookies.get('FireCloudToken') || null);
    const { setLoading } = useGlobal();
    const { enqueueSnackbar } = useSnackbar();
    
    const updateUser = async (userData: UpdateUserData) => {
        if (!token || !state.data?.user) return;
        
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const updatedUser = await updateUserApi(token, state.data.user.id, userData);
            
            // Atualiza os dados no contexto
            dispatch({ 
                type: 'SET_USER', 
                payload: {
                    ...state.data,
                    user: {
                        ...state.data.user,
                        ...updatedUser
                    }
                }
            });            
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            enqueueSnackbar('Erro ao atualizar perfil', { variant: 'error' });
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
    
    useEffect(() => {
        const initializeAuth = async () => {
            const tokenFromCookie = Cookies.get('FireCloudToken');
            setToken(tokenFromCookie || null); // Atualiza o estado do token
            if (tokenFromCookie && !state.data) {
                try {
                    setLoading(true); // Ativa o carregamento global
                    dispatch({ type: 'SET_LOADING', payload: true });
                    const data = await getUserDetailsApi(tokenFromCookie);
                    dispatch({ type: 'LOGIN_SUCCESS', payload: { data } });
                } catch (error: any) {
                    console.error('Erro ao inicializar autenticação:', error);
                    setToken(null);
                    Cookies.remove('FireCloudToken');
                    dispatch({ type: 'LOGOUT' });
                } finally {
                    setLoading(false); // Desativa o carregamento global
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
    
        initializeAuth();
    }, []);
    
    const login = async (username: string, password: string) => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
            const apiToken = await loginApi(username, password);
            setToken(apiToken);
            Cookies.set('FireCloudToken', apiToken, { secure: true, sameSite: 'strict' });
            const data = await getUserDetailsApi(apiToken);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { data } });
        } catch (error: any) {
            console.error('Erro ao fazer login:', error);
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Erro ao tentar fazer login. Verifique suas credenciais.' });
            enqueueSnackbar('Erro ao tentar fazer login. Verifique suas credenciais.', { variant: 'error' });
        }
    };

    const loginWithGoogle = async (googleToken: string) => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
            const response = await loginWithGoogleApi(googleToken);
            const apiToken = response.token;
            setToken(apiToken);
            Cookies.set('FireCloudToken', apiToken, { secure: true, sameSite: 'strict' });
            const data = await getUserDetailsApi(apiToken);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { data } });
        } catch (error: any) {
            console.error('Erro ao fazer login com Google:', error);
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Erro ao autenticar com Google.' });
            enqueueSnackbar('Erro ao autenticar com Google.', { variant: 'error' });

        }
    };

    const logout = () => {
        setToken(null);
        Cookies.remove('FireCloudToken');
        dispatch({ type: 'LOGOUT' });
    };

    const getToken = () => token;
    const getUser = () => state.data;
    const isAuthenticated = () => state.isAuthenticated;
    const isAdmin = () => state.data?.user.is_admin || false;
    const user = () => state.data?.user;

    const value = { state, dispatch, login, logout, loginWithGoogle, getToken, getUser, isAuthenticated, isAdmin, user, updateUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};