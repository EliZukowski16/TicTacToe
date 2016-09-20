/**
 * 
 */

$(document).ready(function() {
	$("#submit").click(function() {
		var board = new Board();
		board.populateBoard();
	})
})

function Board() {
	var gameBoard;
	var winner;
	var movesLeft;
	var endState = false;
	var gameScore;

	this.setWinner = function(_winner) {
		winner = _winner;
	}

	this.getWinner = function() {
		return winner;
	}

	this.setMovesLeft = function(_movesLeft) {
		movesLeft = _movesLeft;
	}

	this.getMovesLeft = function() {
		return movesLeft;
	}

	this.setBoard = function(_gameBoard) {
		gameBoard = _gameBoard;
	}

	this.getBoard = function() {
		return gameBoard;
	}

	this.setEndState = function(_endState) {
		endState = _endState;
	}

	this.getEndState = function() {
		return endState;
	}

	this.setGameScore = function(_gameScore) {
		gameScore = _gameScore;
	}

	this.getGameScore = function() {
		return gameScore;
	}

	this.populateBoard = function() {
		this.setEndState(false)
		this.setGameScore(0);
		var gameBoard = []
		var openSquares = 0;
		for (i = 0; i < 3; i++) {
			gameBoard[i] = []
			for (j = 0; j < 3; j++) {

				if ($("#square_" + i + "_" + j).val().toUpperCase() == "X" || $("#square_" + i + "_" + j).val().toUpperCase() == "O") {
					sq = new Square($("#square_" + i + "_" + j).val().toUpperCase(), $("#square_" + i + "_" + j).attr("readonly"))
				}
				else {
					sq = new Square("", $("#square_" + i + "_" + j).attr("readonly"))
				}
				
				if (sq.getState() != "readonly") {
					if (sq.getValue() != "" && sq.getValue().toUpperCase() != "X") {
						$("#errorMessage").text(sq.getValue() + " is not a valid move");
						return false;
					}
				}
				if (sq.getValue() == "") {
					openSquares++;
//					console.log("Open Squares " + openSquares)
				}

				gameBoard[i][j] = sq;
//				console.log("Game Board Value " + gameBoard[i][j].getValue() + " at" + " " + i + " " + j)
			}
		}

		this.setBoard(gameBoard)
		this.setMovesLeft(openSquares)
//		console.log("Moves Left " + this.getMovesLeft())

		this.playGames(this);

		return true;
	}

	this.checkRows = function(board) {
//		console.log("Checking Rows")

		for (var i = 0; i < 3; i++) {
			var rowValues = new Array(3)
			for (var j = 0; j < 3; j++) {
				var sq = board.getBoard()[i][j]
				rowValues[j] = sq.getValue();
//				console.log("Row Values for row " + i + " position : " + rowValues[j])
			}
			if (rowValues[0] == "X" || rowValues[0] == "O") {
				if (rowValues[0] == rowValues[1] && rowValues[1] == rowValues[2]) {
					console.log("Found end state: rows")
					rowValues[0] == "X" ? board.setWinner("X") : board.setWinner("O");
					board.getWinner == "X" ? board.setGameScore(-1) : board.setGameScore(1);
					board.setEndState(true)
				}
			}
		}
		return board;

	}

	this.checkColumns = function(board) {
//		console.log("Checking Columns")
		for (var i = 0; i < 3; i++) {
			var colValues = new Array(3)
			for (var j = 0; j < 3; j++) {
				var sq = board.getBoard()[j][i];
				colValues[j] = sq.getValue()
//				console.log("Col Values for col " + i + " position: " + colValues[j])
			}
			if (colValues[0] == "X" || colValues[0] == "O") {
				if (colValues[0] == colValues[1] && colValues[1] == colValues[2]) {
					console.log("Found end state: cols")
					colValues[0] == "X" ? board.setWinner("X") : board.setWinner("O");
					board.getWinner == "X" ? board.setGameScore(-1) : board.setGameScore(1);
					board.setEndState(true)
				}
			}
		}
		return board;
	}

	this.checkDiagonals = function(board) {
//		console.log("Checking diagonals")
		var diagValuesForward = new Array(3)
		var diagValuesBackward = new Array(3)
		
		for (var i = 0; i < 3; i++) {
			diagValuesForward[i] = board.getBoard()[i][i].getValue()
			diagValuesBackward[i] = board.getBoard()[(2 - i)][i].getValue()
//			console.log("Diag values Forward at " + i + " " + i + " " + diagValuesForward[i]);
			console.log("Diag values Backward at " + (2 - Number(i)) + " " + i + " " + diagValuesBackward[i]);

			if (diagValuesForward[0] == "X" || diagValuesForward[0] == "O") {
				if (diagValuesForward[0] == diagValuesForward[1] && diagValuesForward[1] == diagValuesForward[2]) {
					console.log("Found end state: diagFor")
					diagValuesForward[0] == "X" ? board.setWinner("X") : board.setWinner("O");
					board.getWinner == "X" ? board.setGameScore(-1) : board.setGameScore(1);
					board.setEndState(true)
				}
			}
			if (diagValuesBackward[0] == "X" || diagValuesBackward[0] == "O") {
				if (diagValuesBackward[0] == diagValuesBackward[1] && diagValuesBackward[1] == diagValuesBackward[2]) {
					console.log("Found end state: diagBack")
					diagValuesBackward[0] == "X" ? board.setWinner("X") : board.setWinner("O");
					board.getWinner == "X" ? board.setGameScore(-1) : board.setGameScore(1);
					board.setEndState(true)
				}
			}
		}
		
		return board;
	}

	this.checkWinner = function(board) {
		console.log("Checking if winner found")
		board = board.checkRows(board);
		board = board.checkColumns(board);
		board = board.checkDiagonals(board);

		if ((board.getEndState() == false) && (board.getMovesLeft() == 0)) {
			board.setEndState(true);
			board.setGameScore(0);
		}
		return board;
	}

	this.playGames = function(board) {
		console.log("Playing game with " + board)
		var boardSums = []
		for (var i = 0; i < 3; i++) {
			boardSums[i] = []
			for (var j = 0; j < 3; j++) {
				if (board.getBoard()[i][j].getValue() == "X" || board.getBoard()[i][j].getValue() == "O") {
					boardSums[i][j] = -1000;
				} else {
					boardSums[i][j] = 0;
				}
//				console.log("Initial board sums " + boardSums[i][j])
			}
		}

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (board.getBoard()[i][j].getValue() == "") {
					var playBoard = board.getBoard();
					playBoard[i][j].setValue("O");
//					console.log(playBoard[i][j])
					board.setBoard(playBoard);


					boardSums[i][j] = board.playTurn(board, "X", 1)
					console.log(boardSums)
//					console.log(playBoard)
//					console.log(i)
//					console.log(j)
//					console.log(playBoard[i][j].getValue())
					playBoard[i][j].setValue("");
					board.setBoard(playBoard)
				}
			}
		}

		var bestMove = this.chooseMove(boardSums);

		var playBoard = board.getBoard();
		playBoard[bestMove[0]][bestMove[1]].setValue = "X";
		board.setBoard(playBoard);

		return board;

	}

	this.chooseMove = function(boardSums) {
		var bestMove = -999;
		var bestMoveXY = []
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (boardSums[i][j] > bestMove) {
					bestMoveXY[0] = i;
					bestMoveXY[1] = i;
				}
			}
		}

		return bestMoveXY;
	}

	this.playTurn = function(board, player, movesTaken) {
//		console.log("Play Turn board " + board.getBoard())
//		console.log("Play Turn player " + player)
		var score = 0;
		board.setMovesLeft(board.getMovesLeft() - movesTaken)
		board = board.checkWinner(board);
		board.printBoard(board)
//		console.log("Board end state " + board.getEndState())
		if (board.getEndState()) {
//			console.log("Reached end")
			return (score + board.getGameScore());
		} else {
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
//					console.log("Checking cell " + i + " " + j)
					if (board.getBoard()[i][j].getValue() === "" || board.getBoard()[i][j].getValue() === undefined) {
//						console.log("Found empty square")
						var nextMove = new Board();
						var moveBoard = board.getBoard();

						moveBoard[i][j].setValue(player);
						nextMove.setBoard(moveBoard);
						var otherPlayer;
						player == "X" ? otherPlayer = "O" : otherPlayer = "X";
						movesTaken++
						score = score + nextMove.playTurn(nextMove, otherPlayer, movesTaken);
						console.log("Current score " + score)
						moveBoard[i][j].setValue("");
						nextMove.setBoard(moveBoard);
						movesTaken--
					}
				}
			}
		}
		console.log("Score " + score)
		return score;
	}

	this.printBoard = function(board) {
		console.log("Printing Board")
		for (var i = 0; i < 3; i++) {
			var row = "";
			for (var j = 0; j < 3; j++) {
				row = row + (board.getBoard()[i][j].getValue() == "" ? " ": board.getBoard()[i][j].getValue());
			}
			console.log(row)
		}
	}

}



function Square(sqValue, readOnly) {
	this.sqValue = sqValue;
	this.readOnly = readOnly;

	this.setValue = function(_sqValue) {
		sqValue = _sqValue;
	}

	this.getValue = function() {
		return sqValue;
	}

	this.getState = function() {
		return readOnly;
	}

	this.setState = function(_readOnly) {
		readOnly = _readOnly;
	}
}