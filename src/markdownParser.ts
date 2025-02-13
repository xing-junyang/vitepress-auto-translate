import MarkdownIt from 'markdown-it';
// @ts-ignore
import MarkdownItKatex from 'markdown-it-katex';
import {TranslationSegment} from "./types";


export class MarkdownParser {
    private md: MarkdownIt;
    private segments: TranslationSegment[] = [];

    constructor() {
        this.md = new MarkdownIt('commonmark').use(MarkdownItKatex);
        this.customizeRenderer();
    }

    private getTextSegment(content: string, startLine: number, endLine: number): string {
        const lines = content.split('\n');
        return lines.slice(startLine, endLine).join('\n');
    }

    private customizeRenderer(): void {
        // code blocks
        this.md.renderer.rules.fence = (tokens, idx) => {
            const token = tokens[idx];
            if(token.map == null){
                throw new Error('Token map is null');
            }
            this.segments.push({
                type: 'code',
                content: token.markup + token.info + '\n' + token.content + token.markup,
                needsTranslation: false,
                tokenIndex: [token.map[0], token.map[1]]
            });
            return '';
        };

        // math blocks
        this.md.renderer.rules.math_block = (tokens, idx) => {
            const token = tokens[idx];
            if(token.map == null){
                throw new Error('Token map is null');
            }
            this.segments.push({
                type: 'math',
                content: token.markup + token.content + token.markup,
                needsTranslation: false,
                tokenIndex: [token.map[0], token.map[1]]
            });
            return '';
        };

        // html blocks (e.g. front matter)
        this.md.renderer.rules.html_block = (tokens, idx) => {
            const token = tokens[idx];
            if(token.map == null){
                throw new Error('Token map is null');
            }
            this.segments.push({
                type: 'html',
                content: token.content,
                needsTranslation: false,
                tokenIndex: [token.map[0], token.map[1]]
            });
            return '';
        };
    }

    async parse(content: string): Promise<TranslationSegment[]> {
        this.segments = [];
        // render Markdown: get special blocks
        this.md.render(content);

        //adding text segments to translation segments
        let startLine = 0;
        let endLine = content.split('\n').length;
        let len = this.segments.length;
        for(let i = 0; i < len; i++){
            endLine = this.segments[i].tokenIndex[0];
            this.segments.push({
                type: 'text',
                content: this.getTextSegment(content, startLine, endLine),
                needsTranslation: true,
                tokenIndex: [startLine, endLine],
                length: this.getTextSegment(content, startLine, endLine).length
            });
            startLine = this.segments[i].tokenIndex[1];
        }
        //adding last text segment
        this.segments.push({
            type: 'text',
            content: this.getTextSegment(content, startLine, endLine),
            needsTranslation: true,
            tokenIndex: [startLine, endLine],
            length: this.getTextSegment(content, startLine, endLine).length
        });

        //sorting segments by token index
        this.segments.sort((a, b) => {
            return a.tokenIndex[0] - b.tokenIndex[0];
        });

        //filtering out empty text segments, change `needsTranslation` to false
        this.segments = this.segments.map(s => {
            return {
                ...s,
                needsTranslation: (s.needsTranslation ? (s.length !== 0): false)
            }
        })

        return this.segments;
    }

    async reconstruct(segments: TranslationSegment[]): Promise<string> {
        let result = '';

        for (const segment of segments) {
            result += segment.content;
            result += '\n\n';
        }

        return result;
    }
}