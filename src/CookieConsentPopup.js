import React from 'react';
import { useCookies } from 'react-cookie';
import { Box, Button, Typography } from '@mui/material';

const CookieConsentPopup = () => {
    const [cookies, setCookie] = useCookies(['user-consent']);

    const handleAccept = () => {
        setCookie('user-consent', 'accepted', { path: '/' });
    };

    // If user has already accepted the cookies, do not show the popup
    if (cookies['user-consent'] === 'accepted') {
        return null;
    }

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'background.paper',
            padding: '16px',
            borderTop: '1px solid',
            borderColor: 'divider'
        }}>
            <Typography variant="body1">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </Typography>
            <Button onClick={handleAccept} sx={{ mt: 1 }}>
                Accept
            </Button>
        </Box>
    );
};

export default CookieConsentPopup;
