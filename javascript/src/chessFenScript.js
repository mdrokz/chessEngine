// ==UserScript==
// @name         Chess.com 'Computer Analysis' button
// @version      1.1
// @description  Order a computer analysis directly from the Live Chess page
// @author       Lars Petrus
// @match        https://www.chess.com/live/game/*
// @namespace https://greasyfork.org/users/10616
// ==/UserScript==

// debugger;
// go_analyze = function () {
//     var gameId = window.location.href.split("=").pop();
//     window.location.href = "http://www.chess.com/home/computer_analysis_redirect?live_id=" + gameId;
// }

// $("body").append("<button class='button-submit' onclick='go_analyze();' style='position:fixed; left: 200px; top:5px; font-size:10px; z-index: 9;'>Computer Analysis</button>");

// var list = ['piece wr square-11',
//     'piece wk square-71',
//     'piece wr square-62',
//     'piece wp square-13',
//     'piece wp square-33',
//     'piece bq square-53',
//     'piece wn square-63',
//     'piece bn square-73',
//     'piece bp square-83',
//     'piece wp square-24',
//     'piece wb square-54',
//     'piece bk square-85',
//     'piece bp square-26',
//     'piece bp square-46',
//     'piece wq square-76',
//     'piece bp square-17',
//     'piece bp square-37'
// ];

var chessBoard = new Array(8);

for (var i = 1; i <= 8; i++) {
    chessBoard[i] = new Array(8);
}

// getFenString(list);

function getFenString(list) {
    list.forEach(f => {
        // var className = 'piece bq square-53';
        var className = f;
        var regexp = /square-\d\d/;

        var match = className.match(regexp);
        if (match[0] && match[0] != '') {
            var sqMatch = match[0].match(/\d\d/);
            if (sqMatch[0] && sqMatch[0] != '') {
                var sqNum = sqMatch[0];
            }
        }

        var p = className.match(/\s..\s/);
        if (p[0] && p[0] != '') {
            var piece = p[0].trim();
        }

        // console.log(sqNum);

        chessBoard[sqNum[1]][sqNum[0]] = piece;
    })

    var strFen = '';
    for (var i = 8; i >= 1; i--) {
        for (var j = 1; j <= 8; j++) {
            var p = getPieceInitals(chessBoard[i][j]);
            if (p) {
                strFen += p;
            }
        }
        if (i > 1) {
            strFen += '/';
        }
    }


    var x = strFen.split('/');
    var y = [];
    x.forEach(f => {
        var newFen = '';
        var occ = 0;
        for (var i = 0; i < 8; i++) {
            if (f[i] == '1') {
                // console.log(f)
                occ += 1;
                if (occ > 1) {
                    var pos = newFen.length - 1;
                    newFen = replaceAt(newFen, pos, occ);
                    // console.log(newFen)
                } else {
                    newFen += f[i];
                }
            } else {
                occ = 0;
                newFen += f[i];
            }
        }
        y.push(newFen);
    });


    var fen = y.join('/');

    // console.log(className);
    return fen;
}


function getPieceInitals(piece) {
    if (piece && piece != '') {
        switch (piece) {
            case 'wp':
                return 'P';
            case 'wr':
                return 'R';
            case 'wn':
                return 'N';
            case 'wb':
                return 'B';
            case 'wq':
                return 'Q';
            case 'wk':
                return 'K';


                // ---------------------

            case 'bp':
                return 'p';
            case 'br':
                return 'r';
            case 'bn':
                return 'n';
            case 'bb':
                return 'b';
            case 'bq':
                return 'q';
            case 'bk':
                return 'k';

            default:
                return '1';
        }
    } else {
        return '1';
    }
}

function replaceAt(str, index, replacement) {
    if (index >= str.length) {
        return str.valueOf();
    }
    return str.substring(0, index) + replacement + str.substring(index + 1);
}

module.exports = getFenString;