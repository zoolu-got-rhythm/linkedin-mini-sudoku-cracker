// takes in clingo output as input and returns a 2d array of solved linkedin mini sudoku
export function parseClingo(clingoOutput) {
    const grid = Array.from({ length: 6 }, () => Array(6).fill(null));

    // Parses assign(Row, Col, Value) predicates from Clingo output.
    // These correspond to the ASP fact format in linkedinMiniSudokuCluesFacts.lp
    // e.g., assign(1,2,3) means row 1, column 2, value 3 (1-indexed)
    const regex = /assign\((\d+),(\d+),(\d+)\)/g;
    let match;

    while ((match = regex.exec(clingoOutput)) !== null) {
        const row = Number(match[1]) - 1; // convert from 1-indexed (ASP) to 0-indexed (JS)
        const col = Number(match[2]) - 1;
        const value = Number(match[3]);

        grid[row][col] = value;
    }

    return grid;
}
