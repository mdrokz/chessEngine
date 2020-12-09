// ==UserScript==
// @name          Chess Fen Script Generator
// @namespace
// @description	  Generates Fen Script
// @include       https://www.chess.com/*
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
    jsfx.addJQuery();

    jsfx.getPieceInitals =
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

        var squares = document.getElementsByClassName('board')[0].querySelectorAll('.piece');
        var list = [];
        squares.forEach(f => {
            // console.log(f.className);
            list.push(f.className);
        });
        // console.log(list);



        {
            chessBoard = new Array(8);

            for (var i = 1; i <= 8; i++) {
                chessBoard[i] = new Array(8);
            }

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
            for (var l = 8; l >= 1; l--) {
                for (var m = 1; m <= 8; m++) {
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
            var vmlElement = document.getElementsByClassName('vertical-move-list')[0];
            var movesList = vmlElement.children;
            var nextMove = '';
            var castle = 'KQkq'
            var isWhiteCastle = true;
            var isBlackCastle = true;
            var movesPlayed = movesList.length;

            for (let i = 0; i < movesList.length; i++) {

                let whiteMove = movesList[i].querySelector('.white');
                let blackMove = movesList[i].querySelector('.black');

                if (whiteMove) {
                    let move;
                    let piece = false;

                    if (whiteMove.children[0]) {
                        move = whiteMove.children[0].attributes[0].value;
                        piece = move.includes('rook') || move.includes('king')
                    }

                    if (whiteMove.innerText == 'O-O') {
                        if (isBlackCastle) {
                            castle = 'kq'
                            isWhiteCastle = false;
                        } else {
                            castle = '-'
                        }
                    } else if (whiteMove.innerText == 'O-O-O') {
                        if (isBlackCastle) {
                            castle = 'kq'
                            isWhiteCastle = false;
                        } else {
                            castle = '-'
                        }
                    } else if (piece) {
                        if (isBlackCastle) {
                            castle = 'kq'
                            isWhiteCastle = false;
                        } else {
                            castle = '-'
                        }
                    }
                }

                if (blackMove) {

                    let move;
                    let piece = false;

                    if (blackMove.children[0]) {
                        move = blackMove.children[0].attributes[0].value;
                        piece = move.includes('rook') || move.includes('king')
                    }

                    if (blackMove.innerText == 'O-O') {
                        if (isWhiteCastle) {
                            castle = 'KQ'
                            isBlackCastle = false;
                        } else {
                            castle = '-'
                        }
                    } else if (blackMove.innerText == 'O-O-O') {
                        if (isWhiteCastle) {
                            castle = 'KQ'
                            isBlackCastle = false;
                        } else {
                            castle = '-'
                        }
                    } else if (piece) {
                        if (isWhiteCastle) {
                            castle = 'KQ'
                            isBlackCastle = false;
                        } else {
                            castle = '-'
                        }
                    }
                }

                if (i <= movesList.length) {

                    if (whiteMove) {
                        nextMove = 'b'
                    }

                    if (blackMove) {
                        nextMove = 'w'
                    }
                }

            }

            var cmdFen = `position fen ${fen} ${nextMove} ${castle} - 0 ${movesPlayed} moves \n`;
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