import React from 'react';

const FeedbackFormIframe = () => {
    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <iframe
                title="Feedback Form"
                src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAAaGlXSRURVo3REkxMFlSWktHSENVR1NFSThQSTJFQi4u&embed=true"
                frameborder="0"
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
            >
            </iframe>
        </div>
    );
};

export default FeedbackFormIframe;
