// @ts-ignore
import dotenv from 'dotenv';

export class LLMAdapter{
    protected apiKey: string;

    constructor() {
        dotenv.config();
        this.apiKey = process.env.LLM_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('API key not found');
        }
    }

    async translate(content: string, targetLang: string) {
        return '';
    }
}