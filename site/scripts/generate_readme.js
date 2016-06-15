var fs = require('fs');
var Remarkable = require('remarkable');
var md = new Remarkable();

var readMe = fs.readFileSync('README.md', 'utf-8');
var markdownReadMe = md.render(readMe);

// add link to stylesheet
markdownReadMe += '<link rel="stylesheet" type="text/css" href="stylesheet.css">';

fs.writeFileSync('./site/README.html', markdownReadMe);