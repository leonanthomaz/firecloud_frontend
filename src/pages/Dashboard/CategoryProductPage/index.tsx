import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import Cookies from 'js-cookie';
import { CategoryType, CategoryUpdate } from '../../../types/category_product';
import { createProductCategory, deleteProductCategory, getProductCategories, updateProductCategory } from '../../../services/api/category_product';

const CategoryProductPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [editCategory, setEditCategory] = useState<CategoryUpdate | null>(null);
    const { state } = useAuth();
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; categoryId: number | null }>({
        open: false,
        categoryId: null,
    });

    useEffect(() => {
        fetchCategories();
    }, [state.data]);

    const fetchCategories = async () => {
        const token = Cookies.get('FireCloudToken');
        const companyId = state.data?.company.id;
        if (!token || !companyId) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado ou empresa não encontrada.' });
            return;
        }
        try {
            const categoryList = await getProductCategories(token, companyId);
            setCategories(categoryList);
            setStatusMessage(null);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const handleCreateCategory = async () => {
        const token = Cookies.get('FireCloudToken');
        const companyId = state.data?.company.id;
        if (!token || !companyId) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado ou empresa não encontrada.' });
            return;
        }
        try {
            await createProductCategory(token, companyId, { name: newCategoryName });
            await fetchCategories();
            setNewCategoryName('');
            setIsAddFormVisible(false);
            setStatusMessage({ type: 'success', message: 'Categoria criada com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            setStatusMessage({ type: 'error', message: 'Erro ao criar categoria. Tente novamente.' });
        }
    };

    const handleDeleteCategory = async () => {
        const token = Cookies.get('FireCloudToken');
        const companyId = state.data?.company.id;
        if (!token || !deleteConfirmation.categoryId || !companyId) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado, categoria ou empresa não especificada.' });
            return;
        }
        try {
            await deleteProductCategory(token, companyId, deleteConfirmation.categoryId);
            setCategories(categories.filter((category) => category.id !== deleteConfirmation.categoryId));
            setStatusMessage({ type: 'success', message: 'Categoria excluída com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            setStatusMessage({ type: 'error', message: 'Erro ao excluir categoria. Tente novamente.' });
        } finally {
            setDeleteConfirmation({ open: false, categoryId: null });
        }
    };

    const handleEditCategory = (category: CategoryType) => {
        setEditCategory({ ...category, company_id: state.data?.company.id ?? 0 });
    };

    const handleUpdateCategory = async () => {
        if (!editCategory || !editCategory.name || !editCategory.name.trim()) {
            setStatusMessage({ type: 'error', message: 'Nome da categoria não pode estar vazio.' });
            return;
        }
        const token = Cookies.get('FireCloudToken');
        const companyId = state.data?.company.id;
        if (!token || !companyId) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado ou empresa não encontrada.' });
            return;
        }
        try {
            const updatedCategory = await updateProductCategory(token, companyId, editCategory.id, {
                name: editCategory.name,
                id: 0,
                company_id: 0
            });
            setCategories(categories.map((cat) => (cat.id === editCategory.id ? updatedCategory : cat)));
            setEditCategory(null);
            setStatusMessage({ type: 'success', message: 'Categoria atualizada com sucesso!' });
        } catch (error: any) {
            setStatusMessage({ type: 'error', message: error.message || 'Erro ao atualizar categoria. Tente novamente.' });
        }
    };

    const confirmDeleteCategory = (categoryId: number) => {
        setDeleteConfirmation({ open: true, categoryId });
    };

    return (
        <Layout withSidebar>
            <Box>
                <Typography variant="h5" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
                    Categorias de Produtos
                </Typography>
                {statusMessage && (
                    <Alert severity={statusMessage.type} sx={{ mb: 3 }}>
                        {statusMessage.message}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {editCategory === null && (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsAddFormVisible(!isAddFormVisible)}
                            >
                                {isAddFormVisible ? 'Cancelar' : 'Adicionar Categoria'}
                            </Button>
                        </>
                    )}
                </Box>
                {isAddFormVisible && (
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            label="Nome da Categoria"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                            <Button variant="contained" color="primary" onClick={handleCreateCategory}>
                                Criar Categoria
                            </Button>
                            <Button variant="outlined" onClick={() => setIsAddFormVisible(false)}>
                                Cancelar
                            </Button>
                        </Box>
                    </Box>
                )}
                <TableContainer sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditCategory(category)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => confirmDeleteCategory(category.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {editCategory && (
                    <Dialog open={!!editCategory} onClose={() => setEditCategory(null)}>
                        <DialogTitle>Editar Categoria</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Nome da Categoria"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditCategory(null)}>Cancelar</Button>
                            <Button onClick={handleUpdateCategory} variant="contained" color="primary">
                                Salvar
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, categoryId: null })}>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogContent>
                        <Typography>Tem certeza que deseja excluir esta categoria?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmation({ open: false, categoryId: null })}>Cancelar</Button>
                        <Button onClick={handleDeleteCategory} variant="contained" color="secondary">
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default CategoryProductPage;
