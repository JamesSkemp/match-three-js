'use strict';
import test from 'ava';
import * as _ from 'lodash';
import * as tools from '../src/tools';
let orbs;
let chunks: any[][][];
let chunksWithPositionInformation: any[];

test.before(() => {
    orbs  = [ [ 6, 5, 4, 1 ],
              [ 3, 2, 2, 5 ],
              [ 3, 3, 4, 2 ],
              [ 6, 4, 0, 6 ] ];
    chunks = [];
    _.each(tools.iterchunks(orbs), metadata => {
        chunks.push(metadata.chunk);
    });
    chunksWithPositionInformation = tools.iterchunks(orbs, [4, 2], true);
});

test('has the correct length', t => {
    t.is(chunks.length, 6);
});

test('has the correct chunk size', t => {
    t.deepEqual(_.map(chunks, 'length'), _.fill(Array(6), 2));
});

test('each chunk has the correct slice size', t => {
    let allLengths = _.flatten(_.map(chunks, chunk => _.map(chunk, 'length')));
    t.deepEqual(allLengths, _.fill(Array(12), 4));
});

test('has the correct chunk contents', t => {
    let correctChunks = [
        [
            [6, 5, 4, 1],
            [3, 2, 2, 5]
        ],
        [
            [3, 2, 2, 5],
            [3, 3, 4, 2]
        ],
        [
            [3, 3, 4, 2],
            [6, 4, 0, 6]
        ],

        // transposed
        [
            [6, 3, 3, 6],
            [5, 2, 3, 4]
        ],
        [
            [5, 2, 3, 4],
            [4, 2, 4, 0]
        ],
        [
            [4, 2, 4, 0],
            [1, 5, 2, 6]
        ]
    ];
    t.deepEqual(chunks, correctChunks);
});

test('provides position information', t => {
    let correctChunks = [
        {
            chunk: [
                [6, 5, 4, 1],
                [3, 2, 2, 5]
            ],
            positionInfo: {
                first: [0, 0],
                last: [1, 3]
            }
        },
        {
            chunk: [
                [3, 2, 2, 5],
                [3, 3, 4, 2]
            ],
            positionInfo: {
                first: [1, 0],
                last: [2, 3]
            }
        },
        {
            chunk: [
                [3, 3, 4, 2],
                [6, 4, 0, 6]
            ],
            positionInfo: {
                first: [2, 0],
                last: [3, 3]
            }
        },

        // transposed
        {
            chunk: [
                [6, 3, 3, 6],
                [5, 2, 3, 4]
            ],
            positionInfo: {
                first: [0, 0],
                last: [3, 1]
            }
        },
        {
            chunk: [
                [5, 2, 3, 4],
                [4, 2, 4, 0]
            ],
            positionInfo: {
                first: [0, 1],
                last: [3, 2]
            }
        },
        {
            chunk: [
                [4, 2, 4, 0],
                [1, 5, 2, 6]
            ],
            positionInfo: {
                first: [0, 2],
                last: [3, 3]
            }
        }
    ];

    t.deepEqual(chunksWithPositionInformation, correctChunks);
});
