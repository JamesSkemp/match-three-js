'use strict';

let _ = require('lodash');

exports.makeMove = function(board, swapOrbs) {
    let [[r1, c1], [r2, c2]] = swapOrbs;
    let first = document.getElementById('main ' + r1 + ' ' + c1);
    let second = document.getElementById('main ' + r2 + ' ' + c2);

    // remove the white borders
    first.style.border = 'none';
    second.style.border = 'none';
    
    // make the swap
    board.swap(swapOrbs);
    if (!board.hasMatch()) {
        // unswaps in the board instance and leave the html unchanged
        board.swap(swapOrbs)
        alert('That\'s not a valid move, you fool!');
    } else {
        // make the swap in the html
        first.style.backgroundColor = board.orbs[r1][c1];
        second.style.backgroundColor = board.orbs[r2][c2];
        
        // evaluate the board
        // save data for matches to be implemented soon
        // catch for matches after the evaluation drops new orbs down
        let matchDatas = [];
        while (board.hasMatch()) {
            let matchData = board.evaluate();
            matchDatas.push(matchData);
        }
        
        // catch if there are no possible matches left
        if (board.needsShuffle()) { board.shuffle() };
        
         
        // repopulate the board in html
        exports.repopulate(board);
        
        return matchDatas;
    }
};

exports.repopulate = function(board) {
    _.each(_.range(board.orbs.length), row => {
        _.each(_.range(board.orbs[row].length), col => {
            let td = document.getElementById('main ' + row + ' ' + col);
            td.style.backgroundColor = board.orbs[row][col];
        })
    })
}
    
exports.areNeighbors = function(orbs) {
    let [[r1, c1], [r2, c2]] = orbs;
    return (r1 == r2 && Math.abs(c1 - c2) == 1) || (c1 == c2 && Math.abs(r1 - r2) == 1)
};

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

exports.twoSelectedOrbsAreEqual = function(selectedOrbs) {
    let orb1 = selectedOrbs[0];
    let orb2 = selectedOrbs[1];
    return orb1[0] === orb2[0];
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

exports.createHTMLBoard = function(board, div, name) {
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
}

exports.pullDownOrbs = function(colData) {
    _.each(colData, (data, col) => {
        // set the number of pixels the orbs should move down
        let pixels = 56 * data.orbCount;
        // remove the orbs from the match
        _.each(_.range(data.orbCount), adder => {
            let id = 'main ' + (data.topRow + adder)  + ' ' + col;
            let orbToRemove = document.getElementById(id);
            orbToRemove.style.opacity = '0';
        });
        
        // pull down unaffected orbs in main board above the match
        _.each(_.rangeRight(data.topRow), rowToMove => {
            let orbToMove = document.getElementById('main ' + rowToMove + ' ' + col);
            orbToMove.style.webkitTransform = 'translate(0, ' + pixels + 'px)';
        });
        
        // pull down orbs from the attic board (pull down the whole column);
        let atticOrbs = document.getElementsByClassName('attic ' + col);
        _.each(atticOrbs, atticOrb => {
            atticOrb.style.webkitTransform = 'translate(0, ' + (pixels) + 'px)';
        });
    });
}
