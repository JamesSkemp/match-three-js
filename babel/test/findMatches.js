import test from 'ava';
import * as _ from 'lodash';
import {findMatches} from '../src/board';
import {boards} from './data/boards';

_.each(boards, (metadata, board) => {
    test(`matches ${board}`, t => {
        t.true(_.isEqual(findMatches(metadata['orbs']), metadata['foundMatches']));
    });
});
