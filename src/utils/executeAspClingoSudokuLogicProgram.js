import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function executeAspClingoSudokuLogicProgram() {
    const solverPath = path.resolve(
        __dirname,
        "../asp/linkedinMiniSudokuSolver.lp",
    );

    const cluesPath = path.resolve(
        __dirname,
        "../asp/linkedinMiniSudokuCluesFacts.lp",
    );

    return new Promise((resolve, reject) => {
        const clingo = spawn("clingo", [solverPath, cluesPath]);

        let stdout = "";
        let stderr = "";

        clingo.stdout.on("data", (data) => {
            const s = data.toString();
            stdout += s;
        });

        clingo.stderr.on("data", (data) => {
            const s = data.toString();
            stderr += s;
        });

        clingo.on("close", (code) => {
            console.log(`Clingo exited with ${code}`);
            const result = { code, stdout, stderr };
            if (code === 0 || code === 30) resolve(result);
            else reject(result);
        });
    });
}
