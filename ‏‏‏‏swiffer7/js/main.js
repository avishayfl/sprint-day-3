'use strict'
// update: saterday 23:00

const EMPTY = ' ';
const MINE = '🎇'
const FLAG = '🚩';

var gBoard;
var gInterval;
var firstCell;

var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);

    firstCell = true
    startGame();
   
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    var elStatus = document.querySelector('.status');
    elStatus.innerText = '😀 ENGOY YOUR GAME';

}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }

    randomMine(board)
    console.log(board);


   
    setMinesNegsCount(board);
    console.table(board);
    return board
}

function randomMine(board) {

    var numsMines = gLevel.mines

    while (numsMines > 0) {
        var i = getRandomInt(0, gLevel.size);
        var j = getRandomInt(0, gLevel.size);
        var rndCell = board[i][j]
        if (!rndCell.isMine) {
            rndCell.isMine = true;
            numsMines--

        }
    }
}

function expandShown(board, i, j) {
    
    var location = { i, j }
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
            if (i === location.i && j === location.j) continue
            var currCell = board[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.minesAroundCount !== 0) continue
            if (currCell.minesAroundCount === 0) {
                if (currCell.isShown) gGame.shownCount--
                currCell.isShown = true;
                gGame.shownCount++
                elCell.innerText = '0';
            }
        }
    }
}


function miensCounter(cellI, cellJ, board) {
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount
}


function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = board[i][j];
            var minesNum = miensCounter(i, j, board);
            currCell.minesAroundCount = minesNum;
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board.length; j++) {

            strHTML += `<td class="cell-${i}-${j}" 
            onclick="cellClick(this, ${i}, ${j})"
            oncontextmenu="cellMarked(this, ${i}, ${j}); return false;" ></td>`
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function cellClick(elCell, i, j) {
    var clickCell = gBoard[i][j];
    if (gGame.isOn) {

        if (firstCell) {
            gInterval = setInterval(timer, 1000);
            firstCell = false
            var elStatus = document.querySelector('.status');
            elStatus.innerText = '😫 I DON\'T WANT TO LOOK ';
        }
        if (!clickCell.isMine && !clickCell.isShown) {
            clickCell.isShown = true;
            elCell.innerText = clickCell.minesAroundCount;
            gGame.shownCount++
            checkGameOver();
            if (clickCell.minesAroundCount === 0) {
                elCell.innerText = '0';
                expandShown(gBoard, i, j);
            }
        } else if (clickCell.isMine) {
            revealeAllMines()
            gGame.isOn = false;
            clearInterval(gInterval);
            gGame.secsPassed = sumSeconds;
        }

        console.log(gGame.shownCount);
    }
}


function revealeAllMines() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            var currElCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.isMine) {
                currCell.isShown = true;
                currElCell.innerText = MINE;
                gGame.isOn = false;
                var elStatus = document.querySelector('.status')
                elStatus.innerText = '👻 CALL 101';
            }
        }
    }
}


//right click -flag
function cellMarked(elCell, i, j) {
    elCell.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
    }, false);
    if (gGame.isOn) {
     
        var clickCell = gBoard[i][j]
        if (clickCell.isShown) {
            return;
        }
        if (!clickCell.isMarked) {
            clickCell.isMarked = true;
            elCell.innerText = FLAG;
        } else {
            clickCell.isMarked = false;
            elCell.innerText = '';
        }
        if (clickCell.isMine && clickCell.isMarked) {
            gGame.markedCount++;
            checkGameOver();
        } else if (clickCell.isMine && !clickCell.isMarked) gGame.markedCount--

    }
}

function checkGameOver() {
    var notMineCells = (gLevel.size ** 2) - gLevel.mines;
    if (gGame.markedCount === gLevel.mines && gGame.shownCount === notMineCells) {
        gGame.isOn = false;
        clearInterval(gInterval);
        gGame.secsPassed = sumSeconds;
        var elStatus = document.querySelector('.status')
        elStatus.innerText = '🐱‍🏍 YOU ARE SUPERHIRO';
    }
}


function startGame() {
    seconds.innerText = '000';
    clearInterval(gInterval);
}


function level(elLevel) {
    if (elLevel.innerText === 'EASY') {
        gLevel = { size: 4, mines: 2 }
        initGame()
    }
    if (elLevel.innerText === 'MEDIUM') {
        gLevel = { size: 8, mines: 10 }
        initGame()
    }
    if (elLevel.innerText === 'HARD') {
        gLevel = { size: 12, mines: 20 }
        initGame()
    }

}

var seconds = document.querySelector(".seconds");
var sumSeconds = 0;

function timer() {
  ++sumSeconds;
  seconds.innerHTML = sumSeconds

}

