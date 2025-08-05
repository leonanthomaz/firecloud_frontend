// // components/chat/IAResponse.tsx
// import { Box, Typography } from '@mui/material';
// import { ServiceCard } from './ServiceCard';

// interface IAResponseProps {
//   response: any;
// }

// export const IAResponse: React.FC<IAResponseProps> = ({ response }) => {
//   if (response?.type === 'interaction' && response?.data?.services) {
//     return (
//       <Box>
//         <Typography variant="body1" sx={{ mb: 2 }}>
//           {response.user_response}
//         </Typography>

//         {response.data.services.categories.map((cat: any) => (
//           <Box key={cat.category_name} sx={{ mb: 2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//               Categoria: <strong>{cat.category_name}</strong>
//             </Typography>
//             {cat.services.map((srv: any) => (
//               <ServiceCard
//                 key={srv.id}
//                 name={srv.name}
//                 description={srv.description}
//                 price={srv.price}
//                 duration={srv.duration}
//                 // available={srv.availability}
//                 image={srv.image}
//               />
//             ))}
//           </Box>
//         ))}
//       </Box>
//     );
//   }

//   // fallback: resposta como markdown
//   return (
//     <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
//       {response?.user_response}
//     </Typography>
//   );
// };
