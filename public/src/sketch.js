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

    // Colors
    dark = color('#fdd')
    light = color('#fff')
    bg = color('#e0e0e0')
}


  
function draw() {
    background(bg)
    noStroke()
    imageMode(CENTER)

    let boardSize = tileSize * 8

    let boardCorner = {
        x: center.x - (boardSize/2),
        y: center.y - (boardSize/2),
    }

    let padding = 5
    let paddingColor = color(100)
    let textColor = color(100)


    fill(paddingColor)
    rect(boardCorner.x - padding, boardCorner.y - padding, boardSize + 2*padding, boardSize + 2*padding)
    fill(light)
    rect(boardCorner.x, boardCorner.y, boardSize, boardSize)

    
    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    // Render Tiles + Text
    textSize(Math.ceil(tileSize/5))
    for (var row = 1; row <= 8; row++) {
        for (var col = 1; col <= 8; col++) {
            let pos = tilePos(row, col)
            if (col % 2 == row % 2) {
                fill(dark)
            } else {
                fill(light)
            }

            rect(pos.x, pos.y,tileSize, tileSize)

            // Text
            if (row == 1) {
                fill(textColor)
                text(cols[col-1], pos.x + tileSize - 18, pos.y + tileSize - 9)
            }

            if (col == 1) {
                fill(textColor)
                text(row, pos.x + 6, pos.y + 21)
            }
        }
    }
    
    // Render Pieces
    renderPieceCoords('white', 'rook', mouseX, mouseY)
    renderPieceOnTile('black', 'king', 2, 5)

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
