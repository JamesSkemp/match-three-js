'use strict';
import * as _ from 'lodash';

/**
 * With `orbs` being
 * [ [ 6, 5, 4 ],
 *   [ 3, 2, 2 ],
 *   [ 6, 4, 0 ] ]
 * And with a [3, 2] `chunkLimitRange`, this will yield each 3x2
 * grouping, and then, each available 2x3 grouping.
 * [ [ [6, 5, 4], [3, 2, 2] ], [ [3, 2, 2], [6, 4, 0] ],
 *   [ [6, 3, 6], [5, 2, 4] ], [ [5, 2, 4], [4, 2, 0] ] ]
 */
let iterchunks = function (orbs, chunkLimitRange = [4, 2]) {
    // Defaults will find all possible 3-matches. Used by `Board#evaluate`.
    let [width, height] = chunkLimitRange;
    let [finalPositionWidth, finalPositionHeight] = [orbs[0].length - width, orbs.length - height];
    let chunks = [];
    _.each(_.range(0, finalPositionHeight + 1), heightIndex => {
        _.each(_.range(0, finalPositionWidth + 1), widthIndex => {
            chunks.push([
                orbs[heightIndex].slice(widthIndex, widthIndex + width),
                orbs[heightIndex + 1].slice(widthIndex, widthIndex + width)
            ]);
        });
    });
    return chunks;
};

export default class Board {
    constructor (width = 8, height = 8, types = _.range(7)) {
        this.width = width;
        this.height = height;
        this.types = types;
        let chooseOrb = () => { return _.sample(types); };
        let sampleRow = () => { return _.times(width, chooseOrb); };
        this.orbs = _.zip(..._.times(height, sampleRow));
        // this.evaluateAll(this.orbs);
    }

    get size() {
        return [this.width, this.height];
    }

    get availableTypes() {
        return _.uniq(_.flatten(this.orbs)).sort();
    }

    /**
     * @returns {Object} - A match event. Includes the
     *
     */
    evaluate(board) {
        let matchEvents = [],
            matchLength = 3;
        for (var x = 0; x < this.height; x++) { // all rows
            for (var y = 0; y < this.width - 2; y++) { // all but last 2 columns
                if (board[x][y] == board[x][y+1] && board[x][y+2] == board[x][y]) {
                    for (var i = 3; i < 5; i++){
                        if (!board[x][y + i]) { break };
                        if (board[x][y] == board[x][y + i]) { matchLength++ }
                    };
                    matchEvents.push([[x, y], 'right', matchLength]);
                    matchLength = 3;
                    break;
                }
            }
        };
        for (var y = 0; y < this.width; y++) { // all columns
            for (var x = 0; x < this.height - 2; x++) { // all but last 2 rows    
                if (board[x][y] == board[x+1][y] && board[x+2][y] == board[x][y]) {
                    for (var j = 3; j < 5; j++){
                        if (!board[x + j]) { break };
                        if (board[x][y] == board[x + j][y]) { matchLength++ }
                    };
                    matchEvents.push([[x, y], 'down', matchLength]);
                    matchLength = 3;
                    break
                } 
            }
        }
        return matchEvents  
    }

    evaluateAll() {
        var matchEvents = [];
        while (this.hasMatch()) {
            matchEvents.push(this.evaluate());
        }
    }

    needsShuffle() {
        let chunks = iterchunks(_.cloneDeep(this.orbs));
        let chunksBackward = iterchunks(_.zip(..._.cloneDeep(this.orbs)));
        chunks.push(...chunksBackward);
        return chunks;
    }

    hasMatch() {
        return !this.needsShuffle();
    }

    shuffle() {

    }
};
