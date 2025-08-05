// // src/components/Enterprise/ParallaxComponent/index.tsx
// import React from 'react';
// import { Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
// import { Parallax, ParallaxLayer } from '@react-spring/parallax';
// import { styled } from '@mui/system';

// // Elementos geométricos estilizados
// const GeometricShape = styled(Box)(() => ({
//   position: 'absolute',
//   borderRadius: '50%',
//   background: 'rgba(255, 255, 255, 0.2)',
//   backdropFilter: 'blur(5px)',
//   border: '1px solid rgba(255, 255, 255, 0.3)',
// }));

// const ChatBotIllustration = styled(Box)({
//   width: '120px',
//   height: '120px',
//   backgroundImage: 'url(https://cdn-icons-png.flaticon.com/512/4712/4712035.png)',
//   backgroundSize: 'contain',
//   backgroundRepeat: 'no-repeat',
//   backgroundPosition: 'center',
//   filter: 'drop-shadow(0 0 10px rgba(100, 149, 237, 0.7))',
// });

// const ParallaxComponent: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <Box sx={{ position: 'relative', overflow: 'hidden', my: 8 }}>
//       <Parallax pages={isMobile ? 1.5 : 2} style={{ width: '100%', height: isMobile ? '600px' : '800px' }}>
//         {/* Camada de fundo com gradiente */}
//         <ParallaxLayer offset={0} speed={0.5} style={{ 
//           background: 'linear-gradient(135deg, #d2e8ff 30%, #a8f0fa 70%)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//           {/* Formas geométricas de fundo */}
//           <GeometricShape sx={{ width: '300px', height: '300px', top: '-50px', left: '-50px' }} />
//           <GeometricShape sx={{ 
//             width: '150px', 
//             height: '150px', 
//             bottom: '50px', 
//             right: '50px',
//             borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
//           }} />
          
//           {/* Triângulo */}
//           <Box sx={{
//             position: 'absolute',
//             width: 0,
//             height: 0,
//             borderLeft: '150px solid transparent',
//             borderRight: '150px solid transparent',
//             borderBottom: '300px solid rgba(255, 255, 255, 0.15)',
//             right: '10%',
//             top: '20%',
//             transform: 'rotate(45deg)',
//           }} />
//         </ParallaxLayer>

//         {/* Camada de conteúdo principal */}
//         <ParallaxLayer offset={0} speed={0.8} style={{ 
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1,
//         }}>
//           <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center', px: 2 }}>
//             <Typography variant="h3" component="h2" sx={{ 
//               fontWeight: 700,
//               color: theme.palette.text.primary,
//               textShadow: '0 2px 10px rgba(0,0,0,0.1)',
//             }}>
//               Chatbots Inteligentes para sua Empresa
//             </Typography>
            
//             <Typography variant="h6" sx={{ 
//               maxWidth: '800px',
//               color: theme.palette.text.secondary,
//             }}>
//               Soluções de IA personalizadas que transformam a interação com seus clientes
//             </Typography>
            
//             <Stack direction={isMobile ? 'column' : 'row'} spacing={4} alignItems="center">
//               <ChatBotIllustration />
//               <ChatBotIllustration sx={{ transform: 'scale(0.8)' }} />
//               <ChatBotIllustration sx={{ transform: 'scale(0.6)' }} />
//             </Stack>
//           </Stack>
//         </ParallaxLayer>

//         {/* Camada de elementos flutuantes */}
//         <ParallaxLayer offset={0.2} speed={0.3} style={{ zIndex: 0 }}>
//           <Box sx={{
//             position: 'absolute',
//             width: '100px',
//             height: '100px',
//             background: 'rgba(168, 240, 250, 0.4)',
//             borderRadius: '50%',
//             top: '30%',
//             left: '10%',
//           }} />
          
//           <Box sx={{
//             position: 'absolute',
//             width: '200px',
//             height: '200px',
//             background: 'rgba(210, 232, 255, 0.3)',
//             borderRadius: '20%',
//             bottom: '10%',
//             left: '5%',
//             transform: 'rotate(45deg)',
//           }} />
//         </ParallaxLayer>

//         {/* Camada de rodapé do parallax */}
//         <ParallaxLayer offset={isMobile ? 0.8 : 1.2} speed={0.4} style={{ 
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'flex-end',
//           paddingBottom: '50px',
//         }}>
//           <Typography variant="body1" sx={{ 
//             color: theme.palette.text.primary,
//             textAlign: 'center',
//             maxWidth: '800px',
//             px: 2,
//           }}>
//             Nossas soluções de IA aprendem com cada interação, oferecendo respostas cada vez mais precisas e naturais.
//           </Typography>
//         </ParallaxLayer>
//       </Parallax>
//     </Box>
//   );
// };

// export default ParallaxComponent;