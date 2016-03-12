'use strict';
import test from 'ava';
import * as _ from 'lodash';
import Board from '../babel/board';
let board;

test.before(() => {
    board = new Board();
});

test('creates a new 8x8 board', t => {
    // 8x8 default
    t.is(board.width, 8);
    t.is(board.height, 8);
    t.same(board.size, [8, 8]);
});

test('creates seven different types of orbs', t => {
    t.same(board.availableTypes, _.range(7));
});

test('finds all matches', t => {
    let testBoard = [
    [1, 2, 3, 4, 5, 6, 7, 1],
    [2, 2, 2, 5, 6, 7, 1, 2],
    [3, 4, 5, 6, 1, 1, 2, 3],
    [4, 5, 6, 7, 1, 2, 3, 3],
    [5, 6, 7, 1, 1, 3, 4, 3],
    [6, 7, 1, 2, 1, 4, 5, 3],
    [7, 1, 2, 3, 4, 5, 6, 3],
    [1, 4, 2, 2, 2, 2, 2, 6],
    ];
    
    t.same(board.evaluate(testBoard), [[[1, 0], 'right', 3], [[7, 2], 'right', 5], [[2, 4], 'down', 4], [[2, 7], 'down', 5]]);
});

test.skip('should have at least one possible match set by default', t => {
    t.ok(board.hasMatch());
});
