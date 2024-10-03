import axios from "axios";
import OpenAI from "openai";

const getTextFromJson = (json) => {
    if (json && json.candidates && json.candidates.length > 0) {
        const candidate = json.candidates[0];
        if (
            candidate.content &&
            candidate.content.parts &&
            candidate.content.parts.length > 0
        ) {
            return candidate.content.parts[0].text;
        }
    }
    return null; // Return null if the expected structure is not found
}

export class SimplerAllAis {
    static async askGpt(obj: {
        data?: string,
        prompt: string,
        previousConversations?: Array<{ role: "user" | "assistant" | "system", text: string }>, // New parameter for conversation history
        model?: "gpt-4o-mini" | "gpt-4o" | "o1-preview",
    }, apiKey: string): Promise<string | undefined> {
        if (!obj.model) {
            obj.model = "gpt-4o-mini"
        }

        const convs: any[] = [];

        // Add previous conversations to the request
        if (obj?.previousConversations && obj.previousConversations.length > 0) {
            obj.previousConversations.forEach((conversation) => {
                convs.push({
                    role: conversation.role,
                    content: conversation.text,
                });
            });
        }

        if (obj?.data) {
            convs.push({
                role: 'user',
                content: JSON.stringify(obj.data),
            });
        }

        if (obj?.prompt) {
            convs.push({
                role: 'user',
                content: obj.prompt,
            });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
        });

        try {
            const chatCompletion = await openai.chat.completions.create({
                // @ts-ignore
                messages: convs,
                model: obj.model,
            });
            if (chatCompletion && chatCompletion.choices.length > 0) {
                return chatCompletion.choices[0].message?.content || "No content";
            }
        } catch (e) {
            console.log(`all-ais.ts :: AllAis :: askChatgpt4oMini :: e -> `, e);
            return "Error occurred while processing the request.";
        }
    }
}