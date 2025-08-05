import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import Cookies from 'js-cookie';
import { CategoryType, CategoryUpdate } from '../../../types/category_service';
import { createServiceCategory, deleteServiceCategory, getServiceCategories, updateServiceCategory } from '../../../services/api/category_service';
import CategoryModal from './CategoryModal';
import CategoryTable from './CategoryTable';

const CategoryServicePage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [editCategory, setEditCategory] = useState<CategoryUpdate | null>(null);
    const { state, isAuthenticated, getToken } = useAuth();
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; categoryId: number | null }>({
        open: false,
        categoryId: null,
    });

    const authenticated = isAuthenticated();
    const token: string | null = getToken();

    useEffect(() => {
        if (state.data?.company.id) {
            fetchCategories();
        }
    }, [state.data?.company.id]);

    const fetchCategories = async () => {
        if (!authenticated || !state.data?.company.id) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado ou empresa não especificada.' });
            return;
        }
        try {
            if (token) {
                const categoryList = await getServiceCategories(token, state.data?.company.id);
                setCategories(categoryList);
                setStatusMessage(null);
            } else {
                setStatusMessage({ type: 'error', message: 'Token não encontrado. Tente novamente.' });
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            setStatusMessage({ type: 'error', message: 'Erro ao buscar categorias. Tente novamente.' });
        }
    };

    const handleCreateCategory = async (name: string) => {
        if (!authenticated || !state.data?.company.id) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado ou empresa não especificada.' });
            return;
        }
        try {
            if (token) {
                await createServiceCategory(token, state.data?.company.id, { name: name });
                await fetchCategories();
                setStatusMessage({ type: 'success', message: 'Categoria criada com sucesso!' });
            } else {
                setStatusMessage({ type: 'error', message: 'Token não encontrado. Tente novamente.' });
            }
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            setStatusMessage({ type: 'error', message: 'Erro ao criar categoria. Tente novamente.' });
        }
    };

    const handleDeleteCategory = async () => {
        const token = Cookies.get('FireCloudToken');
        if (!token || deleteConfirmation.categoryId === null || !state.data?.company.id) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado, categoria ou empresa não especificada.' });
            return;
        }
        try {
            await deleteServiceCategory(token, state.data?.company.id, deleteConfirmation.categoryId);
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
        setEditCategory({ ...category, company_id: state.data?.company.id });
    };

    const handleUpdateCategory = async (name:string) => {
        if (!editCategory || !name?.trim() || !state.data?.company.id) {
            setStatusMessage({ type: 'error', message: 'Nome da categoria ou empresa não especificada.' });
            return;
        }
        const token = Cookies.get('FireCloudToken');
        if (!token) {
            setStatusMessage({ type: 'error', message: 'Usuário não autenticado.' });
            return;
        }
        try {
            if (name) {
                const updatedCategory = await updateServiceCategory(token, state.data?.company.id, editCategory.id, { name: name });
                setCategories(categories.map((cat) => (cat.id === editCategory.id ? updatedCategory : cat)));
                setEditCategory(null);
                setStatusMessage({ type: 'success', message: 'Categoria atualizada com sucesso!' });
            }
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
                    Categorias de Serviços
                </Typography>
                {statusMessage && (
                    <Alert severity={statusMessage.type} sx={{ mb: 3 }}>
                        {statusMessage.message}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {editCategory === null && (
                        <Button variant="contained" color="primary" onClick={() => setIsAddFormVisible(true)}>
                            Adicionar Categoria
                        </Button>
                    )}
                </Box>

                <CategoryModal
                    open={isAddFormVisible}
                    onClose={() => setIsAddFormVisible(false)}
                    onSubmit={handleCreateCategory}
                    title="Adicionar Categoria"
                    submitText="Criar Categoria"
                />

                <CategoryTable
                    categories={categories}
                    onEdit={handleEditCategory}
                    onDelete={confirmDeleteCategory}
                />

                {editCategory && (
                    <CategoryModal
                        open={!!editCategory}
                        onClose={() => setEditCategory(null)}
                        onSubmit={handleUpdateCategory}
                        initialValue={editCategory.name}
                        title="Editar Categoria"
                        submitText="Salvar"
                    />
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

export default CategoryServicePage;