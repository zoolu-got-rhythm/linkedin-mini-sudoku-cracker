import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLUES_FILE_PATH = path.resolve(
    __dirname,
    "../asp/linkedinMiniSudokuCluesFacts.lp",
);

export function writeCluesFile(clues2dArray) {
    const lines = [];

    for (let row = 0; row < clues2dArray.length; row++) {
        const rowClues = [];
        for (let col = 0; col < clues2dArray[row].length; col++) {
            const value = clues2dArray[row][col];
            if (value !== null) {
                // Convert to 1-indexed for ASP
                rowClues.push(`assign(${row + 1},${col + 1},${value}).`);
            }
        }
        if (rowClues.length > 0) {
            lines.push(`% Row ${row + 1}`);
            lines.push(...rowClues);
            lines.push("");
        }
    }

    writeFileSync(CLUES_FILE_PATH, lines.join("\n"));
    console.log(`Wrote clues to ${CLUES_FILE_PATH}`);
}
