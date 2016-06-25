'use strict';

let board = require('../../src/board');
let demotools = require('./demotools');
let animate = require('./animationHelpers');
let _ = require('lodash');

let colors = ['red', 'blue', 'green', 'aquamarine', 'yellow', 'brown', 'purple', 'orange'];
let b = new board.Board(8, 8, colors);

// create the main board and append it to 'board' div
let demoBoard = document.getElementById('board');
animate.createHTMLBoard(b.orbs);

// create the atticOrbs orb set and append it to 'attic' div
let atticBoard = document.getElementById('attic');
animate.createHTMLAttic(b.atticOrbs);

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
});

let selectedOrbs = [];
global.selectOrb = function(row, col) {
    selectedOrbs.push([row, col]);

    // if it's the first selected orb, put a border around it
    // if it's a valid move, make the move
    // if both selected orbs are the same, deselect
    // if the two orbs aren't neighbors, throw error and reset choices
    if (selectedOrbs.length === 1) {
        animate.addBorder(row, col);
        return;
    } else if (demotools.areNeighbors(selectedOrbs)) {
        let matchDatas = demotools.makeMove(b, selectedOrbs);
        _.each(matchDatas, matchData => {
            _.each(matchData, match => {
                animate.updateScore(match);
            })
        });
        selectedOrbs = [];
    } else if (demotools.twoSelectedOrbsAreEqual(selectedOrbs)) {
        selectedOrbs = [];
        animate.removeBorder(row, col);
    } else {
        alert("You must choose two neighboring orbs!");
        _.each(selectedOrbs, orb => {
            animate.removeBorder(orb[0], orb[1]);
        })
        selectedOrbs = [];
    }
}
