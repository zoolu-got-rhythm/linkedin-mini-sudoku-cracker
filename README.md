# linkedin mini sudoku cracker

uses answer set programming (ASP) language to solve linkedin's mini sudoku and then uses puppeteer to automate the process of inputing the solved solution into linkedin via the browser.

## installing

install clingo (to run answer set programming logic programs (ASP)), i installed it on mac via brew
install node module dependencies (puppeteer)
`npm i`

## running

input the mini sudoku's clues into src/linkedinMiniSudokuCluesFacts.lp, pre-existing example code is in the file already to show you the format it needs to be in.
then run:
`node src/index.js`
