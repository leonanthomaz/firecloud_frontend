// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
// import Layout from '../../../components/Layout';
// import Cookies from 'js-cookie';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // import { getTokenStatusApi } from '../../../services/api/token_ia';
// import LoadingPage from '../../../components/Loading/LoadingPage';
// import { TokenStatusResponse } from '../../../types/token_ia';

// const CompanyAnalyticsIA: React.FC = () => {
//     const [data, setData] = useState<TokenStatusResponse | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const getAnalyticsData = async () => {
//             setLoading(true);
//             const token = Cookies.get('FireCloudToken');
//             const provider = "openai";

//             try {
//                 if (token) {
//                     const response = await getTokenStatusApi(token, provider);
//                     setData(response);
//                 } else {
//                     setError("Token não encontrado.");
//                 }
//             } catch (error) {
//                 setError("Erro ao carregar os dados. Tente novamente.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getAnalyticsData();
//     }, []);

//     if (loading) return <LoadingPage />;

//     if (error) return <Layout><Typography color="error">{error}</Typography></Layout>;

//     if (!data) return <Layout><Typography>Dados não disponíveis.</Typography></Layout>;

//     return (
//         <Layout>
//             <Box>
//                 <Typography variant="h5" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
//                     Consumo da IA
//                 </Typography>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">Tokens Usados</Typography>
//                                 <Typography variant="h5" color="primary">{data.credits_used}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">Limite de Créditos</Typography>
//                                 <Typography variant="h5" color="primary">{data.credit_limit ?? 'Ilimitado'}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">Requisições Disponíveis</Typography>
//                                 <Typography variant="h5" color="primary">{data.rate_limit_requests} / {data.rate_limit_interval}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>

//                 <Typography variant="h5" sx={{ mt: 5 }}>Gráficos de Consumo</Typography>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} md={6}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">Consumo de Tokens</Typography>
//                                 <ResponsiveContainer width="100%" height={300}>
//                                     <LineChart data={data.tokensOverTime || []}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="date" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Line type="monotone" dataKey="tokens" stroke="#8884d8" />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                         <Card>
//                             <CardContent>
//                                 <Typography variant="h6">Requisições por Dia</Typography>
//                                 <ResponsiveContainer width="100%" height={300}>
//                                     <LineChart data={data.requestsOverTime || []}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="date" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Legend />
//                                         <Line type="monotone" dataKey="requests" stroke="#82ca9d" />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </Layout>
//     );
// };

// export default CompanyAnalyticsIA;
// function getTokenStatusApi(token: string, provider: string) {
//     throw new Error('Function not implemented.');
// }

