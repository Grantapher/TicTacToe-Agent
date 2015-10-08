// Tic Tac Toe
/* 
var Agent = function () {}

Agent.prototype.selectMove = function(board) {
    var freeCells = [];
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) freeCells.push(i);
    }

    return freeCells[Math.floor(Math.random() * freeCells.length)];
}
*/

var Agent = function() {
	this.corners = [8, 6, 4, 2];
	this.sides = [1, 3, 7, 9];
	this.center = [5];
	this.oppositeCorners = {
		8:2,
		6:4,
		4:6,
		2:8
	};

};

Agent.prototype.selectMove = function(board) {
	var playerLetter = this.getPlayerLetter(board);
	var myCells = playerLetter == "X" ? board.X : board.O;
	var theirCells = playerLetter == "X" ? board.O : board.X;
	var choice = -1;

	// Win
	choice = this.findWinningCell(board, myCells);
	if(choice > 0) return choice;
	
	// Block
	choice = this.findWinningCell(board, theirCells);
	if(choice > 0) return choice;

	// Block Fork
	choice = this.findForkBlock(board, theirCells, myCells);
	if(choice > 0) return choice;

	// Center
	choice = this.chooseAnyIfFree(board, this.center);
	if(choice > 0) return choice;

	// Opposite Corner
	choice = this.chooseOppositeCorner(board, theirCells);
	if(choice > 0) return choice;

	// Random Corner
	choice = this.chooseAnyIfFree(board, this.corners);
	if(choice > 0) return choice;

	// Random Side
	choice = this.chooseAnyIfFree(board, this.sides);
	if(choice > 0) return choice;

	console.log("AssertionError: all cells are full but the game has not ended.");
	return -1;
}

Agent.prototype.getPlayerLetter = function(board) {
	var freeCellCount = 0;
    for (var i = 1; i < 10; i++) {
		if(board.cellFree(i)) {
			freeCellCount++;
		}
	}
	return freeCellCount % 2 == 1 ? "X" : "O";
}

Agent.prototype.findWinningCell = function(board, playerCells) {
	for(var i = 0; i < playerCells.length; i++) {
		for(var j = i + 1; j < playerCells.length; j++) {
			var cellToWin = 15 - (playerCells[i] + playerCells[j]);
			if(board.cellFree(cellToWin) && 0 < cellToWin && cellToWin < 10){
				return cellToWin;
			}
		}
	}
	return -1;
}

Agent.prototype.findForkBlock = function(board, theirCells, myCells) {

	// Corner Overload Fork
	// Looks for this scenario in all 4 rotations
	//
	//	|     |     |  X  |  X  | OX  |
	//	| X   | XO  | XO  | XO  | XO  |
	//	|     |     |     |  ^  |     |
	//
	// Makes sure to plug this fork

	var cornerOverloads = {
		3:[9, 1],
		1:[3, 7],
		7:[1, 9],
		9:[7, 3]
	};
	
	var overloadChoices = {
		"13":8,
		"17":6,
		"39":4,
		"79":2
	}
	
	for(var i = 0; i < theirCells.length; i++) {
		var firstCell = theirCells[i];
		var options = cornerOverloads[firstCell];
		if(undefined != options) {
			//firstCell is a side, check if an adjacent side is filled by opponent
			for(var j = 0; j < options.length; j++) {
				var item = options[j];
				var index = theirCells.indexOf(item);
				if(index >= 0) {
					//corner is overloaded, fill the corner if possible
					var secondCell = theirCells[index];
					var overloadString = [firstCell, secondCell].sort().join();
					var overloadCorner = overloadChoices[overloadString];
					if(board.cellFree(overloadCorner)) {
						return overloadCorner;
					}
				}
			}
		}
	}

	// Opposite Corners Fork
	// Looks for this scenario in both rotations
	//
	//	|     |     |   X |   X |
	//	|     |  O  |  O  |  O  |
	//	| X   | X   | X^  | XO  |
	//
	// Makes sure to plug this fork by picking any side
	
	for(var i = 0; i < theirCells.length; i++) {
		var firstCell = theirCells[i];
		var oppositeCorner = this.oppositeCorners[firstCell];
		if(undefined != oppositeCorner 
				&& theirCells.indexOf(oppositeCorner) >= 0 
				&& myCells.indexOf(5) >= 0) {
			return this.chooseAnyIfFree(board, this.sides);
		}
	}
	
	return -1;
}

Agent.prototype.chooseAnyIfFree = function (board, cellChoices) {
	var freeCells = [];
	
	for(var i = 0; i < cellChoices.length; i++) {
		var choice = cellChoices[i];
		if(board.cellFree(choice)) {
			freeCells.push(choice);
		}
	}
    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

Agent.prototype.chooseOppositeCorner = function(board, theirCells) {
	for(var i = 0; i < theirCells.length; i++) {
		var cell = theirCells[i];
		var opposite = this.oppositeCorners[cell];
		if(undefined != opposite && board.cellFree(opposite)) {
			return opposite;
		}
	}
	return -1;
}