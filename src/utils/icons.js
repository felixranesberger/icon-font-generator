import path from 'node:path';
import { getFileNames } from './files.js';

export async function getIcons(inputDirectory) {
    const fileNames = await getFileNames(inputDirectory);

    return fileNames
        .filter(fileName => fileName.endsWith('.svg'))
        .map(fileName => ({
            path: path.join(inputDirectory, fileName),
            name: fileName.replace('.svg', '')
        }));
}
