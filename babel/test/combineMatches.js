import test from 'ava';
import * as _ from 'lodash';
import {combineMatches} from '../src/board';
import {boards} from './data/boards';

_.each(boards, (metadata, board) => {
    test(`combines ${board}`, t => {
        t.true(_.isEqual(combineMatches(metadata['foundMatches']), metadata['combinedMatches']));
    });
});