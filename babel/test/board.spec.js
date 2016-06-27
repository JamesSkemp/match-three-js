'use strict';
import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import * as orbs from '../src/orbs';
import * as triples from '../src/triples';
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

test('should have at least one possible match set and should not have a match event by default', t => {
    _.each(_.range(100), i => {
        board = new Board();
        t.ok(board.hasPotentialMatch() && !board.hasMatch());
    });
});

test('attic orbs should have at least one possible match set and should not have a match event by default', t => {
    _.each(_.range(100), i => {
        board = new Board();
        t.ok(orbs.hasPotentialMatch(board.atticOrbs) && !Boolean(triples.find(board.atticOrbs)[0]));
    });
});

test('attic orbs can be set manually', t => {
    let testAttic = [
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7]
    ];
    let atticBoard = new Board(8, 8, _.range(8), testAttic);
    t.is(atticBoard.atticOrbs, testAttic);
});
