#!/usr/bin/env node
'use strict';

const execSync = require('child_process').execSync;

let browserSync = require('browser-sync').create();

execSync('npm run babel; npm run browserify; node site/scripts/generate_readme.js', { stdio: [0, 1, 2] });

browserSync.init({
    server: 'site',
    files: [
        'site/index.html'
    ]
});

browserSync.watch('site/scripts/main.js', (event) => {
    if (event === 'change') {
        execSync('npm run browserify', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('site/scripts/demotools.js', (event) => {
    if (event === 'change') {
        execSync('npm run browserify', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('babel/src/*.js', (event) => {
    if (event === 'change') {
        execSync('npm run babel', { stdio: [0, 1, 2] });
        execSync('npm run browserify', { stdio: [0, 1, 2] });
    }
});

browserSync.watch('site/scripts/generate_readme.js', (event) => {
    if (event === 'change') {
        execSync('node site/scripts/generate_readme.js', { stdio: [0, 1, 2] });
    }
});
