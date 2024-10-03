import { SimplerAllAis } from '@/utils/simpler-all-ais';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const API_KEY = process.env.OPENAI_API_KEY; // Fetch the OpenAI API key from environment variable

    if (req.method === 'POST') {
        const { prompt, data, previousConversations, model, apiKey } = req.body;

        // Check if the provided OpenAI API key matches the one in the environment variable
        if (apiKey !== API_KEY) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid API Key' });
        }

        try {
            const response = await SimplerAllAis.askGpt({
                prompt,
                data,
                previousConversations,
                model,
            }, apiKey);
            res.status(200).json({ success: true, message: response });
        } catch (error) {
            console.error("Error in askGpt API:", error);
            res.status(500).json({ success: false, message: "Something went wrong." });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
