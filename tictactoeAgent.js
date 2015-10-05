// Tic Tac Toe
var Agent = function () {

}

Agent.prototype.selectMove = function(board) {
    var freeCells = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) freeCells.push(i);
    }

    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

