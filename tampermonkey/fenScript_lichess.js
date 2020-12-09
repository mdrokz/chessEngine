// ==UserScript==
// @name          Li-Chess Fen Script Generator
// @namespace
// @description	  Generates Fen Script
// @include       https://lichess.org/*
// @version       0.0.2
// @grant         none
// ==/UserScript==
//





(function (jsfx) {
    'use strict';

    //jsfx.apiUrl = "http://localhost:44366";
    jsfx.apiUrl = "http://localhost:8001";

    jsfx.addJQuery =
        function addJQuery(callback) {
            var script = document.createElement("script");
            script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
            // script.addEventListener('load', function () {
            //     var script = document.createElement("script");
            //     // script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            //     document.body.appendChild(script);
            // }, false);
            document.body.appendChild(script);
        }
    // jsfx.addJQuery();

    jsfx.getPieceInitals =
        function getPieceInitals(piece) {
            if (piece && piece != '') {
                switch (piece) {
                    case 'white pawn':
                        return 'P';
                    case 'white rook':
                        return 'R';
                    case 'white knight':
                        return 'N';
                    case 'white bishop':
                        return 'B';
                    case 'white queen':
                        return 'Q';
                    case 'white king':
                        return 'K';


                        // ---------------------

                    case 'black pawn':
                        return 'p';
                    case 'black rook':
                        return 'r';
                    case 'black knight':
                        return 'n';
                    case 'black bishop':
                        return 'b';
                    case 'black queen':
                        return 'q';
                    case 'black king':
                        return 'k';

                    default:
                        return '1';
                }
            } else {
                return '1';
            }
        }

    jsfx.replaceAt =
        function replaceAt(str, index, replacement) {
            if (index >= str.length) {
                return str.valueOf();
            }
            return str.substring(0, index) + replacement + str.substring(index + 1);
        }

    jsfx.genFenScript = function () {
        // var list = ["piece wr square-11", "piece wn square-21", "piece wb square-31", "piece wq square-41", "piece wk square-51", "piece wb square-61", "piece wn square-63", "piece wr square-81", "piece wp square-12", "piece wp square-22", "piece wp square-32", "piece wp square-52", "piece wp square-62", "piece wp square-72", "piece wp square-82", "piece bq square-66", "piece bp square-17", "piece bp square-27", "piece bp square-37", "piece bp square-47", "piece bp square-77", "piece bp square-87", "piece br square-18", "piece bn square-28", "piece bb square-38", "piece bk square-58", "piece bb square-68", "piece bn square-78", "piece br square-88"];
        var chessBoard = null;
        var sqWidth = 0;
        var sqHeight = 0;
        // ----------
        var squares = document.querySelector('cg-board').querySelectorAll('piece');
        sqWidth = squares[0].clientWidth;
        sqHeight = squares[0].clientHeight;
        var list = [];

        {
            chessBoard = new Array(8);

            for (var i = 1; i <= 8; i++) {
                chessBoard[i] = new Array(8);
            }

            squares.forEach(f => {
                // console.log(f.className);
                // list.push(f.className);
                var sq = f.cgKey;
                var piece = f.cgPiece;
                var i = 0;
                var j = 0;
                if (piece && piece != '' && piece != 'ghost') {
                    switch (sq[0]) {
                        case 'a':
                            i = 8;
                            break;

                        case 'b':
                            i = 7;
                            break;

                        case 'c':
                            i = 6;
                            break;

                        case 'd':
                            i = 5;
                            break;

                        case 'e':
                            i = 4;
                            break;

                        case 'f':
                            i = 3;
                            break;

                        case 'g':
                            i = 2;
                            break;

                        case 'h':
                            i = 1;
                            break;
                    }
                    j = sq[1];

                    chessBoard[j][i] = piece;
                }
            });

            // list.forEach(f => {
            //     // var className = 'piece bq square-53';
            //     var className = f;
            //     var regexp = /square-\d\d/;

            //     var match = className.match(regexp);
            //     if (match[0] && match[0] != '') {
            //         var sqMatch = match[0].match(/\d\d/);
            //         if (sqMatch[0] && sqMatch[0] != '') {
            //             var sqNum = sqMatch[0];
            //         }
            //     }

            //     var p = className.match(/\s..\s/);
            //     if (p[0] && p[0] != '') {
            //         var piece = p[0].trim();
            //     }

            //     // console.log(sqNum);

            //     chessBoard[sqNum[1]][sqNum[0]] = piece;
            // })

            var strFen = '';
            for (var l = 8; l >= 1; l--) {
                for (var m = 8; m >= 1; m--) {
                    var p = jsfx.getPieceInitals(chessBoard[l][m]);
                    if (p) {
                        strFen += p;
                    }
                }
                if (l > 1) {
                    strFen += '/';
                }
            }


            var x = strFen.split('/');
            var y = [];
            x.forEach(f => {
                var newFen = '';
                var occ = 0;
                for (var a = 0; a < 8; a++) {
                    if (f[a] == '1') {
                        // console.log(f)
                        occ += 1;
                        if (occ > 1) {
                            var pos = newFen.length - 1;
                            newFen = jsfx.replaceAt(newFen, pos, occ);
                            // console.log(newFen)
                        } else {
                            newFen += f[a];
                        }
                    } else {
                        occ = 0;
                        newFen += f[a];
                    }
                }
                y.push(newFen);
            });


            var fen = y.join('/');
            // console.log(fen);
            // ----------------------------------------------------------------------------------------------------------------------------------
            // ----------------------------------------------------------------------------------------------------------------------------------
            var lastMoves = document.querySelector('cg-board').querySelectorAll('square');

            var didWkMove = false;
            var didBkMove = false;
            var lastWkPos = '';
            var lastBkPos = '';

            var moves = document.querySelectorAll('u8t');
            moves.forEach((m, key) => {
                var pos = m.textContent;
                if (pos == 'O-O' || pos == 'O-O-O') {
                    if (key % 2 == 0) {
                        didWkMove = true;
                    } else {
                        didBkMove = true;
                    }
                }
                if (!didWkMove && (key % 2 == 0)) {
                    if (pos.includes('K')) {
                        didWkMove = true;
                    }
                }
                if (!didBkMove && (key % 2 == 1)) {
                    if (pos.includes('K')) {
                        didBkMove = true;
                    }
                }
            });

            var castle = 'KQkq'

            if (!didWkMove && !didBkMove) {
                castle = 'KQkq';
            } else if (didWkMove && !didBkMove) {
                castle = 'kq';
            } else if (!didWkMove && didBkMove) {
                castle = 'KQ';
            } else if (didWkMove && didBkMove) {
                castle = '-';
            }
            // ------------------------------------------------------------------------------------------------------------------------------------------------
            var nextMove = '';
            var movesLength = moves.length;
            if (movesLength % 2 == 0) {
                nextMove = 'w';
            } else {
                nextMove = 'b';
            }
            // ------------------------------------------------------------------------------------------------------------------------------------------------
            var movesIndex = document.querySelectorAll('i5z');
            var movesPlayed = movesIndex.length;

            // ------------------------------------------------------------------------

            var cmdFen = `position fen ${fen} ${nextMove} ${castle} - 0 ${movesPlayed} moves \n`;
            // "r1bqkb1r/pp2pppp/2n5/3N4/8/4Q3/PPP2PPP/R1B1KBNR b KQkq - 0 7",
            // p.stdin.write(`position fen ${fen} ${nextMove} ${castle} - 0 ${movesPlayed} moves \n`)
            // p.stdin.write("go depth 21 \n")
            // console.log(cmdFen);
        }

        jsfx.apiSuccess = function (response) {
            // console.log(response);
            var divLines = $('.chessLines')[0];
            if (divLines) {
                // $(divLines).text(this.responseText);
                // $(divLines).html(this.responseText);
                divLines.innerText = response;
            }
        }

        var data = JSON.stringify({
            "FenString": cmdFen,
            "Depth": 15,
            "MultiPv": 5,
            "WaitTime": 3
        });

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                jsfx.apiSuccess(this.responseText);
            }
        });

        xhr.open("POST", jsfx.apiUrl + "/api/uci/GetBestMoves");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);
    }

    setTimeout(() => {
        var mainDiv = document.createElement('div');
        mainDiv.id = "mainDiv";
        mainDiv.style = "width: 10px; position: absolute; right: 50px; bottom: 10px; background-color: rgb(39 37 34);";
        // ----------------------------------------------------------------------------------------------------------------------------------
        var btnHint = document.createElement('button');
        btnHint.className = 'ui_v5-button-component ui_v5-button-basic ui_v5-button-small board-main-control-button-button';
        btnHint.style.width = '10px';
        btnHint.onclick = function onHintClick(e) {
            jsfx.genFenScript();
        };
        var btnBar = document.getElementsByClassName('main-controls-component')[0];
        if (btnBar) {
            btnBar.appendChild(btnHint);
        }
        // document.body.appendChild(btnHint);
        mainDiv.append(btnHint);
        // ----------------------------------------------------------------------------------------------------------------------------------
        var divLines = document.createElement('div');
        divLines.className = 'chessLines';
        divLines.style = "color: aliceblue;";
        // document.body.appendChild(divLines);
        mainDiv.append(divLines);
        // ----------------------------------------------------------------------------------------------------------------------------------
        var btnCollapse = document.createElement('button');
        btnCollapse.onclick = function (e) {
            var mDiv = $('#mainDiv')[0];
            var dl = $('.chessLines')[0];
            if (mDiv) {
                if (mDiv.offsetWidth < 100) {
                    $(mDiv).css("width", "800px");
                    if (dl) {
                        $(dl).css('display', 'block');
                    }
                } else {
                    $(mDiv).css("width", "20px");
                    if (dl) {
                        $(dl).css('display', 'none');
                    }
                }
            }
        };
        mainDiv.append(btnCollapse);
        // ----------------------------------------------------------------------------------------------------------------------------------

        document.body.appendChild(mainDiv);
    }, 3000);

})(this.jsfx = {});




// function jqeuryAjaxCall() {
//     var settings = {
//         "url": "http://localhost:8001/api/uci/GetBestMoves",
//         "method": "POST",
//         "timeout": 0,
//         "headers": {
//             "Content-Type": "application/json"
//         },
//         "data": JSON.stringify({
//             "FenString": cmdFen,
//             "Depth": 15,
//             "MultiPv": 5
//         }),
//     };

//     var ajax = $.ajax(settings);
//     ajax.done = function (response) {
//         debugger;
//         console.log(response);
//     }
// }