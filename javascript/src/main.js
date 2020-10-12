// Deps
const puppeteer = require('puppeteer');

// STD
const readline = require('readline');
const fs = require('fs');
const cp = require('child_process')

// FFI
const ffi = require('ffi');
const ref = require('ref');
const refArray = require('ref-array');

// modules
const getFenString = require('./chessFenScript');
const {
    stdin
} = require('process');

const rl = readline.createInterface(fs.createReadStream('./credentials.txt'));

var credentials = [];

const chessLoginUrl = "https://chess.com/login";

const waitUntil = ['domcontentloaded', 'load', 'networkidle0', 'networkidle2'];

(async () => {
    // var CArray = refArray('string')

    // var main = ffi.Library('../src/libmain', {
    //     'getFenString': ['void', [CArray]]
    // })

    console.log('Scraper Started...');

    const url = fs.readFileSync('./url.txt').toString();

    rl.on('line', (input) => {
        credentials.push(input);
    });

    let stockfishEngine = "";

    if(process.platform == 'win32') {
        stockfishEngine = "stockfish_20090216_x64.exe"
    } else {
        stockfishEngine = "./stockfish"
    }

    const p = cp.spawn(stockfishEngine, {
        shell: true,
    });

    p.stdout.on('data', (data) => {
        let line = data.toString();
        console.log(data.toString());
    })


    p.stdin.write("uci\n");

    p.stdin.write("ucinewgame\n");

    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1920 / 2,
            height: 1080
        },
        headless: false
    })

    const page = await browser.newPage();

    await page.exposeFunction("extractMoves", (movesPlayed, nextMove, castle, board) => {
        console.log("Moves Played:", movesPlayed, nextMove)
        let fen = getFenString(board);
        let cmd = `position fen ${fen} ${nextMove} ${castle} - 0 ${movesPlayed} moves \n`
        console.log(cmd)
        p.stdin.write(cmd);
        p.stdin.write("go depth 21 \n")
    });

    await page.goto(chessLoginUrl);

    await Wait(2000);

    let username = credentials[0];
    let password = credentials[1];

    let usernameInput = await page.$x('//*[@id="username"]');

    let passwordInput = await page.$x('//*[@id="password"]');

    let submitButton = await page.$x('//*[@id="login"]');

    await usernameInput[0].type(username, 800);
    await passwordInput[0].type(password, 800);
    await submitButton[0].click();

    await page.waitForNavigation({
        waitUntil: ['domcontentloaded']
    })

    page.goto(url);

    await page.waitForNavigation({
        waitUntil: ['domcontentloaded']
    })

    await Wait(2000);

    await page.evaluate(() => {

        function Scrape() {

            var movesList = document.getElementsByClassName('vertical-move-list')[0].children;
            var nextMove = '';
            var castle = 'KQkq'
            var isWhiteCastle = true;
            var isBlackCastle = true;

            for (let i = 0; i < movesList.length; i++) {

                let whiteMove = movesList[i].querySelector('.white');
                let blackMove = movesList[i].querySelector('.black');

                if (whiteMove) {
                    if (whiteMove.innerText == 'O-O') {
                        if (isBlackCastle) {
                            castle = 'kq'
                            isWhiteCastle = false;
                        } else {
                            castle = '-'
                        }
                    }
                }

                if (blackMove) {

                    if (blackMove.innerText == 'O-O') {
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

                        if (whiteMove.innerText == 'O-O') {
                            castle = 'kq'
                        }
                    }

                    if (blackMove) {
                        nextMove = 'w'

                        if (blackMove.innerText == 'O-O') {
                            castle = 'KQ'
                        }
                    }
                }

            }

            var squares = document.getElementsByClassName('board')[0].querySelectorAll('.piece');
            console.log(squares);
            var list = [];
            squares.forEach(f => {
                // console.log(f.className);
                list.push(f.className);
            });
            window.extractMoves(movesList.length, nextMove, castle, list);
        }

        Scrape()

        const targetNode = document.getElementsByClassName('vertical-move-list')[0]

        // Options for the observer (which mutations to observe)
        const config = {
            attributes: true,
            childList: true,
            subtree: true
        };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            Scrape()
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    });

    // p.stdin.end();

})();


const Wait = (time) => {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(null);
        }, time);

    });

}