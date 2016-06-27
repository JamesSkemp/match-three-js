exports.addBorder = function(row, col) {
    let id = 'main ' + row + ' ' + col;
    let td = document.getElementById(id);
    td.style.border = '2px solid white';
};

exports.removeBorder = function(row, col) {
    let id = 'main ' + row + ' ' + col;
    let td = document.getElementById(id);
    td.style.border = 'none';
};

exports.updateScore = function(matchData) {
    let type = matchData[0];
    let length = matchData[1];
    let id = type + ' points';
    let scoreCard = document.getElementById(id);
    let currentPoints = parseInt(scoreCard.innerHTML);
    if (isNaN(currentPoints)) {
        currentPoints = 0;
    };
    let newPoints = currentPoints + length;
    scoreCard.innerHTML = newPoints;
    console.log('You got a ' + type + ' match of ' + length + '!');
};

exports.createHTMLBoardOld = function(board, div, name) {
    _.each(_.range(board.orbs.length), row => {
        _.each(_.range(board.orbs[row].length), col => {
            let orbDiv = document.createElement('div');
            if (name == 'main') {
                orbDiv.setAttribute('id', name + ' ' + row + ' ' + col);
                let onclick = 'selectOrb(' + row + ', ' + col + ');';
                orbDiv.setAttribute('onclick', onclick);
            };
            if (name == 'attic') {
                orbDiv.setAttribute('class', name + ' ' + col);
            }
            orbDiv.style.backgroundColor = board.orbs[row][col];
            div.appendChild(orbDiv);
        });
    });
};

exports.createHTMLBoard = function(orbs) {
    let HTMLBoard = document.getElementById('board');
    _.each(_.range(orbs.length), row => {
        _.each(_.range(orbs[row].length), col => {
            let orbDiv = document.createElement('div');
            orbDiv.setAttribute('id', 'main ' + row + ' ' + col);
            let onclick = 'selectOrb(' + row + ', ' + col + ');';
            orbDiv.setAttribute('onclick', onclick);
            orbDiv.style.backgroundColor = orbs[row][col];
            HTMLBoard.appendChild(orbDiv);
        });
    });
};

exports.createHTMLAttic = function(atticOrbs) {
    let atticBoard = document.getElementById('attic');
    _.each(_.range(atticOrbs.length), row => {
        _.each(_.range(atticOrbs[row].length), col => {
            let orbDiv = document.createElement('div');
            orbDiv.setAttribute('class', 'attic ' + col);
            orbDiv.style.backgroundColor = atticOrbs[row][col];
            atticBoard.appendChild(orbDiv);
        });
    });
};

let moveOrb = function(row, col, direction, distance = 1) {
    let orbToMove = document.getElementById('main ' + row + ' ' + col);
    let pixels = 56 * distance;
    switch (direction) {
        case 'up':
            orbToMove.style.webkitTransform = 'translate(0, ' + (-pixels) + 'px)';
            break;
        case 'down':
            orbToMove.style.webkitTransform = 'translate(0, ' + (pixels) + 'px)';
            break;
        case 'left':
            orbToMove.style.webkitTransform = 'translate(' + (-pixels) + 'px, 0)';
            break;
        case 'right':
            orbToMove.style.webkitTransform = 'translate(' + (pixels) + 'px, 0)';
            break;
    }
};

/**
  * @description Resets the entire board in the html behind the scenes. This function should
  * not be visible in the browser. It resets what is in the browser so that orbs can be collected
  * appropriately in future demotools function calls.
  * 
  * More specifically, it tears down the entire main board (in html) and then recreates it immediately.
  */
exports.repopulate = function(orbs, atticOrbs) {
    console.log('repopulating');
    // tear down the board
    let HTMLBoard = document.getElementById('board');
    while (HTMLBoard.firstChild) {
        HTMLBoard.removeChild(HTMLBoard.firstChild);
    };
    // build the board back from scratch with the new board
    exports.createHTMLBoard(orbs);
    
    // tear down the attic
    let attic = document.getElementById('attic');
    while (attic.firstChild) {
        attic.removeChild(attic.firstChild);
    };
    // build the attic back from scratch with the new board
    exports.createHTMLAttic(atticOrbs);
};

exports.swap = function (board, firstOrb, secondOrb) {
    // make the swap appear in the html/css
    console.log('swapping');
    let firstDirection;
    let secondDirection
    if (firstOrb[0] === secondOrb[0]) {
        if (firstOrb[1] > secondOrb[1]) {
            firstDirection = 'left';
            secondDirection = 'right';
        } else {
            firstDirection = 'right';
            secondDirection = 'left';
        }
    } else {
        if (firstOrb[0] > secondOrb[0]) {
            firstDirection = 'up';
            secondDirection = 'down';
        } else {
            firstDirection = 'down';
            secondDirection = 'up';
        };
    };
    moveOrb(...firstOrb, firstDirection);
    moveOrb(...secondOrb, secondDirection);

    return board.orbs;
};

let eraseMatches = function(matches) {
    console.log('erasing', matches);
    _.each(matches, match => {
        _.each(match, coord => {
            let row = coord[0];
            let col = coord[1];
            let orbToRemove = document.getElementById('main ' + row + ' ' + col);
            orbToRemove.style.opacity = '0';
        });
    });
};

let releaseAttic = function(orbCounts) {
    _.each(orbCounts, (count, col) => {
        let atticOrbs = document.getElementsByClassName('attic ' + col);
        _.each(atticOrbs, atticOrb => {
            atticOrb.style.webkitTransform = 'translate(0, ' + (56 * count) + 'px)';
        });
    });
};

let blanksBelow = function(width, height) {
    let blanksBelow = {};
    _.each(_.rangeRight(height - 1), row => {
        _.each(_.range(width), col => {
            let blankCount = 0
            _.each(_.range(1, height - row), adder => {
                let orb = document.getElementById(`main ${row + adder} ${col}`);
                if (orb.style.opacity === '0') {
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

let activateGravity = function(orbs) {
    console.log('activating gravity');
    _.each(blanksBelow(orbs[0].length, orbs.length), (count, coord) => {
        let intCoord = _.map(coord.split(','), _.toInteger);
        moveOrb(intCoord[0], intCoord[1], 'down', count);
    })
    
};

exports.pullDownOrbs = function(board, matches, orbCounts) {
    // set opacity for all orbs in matches to 0 (erase them)
    eraseMatches(matches);
    
    // Going left to right and bottom-up, loop through each orb.
    // If the orb below is blank, swap down until the orb below is not blank,
    // or the bottom is reached
    activateGravity(board);
    
    // Pull down orbs from the attic
    releaseAttic(orbCounts);
    
};

exports.activateGravity = activateGravity;
exports.releaseAttic = releaseAttic;
exports.eraseMatches = eraseMatches;
