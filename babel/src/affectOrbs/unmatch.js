/**
      * @private
      * @description Does the dirty work for unmatch by taking a given orb and swapping with a neighbor
      * of a different type, or a random orb on the board if there are no valid neighbors.
      * @see unmatch
      */
    _unmatch(row, col, match, skipToRandom = false) {
        let thisOrb = this.orbs[row][col];
        let swapped = false;
        let directions = _.shuffle(['up', 'down', 'left', 'right']);
        for (let i = 0; i < 4; i++) {
            // abandons the process and jumps to swapping a random orb
            if (skipToRandom) { break };
            if (directions[i] === 'up' && !_.isUndefined(this.orbs[row - 1]) && this.orbs[row - 1][col] !== thisOrb) {
                this.swap([[row, col], [row - 1, col]], false);
                swapped = true;
                break;
            } else if (directions[i] === 'down' && !_.isUndefined(this.orbs[row + 1]) && this.orbs[row + 1][col] !== thisOrb) {
                this.swap([[row, col], [row + 1, col]], false);
                swapped = true;
                break;
            } else if (directions[i] === 'left' && !_.isUndefined(this.orbs[row][col - 1]) && this.orbs[row][col - 1] !== thisOrb) {
                this.swap([[row, col], [row, col - 1]], false);
                swapped = true;
                break;
            } else if (directions[i] === 'right' && !_.isUndefined(this.orbs[row][col + 1]) && this.orbs[row][col + 1] !== thisOrb) {
                this.swap([[row, col], [row, col + 1]], false);
                swapped = true;
                break;
            }
        }
        while (!swapped) {
            let [randomRow, randomCol] = [_.random(this.height - 1), _.random(this.width - 1)];
            if (!_.includes(match, [randomRow, randomCol]) && this.orbs[randomRow][randomCol] !== thisOrb) {
                this.swap([[row, col], [randomRow, randomCol]], false);
                swapped = true;
            }
        }
    }
    
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
      *         [ 3, 5, 1, 2 ],     to      [ 3, 5, 1, 2 ],     this.orbs[1][1] was the
      *         [ 4, 5, 2, 3 ]              [ 4, 5, 2, 3 ]      intersection swapped
      *
      * @example A side-by-side match could go from 
      *         [ 1, 5, 5, 5 ],             [ 1, 5, 4, 5 ],                 [ 1, 5, 4, 5 ],
      *         [ 2, 5, 5, 5 ],             [ 2, 5, 5, 5 ],                 [ 2, 5, 1, 5 ],
      *         [ 3, 4, 1, 2 ],     to      [ 3, 4, 1, 2 ],    and then     [ 3, 4, 5, 2 ],
      *         [ 4, 1, 2, 3 ]              [ 5, 1, 2, 3 ]                  [ 5, 1, 2, 3 ]
      */
    unmatch() {
        while (this.hasMatch()) {
            let intersections = [];
            let match = combineMatches(findTriples(this.orbs))[0];
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
                    midNeighbors = [this.orbs[midRow][midCol - 1], this.orbs[midRow][midCol + 1]];
                } else {
                    midNeighbors = [this.orbs[midRow - 1][midCol], this.orbs[midRow + 1][midCol]];
                }
                let isSideBySideMatch = _.includes(midNeighbors, this.orbs[midRow][midCol]);

                this._unmatch(...match[median], match, isSideBySideMatch);
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
                this._unmatch(..._.sample(intersections), match);
            };
        };
    }