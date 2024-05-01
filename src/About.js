import React from 'react';
import { Container, Typography } from '@mui/material';

const About = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>About Page</Typography>
            <Typography>{process.env.REACT_APP_ABOUT_TEXT}</Typography>
        </Container>
    );
};

export default About;