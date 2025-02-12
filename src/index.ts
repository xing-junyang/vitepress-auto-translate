#!/usr/bin/env node
import { Command } from 'commander';
import { FileHandler } from './fileHandler';
import { Translator } from './translator';
// @ts-ignore
import dotenv from 'dotenv';
import {FileInfo} from "./types";

dotenv.config();

const program = new Command();

program
    .name('vitepress-auto-translate')
    .description('CLI to translate VitePress documentation')
    .version('1.0.0')
    .option('-s, --source <path>', 'Source directory path', 'docs')
    .option('-l, --languages <languages...>', 'Target languages', ['es', 'fr'])
    .option('-e, --exclude <patterns...>', 'Patterns to exclude', [])
    .option('-t, --llm <llm>', 'Language model to use', 'siliconflow')
    .action(async (options) => {
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error('API_KEY is required in .env file');
            }

            const fileHandler = new FileHandler(options.source);
            const translator = new Translator(options.llm, apiKey);

            const files: FileInfo[] = await fileHandler.getMarkdownFiles(options.exclude);

            for (const file of files) {
                for (const lang of options.languages) {
                    console.log(`Translating ${file.path} to ${lang}...`);
                    const translatedContent = await translator.translate(file.content, lang);
                    await fileHandler.writeTranslatedFile(file.path, translatedContent, lang);
                }
            }

            console.log('Translation completed successfully!');
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    });