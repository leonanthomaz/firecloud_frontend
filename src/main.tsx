// src/main.tsx
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useMuiTheme } from './styles/muiTheme';
import { GlobalProvider } from './contexts/GlobalContext';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PaymentProvider } from './contexts/PaymentContext';
import { SnackbarProvider } from 'notistack';
import { CompanyProvider } from './contexts/CompanyContext';
import { GlobalCss } from './styles/globalStyles';

const Root = () => {
    return (
        <MainApp />
    );
};

const MainApp = () => {
    const muiTheme = useMuiTheme();

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_API_GOOGLE_ID_CLIENT}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <GlobalCss />
                <GlobalProvider> 
                    <AuthProvider>
                        <CompanyProvider>
                            <PaymentProvider>
                                <Router>
                                    <SnackbarProvider
                                        maxSnack={3}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        >
                                        <App />
                                    </SnackbarProvider>
                                </Router>
                            </PaymentProvider>
                        </CompanyProvider>
                    </AuthProvider>
                </GlobalProvider>
            </MuiThemeProvider>
        </GoogleOAuthProvider>
    );
};

createRoot(document.getElementById('root')!).render(<Root />);