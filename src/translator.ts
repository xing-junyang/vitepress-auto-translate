import { MarkdownParser } from './markdownParser';
import {LLMAdapter} from "./llm_adapter/llm_adapter";
import {Siliconflow} from "./llm_adapter/siliconflow";
import {Openai} from "./llm_adapter/openai";
// @ts-ignore
import cliProgress from 'cli-progress';


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
            throw new Error('No LLM adapter found');
        }
    }

    async translate(content: string, targetLang: string, maxRetries: number): Promise<string> {
        try {
            const segments = await this.markdownParser.parse(content);
            const translationNeeded = segments.filter(s => s.needsTranslation);
            const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            const totalSegments = translationNeeded.length;
            progressBar.start(totalSegments, 0);
            const batchSize = 5;
            for (let i = 0; i < totalSegments; i += batchSize) {
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
                progressBar.update(i + (i + batchSize > totalSegments ? totalSegments - i : batchSize));
            }
            progressBar.stop();

            return await this.markdownParser.reconstruct(segments);

        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }
}