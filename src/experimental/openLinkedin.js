import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { executeAspClingoSudokuLogicProgram } from "../utils/executeAspClingoSudokuLogicProgram.js";
import { parseClingo } from "../utils/parseClingo.js";
import { sleep } from "../utils/sleep.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loginDetails = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../loginDetails.json"), "utf-8")
);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com", {
    waitUntil: "networkidle2",
  });

  console.log("LinkedIn opened successfully");

  // Click accept on privacy/cookie consent
  const acceptButton = await page
    .waitForSelector('button[action-type="ACCEPT"]', {
      visible: true,
      timeout: 5000,
    })
    .catch(() => null);

  if (acceptButton) {
    await acceptButton.click();
    console.log("Accepted privacy terms");
  }

  // Click 'Sign in with email' button
  await page.waitForSelector("a, button", { visible: true, timeout: 5000 });

  const clicked = await page.evaluate(() => {
    const elements = [...document.querySelectorAll("a, button")];
    const signInBtn = elements.find((el) =>
      el.textContent.toLowerCase().includes("sign in")
    );
    if (signInBtn) {
      signInBtn.click();
      return true;
    }
    return false;
  });

  if (clicked) {
    console.log("Clicked 'Sign in' button");
  } else {
    console.log("Could not find 'Sign in' button");
  }

  // Wait for login form and enter credentials
  await page.waitForSelector("#username", { visible: true, timeout: 10000 });

  await page.type("#username", loginDetails.email);
  console.log("Entered email");

  await page.type("#password", loginDetails.password);
  console.log("Entered password");

  // Click sign in submit button and wait for navigation together
  // await Promise.all([
  // page.waitForNavigation({ waitUntil: "networkidle2" }),
  await page.click('button[type="submit"]');
  // ]);

  console.log("Clicked sign in submit button and login complete");

  // Wait for navigation to complete after login
  // await page.waitForNavigation({ waitUntil: "networkidle2" });

  // Sleep before navigating
  await sleep(5000);

  // Navigate to Mini Sudoku page
  await page.goto("https://www.linkedin.com/games/mini-sudoku/", {
    waitUntil: "networkidle2",
  });

  console.log("Navigated to Mini Sudoku page");

  // crack the sudoku
  try {
    const { stdout: solvedSudokuClingoOutput } =
      await executeAspClingoSudokuLogicProgram();
    const solvedSudoku2dArray = parseClingo(solvedSudokuClingoOutput);

    const cells = await page.$$(".sudoku-cell");

    async function pressNumber(n) {
      const numberButtons = await page.$$(".sudoku-input-button");
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

    await sleep(3000);
    await browser.close();
  } catch (error) {
    console.log("clingo asp error: ", error);
  }
})();
