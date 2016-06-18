'use strict';

let board = require('../../src/board');
let demotools = require('./demotools');
let _ = require('lodash');

let colors = ['red', 'blue', 'green', 'aquamarine', 'yellow', 'brown', 'purple', 'orange'];
let b = new board.Board(8, 8, colors);

// create the board and append it to 'board' div
let demoBoard = document.getElementById('board');
_.each(_.range(b.orbs.length), row => {
    _.each(_.range(b.orbs[row].length), col => {
        let orbDiv = document.createElement('div');
        orbDiv.setAttribute('id', row + ' ' + col);
        let onclick = 'selectOrb(' + row + ', ' + col + ');';
        orbDiv.setAttribute('onclick', onclick);
        orbDiv.style.backgroundColor = b.orbs[row][col];
        demoBoard.appendChild(orbDiv);
    });
});

// create a scoreboard for each orb type
let types = document.getElementById('types');
let points = document.getElementById('points');
_.each(colors, color => {
    let td1 = document.createElement('td');
    td1.style.backgroundColor = color;
    let td2 = document.createElement('td');
    let id = color + ' points';
    td2.setAttribute('id', id);
    //td2.innerHTML = 0;
    types.appendChild(td1);
    points.appendChild(td2);
})

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
        let matchDatas = demotools.makeMove(b, selectedOrbs);
        _.each(matchDatas, matchData => {
            _.each(matchData, match => {
                demotools.updateScore(match);
            })
        });
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
