'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Board = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _orbs = require('./orbs');

var orbs = _interopRequireWildcard(_orbs);

var _triples = require('./triples');

var triples = _interopRequireWildcard(_triples);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = exports.Board = function () {
    function Board() {
        var width = arguments.length <= 0 || arguments[0] === undefined ? 8 : arguments[0];

        var _this = this;

        var height = arguments.length <= 1 || arguments[1] === undefined ? 8 : arguments[1];
        var types = arguments.length <= 2 || arguments[2] === undefined ? _.range(7) : arguments[2];

        _classCallCheck(this, Board);

        this.width = width;
        this.height = height;
        this.types = types;
        var chooseOrb = function chooseOrb() {
            return _.sample(_this.types);
        };
        var sampleRow = function sampleRow() {
            return _.times(_this.width, chooseOrb);
        };
        this.orbs = _.zip.apply(_, _toConsumableArray(_.times(this.height, sampleRow)));
        if (this.hasMatch() || this.needsShuffle()) {
            this.shuffle();
        };
    }

    _createClass(Board, [{
        key: 'evaluate',
        value: function evaluate() {
            var dropOptions = arguments.length <= 0 || arguments[0] === undefined ? this.types : arguments[0];

            var evaluation = orbs.evaluate(this.orbs, this.height, this.width, this.matches, dropOptions);

            var _evaluation = _slicedToArray(evaluation, 2);

            var newOrbs = _evaluation[0];
            var matchData = _evaluation[1];

            this.orbs = newOrbs;
            return matchData;
        }
    }, {
        key: 'needsShuffle',
        value: function needsShuffle() {
            return !this.hasPotentialMatch();
        }
    }, {
        key: 'hasPotentialMatch',
        value: function hasPotentialMatch() {
            return orbs.hasPotentialMatch(this.orbs);
        }
    }, {
        key: 'hasMatch',
        value: function hasMatch() {
            return Boolean(triples.find(this.orbs)[0]);
        }
    }, {
        key: 'swap',
        value: function swap(swapOrbs) {
            orbs.swap(this.orbs, swapOrbs);
        }
    }, {
        key: 'unmatch',
        value: function unmatch() {
            while (this.hasMatch()) {
                this.orbs = orbs.unmatch(this.orbs, this.height, this.width, this.matches[0]);
            }
        }
    }, {
        key: 'shuffle',
        value: function shuffle() {
            this.orbs = _.map(this.orbs, function (row) {
                return _.shuffle(row);
            });
            this.unmatch();
            if (this.needsShuffle()) {
                this.shuffle();
            };
        }
    }, {
        key: 'size',
        get: function get() {
            return [this.width, this.height];
        }
    }, {
        key: 'availableTypes',
        get: function get() {
            return _.uniq(_.flatten(this.orbs)).sort();
        }
    }, {
        key: 'triples',
        get: function get() {
            return triples.find(this.orbs);
        }
    }, {
        key: 'matches',
        get: function get() {
            return triples.combine(this.triples);
        }
    }]);

    return Board;
}();

;