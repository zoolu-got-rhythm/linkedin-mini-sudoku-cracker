export class SudokuGamePage {
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

    async inputSolution(solution2dArray) {
        const cells = await this.page.$$(".sudoku-cell");

        for (let row = 0; row < solution2dArray.length; row++) {
            for (let column = 0; column < solution2dArray[0].length; column++) {
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
    }
}
