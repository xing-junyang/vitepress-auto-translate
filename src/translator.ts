import { MarkdownParser } from './markdownParser';
import { TranslationSegment } from './types';
import {LLMAdapter} from "./llm_adapter/llm_adapter";
import {Siliconflow} from "./llm_adapter/siliconflow";
import {Openai} from "./llm_adapter/openai";


export class Translator {
    private markdownParser: MarkdownParser;
    private llmAdapter: LLMAdapter

    constructor(apikey: string, llm: string) {
        this.markdownParser = new MarkdownParser();
        if(llm === 'siliconflow'){
            this.llmAdapter = new Siliconflow(apikey);
        }else if(llm === 'openai') {
            this.llmAdapter = new Openai(apikey);
        }else{
            console.error('Error: No LLM adapter found');
            throw new Error('Error: No LLM adapter found');
        }
    }

    async translate(content: string, targetLang: string): Promise<string> {
        try {
            const segments = await this.markdownParser.parse(content);
            const translationNeeded = segments.filter(s => s.needsTranslation);

            const batchSize = 5;
            const maxRetries = 3;
            for (let i = 0; i < translationNeeded.length; i += batchSize) {
                const batch = translationNeeded.slice(i, Math.min(i + batchSize, translationNeeded.length));
                const batchContent = batch.map(s => s.content).join('\n---\n');
                let response = await this.llmAdapter.translate(batchContent, targetLang);
                let retryCount = 0;
                while(!response){
                    if(retryCount === maxRetries){
                        console.error('Error: Max retries exceeded');
                        throw new Error('Max retries exceeded');
                    }
                    console.log('Retrying translation...');
                    retryCount--;
                    response = await this.llmAdapter.translate(batchContent, targetLang);
                }

                const translations = response.split('\n---\n') || [];
                batch.forEach((segment, index) => {
                    segment.content = translations[index]?.trim() || segment.content;
                });
            }

            return await this.markdownParser.reconstruct(segments);

        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }
}