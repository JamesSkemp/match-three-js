import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import {combineMatches} from '../src/board';
import {findMatches} from '../src/board';
import {orbs} from './data/orbs';
import {names} from './data/names';
let board;
let unMatchedOrbs;

test.before(() => {
    board = new Board(5, 5);
    unMatchedOrbs = [];
    
    _.each(_.range(orbs.length), i => {
        board.orbs = orbs[i];
        while (board.hasMatchEvent()) {
            board._unMatch();
        }
        unMatchedOrbs.push(board.orbs);
    });
    
    console.log(unMatchedOrbs);
});

_.each(_.range(orbs.length), j => {
    test(`unmatches ${names[j]}`, t => {
        t.true(_.isEmpty(findMatches(unMatchedOrbs[j])));
    });
});