export interface TranslationSegment {
    type: 'text' | 'code' | 'math' | 'frontmatter' | 'html';
    content: string;
    needsTranslation: boolean;
    tokenIndex: [number, number];
    length?: number;  // only for text segments
}

export interface FileInfo {
    path: string;
    content: string;
}