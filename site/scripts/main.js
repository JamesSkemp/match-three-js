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
    let id = row + ' ' + col;
    let td = document.getElementById(id);
    td.style.border = '2px solid white';
    if (selectedOrbs.length === 2 && demotools.areNeighbors(selectedOrbs)) {
        demotools.makeMove(b, selectedOrbs);
        selectedOrbs = [];
    }
} 
