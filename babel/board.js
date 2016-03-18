'use strict';
import * as _ from 'lodash';
let SortedSet = require('collections/sorted-set');

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

    findMatches() {
        let matches = [],
            b = _.cloneDeep(this.orbs);
        
        _.each(_.range(this.height - 2), x => {
            _.each(_.range(this.width - 2), y => {
                if (b[x][y] == b[x][y + 1] && b[x][y] == b[x][y + 2]) {
                    matches.push([[x, y], [x, y + 1], [x, y + 2]])
                } else if (b[x][y] == b[x + 1][y] && b[x][y] == b[x + 2][y]) {
                    matches.push([[x, y], [x + 1, y], [x + 2, y]])
                };
            });
        });
        return matches;
    }
    
    combineMatches() {
        let combinedMatches = [],
            unused = _.clone(this.findMatches()), 
            couldMatch, before, currentMatch;
        
        while (unused[0] != null) {
            currentMatch = new SortedSet(unused[0]);
            unused.shift();
            couldMatch = _.clone(unused);
                
            _.each(couldMatch, m => { //only union if there is an overlap!
                if (currentMatch.intersection(m).toArray()[0] != null) {
                    before = currentMatch.toArray();
                    currentMatch.swap(0, currentMatch.length, currentMatch.union(m));
                    if (before != currentMatch.toArray()) {
                        unused.splice(unused.indexOf(m), 1);
                    }
                }
            });
            combinedMatches.push(currentMatch.toArray());
        }
        return combinedMatches;
    }
    
    evaluate() {
        
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
