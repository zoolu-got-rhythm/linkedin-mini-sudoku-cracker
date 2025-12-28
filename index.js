import puppeteer from "puppeteer";
import { executeAspClingoSudokuLogicProgram } from "./executeAspClingoSudokuLogicProgram.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseClingo(output) {
  // Create empty 6x6 grid
  const grid = Array.from({ length: 6 }, () => Array(6).fill(null));

  // Match assign(R,C,V)
  const regex = /assign\((\d+),(\d+),(\d+)\)/g;
  let match;

  while ((match = regex.exec(output)) !== null) {
    const r = Number(match[1]) - 1;
    const c = Number(match[2]) - 1;
    const v = Number(match[3]);

    grid[r][c] = v;
  }

  return grid;
}

// run program
(async () => {
  try {
    const { stdout } = await executeAspClingoSudokuLogicProgram();
    const solvedSudoku2dArray = parseClingo(stdout);

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://www.linkedin.com/games/mini-sudoku/", {
      waitUntil: "networkidle2",
    });

    const gameFrame = page
      .frames()
      .find(
        (f) =>
          f.url() === "https://www.linkedin.com/games/view/mini-sudoku/desktop"
      );

    if (!gameFrame) {
      throw new Error("Mini Sudoku game frame not found");
    }

    await gameFrame.waitForSelector("#launch-footer-start-button", {
      visible: true,
    });

    await gameFrame.click("#launch-footer-start-button");

    const cells = await gameFrame.$$(".sudoku-cell");

    async function pressNumber(n) {
      const numberButtons = await gameFrame.$$(".sudoku-input-button");
      const button = numberButtons[n - 1];

      const btnBox = await button.boundingBox();
      await page.mouse.click(
        btnBox.x + btnBox.width / 2,
        btnBox.y + btnBox.height / 2
      );
    }

    for (let row = 0; row < solvedSudoku2dArray.length; row++) {
      for (let column = 0; column < solvedSudoku2dArray[0].length; column++) {
        const solutionNumberAtCurrentCell = solvedSudoku2dArray[row][column];

        let linkedInMiniSudokuCellIndex = row * 6 + column;

        const sudokuMiniLinkedinCell = cells[linkedInMiniSudokuCellIndex];
        const box = await sudokuMiniLinkedinCell.boundingBox();

        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

        await pressNumber(solutionNumberAtCurrentCell);
      }
    }

  } catch (error) {
    console.log("clingo asp error: ", error);
  }
})();
