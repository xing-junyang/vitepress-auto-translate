export interface TranslationSegment {
    type: 'text' | 'code' | 'math' | 'frontmatter' | 'html';
    content: string;
    needsTranslation: boolean;
    tokenIndex?: number;
}

export interface TranslationResult {
    original: string;
    translated: string;
}