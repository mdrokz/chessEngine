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
    childList: true,
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