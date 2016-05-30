'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.find = find;
exports.combine = combine;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _tools = require('./tools');

var tools = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SortedSet = require('collections/sorted-set');

var _findTriples = function _findTriples(chunks, isTransposed) {
    var triples = [];

    _.each(chunks, function (chunk) {
        var orbs = _.first(chunk);
        var metadata = _.last(chunk);
        if (_.uniq(orbs).length === 1) {
            var anchor = metadata.position.first;
            var firstOrb = anchor;
            var secondOrb = void 0;
            var thirdOrb = void 0;

            if (isTransposed) {
                secondOrb = [anchor[0] + 1, anchor[1]];
                thirdOrb = [anchor[0] + 2, anchor[1]];
            } else {
                secondOrb = [anchor[0], anchor[1] + 1];
                thirdOrb = [anchor[0], anchor[1] + 2];
            }

            var absolutePositions = [firstOrb, secondOrb, thirdOrb];
            triples.push(absolutePositions);
        }
    });

    return triples;
};

/**
  * @description Gathers all triples, which are the coordinates for all instances of 
  * three consecutive matching orbs, first in rows, then in columns.
  */
function find(orbs) {
    var chunksOriginal = tools._iterchunks(orbs, [3, 1], true);
    var chunksTransposed = tools._iterchunks(_.zip.apply(_, _toConsumableArray(orbs)), [3, 1], true, true);

    return [].concat(_toConsumableArray(_findTriples(chunksOriginal, false)), _toConsumableArray(_findTriples(chunksTransposed, true)));
};

function combine(triples) {
    var matches = [];
    var unused = triples;
    var couldMatch = void 0;
    var before = void 0;
    var currentMatch = void 0;

    while (unused[0] != null) {
        currentMatch = new SortedSet(unused[0]);
        unused.shift();
        couldMatch = _.clone(unused);

        _.each(couldMatch, function (m) {
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