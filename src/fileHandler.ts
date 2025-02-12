import fs from 'fs-extra';
// @ts-ignore
import path from 'path';
import {FileInfo} from "./types";

export class FileHandler {
    constructor(private basePath: string) {}

    async getMarkdownFiles(exclude: string[] = []): Promise<FileInfo[]> {
        const files: FileInfo[] = [];

        async function walk(dir: string) {
            const items = await fs.readdir(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    if (!exclude.includes(item)) {
                        await walk(fullPath);
                    }
                } else if (item.endsWith('.md')) {
                    const content = await fs.readFile(fullPath, 'utf-8');
                    files.push({
                        path: fullPath,
                        content
                    });
                }
            }
        }

        await walk(this.basePath);
        return files;
    }

    async writeTranslatedFile(originalPath: string, content: string, lang: string): Promise<void> {
        const dir = path.dirname(originalPath);
        const filename = path.basename(originalPath);
        const langDir = path.join(dir, lang);

        await fs.ensureDir(langDir);
        await fs.writeFile(path.join(langDir, filename), content);
    }
}