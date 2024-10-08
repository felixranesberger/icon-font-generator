import ttf2woff2 from 'ttf2woff2';

export async function generateWoff2(ttf) {
    const woff2 = ttf2woff2(new Uint8Array(ttf), {});
    const buffer = Buffer.from(woff2.buffer);
    return { ext: 'woff2', data: buffer, type: 'binary' };
}
