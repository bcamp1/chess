var bg
var center
var size

var images

function getPieceImage(color, piece) {
    return images[color][piece]
}

function where(notation) {
    if (notation.length != 2) {
        throw 'notation incorrect'
    }

    let colLetter = notation.charAt(0)
    let row = Number.parseInt(notation.charAt(1), 10)


    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    let col = cols.findIndex(element => element == colLetter) + 1;

    let pos = {row: row, col: col}

    return pos

}

function posToString(pos) {
    if (pos == null) return 'none'
    let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return cols[pos.col-1] + pos.row.toString()
}