import { ensureDirectories, writeFile } from './utils/files.js';
import { generateWoff2 } from './modules/generate-woff2.js';
import { generateSvg } from './modules/generate-svg.js';
import { generateTtf } from './modules/generate-ttf.js';
import { validate } from './utils/validate.js';
import { getIcons } from './utils/icons.js';
import path from 'node:path';


export async function iconFontGenerator(options) {
    // 1. Validate the options.
    const {name, input, output, types} = validate(options);

    // 2. Get all the icons in the input directory.
    const icons = await getIcons(input);

    // 3. Generate the fonts.
    const fontName = name || 'default';
    const svg = await generateSvg(fontName, icons);
    const ttf = await generateTtf(svg.data);
    const woff2 = await generateWoff2(ttf.data);
    const values = {svg, ttf, woff2};

    // 4. Write the files.
    await ensureDirectories(output);
    const outputValues = types.map(type => values[type]);
    const paths = [];
    for (const item of outputValues) {
        const filePath = path.join(output, `${fontName}.${item.ext}`);
        paths.push(filePath);
        await writeFile(filePath, item.data, item.type);
    }

    return paths;
}
