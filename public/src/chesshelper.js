var tileSize = 100
var dark, light, bg
var center
var size

var images

function getPieceImage(color, piece) {
    return images[color][piece]
}

function tilePos(row, col) {
    if (row < 1 || row > 8 || col < 1 || col > 8) {
        throw 'tilePos: invalid bounds'
    }

    let boardCorner = {
        x: center.x - (tileSize * 4),
        y: center.y - (tileSize * 4),
    }

    return {
        x: boardCorner.x + ((col-1)*tileSize),
        y: boardCorner.y + ((8-row)*tileSize),
    }
}

function tileCenter(row, col) {
    let pos = tilePos(row, col)
    return {
        x: pos.x + (tileSize/2),
        y: pos.y + (tileSize/2),
    }
}

function renderPieceCoords(color, piece, x, y) {
    let img = getPieceImage(color, piece)
    image(img, x, y, tileSize, tileSize)
}

function renderPieceOnTile(color, piece, row, col) {
    let center = tileCenter(row, col)
    let img = getPieceImage(color, piece)
    image(img, center.x, center.y, tileSize, tileSize)
}