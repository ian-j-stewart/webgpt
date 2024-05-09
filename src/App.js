import React from 'react';
import { BrowserRouter, Routes, Route, Link , Navigate} from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import SelectedThread from './SelectedThread'; // Adjust the import path as needed
import About from './About'; // Ensure you have this component created
import CAPTCHA from './CAPTCHA'; // Import the CAPTCHA component
import { auth } from './firebase-config';
import { useAuth } from './AuthContext';
import {signOut} from "./Signout";

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/" />;
};
export const signUp = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
};

export const signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};
const App = () => {
    const { currentUser } = useAuth();

    return (
        <BrowserRouter>
            <AppBar position="static">
                <Toolbar>
                    <img
                        src={process.env.REACT_APP_LOGO}
                        alt="Logo"
                        style={{ height: '50px', marginRight: '20px', backgroundColor: 'white' }}
                    />
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    {currentUser && (
                        <Button color="inherit" onClick={signOut} style={{ marginLeft: 'auto' }}>
                            Sign Out
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                <Routes>
                    <Route path="/" element={<CAPTCHA />} />
                    <Route path="/main" element={<ProtectedRoute><SelectedThread /></ProtectedRoute>} />
                    <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                </Routes>
            </Container>
            <Box component="footer" sx={{ mt: 5, textAlign: 'center' }}>
                <Button component={Link} to="/about">About This Site</Button>
            </Box>
        </BrowserRouter>
    );
};


export default App;