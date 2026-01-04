import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { executeAspClingoSudokuLogicProgram } from "./utils/executeAspClingoSudokuLogicProgram.js";
import { parseClingo } from "./utils/parseClingo.js";
import { writeCluesFile } from "./utils/writeCluesFile.js";
import { sleep } from "./utils/sleep.js";
import { LinkedInLoginPage } from "./pages/LinkedInLoginPage.js";
import { SudokuGamePage } from "./pages/SudokuGamePage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loginDetails = JSON.parse(
    readFileSync(path.resolve(__dirname, "../loginDetails.json"), "utf-8"),
);

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    const loginPage = new LinkedInLoginPage(page);
    await loginPage.open();
    await loginPage.acceptCookies();
    await loginPage.clickSignIn();
    await loginPage.login(loginDetails.email, loginDetails.password);

    const sudokuPage = new SudokuGamePage(page);
    await sudokuPage.navigate();

    try {
        // Read clues from the puzzle page and write to clues file
        const clues = await sudokuPage.readClues();
        writeCluesFile(clues);

        // Solve the puzzle using Clingo
        const { stdout: solvedSudokuClingoOutput } =
            await executeAspClingoSudokuLogicProgram();
        const solvedSudoku2dArray = parseClingo(solvedSudokuClingoOutput);

        await sudokuPage.inputSolution(solvedSudoku2dArray, clues);

        await sleep(3000);
        await browser.close();
    } catch (error) {
        console.log("error", error);
    }
})();
