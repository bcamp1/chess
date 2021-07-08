"use strict";

function preload() {
    images = {
        'black': {
            'bishop': loadImage('pieces/bB.png'),
            'king': loadImage('pieces/bK.png'),
            'knight': loadImage('pieces/bN.png'),
            'pawn': loadImage('pieces/bP.png'),
            'queen': loadImage('pieces/bQ.png'),
            'rook': loadImage('pieces/bR.png'),
        },
        'white': {
            'bishop': loadImage('pieces/wB.png'),
            'king': loadImage('pieces/wK.png'),
            'knight': loadImage('pieces/wN.png'),
            'pawn': loadImage('pieces/wP.png'),
            'queen': loadImage('pieces/wQ.png'),
            'rook': loadImage('pieces/wR.png'),
        }
    }
}

var p1;
var board;
var floating = null;


function setup() {
    const canvas = createCanvas(windowWidth, windowHeight - 50);
    canvas.parent('p5-canvas')

    // Center and Size
    center = {
        x: windowWidth/2,
        y: (windowHeight - 50)/2
    }

    size = {
        width: windowWidth,
        height: windowHeight - 50
    }

    bg = color('#e0e0e0')

    // Colors
    let darkColor = color('#fdd')
    let lightColor = color('#fff')
    let borderColor = color(100)

    board = new Board(800, lightColor, darkColor, borderColor)
    board.addPiece('black', 'king', where('c6'))
    board.addPiece('black', 'knight', where('g6'))
    board.addPiece('white', 'pawn', where('h4'))
    board.addPiece('white', 'pawn', where('g2'))
    board.addPiece('white', 'king', where('b1'))
    board.addPiece('white', 'rook', where('d3'))
    board.addPiece('black', 'bishop', where('b5'))
    board.addPiece('white', 'queen', where('f5'))

    console.log(board.getPieceLocations('white', 'pawn'))
}

var mouseDown, pMouseDown
  
function draw() {
    background(bg)
    noStroke()

    pMouseDown = mouseDown

    mouseDown = mouseIsPressed

    if (mouseDown && !pMouseDown) {
        var square = board.coordsToPos({x: mouseX, y: mouseY})
        if (square != null) {
            board.activeSquare = square
            var pieceIndex = board.getIndexOnTile(square)
            if (pieceIndex != -1) {
                board.pieces[pieceIndex].hidden = true
                floating = {
                    color: board.pieces[pieceIndex].color,
                    type: board.pieces[pieceIndex].type,
                }
            }
        }
    }

    if (!mouseDown && pMouseDown) {
        var square = board.coordsToPos({x: mouseX, y: mouseY})
        if (square != null) {
            let activePiece = board.getPieceOnTile(board.activeSquare)
            if (activePiece != null) {
                let result = board.movePiece(activePiece, square)
                if (result == true) {
                    board.pieces[board.getIndexOnTile(square)].hidden = false
                } else {
                    board.pieces[board.getIndexOnTile(board.activeSquare)].hidden = false
                }
            }
        } else {
            if (board.activeSquare != null) {
                let index = board.getIndexOnTile(board.activeSquare)
                if (index != -1) {
                    board.pieces[board.getIndexOnTile(board.activeSquare)].hidden = false
                }
            }
        }
        floating = null
    }

    board.render(center)

    // Floating piece
    if (floating != null) {
        board.renderPieceCoords(floating.color, floating.type, mouseX, mouseY)
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 50);

    center = {
        x: windowWidth/2,
        y: (windowHeight - 50)/2
    }

    size = {
        width: windowWidth,
        height: windowHeight - 50
    }
}
