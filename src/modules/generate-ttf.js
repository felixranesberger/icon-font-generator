import svg2ttf from 'svg2ttf';

export async function generateTtf(svg) {
    const ttf = svg2ttf(svg, {});
    const buffer = Buffer.from(ttf.buffer);
    return { ext: 'ttf', data: buffer, type: 'binary' };
}
