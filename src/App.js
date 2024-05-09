import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import SelectedThread from './SelectedThread'; // Adjust the import path as needed
import About from './About';
import FeedbackFormIframe from './FeedbackFormIframe';
import CAPTCHA from './CAPTCHA';
import { useAuth } from './AuthContext';
import { signOut } from "./Signout";
import CookieConsentPopup from './CookieConsentPopup'; // Make sure to import the CookieConsentPopup
import TermsAndConditions from './TermsAndConditions';
const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/" />;
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
                        <Button color="inherit" component="a" href="https://www.fusionlabs.info" target="_blank" rel="noopener noreferrer">
                            Fusionlabs
                        </Button>
                        <Button color="inherit" component={Link} to="/feedback">Feedback</Button>
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
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/feedback" element={<FeedbackFormIframe />} />

                </Routes>
            </Container>
            <Box component="footer" sx={{ mt: 5, textAlign: 'center' }}>
                <Button component={Link} to="/about">About This Site</Button>
                <Button component={Link} to="/terms">Terms and Conditions</Button> {/* Add link to the footer */}
            </Box>
            <CookieConsentPopup />
        </BrowserRouter>
    );
};

export default App;
