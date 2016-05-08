'use strict';
import * as _ from 'lodash';
import iterchunks from './tools/iterchunks';
import hasPotentialMatchInSingleRow from './getMatches/hasPotentialMatch';
import hasPotentialMatchInPairOfRows from './getMatches/hasPotentialMatch';
import * as orbs from './orbs';
import * as triples from './triples';
let SortedSet = require('collections/sorted-set');

export class Board {
    constructor (width = 8, height = 8, types = _.range(7)) {
        this.width = width;
        this.height = height;
        this.types = types;
        let chooseOrb = () => { return _.sample(this.types); };
        let sampleRow = () => { return _.times(this.width, chooseOrb); };
        this.orbs = _.zip(..._.times(this.height, sampleRow));
        if (this.hasMatch() || this.needsShuffle()) {
            this.shuffle();
        };
    }

    get size() {
        return [this.width, this.height];
    }

    get availableTypes() {
        return _.uniq(_.flatten(this.orbs)).sort();
    }
    
    get triples() {
        return triples.find(this.orbs);
    }
    
    get matches() {
        return triples.combine(this.triples);
    }

    evaluate(dropOptions = this.types) {
        let evaluation = orbs.evaluate(this.orbs, this.height, this.width, this.matches, dropOptions)
        let [newOrbs, matchData] = evaluation;
        this.orbs = newOrbs;
        return matchData;

    }

    needsShuffle() {
        return !this.hasPotentialMatch();
    }

    hasPotentialMatch() {
        return orbs.hasPotentialMatch(this.orbs);
    }
    
    hasMatch() {
        return Boolean(triples.find(this.orbs)[0]);
    }

    swap(swapOrbs, playerSwap = true) {
        let [[row1, col1], [row2, col2]] = swapOrbs;
        let orbsBefore = _.cloneDeep(this.orbs);
        this.orbs[row1][col1] = orbsBefore[row2][col2]
        this.orbs[row2][col2] = orbsBefore[row1][col1]
        // undo the swap if it did not yeild a match
        if (playerSwap && !this.hasMatch()) {
            this.orbs = orbsBefore;
        };
    }
    
    unmatch() {
        while(this.hasMatch()) {
            this.orbs = orbs.unmatch(this.orbs);
        }
    }

    shuffle() {
        this.orbs = _.map(this.orbs, row => _.shuffle(row));
        this.unmatch();
        if (this.needsShuffle()) {
            this.shuffle();
        };
    }
};
