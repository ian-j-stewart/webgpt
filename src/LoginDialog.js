// LoginDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const LoginDialog = ({ open, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log("Login with:", username, password);
        onClose(true); // Assuming true indicates successful login or skip
    };

    const handleSkip = () => {
        onClose(false); // Assuming false indicates the user decided to skip login
    };

    return (
        <Dialog open={open} onClose={() => {}}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLogin}>Login</Button>
                <Button onClick={handleSkip}>Skip for Now</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;
