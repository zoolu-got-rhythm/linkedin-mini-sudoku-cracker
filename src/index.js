import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { executeAspClingoSudokuLogicProgram } from "./utils/executeAspClingoSudokuLogicProgram.js";
import { parseMiniSudokuClingoOutput } from "./utils/parseMiniSudokuClingoOutput.js";
import { writeMiniSudokuCluesAspFile } from "./utils/writeMiniSudokuCluesAspFile.js";
import { sleep } from "./utils/sleep.js";
import { parseWaitUntilCmdLineArg } from "./utils/parseWaitUntilCmdLineArg.js";
import { LinkedInLoginPageAutomation } from "./pagesAutomation/LinkedInLoginPageAutomation.js";
import { SudokuGamePageAutomation } from "./pagesAutomation/SudokuGamePageAutomation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const waitUntilTime = parseWaitUntilCmdLineArg(process.argv.slice(2));

const loginDetails = JSON.parse(
    readFileSync(path.resolve(__dirname, "../loginDetails.json"), "utf-8"),
);

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    const loginPage = new LinkedInLoginPageAutomation(page);
    await loginPage.open();
    await loginPage.acceptCookies();
    await loginPage.clickSignIn();
    await loginPage.login(loginDetails.email, loginDetails.password);

    const sudokuPage = new SudokuGamePageAutomation(page);
    await sudokuPage.navigate();

    try {
        // Read clues from the puzzle page and write to clues file
        const clues = await sudokuPage.readClues();
        writeMiniSudokuCluesAspFile(clues);

        // Solve the puzzle using answer set programming language (ASP) with Clingo
        const { stdout: solvedSudokuClingoOutput } =
            await executeAspClingoSudokuLogicProgram();
        const solvedSudoku2dArray = parseMiniSudokuClingoOutput(solvedSudokuClingoOutput);

        if (waitUntilTime) {
            await sudokuPage.waitUntilTime(waitUntilTime);
        }

        await sudokuPage.inputSolution(solvedSudoku2dArray, clues);

        await sleep(3000);
        await browser.close();
    } catch (error) {
        console.log("error", error);
    }
})();
