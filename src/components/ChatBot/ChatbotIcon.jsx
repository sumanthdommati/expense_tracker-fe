import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatbotIcon = ({ onClick, isOpen }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                }`}
            aria-label="Open expense assistant"
        >
            <MessageSquare size={24} />
        </button>
    );
};

export default ChatbotIcon;
