'use strict';
import * as _ from 'lodash';
import * as orbs from './orbs';
import * as triples from './triples';

export class Board {
    constructor (width = 8, height = 8, types = _.range(7), needsAttic = true) {
        this.width = width;
        this.height = height;
        this.types = types;
        this.generateOrbs();
        if (this.hasMatch() || this.needsShuffle()) {
            this.shuffle();
        };
        if (needsAttic) {
            this.attic = new Board(this.width, this.height, this.types, false);
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
    
    generateOrbs() {
        let chooseOrb = () => { return _.sample(this.types); };
        let sampleRow = () => { return _.times(this.width, chooseOrb); };
        this.orbs = _.zip(..._.times(this.height, sampleRow));
    }

    evaluate() {
        let [newOrbs, matchData] = orbs.evaluate(this.orbs, this.height, this.width, this.matches, this.attic.orbs);
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

    swap(swapOrbs) {
        this.orbs = orbs.swap(this.orbs, swapOrbs);
    }
    
    unmatch() {
        while(this.hasMatch()) {
            this.orbs = orbs.unmatch(this.orbs, this.height, this.width, this.matches[0]);
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
