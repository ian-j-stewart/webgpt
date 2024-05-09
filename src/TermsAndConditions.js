import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsAndConditions = () => {
    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Terms and Conditions
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to our prototype application! This app allows users to ask questions about the US Export Administration Regulations (EAR). It's designed to test the utility of chat-based AI tools in providing regulatory information.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Disclaimer:</strong> The responses provided by the application are not legal advice. They are for informational purposes only and are part of a test to evaluate the effectiveness of such tools. Users should not rely solely on the information provided by this app for making legal decisions.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Feedback:</strong> Users are encouraged to provide feedback on their experience. This feedback is crucial for the ongoing development and improvement of this prototype.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Registration and Communication:</strong> By registering with the app, users agree that Fusionlabs LLC may follow up with communications including but not limited to newsletters, product updates, and other informational materials.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Data Storage:</strong> Fusionlabs LLC, a Virginia, USA registered company, will store personal information provided by users in accordance with our Privacy Policy. This information will be used to enhance user experience and improve our services.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Acceptance of Terms:</strong> By registering and using this application, users are deemed to have read, understood, and agreed to these terms and conditions.
                </Typography>
                <Typography variant="body1" paragraph>
                    We reserve the right to modify these terms at any time. Users are encouraged to periodically review the Terms and Conditions to stay informed of any changes.
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsAndConditions;