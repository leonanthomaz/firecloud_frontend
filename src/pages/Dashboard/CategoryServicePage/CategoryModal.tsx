import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
} from '@mui/material';

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    initialValue?: string;
    title: string;
    submitText: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialValue = '',
    title,
    submitText,
}) => {
    const [name, setName] = useState(initialValue);

    const handleSubmit = () => {
        onSubmit(name);
        setName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nome da Categoria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2, mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {submitText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryModal;