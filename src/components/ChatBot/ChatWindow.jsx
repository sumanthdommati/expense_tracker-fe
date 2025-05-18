import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Maximize2, Minimize2, ChevronDown, HelpCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { processQuery } from './chatbotService';

const ChatWindow = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hello! I'm your expense assistant. Ask me anything about your expenses, like 'What did I spend on food this month?' or 'Show my highest expense'.",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Example suggestions
    const suggestions = [
        "What did I spend on food this month?",
        "Show my highest expense",
        "How much have I spent in total?",
        "What are my top spending categories?"
    ];

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Hide suggestions after first user message
        setShowSuggestions(false);

        const userMessage = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await processQuery(input);

            // Format response if it contains bullet points (•)
            const formattedResponse = response.includes('•')
                ? formatBulletPoints(response)
                : response;

            // Add bot response
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        text: formattedResponse,
                        isUser: false,
                        timestamp: new Date()
                    }
                ]);
                setIsLoading(false);
            }, 500); // Small delay to make it feel more natural
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text: "Sorry, I couldn't process your request. Please try again.",
                    isUser: false,
                    timestamp: new Date()
                }
            ]);
            setIsLoading(false);
        }
    };

    // Function to format bullet points from backend
    const formatBulletPoints = (text) => {
        // Split text by bullet points
        const parts = text.split('•');

        // First part is intro text (before any bullets)
        const introText = parts[0].trim();

        // Rest are bullet points
        const bullets = parts.slice(1).map(item => item.trim());

        // Return JSX-compatible format with line breaks
        return {
            type: 'formatted',
            intro: introText,
            bullets: bullets
        };
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        inputRef.current?.focus();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            ref={chatContainerRef}
            className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                } ${isExpanded
                    ? 'w-[95vw] h-[80vh] sm:w-[600px] sm:h-[600px] md:w-[700px]'
                    : 'w-[95vw] h-[500px] sm:w-[400px]'
                }`}
        >
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center space-x-2">
                    <MessageCircle size={22} />
                    <h3 className="font-semibold text-lg">Finance Assistant</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleExpand}
                        className="text-white hover:bg-indigo-700 rounded-full p-1.5 transition-colors"
                        aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
                    >
                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-indigo-700 rounded-full p-1.5 transition-colors"
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.map(message => (
                    <ChatMessage
                        key={message.id}
                        message={message.text}
                        isUser={message.isUser}
                        timestamp={message.timestamp}
                    />
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                            <div className="flex space-x-2">
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested queries */}
                {showSuggestions && (
                    <div className="mt-4 mb-2">
                        <p className="text-xs text-gray-500 mb-2 flex items-center">
                            <HelpCircle size={14} className="mr-1" />
                            Try asking:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white shadow-inner">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your expenses..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        disabled={isLoading || !input.trim()}
                        aria-label="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                    <ChevronDown className="inline-block h-3 w-3 mr-1" />
                    Type a question about your finances or try one of the suggestions above
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;