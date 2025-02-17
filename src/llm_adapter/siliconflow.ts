import {LLMAdapter} from "./llm_adapter";
import axios from "axios";

export class Siliconflow extends LLMAdapter {
    private readonly baseURL: string = '';
    private readonly model: string = '';

    constructor(apiKey: string, baseURL: string, model: string) {
        super(apiKey);
        this.baseURL = baseURL;
        this.model = model;
    }
    async translate(content: string, targetLang: string) {
        const options = {
            method: 'POST',
            url: this.baseURL,
            headers: {
                Authorization: 'Bearer ' + this.apiKey,
                'Content-Type': 'application/json',
            },
            data: {
                model: this.model,
                messages: [
                    {
                        content: `Translate the following text sections to ${targetLang}. Each section is separated by ------. Must preserve all markdown syntax and formatting. Return translations in the same format.`,
                        role: 'system',
                    },
                    {
                        role: 'user',
                        content: content,
                    },
                ],
            },
            timeout: 100000,
        };

        try {
            const response = await axios(options);
            const data = response.data;

            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Invalid response structure: '+ data);
            }
        } catch (error) {
            console.error('Siliconflow translation error:');
            return null;
        }
    }
}