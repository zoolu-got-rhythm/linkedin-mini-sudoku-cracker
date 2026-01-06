// Selectors last tested: 2026-01-06
// If automation fails, LinkedIn may have changed their page structure
export class SudokuGamePageAutomation {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto("https://www.linkedin.com/games/mini-sudoku/", {
            waitUntil: "networkidle2",
        });
        console.log("Navigated to Mini Sudoku page");
    }

    async pressNumber(n) {
        const numberButtons = await this.page.$$(".sudoku-input-button");
        const button = numberButtons[n - 1];

        const btnBox = await button.boundingBox();
        await this.page.mouse.click(
            btnBox.x + btnBox.width / 2,
            btnBox.y + btnBox.height / 2,
        );
    }

    async readClues() {
        const cells = await this.page.$$(".sudoku-cell");
        const clues = Array.from({ length: 6 }, () => Array(6).fill(null));

        for (let i = 0; i < cells.length; i++) {
            const text = await cells[i].evaluate((el) => el.textContent.trim());
            const value = parseInt(text, 10);

            if (!isNaN(value) && value >= 1 && value <= 6) {
                const row = Math.floor(i / 6);
                const col = i % 6;
                clues[row][col] = value;
            }
        }

        console.log("Read clues from puzzle");
        return clues;
    }

    async getTimerSeconds() {
        const timerText = await this.page.$eval(".timer-text", (el) =>
            el.textContent.trim(),
        );
        const [minutes, seconds] = timerText.split(":").map(Number);
        return minutes * 60 + seconds;
    }

    async waitUntilTime(targetTime) {
        const [targetMinutes, targetSeconds] = targetTime.split(":").map(Number);
        const targetTotalSeconds = targetMinutes * 60 + targetSeconds;

        console.log(`Waiting until timer reaches ${targetTime}...`);

        while (true) {
            const currentSeconds = await this.getTimerSeconds();
            if (currentSeconds >= targetTotalSeconds) {
                console.log(`Timer reached ${targetTime}, proceeding with solution`);
                break;
            }
            await new Promise((r) => setTimeout(r, 500));
        }
    }

    async inputSolution(solution2dArray, clues) {
        const cells = await this.page.$$(".sudoku-cell");

        for (let row = 0; row < solution2dArray.length; row++) {
            for (let column = 0; column < solution2dArray[0].length; column++) {
                if (clues[row][column] !== null) {
                    continue;
                }

                const solutionNumberAtCurrentCell =
                    solution2dArray[row][column];

                const cellIndex = row * 6 + column;
                const cell = cells[cellIndex];
                const box = await cell.boundingBox();

                await this.page.mouse.click(
                    box.x + box.width / 2,
                    box.y + box.height / 2,
                );
                await this.pressNumber(solutionNumberAtCurrentCell);
            }
        }
        console.log("Solution input complete");
    }
}
