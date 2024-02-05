import { readFileSync, symlinkSync, existsSync, mkdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { DiffResult } from "./types";

const destinationFolder = join(__dirname, "viewer", "public");

const toDestination = (file: string) => resolve(destinationFolder, file);

const makeDirectories = (file: string) => {
    const directory = dirname(file);
    existsSync(directory) || mkdirSync(directory, { recursive: true });
}

const symlinkPath = (file: string) => {
    const destination = toDestination(file);
    if (existsSync(destination)) return;
    makeDirectories(destination);
    const fullpath = resolve(__dirname, file);
    symlinkSync(fullpath, destination);
}

const symlinkAllDiffPaths = (file: string) =>
    (JSON.parse(readFileSync(file, 'utf-8')) as DiffResult[])
        .forEach(diff => {
            switch (diff.type) {
                case 'only':
                    return symlinkPath(diff.path1);
                case 'differ':
                    return [diff.path1, diff.path2!].forEach(symlinkPath);
            }
        });

const diffs = ["scratch-vm.json", "scratch-gui.json"].map(file => join("diffs", file));
diffs.forEach(symlinkPath);
diffs.forEach(symlinkAllDiffPaths);