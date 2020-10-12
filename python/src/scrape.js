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

return [whiteMoves,blackMoves]