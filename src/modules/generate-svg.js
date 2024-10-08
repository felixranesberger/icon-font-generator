import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';
import * as optimize from '../utils/optimize.js';
import stream from 'stream';

export async function generateSvg(fontName, icons) {
    // Optimize all the icons.
    const optimized = await optimize.execute(icons);

    // Create a font stream object.
    const fontStream = getStream(fontName);

    // Create the svg in memory.
    const svg = await getSvgString(fontStream, optimized);

    // Return the svg.
    return { ext: 'svg', data: svg, type: 'utf8' };
}

async function getSvgString(fontStream, icons) {
    return new Promise((resolve, reject) => {
        let result = Buffer.from([]);
        fontStream
            .on('data', (data) => (result = Buffer.concat([result, Buffer.from(data)])))
            .on('error', (error) => reject(error))
            .on('end', () => resolve(result.toString()));

        writeGlyphs(fontStream, icons);

        fontStream.end();
    });
}

async function writeGlyphs(fontStream, icons) {
    let codepointStart = '\uE000'.charCodeAt(0);
    let codepointOffset = 0;

    for (let icon of icons) {
        const codepoint = String.fromCharCode(codepointStart + codepointOffset++);
        const ligature = icon.name
            .split('')
            .reduce((previous, current, index) => previous + String.fromCharCode(icon.name.charCodeAt(index)), '');

        const glyph = streamFromString(icon.data);
        glyph.metadata = { unicode: [codepoint, ligature], name: icon.name };
        fontStream.write(glyph);
    }
}

function getStream(fontName) {
    return new SVGIcons2SVGFontStream({
        fontName,
        fontWeight: 'normal',
        normalize: true,
        fixedWidth: true,
        centerHorizontally: true,
        fontHeight: 1000,
        log: (_) => _,
    });
}

function streamFromString(raw) {
    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(Buffer.from(raw));
    readable.push(null);
    return readable;
}
