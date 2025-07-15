const { OpenAIAPIKey } = require('./config'); // Create config.js with your API key

class OpenAIAPI {
    static async generateResponse(userMessage, conversationHistory = []) {
        const apiKey = OpenAIAPIKey;
        const endpoint = 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-1106",
                    messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                    max_tokens: 150
                }),
            });

            const responseData = await response.json();

            // Safely check for responseData.choices
            if (
                responseData &&
                Array.isArray(responseData.choices) &&
                responseData.choices.length > 0 &&
                responseData.choices[0].message
            ) {
                console.log('Response from OpenAI API:', responseData.choices[0].message);
                return responseData.choices[0].message.content;
            } else {
                console.error('⚠️ OpenAI API returned an unexpected format:', JSON.stringify(responseData, null, 2));
                return `❌ Error: ${responseData.error.message}. Please try again later.`;
            }

        } catch (error) {
            console.error('❌ Network or processing error occurred:', error.message);
            return '⚠️ Error: Failed to contact AI service. Please check your connection or try again later.';
        }
    }
}

module.exports = { OpenAIAPI };
