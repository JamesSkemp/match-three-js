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
    board.orbs = [ 
        [ 1, 6, 4, 6, 1, 5, 3, 2 ],
        [ 3, 6, 5, 4, 5, 0, 6, 5 ],
        [ 1, 2, 6, 6, 1, 4, 0, 0 ],
        [ 5, 4, 0, 1, 1, 0, 4, 4 ],
        [ 4, 4, 2, 2, 1, 4, 5, 6 ],
        [ 5, 1, 2, 6, 0, 2, 2, 3 ],
        [ 5, 2, 6, 0, 3, 5, 5, 2 ],
        [ 6, 1, 5, 5, 6, 4, 3, 6 ] 
    ];
    t.same(board.evaluate(), [[2, 4], 'down', 3]);
});

test.skip('should have at least one possible match set by default', t => {
    t.ok(board.hasMatch());
});
