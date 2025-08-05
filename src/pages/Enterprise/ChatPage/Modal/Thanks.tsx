import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ThankYouDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ThankYouDialog = ({ open, onClose }: ThankYouDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Obrigado!</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Agradecemos pela sua avaliação. Isso nos ajuda a melhorar!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
