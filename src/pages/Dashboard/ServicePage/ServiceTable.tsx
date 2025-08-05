import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ServiceBase as ServiceType } from '../../../types/service';
import { CategoryType } from '../../../types/category_product';

interface ServiceTableProps {
  services: ServiceType[];
  categories: CategoryType[];
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, categories }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service) => {
            const categoryName = categories.find((cat) => cat.id === service.category_id)?.name || 'Sem categoria';
            return (
              <TableRow key={service.name}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{`R$ ${service.price}`}</TableCell>
                <TableCell>{categoryName}</TableCell>
                <TableCell>
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServiceTable;
