import {LLMAdapter} from "./llm_adapter";
import axios from "axios";

export class Siliconflow extends LLMAdapter {
    constructor(apiKey: string) {
        super(apiKey);
    }
    async translate(content: string, targetLang: string) {
        const options = {
            method: 'POST',
            url: 'https://api.siliconflow.cn/v1/chat/completions',
            headers: {
                Authorization: 'Bearer ' + this.apiKey,
                'Content-Type': 'application/json',
            },
            data: {
                model: 'deepseek-ai/DeepSeek-V3',
                messages: [
                    {
                        content: `Translate the following text sections to ${targetLang}. Each section is separated by ---. Preserve all markdown syntax and formatting. Return translations in the same format.`,
                        role: 'system',
                    },
                    {
                        role: 'user',
                        content: content,
                    },
                ],
            },
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
            throw new Error('Error: API call failed.' + error);
        }
    }
}