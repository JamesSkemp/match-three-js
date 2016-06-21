'use strict';

let board = require('../../src/board');
let demotools = require('./demotools');
let _ = require('lodash');

let colors = ['red', 'blue', 'green', 'aquamarine', 'yellow', 'brown', 'purple', 'orange'];
let b = new board.Board(8, 8, colors);

// create the main board and append it to 'board' div
let demoBoard = document.getElementById('board');
demotools.createHTMLBoard(b, demoBoard, 'main');

// create the attic board and append it to 'attic' div
let a = new board.Board(8, 8, colors);
let atticBoard = document.getElementById('attic');
demotools.createHTMLBoard(a, atticBoard, 'attic');

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

// practice the movements
global.move = function() {
    let matchOrb = document.getElementById('main 7 0');
    matchOrb.style.opacity = '0';
    _.each(_.range(8), row => {
        let orb = document.getElementById('main ' + row + ' 0');
        orb.style.webkitTransform = 'translate(0, 56px)';
    })
    let atticOrb = document.getElementById('attic 7 0');
    atticOrb.style.webkitTransform = 'translate(0, 112px)';
}

// working backwards, here is the example output from the new-to-be Board.evaluate()
// - a horizontal simple match of three on the bottom left corner of an 8x8 board
let exampleOrbCounts = {
    1: 1,
    2: 1,
    3: 1
};
let exampleMatches = [
    [[1, 1], [1, 2], [1, 3]]
];

// call the example (for now this is just moving the orbs in html and nothing else)
global.swap = function() {
    demotools.swap(b, [4, 5], [5, 5]);
}

global.moveMatch = function() {
    demotools.pullDownOrbs(b, exampleMatches, exampleOrbCounts);
}
