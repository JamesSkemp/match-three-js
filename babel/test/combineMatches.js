import test from 'ava';
import * as _ from 'lodash';
import {names} from './data/names';
import {combineMatches} from '../src/board';
import {findMatches} from '../src/board';
import {combinedMatches} from './data/combineMatches';
import {intersectionOrbs} from './data/combineMatches';
import {originalFoundMatches} from './data/combineMatches';
import {foundMatches} from './data/foundMatches';
let testData;

_.each(_.range(foundMatches.length), i => {
    test(`combines ${names[i]}`, t => {
        t.ok(_.isEqual(combineMatches(foundMatches[i]), combinedMatches[i]));
    });
});

test('returns original three matches for a combined match if includeRawData is true', t => {
    _.each(_.range(intersectionOrbs.length), j => {
        testData = combineMatches(findMatches(intersectionOrbs[j]), true)[1];
        t.true(_.isEqual(testData, originalFoundMatches[j])); 
    });
})
