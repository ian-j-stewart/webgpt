// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import SelectedThread from './SelectedThread'; // Adjust the import path as needed
import About from './About'; // Ensure you have this component created
import LoginDialog from './LoginDialog';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(true);

    const handleLoginClose = () => {
        setIsAuthenticated(true);
        setIsLoginDialogOpen(false);
    };

    return (
        <BrowserRouter>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    {/* Other navigation buttons if needed */}
                </Toolbar>
            </AppBar>
            <Container>
                <Routes>
                    <Route path="/" element={<SelectedThread />} />
                    <Route path="/about" element={<About />} />
                </Routes>
                <LoginDialog open={isLoginDialogOpen && !isAuthenticated} onClose={handleLoginClose} />
            </Container>
            <Box component="footer" sx={{ mt: 5, textAlign: 'center' }}>
                <Button component={Link} to="/about">About This Site</Button>
            </Box>
        </BrowserRouter>
    );
};

export default App;
