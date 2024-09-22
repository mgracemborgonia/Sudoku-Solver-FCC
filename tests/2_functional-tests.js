const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const urlSolve = '/api/solve';
const urlCheck = '/api/check';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST request to /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const puzzleSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
      chai.request(server)
        .post(urlSolve)
        .send({
          "puzzle": puzzleString,
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200, 
            res.body.solution, puzzleSolution
          );
        done();
      });
    });
    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server)
        .post(urlSolve)
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, "Required field missing"
          );
        done();
      });
    });
    test('Solve a puzzle with invalid characters', (done) => {
      const puzzleString = '1-5..2.84..63+12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8a.1..16....926914.37.';
      chai.request(server)
        .post(urlSolve)
        .send({
          "puzzle": puzzleString,
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, 'Invalid characters in puzzle'
          );
        done();
      });
    });
    test('Solve a puzzle with incorrect length', (done) => {
      const puzzleString1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914';
      const puzzleString2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.12';
      chai.request(server)
        .post(urlSolve)
        .send({
          "puzzle": [puzzleString1, puzzleString2]
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, 'Expected puzzle to be 81 characters long'
          );
        done();
      });
    });
    test('Solve a puzzle that cannot be solved', (done) => {
      const puzzleString = '145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.372';
      chai.request(server)
        .post(urlSolve)
        .send({
          "puzzle": puzzleString,
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, 'Puzzle cannot be solved'
          );
        done();
      });
    });
  });
  
  suite('POST request to /api/check', () => {
    test('Check a puzzle placement with all fields', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const coordinate = 'A1';
      const value = 9;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.valid, true
          );
        done();
      });
    });
    test('Check a puzzle placement with single placement conflict', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const coordinate = 'A2';
      const value = 8;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.conflict.length, 1
          );
        done();
      });
    });
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const coordinate = 'A3';
      const value = 7;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.conflict.length, 2
          );
        done();
      });
    });
    test('Check a puzzle placement with all placement conflicts', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const coordinate = 'A4';
      const value = 6;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.conflict.length, 3
          );
        done();
      });
    });
    test('Check a puzzle placement with missing required fields', (done) => {
      const coordinate = 'A1';
      const value = 1;
      chai.request(server)
        .post(urlCheck)
        .send({
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, "Required field(s) missing"
          );
        done();
      });
    });  
    test('Check a puzzle placement with invalid characters', (done) => {
      const puzzleString = '1-5..2.84..63+12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8a.1..16....926914.37.';
      const coordinate = 'A2';
      const value = 2;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, "Invalid characters in puzzle"
          );
        done();
      });
    });
    test('Check a puzzle placement with incorrect length', (done) => {
      const puzzleString1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914';
      const puzzleString2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.12';
      const coordinate = 'A3';
      const value = 3;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": [puzzleString1, puzzleString2],
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, "Expected puzzle to be 81 characters long"
          );
        done();
      });
    }); 
    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const coordinate = 'A10';
      const value = 4;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, "Invalid coordinate"
          );
        done();
      });
    });
    test('Check a puzzle placement with invalid placement value', (done) => {
      const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const coordinate = 'A1';
      const value = 10;
      chai.request(server)
        .post(urlCheck)
        .send({
          "puzzle": puzzleString,
          "coordinate": coordinate,
          "value": value
        })
        .end((err, res) => {
          assert.deepEqual(
            res.status, 200,
            res.body.error, "Invalid value"
          );
        done();
      });
    });
  });
});
