'use strict';
import * as _ from 'lodash';

export default class {
    constructor (width = 8, height = 8, types = _.range(7)) {
        this.width = width;
        this.height = height;
        this.types = types;
        let chooseOrb = () => { return _.sample(types) };
        let sampleRow = () => { return _.times(width, chooseOrb) };
        this.orbs = _.zip(..._.times(height, sampleRow));
    }

    get size() {
        return [this.width, this.height];
    }
};
