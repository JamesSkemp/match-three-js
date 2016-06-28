'use strict';
import * as _ from 'lodash';
import * as orbs from './orbs';
import * as triples from './triples';

export class Board {
    constructor (width = 8, height = 8, types = _.range(7), atticTypes = types) {
        this.width = width;
        this.height = height;
        this.types = types;
        this.atticTypes = atticTypes;
        this.orbs = this.generateOrbs();
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
    
    get atticOrbs() {
        return _.cloneDeep(new Board(this.width, this.height, this.atticTypes).orbs);
    }
    
    generateOrbs(types = this.types) {
        let chooseOrb = () => { return _.sample(types); };
        let sampleRow = () => { return _.times(this.width, chooseOrb); };
        return _.zip(..._.times(this.height, sampleRow));
    }
    
    resetAttic(types = this.types) {
        this.atticOrbs = _.cloneDeep(new Board(this.width, this.height, types, true).orbs);
    }

    evaluate() {
        let [newOrbs, matchData] = orbs.evaluate(this.orbs, this.height, this.width, this.matches, this.atticOrbs);
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
