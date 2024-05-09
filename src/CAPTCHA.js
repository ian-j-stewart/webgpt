import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from './auth'; // Ensure these are correctly imported
import { auth } from './firebase-config'; // Ensure auth is correctly imported
import { sendPasswordResetEmail } from 'firebase/auth';

const CAPTCHA = () => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'

    const handleCaptcha = (value) => {
        console.log("Captcha value:", value);
        setIsVerified(true);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignIn = async () => {
        if (!isVerified) {
            alert('Please verify that you are a human!');
            return;
        }
        try {
            await signIn(email, password);
            navigate('/main');
        } catch (error) {
            alert('Failed to sign in: ' + error.message);
        }
    };

    const handleSignUp = async () => {
        if (!isVerified) {
            alert('Please verify that you are a human!');
            return;
        }
        try {
            await signUp(email, password);
            navigate('/main');
        } catch (error) {
            alert('Failed to sign up: ' + error.message);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            alert('Please enter your email address to reset your password.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent!');
        } catch (error) {
            alert('Failed to send password reset email: ' + error.message);
        }
    };

    const siteKey = window.location.hostname === "localhost"
        ? process.env.REACT_APP_CAPTCHA_TEST_KEY
        : process.env.REACT_APP_CAPTCHA_KEY;

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ReCAPTCHA
                sitekey={siteKey}
                onChange={handleCaptcha}
                style={{ margin: '20px 0' }}
            />
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                style={{ marginBottom: '10px' }}
            />
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                style={{ marginBottom: '10px' }}
            />
            <button onClick={authMode === 'signin' ? handleSignIn : handleSignUp} style={{ marginBottom: '10px' }}>
                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
            <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} style={{ marginBottom: '10px' }}>
                Switch to {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
            <button onClick={handleResetPassword} style={{ marginBottom: '10px' }}>
                Reset Password
            </button>
        </div>
    );
};

export default CAPTCHA;
