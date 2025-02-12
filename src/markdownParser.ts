import MarkdownIt from 'markdown-it';
import frontMatter from 'markdown-it-front-matter';
import {TranslationSegment} from "./types";


export class MarkdownParser {
    private md: MarkdownIt;
    private segments: TranslationSegment[] = [];
    private frontmatterContent: string = '';

    constructor() {
        this.md = new MarkdownIt({
            html: true,
            breaks: true,
            linkify: true,
        });

        // 配置front-matter解析
        this.md.use(frontMatter, (fm: string) => {
            this.frontmatterContent = fm;
            this.segments.push({
                type: 'frontmatter',
                content: fm,
                needsTranslation: false,
            });
        });

        this.customizeRenderer();
    }

    private customizeRenderer(): void {
        const defaultRender = this.md.renderer.rules.text!;

        // 处理普通文本
        this.md.renderer.rules.text = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            this.segments.push({
                type: 'text',
                content: token.content,
                needsTranslation: true,
                tokenIndex: idx,
            });
            return defaultRender(tokens, idx, options, env, self);
        };

        // 处理代码块
        this.md.renderer.rules.fence = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            this.segments.push({
                type: 'code',
                content: token.content,
                needsTranslation: false,
                tokenIndex: idx,
            });
            return `\`\`\`${token.info}\n${token.content}\`\`\``;
        };

        // 处理内联代码
        this.md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            this.segments.push({
                type: 'code',
                content: token.content,
                needsTranslation: false,
                tokenIndex: idx,
            });
            return `\`${token.content}\``;
        };

        // 处理HTML标签
        this.md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            this.segments.push({
                type: 'html',
                content: token.content,
                needsTranslation: false,
                tokenIndex: idx,
            });
            return token.content;
        };
    }

    async parse(content: string): Promise<TranslationSegment[]> {
        this.segments = [];
        this.md.render(content);
        return this.segments;
    }

    async reconstruct(segments: TranslationSegment[]): Promise<string> {
        let result = '';

        // 重建front-matter
        const frontmatter = segments.find(s => s.type === 'frontmatter');
        if (frontmatter) {
            result += `---\n${frontmatter.content}\n---\n\n`;
        }

        // 按照token索引重建文档
        const contentSegments = segments.filter(s => s.type !== 'frontmatter')
            .sort((a, b) => (a.tokenIndex || 0) - (b.tokenIndex || 0));

        for (const segment of contentSegments) {
            switch (segment.type) {
                case 'text':
                    result += segment.content;
                    break;
                case 'code':
                    if (segment.content.includes('\n')) {
                        result += `\`\`\`\n${segment.content}\`\`\`\n`;
                    } else {
                        result += `\`${segment.content}\``;
                    }
                    break;
                case 'math':
                    result += segment.content.includes('\n')
                        ? `$$\n${segment.content}\n$$\n`
                        : `$${segment.content}$`;
                    break;
                case 'html':
                    result += segment.content;
                    break;
            }
        }

        return result;
    }
}