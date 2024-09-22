const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    suite("Puzzle string and characters", () => {
        test("Logic handles a valid puzzle string of 81 characters", () => {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            assert.deepEqual(
                solver.validate(puzzleString),
                {valid: true}
            );
        });
        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {        
            const puzzleString = '1-5..2.84..63+12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8a.1..16....926914.37.';
            assert.deepEqual(
                solver.validate(puzzleString),
                {valid: false, error: 'Invalid characters in puzzle'}
            );
        });
        test("Logic handles a puzzle string that is not 81 characters in length", () => {        
            const puzzleString1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914';
            const puzzleString2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.12';  
            if(puzzleString1.length <= 81 && puzzleString2.length >= 81){
                assert.deepEqual(
                    solver.validate(puzzleString1),
                    {valid: false, error: 'Expected puzzle to be 81 characters long'}
                );
                assert.deepEqual(
                    solver.validate(puzzleString2),
                    {valid: false, error: 'Expected puzzle to be 81 characters long'}
                );
            }
        });
    });
    suite("Row/Column/Region Placements", () => {
        test("Logic handles a valid row placement", () => {      
            let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let grid = solver.gridParsed(puzzleString);
            const rowPlacement = 0;
            const columnPlacement = 1;
            const valuePlacement = 6;
            const rowCheckTrue = solver.checkRowPlacement(grid, rowPlacement, columnPlacement, valuePlacement);
            assert.equal(rowCheckTrue, true);
        });
        test("Logic handles an invalid row placement", () => {        
            let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let grid = solver.gridParsed(puzzleString);
            const rowPlacement = 0;
            const columnPlacement = 1;
            const valuePlacement = 1;
            const rowCheckFalse = solver.checkRowPlacement(grid, rowPlacement, columnPlacement, valuePlacement);
            assert.equal(rowCheckFalse, false);
        });
        test("Logic handles a valid column placement", () => {       
            let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let grid = solver.gridParsed(puzzleString);
            const rowPlacement = 0;
            const columnPlacement = 1;
            const valuePlacement = 3;
            const columnCheckTrue = solver.checkColPlacement(grid, rowPlacement, columnPlacement, valuePlacement);
            assert.equal(columnCheckTrue, true);
        });
        test("Logic handles an invalid column placement", () => {
            let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let grid = solver.gridParsed(puzzleString);
            const rowPlacement = 0;
            const columnPlacement = 1;
            const valuePlacement = 9;
            const columnCheckFalse = solver.checkColPlacement(grid, rowPlacement, columnPlacement, valuePlacement);
            assert.equal(columnCheckFalse, false);
        });
        test("Logic handles a valid region (3x3 grid) placement", () => {
            let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let grid = solver.gridParsed(puzzleString);
            const rowPlacement = 0;
            const columnPlacement = 1;
            const valuePlacement = 7;
            const regionCheckTrue = solver.checkRegionPlacement(grid, rowPlacement, columnPlacement, valuePlacement);
            assert.equal(regionCheckTrue, true);
        });
        test("Logic handles an invalid region (3x3 grid) placement", () => {        
            let puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            let grid = solver.gridParsed(puzzleString);
            const rowPlacement = 0;
            const columnPlacement = 1;
            const valuePlacement = 5;
            const regionCheckFalse = solver.checkRegionPlacement(grid, rowPlacement, columnPlacement, valuePlacement);
            assert.equal(regionCheckFalse, false);
        });
    });
    suite("Puzzle Solotion", () => {
        test("Valid puzzle strings pass the solver", () => {
            const puzzleString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            assert.deepEqual(
                solver.solve(puzzleString),
                {solution: puzzleString}
            );
        });
        test("Invalid puzzle strings fail the solver", () => {
            const puzzleString = '145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.372';
            assert.deepEqual(
                solver.solve(puzzleString),
                {error: 'Puzzle cannot be solved'}
            );        
        });
        test("Solver returns the expected solution for an incomplete puzzle", () => {
            const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const puzzleSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            if (puzzleString && puzzleSolution) {
                assert.deepEqual(
                    solver.solve(puzzleString),
                    {solution: puzzleSolution}
                );
            }
        });
    });          
});
