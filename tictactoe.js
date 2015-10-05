// Tic Tac Toe
var GameBoard = function () {
    this.cells = [];

    this.cells.push(document.getElementById("1"));
    this.cells.push(document.getElementById("2"));
    this.cells.push(document.getElementById("3"));

    this.cells.push(document.getElementById("4"));
    this.cells.push(document.getElementById("5"));
    this.cells.push(document.getElementById("6"));

    this.cells.push(document.getElementById("7"));
    this.cells.push(document.getElementById("8"));
    this.cells.push(document.getElementById("9"));

    this.X = [];
    this.O = [];
    this.playerOne = true;
};

GameBoard.prototype.cellFree = function (cell) {
    if (this.X.indexOf(cell) < 0 && this.O.indexOf(cell) < 0) return true;
    else return false;
};

GameBoard.prototype.move = function (cell) {
    if (this.cellFree(cell)) {
        this.playerOne ? this.X.push(cell) : this.O.push(cell);
        var c = this.cells[cell - 1];
        c.className = this.playerOne ? "X" : "O";
        c.innerHTML = this.playerOne ? "X" : "O";
        this.playerOne = !this.playerOne;
    }
    return this.gameOver();
};

GameBoard.prototype.gameOver = function () {
    var Xwin = false;
    var Owin = false;
    var draw = false;
    if (this.X.length > 2) {
        for (var i = 0; i < this.X.length - 2; i++) {
            for (var j = i + 1; j < this.X.length - 1; j++) {
                for (var k = j + 1; k < this.X.length; k++) {
                    if (this.X[i] + this.X[j] + this.X[k] === 15) Xwin = true;
                }
            }
        }
    }
    if (this.O.length > 2) {
        for (var i = 0; i < this.O.length - 2; i++) {
            for (var j = i + 1; j < this.O.length - 1; j++) {
                for (var k = j + 1; k < this.O.length; k++) {
                    if (this.O[i] + this.O[j] + this.O[k] === 15) Owin = true;
                }
            }
        }
    }
    if (this.X.length + this.O.length === 9) draw = true;
    if (Xwin) return 1;
    if (Owin) return 2;
    if (draw) return 3;
    return 0;
};

GameBoard.prototype.reset = function () {
    for (var i = 0; i < this.cells.length; i++) {
        var c = this.cells[i];
        c.className = "";
        c.innerHTML = i + 1;
    }
    this.X = [];
    this.O = [];
    this.playerOne = true;
};

GameBoard.prototype.clone = function () {
    var gb = new GameBoard();
    for (var i = 0; i < this.X.length; i++) {
        gb.X.push(this.X[i]);
    }
    for (var i = 0; i < this.O.length; i++) {
        gb.O.push(this.O[i]);
    }
    gb.playerOne = this.playerOne;
    return gb;
};

GameBoard.prototype.playGame = function (pOne, pTwo) {
    var that = this;

    function loop() {
        if (that.playerOne) that.move(pOne.selectMove(that.clone()));
        else that.move(pTwo.selectMove(that.clone()));
        if (that.gameOver() === 0) {
            window.setTimeout(requestAnimationFrame, 300, loop);
        }
    }

    if (this.gameOver() === 0) {
        requestAnimationFrame(loop);
    }

};

window.onload = function () {

    var newGame = document.getElementById("New Game");

    var gb = new GameBoard();
    var playerOne = new Agent();
    var playerTwo = new Agent();

    newGame.onclick = function () {
        gb.reset();
        gb.playGame(playerOne, playerTwo);
    };


    gb.playGame(playerOne, playerTwo);

    console.log("Window loaded.");
};