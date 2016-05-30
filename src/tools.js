'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.indexOfAll = indexOfAll;
exports._iterchunks = _iterchunks;
exports.iterchunks = iterchunks;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// return the index of all occurrences of `value` in `list`. [5, 3, 7, 5], 5 -> [0, 3]
function indexOfAll(list, value) {
    return _.reduce(list, function (acc, e, i) {
        if (e === value) {
            acc.push(i);
        }

        return acc;
    }, []);
};

/**
 * @private
 * @description Used to provide more granularity to functions that need to call iterchunks
 * on a non-transposed set of orbs, as well as a transposed set of orbs.
 * @see findTriples
 */
function _iterchunks(orbs, chunkLimitRange, includePositionInformation, isTransposed) {
    var chunks = [];

    var _chunkLimitRange = _slicedToArray(chunkLimitRange, 2);

    var width = _chunkLimitRange[0];
    var height = _chunkLimitRange[1];
    var finalPositionWidth = orbs[0].length - width;
    var finalPositionHeight = orbs.length - height;

    _.each(_.range(0, finalPositionHeight + 1), function (heightIndex) {
        _.each(_.range(0, finalPositionWidth + 1), function (widthIndex) {
            var chunkData = orbs.slice(heightIndex, heightIndex + height).map(function (row) {
                return row.slice(widthIndex, widthIndex + width);
            });

            if (includePositionInformation) {
                var startingCoordinates = [heightIndex, widthIndex];
                var endingCoordinates = [heightIndex + height - 1, widthIndex + width - 1];
                if (isTransposed) {
                    startingCoordinates = startingCoordinates.reverse();
                    endingCoordinates = endingCoordinates.reverse();
                }

                chunkData.push({
                    position: {
                        first: startingCoordinates,
                        last: endingCoordinates
                    }
                });
            }

            chunks.push(chunkData);
        });
    });
    return chunks;
};

/**
 * With `orbs` being
 * [ [ 6, 5, 4 ],
 *   [ 3, 2, 2 ],
 *   [ 6, 4, 0 ] ]
 * And with a [3, 2] `chunkLimitRange`, this will yield each 3x2
 * grouping, and then, each available 2x3 grouping.
 * [ [ [6, 5, 4], [3, 2, 2] ], [ [3, 2, 2], [6, 4, 0] ],
 *   [ [6, 3, 6], [5, 2, 4] ], [ [5, 2, 4], [4, 2, 0] ] ]
 *
 * If you want to also return the position of the first member of the chunk,
 * as row/col coordinates, pass in `includePositionInformation`. That will return the
 * same data as above, but with a final piece of information, an object with a `position`
 * key that maps to the first and last row/col coordinates of that chunk.
 * [
 *     [
 *         [6, 5, 4], [3, 2, 2],
 *         {
 *             position: {
 *                 first: [0, 0],
 *                 last: [1, 2]
 *             }
 *         }
 *     ],
 *     [
 *         [3, 2, 2], [6, 4, 0],
 *         {
 *             position: {
 *                 first: [1, 0],
 *                 last: [2, 2]
 *             }
 *         }
 *     ],
 *     [
 *         [6, 3, 6], [5, 2, 4],
 *         {
 *             position: {
 *                 first: [0, 0],
 *                 last: [2, 1]
 *             }
 *         }
 *     ],
 *     [
 *         [5, 2, 4], [4, 2, 0]
 *         {
 *             position: {
 *                 first: [0, 1],
 *                 last: [2, 2]
 *             }
 *         }
 *     ]
 * ]
 */
function iterchunks(orbs) {
    var chunkLimitRange = arguments.length <= 1 || arguments[1] === undefined ? [4, 2] : arguments[1];
    var includePositionInformation = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var transposedOrbs = _.zip.apply(_, _toConsumableArray(orbs));
    return [].concat(_toConsumableArray(_iterchunks(orbs, chunkLimitRange, includePositionInformation, false)), _toConsumableArray(_iterchunks(transposedOrbs, chunkLimitRange, includePositionInformation, true)));
};