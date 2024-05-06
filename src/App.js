import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import SelectedThread from './SelectedThread'; // Adjust the import path as needed
import About from './About'; // Ensure you have this component created
import CAPTCHA from './CAPTCHA'; // Import the CAPTCHA component

const App = () => {
    return (
        <BrowserRouter>
            <AppBar position="static">
                <Toolbar>
                    <img
                        src={process.env.REACT_APP_LOGO}
                        alt="Logo"
                        style={{ height: '50px', marginRight: '20px', backgroundColor: 'white' }}
                    /> <Button color="inherit" component={Link} to="/">Home</Button>
                    {/* Other navigation buttons if needed */}
                </Toolbar>
            </AppBar>
            <Container>
                <Routes>
                    <Route path="/" element={<CAPTCHA />} />
                    <Route path="/main" element={<SelectedThread />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Container>
            <Box component="footer" sx={{ mt: 5, textAlign: 'center' }}>
                <Button component={Link} to="/about">About This Site</Button>
            </Box>
        </BrowserRouter>
    );
};

export default App;