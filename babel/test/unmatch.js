import test from 'ava';
import * as _ from 'lodash';
import {names} from './data/names';
import {orbs} from './data/orbs';
import {Board} from '../src/board';
let board = new Board(5, 5);
test.skip.before(() => {
    let board = new Board(5, 5);
    let unmatchedOrbs = [];
    
    _.each(_.range(orbs.length), i => {
        board.orbs = orbs[i];
        board.unmatch();
        unmatchedOrbs.push(board.orbs);
    });
});

_.each(_.range(orbs.length), j => {
    test(`unmatches ${names[j]}`, t => {
        board.orbs = orbs[j];
        board.unmatch();
        t.false(board.hasMatch());
    });
});

test('unmatches a 3x3 nine-match', t => {
    board.orbs = [
        [1, 2, 3, 4, 5],
        [2, 0, 0, 0, 1],
        [3, 0, 0, 0, 2],
        [4, 0, 0, 0, 3],
        [5, 1, 2, 3, 4]
    ];
    board.unmatch();
    t.false(board.hasMatch());
})
