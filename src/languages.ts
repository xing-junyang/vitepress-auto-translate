export function getLanguageFullName(lang: string): string {
    switch (lang) {
        case 'en':
            return 'English';
        case 'es':
            return 'Spanish';
        case 'fr':
            return 'French';
        case 'de':
            return 'German';
        case 'it':
            return 'Italian';
        case 'pt':
            return 'Portuguese';
        case 'nl':
            return 'Dutch';
        case 'pl':
            return 'Polish';
        case 'ru':
            return 'Russian';
        case 'ja':
            return 'Japanese';
        case 'ko':
            return 'Korean';
        case 'zh':
            return 'Simplified Chinese';
        case 'tzh':
            return 'Traditional Chinese';
        case 'ar':
            return 'Arabic';
        case 'tr':
            return 'Turkish';
        default:
            throw new Error(`Language ${lang} is not supported`);
    }
}