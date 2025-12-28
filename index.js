import puppeteer from "puppeteer";
import { executeAspClingoSudokuLogicProgram } from "./test.js";

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

// const filePath = path.join(__dirname, "linkedinMiniSudokuSolver.lp");

(async () => {
  try {
    const { stdout } = await executeAspClingoSudokuLogicProgram();
    console.log("stdout is: ", stdout);
    const solvedSudoku2dArray = parseClingo(stdout);



  } catch (error) {
    console.log("clingo asp error: ", error);
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/games/mini-sudoku/", {
    waitUntil: "networkidle2",
  });

  // await page.waitForSelector("#launch-footer-start-button");
  // console.log("pass");

  const gameFrame = page
    .frames()
    .find(
      (f) =>
        f.url() === "https://www.linkedin.com/games/view/mini-sudoku/desktop"
    );

  if (!gameFrame) {
    throw new Error("Mini Sudoku game frame not found");
  }

  console.log("Using frame:", gameFrame.url());

  // await page.$$("#launch-footer-start-button");

  const exists = await gameFrame.evaluate(() => {
    return !!document.querySelector("#launch-footer-start-button");
  });

  console.log("button exists:", exists);

  await gameFrame.waitForSelector("#launch-footer-start-button", {
    visible: true,
  });

  await gameFrame.click("#launch-footer-start-button");


  const cells = await gameFrame.$$(".sudoku-cell");


  const row = 0;
  const column = 4;

  // pick a cell
  const index = row * 6 + column - 1;
  console.log("index", index);

  async function pressNumber(n) {
    const numberButtons = await gameFrame.$$(".sudoku-input-button");

    console.log("numberButtons", numberButtons);

    const button = numberButtons[n - 1];

    // click it
    const btnBox = await button.boundingBox();
    await page.mouse.click(
      btnBox.x + btnBox.width / 2,
      btnBox.y + btnBox.height / 2
    );
  }

  for (let i = 0; i < cells.length; i++) {
    // await sleep(300);

    const cell = cells[i];

    console.log("cell found", cell);

    // click it
    const box = await cell.boundingBox();

    console.log("box", box);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    // await sleep(300);
    // type number
    await pressNumber(Math.ceil(Math.random() * 6));
  }
})();
