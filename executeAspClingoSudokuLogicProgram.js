import { spawn } from "child_process";

export async function executeAspClingoSudokuLogicProgram() {
  const inputPathLinkedinMiniSudokuSolver = "linkedinMiniSudokuSolver.lp";
  const inputPathLinkedinMiniSudokuCluesFacts = "linkedinMiniSudokuCluesFacts.lp";

  return new Promise((resolve, reject) => {
    const clingo = spawn("clingo", [
      inputPathLinkedinMiniSudokuSolver,
      inputPathLinkedinMiniSudokuCluesFacts,
    ]);

    let stdout = "";
    let stderr = "";

    clingo.stdout.on("data", (data) => {
      const s = data.toString();
      stdout += s;
    });

    clingo.stderr.on("data", (data) => {
      const s = data.toString();
      stderr += s;
    //   console.error("stderr" + s);
    });

    // clingo.on("error", (err) => reject(err)); // does this do anything? or is it needed?

    clingo.on("close", (code) => {
      console.log(`Clingo exited with ${code}`);
      const result = { code, stdout, stderr };
      if (code === 0 || code === 30) resolve(result);
      else reject(result);
    });
  });
}
