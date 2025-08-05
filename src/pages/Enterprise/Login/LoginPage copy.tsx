// import React, { useState, ChangeEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   Button, 
//   TextField, 
//   Paper, 
//   useMediaQuery, 
//   useTheme, 
//   Stack, 
//   CircularProgress, 
//   Divider,
//   Link
// } from '@mui/material';
// import { GoogleLogin } from '@react-oauth/google';
// import { toast } from 'react-toastify';
// import LoginImage from '@/assets/img/robot-smart-rf.png';
// import { useAuth } from '../../../contexts/AuthContext';

// const LoginPage: React.FC = () => {
//     const { state, user, login, loginWithGoogle } = useAuth();
//     const navigate = useNavigate();
//     const theme = useTheme();
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     console.log("user", user())
//     console.log("state", state.data?.user)
    

//     const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
//       (event: ChangeEvent<HTMLInputElement>) => {
//         setter(event.target.value);
//     };

//     const handleLogin = async () => {
//         setIsLoading(true);
//         try {
//             await login(username, password);
//             const currentUser = user();

//             if (currentUser?.is_new_register || currentUser?.is_new_register_google) {
//                 navigate('/complete-registration');
//             } else {
//                 navigate('/painel');
//             }
//         } catch (error) {
//             toast.error("Erro ao fazer login. Verifique suas credenciais");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGoogleLogin = async (response: any) => {
//         if (!response.credential) {
//             toast.error("Token do Google ausente");
//             return;
//         }
//         try {
//             await loginWithGoogle(response.credential);
//             const currentUser = user();

//             if (currentUser?.is_new_register || currentUser?.is_new_register_google) {
//                 navigate('/complete-registration');
//             } else {
//                 navigate('/painel');
//             }
//         } catch (error) {
//             toast.error("Erro ao fazer login com Google");
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: 'linear-gradient(135deg, #d2e8ff 0%, #a8f0fa 100%)',
//                 p: 3,
//                 position: 'relative',
//                 overflow: 'hidden'
//             }}
//         >
//             {/* Efeito de bolhas decorativas */}
//             <Box sx={{
//                 position: 'absolute',
//                 top: '-50px',
//                 right: '-50px',
//                 width: '300px',
//                 height: '300px',
//                 borderRadius: '50%',
//                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                 zIndex: 0
//             }} />
//             <Box sx={{
//                 position: 'absolute',
//                 bottom: '-100px',
//                 left: '-100px',
//                 width: '400px',
//                 height: '400px',
//                 borderRadius: '50%',
//                 backgroundColor: 'rgba(255, 255, 255, 0.15)',
//                 zIndex: 0
//             }} />

//             <Box sx={{
//                 display: 'flex',
//                 flexDirection: isSmallScreen ? 'column' : 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: isSmallScreen ? 4 : 8,
//                 maxWidth: '1200px',
//                 width: '100%',
//                 zIndex: 1,
//                 position: 'relative'
//             }}>
//                 {!isSmallScreen && (
//                     <Box sx={{
//                         flex: 1,
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         maxWidth: '600px'
//                     }}>
//                         <Box
//                             component="img"
//                             src={LoginImage}
//                             alt="Login Illustration"
//                             sx={{ 
//                                 width: '100%',
//                                 maxWidth: '450px',
//                                 height: 'auto',
//                                 objectFit: 'contain',
//                                 filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
//                                 transition: 'transform 0.3s ease',
//                                 '&:hover': {
//                                     transform: 'scale(1.03)'
//                                 }
//                             }}
//                         />
//                     </Box>
//                 )}

//                 <Box sx={{
//                     flex: 1,
//                     display: 'flex',
//                     justifyContent: 'center',
//                     maxWidth: '450px',
//                     width: '100%'
//                 }}>
//                     <Paper
//                         elevation={3}
//                         sx={{
//                             p: 4,
//                             width: '100%',
//                             borderRadius: 4,
//                             backdropFilter: 'blur(10px)',
//                             backgroundColor: 'rgba(255, 255, 255, 0.85)',
//                             boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
//                             border: '1px solid rgba(255, 255, 255, 0.18)',
//                             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                             '&:hover': {
//                                 transform: 'translateY(-5px)',
//                                 boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)'
//                             }
//                         }}
//                     >
//                         <Typography 
//                             variant="h4" 
//                             align="center" 
//                             gutterBottom
//                             sx={{ 
//                                 mb: 3,
//                                 fontWeight: 700,
//                                 color: theme.palette.primary.main,
//                                 background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
//                                 WebkitBackgroundClip: 'text',
//                                 WebkitTextFillColor: 'transparent'
//                             }}
//                         >
//                             Entrar
//                         </Typography>

//                         <Stack spacing={3}>
//                             <TextField
//                                 label="Username"
//                                 variant="outlined"
//                                 fullWidth
//                                 value={username}
//                                 onChange={handleInputChange(setUsername)}
//                                 disabled={isLoading}
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '12px'
//                                     }
//                                 }}
//                             />
                            
//                             <TextField
//                                 label="Senha"
//                                 type="password"
//                                 variant="outlined"
//                                 fullWidth
//                                 value={password}
//                                 onChange={handleInputChange(setPassword)}
//                                 disabled={isLoading}
//                                 sx={{
//                                     '& .MuiOutlinedInput-root': {
//                                         borderRadius: '12px'
//                                     }
//                                 }}
//                             />

//                             <Button
//                                 variant="contained"
//                                 size="large"
//                                 fullWidth
//                                 onClick={handleLogin}
//                                 disabled={isLoading || !username || !password}
//                                 sx={{ 
//                                     py: 1.5,
//                                     fontWeight: 'bold',
//                                     fontSize: '1rem',
//                                     borderRadius: '12px',
//                                     textTransform: 'none',
//                                     letterSpacing: '0.5px',
//                                     background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
//                                     boxShadow: 'none',
//                                     '&:hover': {
//                                         boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
//                                         background: 'linear-gradient(45deg, #1565c0, #0097a7)'
//                                     }
//                                 }}
//                             >
//                                 {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
//                             </Button>

//                             <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
//                                 <Divider sx={{ flexGrow: 1, borderColor: 'rgba(0, 0, 0, 0.12)' }} />
//                                 <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
//                                     OU
//                                 </Typography>
//                                 <Divider sx={{ flexGrow: 1, borderColor: 'rgba(0, 0, 0, 0.12)' }} />
//                             </Box>

//                             <Box sx={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'center',
//                                 '& .MuiButton-root': {
//                                     borderRadius: '12px !important',
//                                     padding: '8px 16px !important'
//                                 }
//                             }}>
//                                 <GoogleLogin 
//                                     onSuccess={handleGoogleLogin} 
//                                     onError={() => toast.error('Erro no login com Google')}
//                                     width={isSmallScreen ? '280' : '320'}
//                                     shape="pill"
//                                     text="signin_with"
//                                 />
//                             </Box>

//                             <Stack spacing={1} sx={{ mt: 1 }}>
//                                 <Link 
//                                     href="/" 
//                                     variant="body2" 
//                                     align="center"
//                                     color="primary"
//                                     sx={{
//                                         textDecoration: 'none',
//                                         '&:hover': {
//                                             textDecoration: 'underline'
//                                         }
//                                     }}
//                                 >
//                                     Voltar à página inicial
//                                 </Link>
//                                 <Link 
//                                     href="/forgot-password" 
//                                     variant="body2" 
//                                     align="center"
//                                     color="primary"
//                                     sx={{
//                                         textDecoration: 'none',
//                                         '&:hover': {
//                                             textDecoration: 'underline'
//                                         }
//                                     }}
//                                 >
//                                     Esqueceu a senha? Clique aqui
//                                 </Link>
//                             </Stack>
//                         </Stack>
//                     </Paper>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default LoginPage;