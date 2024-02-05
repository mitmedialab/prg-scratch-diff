import * as readline from 'readline';
import type { DiffResult } from './types';

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const diffs: DiffResult[] = [];

// Read each line from stdin
reader.on('line', (line: string) => {
    if (line.startsWith('Only in')) {
        // Parse lines that indicate a file exists only in one directory
        const matches = line.match(/^Only in (.+): (.+)$/);
        if (matches) diffs.push({
            type: 'only',
            path1: `${matches[1]}/${matches[2]}`
        });

    } else if (line.startsWith('Files')) {
        // Parse lines that indicate files differ between directories
        const matches = line.match(/^Files (.+) and (.+) differ$/);
        if (matches) {
            diffs.push({
                type: 'differ',
                path1: matches[1],
                path2: matches[2]
            });
        }
    }
});

reader.on('close', () => console.log(JSON.stringify(diffs, null, 2)));