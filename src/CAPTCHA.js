import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from 'react-router-dom';

const CAPTCHA = () => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

    const handleCaptcha = (value) => {
        console.log("Captcha value:", value);
        setIsVerified(true);
    };

    const handleAccess = () => {
        if (isVerified) {
            navigate('/main');
        } else {
            alert('Please verify that you are a human!');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <ReCAPTCHA
                sitekey={process.env.REACT_APP_CAPCHA_KEY} // Replace with your site key
                onChange={handleCaptcha}
            />
            <button onClick={handleAccess} style={{ marginTop: '20px' }}>
                Access Main Page
            </button>
        </div>
    );
};

export default CAPTCHA;