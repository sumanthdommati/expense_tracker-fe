import React, { useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatWindow from './ChatWindow';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <>
            <ChatbotIcon onClick={toggleChat} isOpen={isOpen} />
            <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default Chatbot;
