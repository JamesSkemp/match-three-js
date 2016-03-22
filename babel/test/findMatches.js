import test from 'ava';
import * as _ from 'lodash';
import {findMatches} from '../src/board';
import {Board} from '../src/board';
let board, exampleMatches, correctMatches, answer;

test.before(() => {
    board = new Board(5, 5);
    exampleMatches = [[
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 3 ],
        [ 3, 6, 6, 6, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 6 ],
        [ 3, 4, 5, 1, 6 ],
        [ 2, 3, 4, 5, 6 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 3 ],
        [ 3, 4, 5, 1, 2 ],
        [ 2, 6, 6, 6, 6 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 6, 4 ],
        [ 4, 5, 1, 6, 3 ],
        [ 3, 4, 5, 6, 2 ],
        [ 2, 3, 4, 6, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 6 ],
        [ 3, 4, 5, 1, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ], [
        [ 1, 2, 6, 4, 5 ],
        [ 5, 1, 6, 3, 4 ],
        [ 4, 5, 6, 2, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 6, 3, 4 ],
        [ 4, 6, 6, 6, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 6, 1, 2, 3 ],
        [ 3, 6, 5, 1, 2 ],
        [ 2, 6, 6, 6, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 6, 6, 6, 6 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 6 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ]];
    correctMatches = [
       [
           [[3, 1], [3, 2], [3, 3]]
       ],
       [
           [[2, 4], [3, 4], [4, 4]]
       ],
       [
           [[4, 1], [4, 2], [4, 3]],
           [[4, 2], [4, 3], [4, 4]]
       ],
       [
           [[1, 3], [2, 3], [3, 3]],
           [[2, 3], [3, 3], [4, 3]]
       ],
       [
           [[2, 0], [2, 1], [2, 2]],
           [[2, 1], [2, 2], [2, 3]],
           [[2, 2], [2, 3], [2, 4]]
       ],
       [
           [[0, 2], [1, 2], [2, 2]],
           [[1, 2], [2, 2], [3, 2]],
           [[2, 2], [3, 2], [4, 2]]
       ],
       [
           [[2, 1], [2, 2], [2, 3]],
           [[1, 2], [2, 2], [3, 2]]
       ],
       [
           [[4, 1], [4, 2], [4, 3]],
           [[2, 1], [3, 1], [4, 1]]
       ],
       [
           [[2, 0], [2, 1], [2, 2]],
           [[2, 1], [2, 2], [2, 3]],
           [[2, 2], [3, 2], [4, 2]]
       ],
       [
           [[2, 1], [2, 2], [2, 3]],
           [[2, 2], [2, 3], [2, 4]],
           [[2, 2], [3, 2], [4, 2]]
       ],
       [
           [[2, 0], [2, 1], [2, 2]],
           [[2, 1], [2, 2], [2, 3]],
           [[2, 2], [2, 3], [2, 4]],
           [[2, 2], [3, 2], [4, 2]]
       ]
   ];
});

test('gathers all matches of three, including overlaps', t => {
   _.each(_.range(exampleMatches.length), i => {
       board.orbs = exampleMatches[i];
       t.true(_.isEqual(findMatches(board.orbs), correctMatches[i]));
   });
});