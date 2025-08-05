import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Modal,
} from '@mui/material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { CategoryType } from '../../../types/category_product';
import { ProductType } from '../../../types/product';
import { getProdutos, produtoPostApi } from '../../../services/api/product';
import { getProductCategories } from '../../../services/api/category_product';

const initialProdutoData: Omit<ProductType, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'deleted_by' | 'company'> = {
    name: '',
    description: '',
    price: 0,
    category: 'Geral',
    stock: 0,
    image: '',
    company_id: 0,
    code: '',
};

const ProductPage: React.FC = () => {
    const [produtoData, setProdutoData] = useState(initialProdutoData);
    const [categories, setCategories] = useState<CategoryType[]>([{
        id: 0, name: 'Geral',
        company_id: 0
    }]);
    const { state } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [produtos, setProdutos] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = Cookies.get('FireCloudToken');
            if (!token) {
                setError('Usuário não autenticado.');
                return;
            }
            try {
                const categoryList = await getProductCategories(token, state.data?.company.id ?? 0);
                if (categoryList.length === 0 || (categoryList.length === 1 && categoryList[0].name === 'Geral')) {
                    setOpenModal(true);
                }
                setCategories(categoryList.length > 0 ? categoryList : [{ id: 0, name: 'Geral', company_id: 0 }]);
            } catch (err) {
                console.error('Erro ao buscar categorias:', err);
                setError('Erro ao buscar categorias. Tente novamente.');
            }
        };
        const fetchProdutos = async () => {
            const token = Cookies.get('FireCloudToken');
            if (!token) {
                setError('Usuário não autenticado.');
                return;
            }
            try {
                const produtoList = await getProdutos(token);
                setProdutos(produtoList);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao buscar produtos. Tente novamente.');
            }
        };
        fetchCategories();
        fetchProdutos();

        if (state.data?.company.id) {
            setProdutoData((prev) => ({ ...prev, company_id: state.data?.company.id ?? 0 }));
        }
    }, [state.data]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setProdutoData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: any) => {
        const { name, value } = event.target;
        setProdutoData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccessMessage(null);

        const token = Cookies.get('FireCloudToken');
        if (!token || !state.data) {
            setError('Usuário não autenticado.');
            return;
        }

        if (!produtoData.name || !produtoData.price) {
            setError('Por favor, preencha os campos obrigatórios: Nome e Preço.');
            return;
        }

        try {
            const category = categories.find(cat => cat.name === produtoData.category);
            const categoryId = category ? category.id : 0;

            const formattedProdutoData = {
                ...produtoData,
                price: parseFloat(produtoData.price.toString().replace(',', '.')),
                category: produtoData.category,
                category_id: categoryId,
            };
            await produtoPostApi(token, formattedProdutoData);
            setSuccessMessage('Produto cadastrado com sucesso!');
            setProdutoData(initialProdutoData);
        } catch (err) {
            console.error('Erro ao cadastrar produto:', err);
            setError('Erro ao cadastrar produto. Tente novamente.');
        }
    };

    return (
        <Layout withSidebar>
            <Box>
                <Typography variant="h5" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
                    Cadastro de Produto
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Preencha os campos abaixo para cadastrar um novo produto.
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <TextField label="Nome" name="name" value={produtoData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                        <TextField
                            label="Descrição"
                            name="description"
                            value={produtoData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField label="Preço (R$)" name="price" type="text" value={produtoData.price} onChange={handleChange} sx={{ flex: 1 }} />
                            <TextField label="Código" name="code" value={produtoData.code} onChange={handleChange} sx={{ flex: 1 }} />
                            <TextField label="Estoque" name="stock" type="number" value={produtoData.stock} onChange={handleChange} sx={{ flex: 1 }} />
                        </Box>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoria</InputLabel>
                            <Select name="category" value={produtoData.category} onChange={handleSelectChange}>
                                {categories.map((category: CategoryType) => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                            Cadastrar Produto
                        </Button>
                    </CardContent>
                </Card>

                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                            Sua empresa ainda não possui categorias para produtos. Se optar por continuar, seus produtos serão padrão "Geral".
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Crie categorias para organizar seus produtos.
                        </Typography>
                        <Link to="/painel/categorias-produtos">
                            <Button variant="contained" color="primary">
                                Criar Categorias
                            </Button>
                        </Link>
                    </Box>
                </Modal>
            </Box>
            <Typography variant="h6" sx={{ mt: 4 }}>Produtos Cadastrados</Typography>
            {produtos.map((produto) => (
                <Card key={produto.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{produto.name}</Typography>
                        <Typography variant="body2">{produto.description}</Typography>
                        <Typography variant="body2">Preço: R$ {produto.price}</Typography>
                        <Typography variant="body2">Categoria: {produto.category}</Typography>
                        <Typography variant="body2">Estoque: {produto.stock}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Layout>
    );
};

export default ProductPage;