const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface(fs.createReadStream('../credentials.txt'));

var credentials = [];

const chessLoginUrl = "https://chess.com/login";

const waitUntil = ['domcontentloaded', 'load', 'networkidle0', 'networkidle2'];

(async () => {

    console.log('Scraper Started...');

    const url = fs.readFileSync('../url.txt').toString();

    rl.on('line', (input) => {
        credentials.push(input);
    });

    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1920 / 2,
            height: 1080
        },
        headless: false
    })

    const page = await browser.newPage();

    await page.exposeFunction("extractMoves", (whiteMoves, blackMoves) => {

        console.log("WHITE MOVES", whiteMoves);
        console.log("BLACK MOVES", blackMoves);

    })

    await page.goto(chessLoginUrl);

    // await page.waitForNavigation({
    //     waitUntil: waitUntil
    // })
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

    await page.goto(url);

    await page.waitForNavigation({
        waitUntil: ['domcontentloaded']
    })

    await Wait(1000);

    await page.evaluate(() => {

        var whiteMoves = [];
        var blackMoves = [];

        var movesList = document.getElementsByClassName('vertical-move-list')[0].children;

        console.log(movesList);

        for (let i = 0; i < movesList.length; i++) {

            let whiteMove = movesList[i].querySelector('.white');
            let blackMove = movesList[i].querySelector('.black');

            if (whiteMove) {
                whiteMoves.push(whiteMove.innerText);
            }
            if (blackMove) {
                blackMoves.push(blackMove.innerText);
            }
        }

        window.extractMoves(whiteMoves, blackMoves);

    });

})();

const Wait = (time) => {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(null);
        }, time);

    });

}