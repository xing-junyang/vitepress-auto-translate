export class LLMAdapter{
    protected apiKey: string;

    constructor(apiKey: string){
        this.apiKey = apiKey;
    }

    async translate(content: string, targetLang: string): Promise<string | null> {
        return '';
    }
}