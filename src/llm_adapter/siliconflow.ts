import {LLMAdapter} from "./llm_adapter";

export class Siliconflow extends LLMAdapter {
    constructor(apiKey: string) {
        super(apiKey);
    }
    async translate(content: string, targetLang: string) {
        const options = {
            method: 'POST',
            headers: {Authorization: 'Bearer api', 'Content-Type': 'application/json'},
            body: `{"model":"deepseek-ai/DeepSeek-V3","messages":[{"content":"Translate the following text sections to ${targetLang}. Each section is separated by ---. Preserve all markdown syntax and formatting. Return translations in the same format.","role":"system"},{"role":"user","content":"${content}"}]}`
        }

        const response: Response | void = await fetch('https://api.siliconflow.cn/v1/chat/completions', options)
            .then(response => {
                console.log(response)
                return response;
            })
            .catch(err => console.error(err));

        if (response) {
            const data = await response.json();
            return data.choices[0].message.content;
        }else{
            console.error('Error: No response from siliconflow API');
            throw new Error('Error: No response from siliconflow API');
        }
    }
}