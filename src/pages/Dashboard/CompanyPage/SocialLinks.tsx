import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { 
  Facebook, 
  Instagram, 
  LinkedIn, 
  Twitter,
  Add,
  Close
} from '@mui/icons-material';
import { CompanyInfo } from '../../../types/company';

interface SocialLinksProps {
  company: CompanyInfo;
  onCompanyChange: (newCompany: CompanyInfo) => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ company, onCompanyChange }) => {
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>(
    company.social_media_links || {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    }
  );

  const platforms = [
    { name: 'facebook', label: 'Facebook', icon: <Facebook color="primary" /> },
    { name: 'instagram', label: 'Instagram', icon: <Instagram color="secondary" /> },
    { name: 'linkedin', label: 'LinkedIn', icon: <LinkedIn color="primary" /> },
    { name: 'twitter', label: 'Twitter', icon: <Twitter color="info" /> }
  ];

  const handleSocialLinkChange = (platform: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLinks = { ...socialLinks, [platform]: event.target.value };
    setSocialLinks(newLinks);
    onCompanyChange({ ...company, social_media_links: newLinks });
  };

  const toggleSocialLinks = () => {
    setShowSocialLinks(!showSocialLinks);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={toggleSocialLinks}
        sx={{ mb: 2 }}
      >
        {showSocialLinks ? 'Ocultar Redes Sociais' : 'Adicionar Redes Sociais'}
      </Button>

      {showSocialLinks && (
        <Box 
          sx={{ 
            p: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.paper'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1">Redes Sociais</Typography>
            <IconButton onClick={toggleSocialLinks} size="small">
              <Close />
            </IconButton>
          </Stack>
          
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {platforms.map((platform) => (
              <TextField
                key={platform.name}
                label={`${platform.label} URL`}
                value={socialLinks[platform.name] || ''}
                onChange={handleSocialLinkChange(platform.name)}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <IconButton edge="start" disabled>
                      {platform.icon}
                    </IconButton>
                  ),
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default SocialLinks;