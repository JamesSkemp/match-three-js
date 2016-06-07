'use strict';

let board = require('../../src/board');
let demotools = require('./demotools');
let _ = require('lodash');

let colors = ['red', 'blue', 'green', 'aquamarine', 'yellow', 'brown', 'purple', 'orange'];
let b = new board.Board(8, 8, colors);

// create the board and append it to 'board' div
let demoBoard = document.getElementById('board');
_.each(_.range(b.orbs.length), row => {
    let tr = document.createElement('tr');
    tr.setAttribute('id', 'row ' + row);
    _.each(_.range(b.orbs[row].length), col => {
        let td = document.createElement('td');
        td.setAttribute('id', row + ' ' + col);
        let onclick = 'selectOrb(' + row + ', ' + col + ');';
        td.setAttribute('onclick', onclick);
        td.style.backgroundColor = b.orbs[row][col];
        tr.appendChild(td);
    });
    demoBoard.appendChild(tr);
});

let selectedOrbs = [];
global.selectOrb = function(row, col) {
    selectedOrbs.push([row, col]);

    // if it's the first selected orb, put a border around it
    // if it's a valid move, make the move
    // if both selected orbs are the same, deselect
    // if the two orbs aren't neighbors, throw error and reset choices
    if (selectedOrbs.length === 1) {
        demotools.addBorder(row, col);
        return;
    } else if (demotools.areNeighbors(selectedOrbs)) {
        demotools.makeMove(b, selectedOrbs);
        selectedOrbs = [];
    } else if (demotools.twoSelectedOrbsAreEqual(selectedOrbs)) {
        selectedOrbs = [];
        demotools.removeBorder(row, col);
    } else {
        alert("You must choose two neighboring orbs!");
        _.each(selectedOrbs, orb => {
            demotools.removeBorder(orb[0], orb[1]);
        })
        selectedOrbs = [];
    }
} 
