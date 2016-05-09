import {_iterchunks} from '../tools/iterchunks';
let SortedSet = require('collections/sorted-set');

let _findTriples = (chunks, isTransposed) => {
    let triples = [];

    _.each(chunks, chunk => {
        let orbs = _.first(chunk);
        let metadata = _.last(chunk);
        if (_.uniq(orbs).length === 1) {
            let anchor = metadata.position.first;
            let firstOrb = anchor;
            let secondOrb;
            let thirdOrb;

            if (isTransposed) {
                secondOrb = [anchor[0] + 1, anchor[1]];
                thirdOrb = [anchor[0] + 2, anchor[1]];
            } else {
                secondOrb = [anchor[0], anchor[1] + 1];
                thirdOrb = [anchor[0], anchor[1] + 2];
            }

            let absolutePositions = [
                firstOrb,
                secondOrb,
                thirdOrb
            ];
            triples.push(absolutePositions);
        }
    });

    return triples;
};

/**
  * @description Gathers all triples, which are the coordinates for all instances of 
  * three consecutive matching orbs, first in rows, then in columns.
  */
export function find(orbs) {
    let chunksOriginal = _iterchunks(orbs, [3, 1], true);
    let chunksTransposed = _iterchunks(_.zip(...orbs), [3, 1], true, true);

    return [
            ..._findTriples(chunksOriginal, false),
            ..._findTriples(chunksTransposed, true)
    ];
};

export function combine(matches) {
    let matches = [];
    let unused = matches;
    let couldMatch;
    let before;
    let currentMatch;

    while (unused[0] != null) {
        currentMatch = new SortedSet(unused[0]);
        unused.shift();
        couldMatch = _.clone(unused);

        _.each(couldMatch, m => {
            //only union if there is an overlap!
            if (currentMatch.intersection(m).toArray()[0] != null) {
                before = currentMatch.toArray();
                currentMatch.swap(0, currentMatch.length, currentMatch.union(m));
                if (before != currentMatch.toArray()) {
                    unused.splice(unused.indexOf(m), 1);
                }
            }
        });
        matches.push(currentMatch.toArray());
    }
    return matches;
};
