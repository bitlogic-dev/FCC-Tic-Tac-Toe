$(document).ready(function() {
	var boxes = document.getElementsByClassName('box');
	var state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	var game = true;
	var human = false;
	var computer = true;
	var humMark;
	var humVal = -1;
	var compMark;
	var compVal = 1;
	var winMatrix = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	function reset() {
		for (var i = 0; i < boxes.length; i++) {
			boxes[i].innerHTML = '';
			state[i] = 0;
		}
		addListeners();
		game = true;
	}



	function checkForWin(board, player) {

		var value = player == computer ? compVal : humVal;

		for (var i = 0; i < 8; i++) {
			var win = true;
			for (var j = 0; j < 3; j++) {
				if (board[winMatrix[i][j]] != value) {
					win = false;
					break;
				}
			}

			if (win) {
				return true;
			}
		}
		return false;
	}

	function checkForTie(board) {
		// test if tie
		for (var i = 0; i < board.length; i++) {
			if (board[i] === 0) {
				return false;
			}
		}
		return true;
	}

	function set(index, player) {
		var playerVal = player == computer ? compVal : humVal;
		var playerMark = playerVal == 1 ? compMark : humMark;

		if (!game)
			return;

		if (state[index] === 0) {
			state[index] = playerVal;
			boxes[index].innerHTML = playerMark;
			if (checkForWin(state, player)) {
				game = false;
				window.setTimeout(reset, 1000);
			} else if (checkForTie(state)) {
				game = false;
				window.setTimeout(reset, 1000);
			}
		}
	}

	// negamax function.
	function negamax(board, depth, isMax) {
		if (checkForWin(board, !isMax))
			return -10 + depth;

		if (checkForTie(board))
			return 0;

		var mark = isMax == computer ? compVal : humVal;
		var max = -1000;
		var index = 0;

		for (var i = 0; i < 9; i++) {
			if (board[i] === 0) {
				var childBoard = board.slice();
				childBoard[i] = mark;

				var moveVal = -negamax(childBoard, depth + 1, !isMax);

				if (moveVal > max) {
					max = moveVal;
					index = i;
				}
			}
		}

		if (depth === 0) {
			set(index, computer);
		}

		return max;
	}

	function compAI() {
		//console.log('compAI fired');
		negamax(state, 0, computer);
	}

	function mark() {
		var id = this.id;
		if (!game)
			return;
		if (state[id] === 0) {
			set(id, human);
			compAI();
		}
	}

	function addListeners() {
		for(var i = 0; i < boxes.length; i++) {
			boxes[i].addEventListener('click', mark, true);
		}
	}

	$('#restart').hide();
	$('#dialog').dialog({
		autoOpen: false,
		height: 310,
		width: 310,
		position: {
			my: 'center',
			at: 'center',
			of: '#main'
		},
		buttons: [{
			text: 'X',
			click: function() {
				humMark = 'X';
				compMark = 'O';
				$(this).dialog('close');
			}
		}, {
			text: 'O',
			click: function() {
				humMark = 'O';
				compMark = 'X';
				$(this).dialog('close');
			}
		}]
	});

	$('#play').on('click', function() {
		addListeners();
		$('#play').hide();
		$('#restart').show();
		$('#dialog').dialog('open');
	});

	$('#restart').on('click', function() {
		reset();
		$('#play').show();
		$('#restart').hide();
	});

});
