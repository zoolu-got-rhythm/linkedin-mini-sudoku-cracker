# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project solves LinkedIn's Mini Sudoku puzzle using Answer Set Programming (ASP) via Clingo, then automates entering the solution into LinkedIn using Puppeteer browser automation.

## Prerequisites

- **Clingo**: Must be installed on the system (e.g., `brew install clingo` on macOS)
- **Node.js**: Uses ES modules (`"type": "module"` in package.json)

## Commands

```bash
# Install dependencies
npm i

# Run the solver and automation
node src/index.js
```

## Architecture

The project has two main components:

### 1. ASP Solver (Clingo)
- `src/linkedinMiniSudokuSolver.lp` - The constraint logic program defining 6x6 mini sudoku rules:
  - Each cell gets exactly one value 1-6
  - No duplicate values in rows or columns
  - No duplicate values in 2x3 boxes
- `src/linkedinMiniSudokuCluesFacts.lp` - User-editable file where puzzle clues are entered as `assign(Row,Col,Value).` facts (1-indexed)

### 2. Browser Automation (Puppeteer)
- `src/index.js` - Main entry point that:
  1. Executes Clingo with the solver and clues files
  2. Parses the solution into a 2D array
  3. Launches browser, navigates to LinkedIn Mini Sudoku
  4. Clicks each cell and inputs the solution

### Utilities
- `src/utils/executeAspClingoSudokuLogicProgram.js` - Spawns Clingo process and returns stdout (exit code 30 = satisfiable solution found)
- `src/utils/parseClingo.js` - Parses `assign(R,C,V)` predicates from Clingo output into a 6x6 grid array

## Workflow

1. Copy clues from LinkedIn's puzzle into `src/linkedinMiniSudokuCluesFacts.lp` using format: `assign(row,col,value).`
2. Run `node src/index.js`
3. Browser opens, solves the puzzle automatically
