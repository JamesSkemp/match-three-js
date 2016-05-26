'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.hasPotentialMatchInSingleRow = hasPotentialMatchInSingleRow;
exports.hasPotentialMatchInPairOfRows = hasPotentialMatchInPairOfRows;
exports.hasPotentialMatch = hasPotentialMatch;
exports.swap = swap;
exports.evaluate = evaluate;
exports.unmatch = unmatch;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _tools = require('./tools');

var tools = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// checks for one row of the iterchunk board for a potential match like [0010].
function hasPotentialMatchInSingleRow(row) {
    return _.max(_.values(_.countBy(row))) > 2;
};

// checks across both rows for a potential match, like [0101]
//                                                     [2031]
function hasPotentialMatchInPairOfRows(pairOfRows) {
    var allValues = _.uniq(_.flatten(pairOfRows));
    var allMatches = _.map(allValues, function (value) {
        return _.uniq([].concat(_toConsumableArray(tools.indexOfAll(pairOfRows[0], value)), _toConsumableArray(tools.indexOfAll(pairOfRows[1], value)))).sort();
    });

    return _.some(allMatches, function (match) {
        return _.some([_.isEqual(match, [0, 1, 2]), _.isEqual(match, [1, 2, 3]), _.isEqual(match, [0, 1, 2, 3])]);
    });
};

function hasPotentialMatch(orbs) {
    var chunks = tools.iterchunks(orbs);
    // [[[1, 2, 3], [2, 3, 4]], [[3, 4, 5], [4, 5, 6]]] becomes
    //  [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
    var flatChunks = _.flattenDepth(chunks, 1);
    var hasWideStyleMatch = _.some(_.map(flatChunks, hasPotentialMatchInSingleRow));
    return hasWideStyleMatch || _.some(_.map(chunks), hasPotentialMatchInPairOfRows);
};

function swap(orbs, swapOrbs) {
    var _swapOrbs = _slicedToArray(swapOrbs, 2);

    var _swapOrbs$ = _slicedToArray(_swapOrbs[0], 2);

    var row1 = _swapOrbs$[0];
    var col1 = _swapOrbs$[1];

    var _swapOrbs$2 = _slicedToArray(_swapOrbs[1], 2);

    var row2 = _swapOrbs$2[0];
    var col2 = _swapOrbs$2[1];

    var orbsBefore = _.cloneDeep(orbs);
    orbs[row1][col1] = orbsBefore[row2][col2];
    orbs[row2][col2] = orbsBefore[row1][col1];
    return orbs;
};

/**
  * 1. logs data for each match and replaces each orb with '\u241a'
  * 2. replaces each '\u241a' and all above orbs with either the orb directly above or a random new orb
  * 3. returns the match data -> [[match1Type, match1Amount], [match2Type, match2Amount], ...]
  */
function evaluate(orbs, height, width, matches, dropOptions) {
    var matchData = [];

    _.each(matches, function (match) {
        // log data
        matchData.push([orbs[match[0][0]][match[0][1]], match.length]);
        // replace each coordinate with '\u241a'
        _.each(match, function (coord) {
            var _coord = _slicedToArray(coord, 2);

            var row = _coord[0];
            var col = _coord[1];

            orbs[row][col] = '␚';
        });
    });

    /**
      * drop down and generate matches
      * 1. reads across starting from the top
      * 2. when it hits '\u241a', loops from that position directly up
      * 3. if the row isn't 0, it takes the orb from above
      * 4. if the row is 0, it creates a random orb
      */
    _.each(_.range(height), function (row) {
        _.each(_.range(width), function (col) {
            //1
            if (orbs[row][col] == '␚') {
                for (var z = row; z >= 0; z--) {
                    //2
                    if (z > 0) {
                        //3
                        orbs[z][col] = orbs[z - 1][col];
                    } else {
                        //4
                        orbs[z][col] = _.sample(dropOptions);;
                    };
                };
            };
        });
    });

    return [orbs, matchData];
};

/**
  * @private
  * @description Does the dirty work for unmatch by taking a given orb and swapping with a neighbor
  * of a different type, or a random orb on the board if there are no valid neighbors.
  * @see unmatch
  */
var _unmatch = function _unmatch(orbs, row, col, match) {
    var skipToRandom = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
    var height = arguments[5];
    var width = arguments[6];

    var thisOrb = orbs[row][col];
    var swapped = false;
    var directions = _.shuffle(['up', 'down', 'left', 'right']);
    for (var i = 0; i < 4; i++) {
        // abandons the process and jumps to swapping a random orb
        if (skipToRandom) {
            break;
        };
        if (directions[i] === 'up' && !_.isUndefined(orbs[row - 1]) && orbs[row - 1][col] !== thisOrb) {
            swap(orbs, [[row, col], [row - 1, col]], false);
            swapped = true;
            break;
        } else if (directions[i] === 'down' && !_.isUndefined(orbs[row + 1]) && orbs[row + 1][col] !== thisOrb) {
            swap(orbs, [[row, col], [row + 1, col]], false);
            swapped = true;
            break;
        } else if (directions[i] === 'left' && !_.isUndefined(orbs[row][col - 1]) && orbs[row][col - 1] !== thisOrb) {
            swap(orbs, [[row, col], [row, col - 1]], false);
            swapped = true;
            break;
        } else if (directions[i] === 'right' && !_.isUndefined(orbs[row][col + 1]) && orbs[row][col + 1] !== thisOrb) {
            swap(orbs, [[row, col], [row, col + 1]], false);
            swapped = true;
            break;
        }
    }
    while (!swapped) {
        var randomRow = _.random(height - 1);

        var randomCol = _.random(width - 1);

        if (!_.includes(match, [randomRow, randomCol]) && orbs[randomRow][randomCol] !== thisOrb) {
            swap(orbs, [[row, col], [randomRow, randomCol]], false);
            swapped = true;
        }
    }
};

/**
  * @description Removes all match events one at a time by swapping a median or intersecting orb
  * with its neighbor or a random orb if necessary. 
  *
  * Intersectiions only occur if the match is not a simple match, i.e. it only spans one
  * column or one row.
  *
  * @example A simple match could go from 
  *         [ 1, 2, 3, 4 ],             [ 1, 2, 5, 4 ],
  *         [ 2, 5, 5, 5 ],             [ 2, 5, 3, 5 ],
  *         [ 3, 4, 1, 2 ],     to      [ 3, 4, 1, 2 ],
  *         [ 4, 1, 2, 3 ]              [ 4, 1, 2, 3 ]
  *
  * @example A multidimensional match could go from 
  *         [ 1, 2, 3, 4 ],             [ 1, 5, 3, 4 ],
  *         [ 2, 5, 5, 5 ],             [ 2, 2, 5, 5 ],
  *         [ 3, 5, 1, 2 ],     to      [ 3, 5, 1, 2 ],     orbs[1][1] was the
  *         [ 4, 5, 2, 3 ]              [ 4, 5, 2, 3 ]      intersection swapped
  *
  * @example A side-by-side match could go from 
  *         [ 1, 5, 5, 5 ],             [ 1, 5, 4, 5 ],                 [ 1, 5, 4, 5 ],
  *         [ 2, 5, 5, 5 ],             [ 2, 5, 5, 5 ],                 [ 2, 5, 1, 5 ],
  *         [ 3, 4, 1, 2 ],     to      [ 3, 4, 1, 2 ],    and then     [ 3, 4, 5, 2 ],
  *         [ 4, 1, 2, 3 ]              [ 5, 1, 2, 3 ]                  [ 5, 1, 2, 3 ]
  */
function unmatch(orbs, height, width, firstMatch) {
    var intersections = [];
    var match = firstMatch;
    // it is a simple match if all of the coords have only 1 rowCoord or 1 colCoord

    var _$zip = _.zip.apply(_, _toConsumableArray(match));

    var _$zip2 = _slicedToArray(_$zip, 2);

    var rowCoords = _$zip2[0];
    var colCoords = _$zip2[1];

    var isSimpleMatch = _.uniq(rowCoords).length === 1 || _.uniq(colCoords).length === 1;
    if (isSimpleMatch) {
        // finds the median orb in the match
        var median = Math.floor(match.length / 2);

        var _match$median = _slicedToArray(match[median], 2);

        var midRow = _match$median[0];
        var midCol = _match$median[1];

        // Checks for a side-by-side match, which could cause and endless loop.
        // In that case, the skipToRandom argument in _unmatch is triggered.

        var midNeighbors = void 0;
        if (_.uniq(rowCoords).length === 1) {
            midNeighbors = [orbs[midRow][midCol - 1], orbs[midRow][midCol + 1]];
        } else {
            midNeighbors = [orbs[midRow - 1][midCol], orbs[midRow + 1][midCol]];
        }
        var isSideBySideMatch = _.includes(midNeighbors, orbs[midRow][midCol]);

        _unmatch.apply(undefined, [orbs].concat(_toConsumableArray(match[median]), [match, isSideBySideMatch, height, width]));
    } else {
        (function () {
            // collects which rows and columns have matches in them
            var matchRows = [];
            var matchCols = [];
            _.each(_.countBy(rowCoords), function (v, k) {
                if (v > 2) {
                    matchRows.push(_.toInteger(k));
                };
            });
            _.each(_.countBy(colCoords), function (v, k) {
                if (v > 2) {
                    matchCols.push(_.toInteger(k));
                };
            });
            // if a coordinate is in a row match and a column match, it is an intersection
            _.each(match, function (coords) {
                if (_.includes(matchRows, coords[0]) && _.includes(matchCols, coords[1])) {
                    intersections.push(coords);
                };
            });
            // chooses a random intersection to unmatch
            _unmatch.apply(undefined, [orbs].concat(_toConsumableArray(_.sample(intersections)), [match, height, width]));
        })();
    };
    return orbs;
};