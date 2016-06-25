import * as _ from 'lodash';
import * as tools from './tools';

// checks for one row of the iterchunk board for a potential match like [0010].
export function hasPotentialMatchInSingleRow (row) {
    return _.max(_.values(_.countBy(row))) > 2;
};

// checks across both rows for a potential match, like [0101]
//                                                     [2031]
export function hasPotentialMatchInPairOfRows (pairOfRows) {
    let allValues = _.uniq(_.flatten(pairOfRows));
    let allMatches = _.map(allValues, value => {
        return _.uniq([...tools.indexOfAll(pairOfRows[0], value),
                       ...tools.indexOfAll(pairOfRows[1], value)]).sort();
    });

    return _.some(allMatches, match => {
        return _.some([
            _.isEqual(match, [0, 1, 2]),
            _.isEqual(match, [1, 2, 3]),
            _.isEqual(match, [0, 1, 2, 3]),
        ]);
    });
};

export function hasPotentialMatch (orbs) {
    let chunks = tools.iterchunks(orbs);
    // [[[1, 2, 3], [2, 3, 4]], [[3, 4, 5], [4, 5, 6]]] becomes
    //  [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
    let flatChunks = _.flattenDepth(chunks, 1);
    let hasWideStyleMatch = _.some(_.map(flatChunks, hasPotentialMatchInSingleRow));
    return hasWideStyleMatch || _.some(_.map(chunks), hasPotentialMatchInPairOfRows);
};

export function swap(orbs, swapOrbs) {
    let [[row1, col1], [row2, col2]] = swapOrbs;
    let orbsBefore = _.cloneDeep(orbs);
    orbs[row1][col1] = orbsBefore[row2][col2]
    orbs[row2][col2] = orbsBefore[row1][col1]
    return orbs;
};

/**
  * @description Returns an object that tells how many 'blanks' are below each coordinate.
  * It only records the data if there is at least one blank below that coordinate. A blank
  * is just an orb that was a part of a match and has subsequently been marked with a value
  * of '\u241a'.
  *
  * The format is this:
  *
  *     blanksBelow = {
  *         'row col': blankCount
  *     }
  *
  * @example
  *     [
  *         [0, 1, 2, 3, 4],                blanksBelow = {
  *         [1, X, X, X, 0],                    '0 1': 1,
  *         [2, 3, 4, 0, 1],    -->             '0 2': 1,
  *         [3, 4, 0, 1, 2],                    '0 3': 1
  *         [4, 0, 1, 2, 3]                 }
  *     ]
  */
export function getBlanksBelow(orbs) {
    let blanksBelow = {};
    let height = orbs[0].length;
    let width = orbs.length
    _.each(_.rangeRight(width - 1), row => {
        _.each(_.range(height), col => {
            let blankCount = 0
            _.each(_.range(1, height - row), adder => {
                if (orbs[row + adder][col] === '\u241a') {
                    blankCount += 1;
                };
            });
            if (blankCount > 0) {
                blanksBelow[[row, col]] = blankCount;
            };
        });
    });
    return blanksBelow;
};

/**
  * @description Drops down unaffected orbs into their new post-evaluated position.
  * NOTE: The orbs in the top rows that will be replaced with atticOrbs are left unchanged
  * by this function.
  */
export function activateGravity(orbs) {
    let orbsBefore = _.cloneDeep(orbs);
    _.each(getBlanksBelow(orbs), (count, coord) => {
        let [row, col] = _.map(coord.split(','), _.toInteger);
        orbs[row + count][col] = orbsBefore[row][col];
    })
    return orbs
};

/**
  * @description Returns an array of orb values that are to be dropped down, starting
  * with the bottom-most atticOrb and working up.
  *
  * @see releaseAttic
  */
export function atticOrbsToDropDown(atticOrbs, col, count) {
    let lastRow = atticOrbs.length;
    let atticOrbsToDropDown = [];
    _.each(_.range(count), n => {
        atticOrbsToDropDown.push(atticOrbs[lastRow - 1 - n][col])
    });
    return atticOrbsToDropDown;
};

/**
  * @description Drops down the necessary orbs from the attic into the main orb set.
  */
export function releaseAttic(orbs, atticOrbs, orbCounts) {
    _.each(orbCounts, (count, col) => {
        let dropdowns = atticOrbsToDropDown(atticOrbs, col, count);
        _.each(_.range(count), row => {
            orbs[row][col] = dropdowns.pop()
        });
    });
    return orbs
};
/**
  * @description Gets the orbCounts object based on a board's matches.
  *
  * The orbCounts object tells how many orbs from the matches are in each column.
  * This is necessary data for the releaseAttic function.
  *
  * @see releaseAttic
  */
export function getOrbCounts(matches) {
    let orbCounts = {};
    _.each(matches, match => {
        _.each(match, coord => {
            if (orbCounts[coord[1]]) {
                orbCounts[coord[1]] += 1;
            } else {
                orbCounts[coord[1]] = 1;
            };
        });
    });
    return orbCounts;
};

export function getMatchData(orbs, matches) {
    let matchData = [];
    _.each(matches, match => {
        matchData.push([orbs[match[0][0]][match[0][1]], match.length]);
    })
    return matchData;
}

/**
  * @description Replaces the value of each orb from the matches with a new value
  * of '\u241a'
  */
export function markMatches(orbs, matches) {
    let matchData = [];
    _.each(matches, match => {
        _.each(match, coord => {
            let [row, col] = coord;
            // replace each coordinate with '\u241a'
            orbs[row][col] = '\u241a'
        })
    });
    return orbs;
}

/**
  * @description Takes a post-swap set of orbs, gathers the match data for each of the matches,
  * marks each orb in the match with '\u241a', pulls down non-match orbs over the 'marked' orbs,
  * and pulls down new orbs from the attic to fill in the rest of the board.
  *
  * @example
  *                 [5, 6, 7, 8, 9],               
  *                 [6, 7, 8, 9, 5],
  *     atticOrbs   [7, 8, 9, 5, 6],
  *                 [8, 9, 5, 6, 7],
  *                 [9, 5, 6, 7, 8]                    new orbs
  *                                                                             matchData
  *                 [0, 1, 2, 3, 4],                [0, 5, 6, 7, 4],         [type, length]
  *                 [1, 2, 3, 4, 0],     returns    [1, 1, 2, 3, 0],     
  *     orbs        [2, 0, 0, 0, 1],       -->      [2, 2, 3, 4, 1],     and     [0, 3]
  *                 [3, 4, 0, 1, 2],                [3, 4, 0, 1, 2],    
  *                 [4, 0, 1, 2, 3]                 [4, 0, 1, 2, 3]
  */
export function evaluate(orbs, height, width, matches, atticOrbs) {
    let matchData = getMatchData(orbs, matches);
    orbs = releaseAttic(activateGravity(markMatches(orbs, matches)), atticOrbs, getOrbCounts(matches));
    return [orbs, matchData];
};

/**
  * @private
  * @description Does the dirty work for unmatch by taking a given orb and swapping with a neighbor
  * of a different type, or a random orb on the board if there are no valid neighbors.
  * @see unmatch
  */
let _unmatch = (orbs, row, col, match, skipToRandom = false, height, width) => {
    let thisOrb = orbs[row][col];
    let swapped = false;
    let directions = _.shuffle(['up', 'down', 'left', 'right']);
    for (let i = 0; i < 4; i++) {
        // abandons the process and jumps to swapping a random orb
        if (skipToRandom) { break };
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
        let [randomRow, randomCol] = [_.random(height - 1), _.random(width - 1)];
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
export function unmatch(orbs, height, width, firstMatch) {
    let intersections = [];
    let match = firstMatch;
    // it is a simple match if all of the coords have only 1 rowCoord or 1 colCoord
    let [rowCoords, colCoords] = _.zip(...match);
    let isSimpleMatch = _.uniq(rowCoords).length === 1 || _.uniq(colCoords).length === 1;
    if (isSimpleMatch) {
        // finds the median orb in the match
        let median = Math.floor(match.length / 2);
        let [midRow, midCol] = match[median];

        // Checks for a side-by-side match, which could cause and endless loop.
        // In that case, the skipToRandom argument in _unmatch is triggered.
        let midNeighbors;
        if (_.uniq(rowCoords).length === 1) {
            midNeighbors = [orbs[midRow][midCol - 1], orbs[midRow][midCol + 1]];
        } else {
            midNeighbors = [orbs[midRow - 1][midCol], orbs[midRow + 1][midCol]];
        }
        let isSideBySideMatch = _.includes(midNeighbors, orbs[midRow][midCol]);

        _unmatch(orbs, ...match[median], match, isSideBySideMatch, height, width);
    } else {
        // collects which rows and columns have matches in them
        let matchRows = [];
        let matchCols = [];
        _.each(_.countBy(rowCoords), (v, k) => {
            if (v > 2) {
                matchRows.push(_.toInteger(k));
            };
        });
        _.each(_.countBy(colCoords), (v, k) => {
            if (v > 2) {
                matchCols.push(_.toInteger(k));
            };
        });
        // if a coordinate is in a row match and a column match, it is an intersection
        _.each(match, coords => {
            if (_.includes(matchRows, coords[0]) && _.includes(matchCols, coords[1])) {
                intersections.push(coords);
            };
        });
        // chooses a random intersection to unmatch 
        _unmatch(orbs, ..._.sample(intersections), match, height, width);
    };    
    return orbs;
};
