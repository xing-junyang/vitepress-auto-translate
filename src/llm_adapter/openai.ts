import {LLMAdapter} from "./llm_adapter";
import {OpenAI} from "openai";

export class Openai extends LLMAdapter {
    private openai: OpenAI;
    private readonly model: string = '';

    constructor(apiKey: string, baseURL: string, model: string) {
        super(apiKey);
        this.openai = new OpenAI({apiKey: this.apiKey, baseURL: baseURL});
        this.model = model;
    }

    async translate(content: string, targetLang: string) {
        //     translate using openai
        try{
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: `Translate the following text sections to ${targetLang}. 
                     Each section is separated by ------. 
                     Preserve all markdown syntax and formatting.
                     Return translations in the same format.`
                    },
                    {
                        role: "user",
                        content: content
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error: No response from openAI API', error);
            throw new Error('Error: No response from openAI API');
        }
    }

}