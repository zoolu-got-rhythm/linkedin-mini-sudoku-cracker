// takes in clingo output as input and returns a 2d array of solved linkedin mini sudoku
export function parseClingo(clingoOutput) {
  // Create empty 6x6 grid
  const grid = Array.from({ length: 6 }, () => Array(6).fill(null));

  // Match assign(R,C,V)
  const regex = /assign\((\d+),(\d+),(\d+)\)/g;
  let match;

  while ((match = regex.exec(clingoOutput)) !== null) {
    const r = Number(match[1]) - 1;
    const c = Number(match[2]) - 1;
    const v = Number(match[3]);

    grid[r][c] = v;
  }

  return grid;
}
