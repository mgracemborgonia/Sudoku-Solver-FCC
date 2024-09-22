'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      const parsedValue = Number(value);
      const regex1 = /^[1-9]$/g;
      const validNum= regex1.test(parsedValue);
      if (!validNum) {
        return res.json({ error: 'Invalid value' });
      }
      const regex = /^[A-Ia-i][1-9]$/g;
      const validCoord= regex.test(coordinate);
      if (!validCoord) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const validateCheck = solver.validate(puzzle);
      if (validateCheck.error) {
        return res.json(validateCheck);
      }

      const rowCharCoord = coordinate.charAt(0).toUpperCase();
      const row = rowCharCoord.charCodeAt(0) - 'A'.charCodeAt(0);
      const column = parseInt(coordinate[1]) - 1;
      const grid = solver.gridParsed(puzzle);
      const resObj = { valid: true, conflict: [] };
      
      if (grid[row][column] === parsedValue) {
        return res.json(resObj);
      }

      const checkRow = solver.checkRowPlacement(grid, row, column, parsedValue);
      const checkColumn = solver.checkColPlacement(grid, row, column, parsedValue);
      const checkRegion = solver.checkRegionPlacement(grid, row, column, parsedValue);

      if(!checkRow || !checkColumn || !checkRegion){
        resObj.conflict.push("row");
        resObj.conflict.push("column");
        resObj.conflict.push("region");
      }

      if (resObj.conflict.length > 0) {
        resObj.valid = false;
      }
      return res.json(resObj);
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validateCheck = solver.validate(puzzle);
      if (validateCheck.error) {
        return res.json(validateCheck);
      }

      const solveCheck = solver.solve(puzzle);
      if(solveCheck){
        return res.json(solveCheck);
      }
    });
};
