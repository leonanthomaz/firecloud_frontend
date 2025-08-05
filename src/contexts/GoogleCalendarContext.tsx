import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface GoogleAuthData {
    token: string;
    expiry: string;
    token_uri: string;
    client_id: string;
    client_secret: string;
    scopes: string[];
    universe_domain: string;
    account: string;
}

interface GoogleCalendarContextProps {
    googleToken: string | null;
    handleConnectGoogleCalendar: () => void;
    handleLogoutGoogleCalendar: () => void;
    isLoading: boolean;
    error: string | null;
}

const GoogleCalendarContext = createContext<GoogleCalendarContextProps | undefined>(undefined);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CLIENT_ID = import.meta.env.VITE_API_GOOGLE_ID_CLIENT;
const REDIRECT_URI = import.meta.env.VITE_API_GOOGLE_REDIRECT_URI;
const COOKIE_NAME = 'googleAuthData';

export const GoogleCalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [googleToken, setGoogleToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Recupera os dados salvos no Cookie ao iniciar
    useEffect(() => {
        const savedAuth = Cookies.get(COOKIE_NAME);
        // console.log("Cookie Recuperado:", savedAuth);

        if (savedAuth) {
            try {
                const authData: GoogleAuthData = JSON.parse(savedAuth);
                if (authData.token) {
                    setGoogleToken(JSON.stringify(authData)); // Armazena o JSON completo
                } else {
                    setError('Token não encontrado nos dados salvos no cookie.');
                }
            } catch (error) {
                console.error('Erro ao ler os dados de autenticação do Cookie:', error);
                setError('Erro ao ler os dados do cookie.');
            }
        }
    }, []);

    const handleConnectGoogleCalendar = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(' ')}`;
            window.location.href = authUrl;
        } catch (err) {
            setError('Erro ao tentar conectar com o Google Calendar.');
            console.error(`Erro de conexão: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const encodedToken = params.get('token');

        if (encodedToken) {
            try {
                const decodedToken = decodeURIComponent(encodedToken);
                const tokenObject = JSON.parse(decodedToken);

                if (tokenObject.token) {
                    Cookies.set(COOKIE_NAME, JSON.stringify(tokenObject), {
                        secure: true,
                        sameSite: 'Strict',
                        path: '/',
                    });
                    setGoogleToken(JSON.stringify(tokenObject)); // Armazena o JSON completo
                    navigate('/painel/schedules', { replace: true });
                }
            } catch (error) {
                console.error('Erro ao processar o token:', error);
                setError('Erro ao processar o token.');
            }
        }
    }, [location.search, navigate]);

    const handleLogoutGoogleCalendar = () => {
        Cookies.remove(COOKIE_NAME);
        setGoogleToken(null);
        navigate('/painel/agendamentos');
    };

    return (
        <GoogleCalendarContext.Provider value={{ googleToken, handleConnectGoogleCalendar, handleLogoutGoogleCalendar, isLoading, error }}>
            {children}
        </GoogleCalendarContext.Provider>
    );
};

export const useGoogleCalendar = () => {
    const context = useContext(GoogleCalendarContext);
    if (!context) {
        throw new Error('useGoogleCalendar deve ser usado dentro de GoogleCalendarProvider');
    }
    return context;
};