import React from 'react';
import { Box, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button color="inherit" component={Link} to="/about">About</Button>
            </Container>
        </Box>
    );
};

export default Footer;
