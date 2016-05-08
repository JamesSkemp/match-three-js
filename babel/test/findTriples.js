import test from 'ava';
import * as _ from 'lodash';
import {findTriples} from '../src/board';
import {boards} from './data/boards';

_.each(boards, (metadata, board) => {
    test(`matches ${board}`, t => {
        t.true(_.isEqual(findTriples(metadata.orbs), metadata.triples));
    });
});
