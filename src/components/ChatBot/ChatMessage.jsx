import React from 'react';
import { format } from 'date-fns';

const ChatMessage = ({ message, isUser, timestamp }) => {
    // Check if message is a formatted object with bullet points
    const isFormattedMessage = message && typeof message === 'object' && message.type === 'formatted';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[85%] ${isUser
                        ? 'bg-indigo-600 text-white rounded-lg rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-lg rounded-bl-none'
                    } px-4 py-2`}
            >
                {isFormattedMessage ? (
                    <div>
                        {/* Intro text */}
                        <p className="mb-2">{message.intro}</p>

                        {/* Bullet points */}
                        <ul className="pl-4 space-y-2">
                            {message.bullets.map((bullet, index) => (
                                <li key={index} className="flex">
                                    <span className="mr-2">•</span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>{message}</p>
                )}
                <div className={`text-xs mt-1 ${isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {format(timestamp, 'h:mm a')}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;