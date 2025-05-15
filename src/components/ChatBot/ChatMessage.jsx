import React from 'react';

const ChatMessage = ({ message, isUser, timestamp }) => {
    const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${isUser
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
            >
                <p className="text-sm">{message}</p>
                <span className={`text-xs ${isUser ? 'text-indigo-200' : 'text-gray-500'} block mt-1`}>
                    {formattedTime}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;
