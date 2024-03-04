import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import SelectedThread from './SelectedThread'; // Adjust the import path as needed
import About from './About'; // Ensure you have this component created
// import LoginDialog from './LoginDialog'; // Commented out for now

const App = () => {
    // const [isAuthenticated, setIsAuthenticated] = useState(false); // Commented out for now
    // const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(true); // Commented out for now

    // const handleLoginClose = () => {
    //     setIsAuthenticated(true);
    //     setIsLoginDialogOpen(false);
    // }; // Commented out for now

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
                {/* <LoginDialog open={isLoginDialogOpen && !isAuthenticated} onClose={handleLoginClose} /> */}
            </Container>
            <Box component="footer" sx={{ mt: 5, textAlign: 'center' }}>
                <Button component={Link} to="/about">About This Site</Button>
            </Box>
        </BrowserRouter>
    );
};

export default App;
