#!/usr/bin/env node
import { Command } from 'commander';
import { FileHandler } from './fileHandler';
import { Translator } from './translator';
import dotenv from 'dotenv';
import {FileInfo} from "./types";
import {getLanguageFullName} from "./languages";

dotenv.config();

const program = new Command();

program
    .name('vitepress-auto-translate')
    .description('CLI to translate VitePress documentation')
    .version('1.0.0')
    .option('-s, --source <paths>', 'Source directory path', 'docs')
    .option('-l, --languages <languages...>', 'Target languages', ['es', 'fr'])
    .option('-e, --exclude <patterns...>', 'Patterns to exclude', [])
    .option('-m, --llm <llm>', 'Language model to use', 'siliconflow')
    .action(async (options) => {
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error('API_KEY is required in .env file');
            }

            const fileHandler = new FileHandler(options.source);
            const translator = new Translator(apiKey, options.llm);

            const files: FileInfo[] = await fileHandler.getMarkdownFiles(options.exclude);

            for (const file of files) {
                for (const lang of options.languages) {
                    const langFullName = getLanguageFullName(lang);
                    console.log(`Translating ${file.path} to ${langFullName}...`);
                    const translatedContent = await translator.translate(file.content, langFullName);
                    await fileHandler.writeTranslatedFile(file.path, translatedContent, lang);
                }
            }

            console.log('Translation completed successfully!');
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });

program.parse(process.argv);