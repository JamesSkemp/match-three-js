import test from 'ava';
import * as _ from 'lodash';
import {combineMatches} from '../src/board';
let match;
let combined;

test('combines a simple row match', t => {
    match = [
        [[3, 1], [3, 2], [3, 3]]
    ];

    combined = [
        [[3, 1], [3, 2], [3, 3]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a simple column match', t => {
    match = [
        [[2, 4], [3, 4], [4, 4]]
    ];

    combined = [
        [[2, 4], [3, 4], [4, 4]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a simple row four-match', t => {
    match = [
        [[4, 1], [4, 2], [4, 3]],
        [[4, 2], [4, 3], [4, 4]]
    ];
    
    combined = [
        [[4, 1], [4, 2], [4, 3], [4, 4]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a simple column four-match', t => {
    match = [
        [[1, 3], [2, 3], [3, 3]],
        [[2, 3], [3, 3], [4, 3]]
    ];
    
    combined = [
        [[1, 3], [2, 3], [3, 3], [4, 3]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a simple row five-match', t => {
    match = [
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]]
    ];
    
    combined = [
        [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a simple column five-match', t => {
    match = [
        [[0, 2], [1, 2], [2, 2]],
        [[1, 2], [2, 2], [3, 2]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    
    combined = [
        [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a cross-match', t => {
    match = [
        [[2, 1], [2, 2], [2, 3]],
        [[1, 2], [2, 2], [3, 2]]
    ];
    
    combined = [
        [[1, 2], [2, 1], [2, 2], [2, 3], [3, 2]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines an L cross-match', t => {
    match = [
        [[4, 1], [4, 2], [4, 3]],
        [[2, 1], [3, 1], [4, 1]]
    ];
    
    combined = [
        [[2, 1], [3, 1], [4, 1], [4, 2], [4, 3]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a four match plus corner match', t => {
    match = [
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    
    combined = [
        [[2, 0], [2, 1], [2, 2], [2, 3], [3, 2], [4, 2]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a four match plus corner match (inverted)', t => {
    match = [
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    
    combined = [
        [[2, 1], [2, 2], [2, 3], [2, 4], [3, 2], [4, 2]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test('combines a seven match', t => {
    match = [
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    
    combined = [
        [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 2], [4, 2]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});

test("returns multiple matches if no overlaps (three-matches)", t => {
    match = [
        [[0, 0], [0, 1], [0, 2]],
        [[3, 4], [4, 4], [5, 4]]
    ];
    
    combined = [
        [[0, 0], [0, 1], [0, 2]],
        [[3, 4], [4, 4], [5, 4]]
    ];

});

test("returns multiple matches if no overlaps (four-matches)", t => {
    match = [
        [[0, 1], [0, 2], [0, 3]],
        [[0, 2], [0, 3], [0, 4]],
        [[2, 2], [2, 3], [2, 4]],
        [[2, 3], [2, 4], [2, 5]]
    ];
    
    combined = [
        [[0, 1], [0, 2], [0, 3], [0, 4]],
        [[2, 2], [2, 3], [2, 4], [2, 5]]
    ];
    
    t.ok(_.isEqual(combineMatches(match), combined));
});
