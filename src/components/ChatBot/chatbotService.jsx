import axios from 'axios';

export const processQuery = async (query) => {
    try {
        const response = await axios.post('/chatbot/', {
            query
        });
        return response.data.response;
    } catch (error) {
        console.error('Error processing chatbot query:', error);
        throw new Error('Failed to process query');
    }
};
