class SudokuSolver {

  validate(puzzleString) {
    const regexPuzzle = /^[0-9.]+$/g;
    const validPuzzle = regexPuzzle.test(puzzleString);
    if (!validPuzzle) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }else if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }else{
      return { valid: true };
    }
  }

  checkRowPlacement(grid, row, column, value) {
    let isValidPuzzle = true;
    grid[row].forEach((cell, columnIndex) => {
      if (cell === value && columnIndex !== column) {
        isValidPuzzle = false;
      }
    });
    return isValidPuzzle;
  }

  checkColPlacement(grid, row, column, value) {
    let isValidPuzzle = true;
    grid.forEach((gridRow, rowIndex) => {
      if (gridRow[column] === value && rowIndex !== row) {
        isValidPuzzle = false;
      }
    });
    return isValidPuzzle;
  }

  checkRegionPlacement(grid, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionColumn = Math.floor(column / 3) * 3;
    let isValidPuzzle = true;
    Array.from({ length: 3 }).forEach((_, i) => {
      Array.from({ length: 3 }).forEach((_, j) => {
        if (grid[regionRow + i][regionColumn + j] === value) {
          isValidPuzzle = false;
        }
      });
    });
    return isValidPuzzle;
  }

  gridParsed(puzzleString) {
    const grid = [];    
    Array.from({ length: 9 }).forEach((_, i) => {
      const calc1 = i * 9;
      const calc2 = (i + 1) * 9;
      const row = puzzleString.slice(calc1, calc2)
        .split('')
        .map(char => {
          if(char === '.'){ 
            return 0; 
          }else{ 
            return parseInt(char, 10);
          }
        });
      grid.push(row);
    });
    return grid;
  }

  solve(puzzleString) {    
    let parsedStr = this.gridParsed(puzzleString);
    const isSolved = (grid, row, column, value) => {
      const rowValidPuzzle = this.checkRowPlacement(grid, row, column, value);
      const colValidPuzzle = this.checkColPlacement(grid, row, column, value);
      const regionValidPuzzle = this.checkRegionPlacement(grid, row, column, value);  
      return rowValidPuzzle && colValidPuzzle && regionValidPuzzle;
    };

    const sudokuSolving = (parsedStr) => {
      let rowIndex, columnIndex, number;
      for (rowIndex = 0; rowIndex < 9; rowIndex++) {
        for (columnIndex = 0; columnIndex < 9; columnIndex++) {
          if (parsedStr[rowIndex][columnIndex] === 0) {
            for (number = 1; number <= 9; number++) {
              if (isSolved(parsedStr, rowIndex, columnIndex, number)) {
                parsedStr[rowIndex][columnIndex] = number;
                if (!sudokuSolving(parsedStr)) {
                  parsedStr[rowIndex][columnIndex] = 0;
                }else{
                  return true;
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (sudokuSolving(parsedStr)) {
      const gridString = parsedStr.flat().join('');
      return {solution: gridString}
    } else {
      return {error: 'Puzzle cannot be solved'}
    } 
  }
};

module.exports = SudokuSolver;
