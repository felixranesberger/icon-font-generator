import fse from 'fs-extra';
import fs from 'fs';

export async function ensureDirectories(paths) {
    const values = Array.isArray(paths) ? paths : [paths];

    for (let value of values) {
        await fse.ensureDir(value);
    }
}

export async function writeFile(filePath, data, type) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, type || 'utf8', function(error) {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
}

export async function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', function(error, data) {
            if (error) {
                return reject(error);
            }

            return resolve(data);
        });
    });
}

export async function getFileNames(inputDirectory) {
    return new Promise((resolve, reject) => {
        fs.readdir(inputDirectory, function(error, files) {
            if (error) {
                return reject(error);
            }

            return resolve(files || []);
        });
    });
}
