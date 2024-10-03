import { SimplerAllAis } from '@/utils/simpler-all-ais';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { prompt, data, previousConversations, model, apiKey } = req.body;

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
