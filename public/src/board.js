function isValidTile(pos) {
    return !(pos.col < 1 || pos.col > 8 || pos.row < 1 || pos.row > 8)
}

function t(pos, dir, dist) {
    // h, v, d+, d-
    switch (dir) {
        case 'h':
            return {row: pos.row, col: pos.col + dist}
        break
        case 'v':
            return {row: pos.row + dist, col: pos.col}
        break
        case 'd+':
            return {row: pos.row + dist, col: pos.col + dist}
        break
        case 'd-':
            return {row: pos.row - dist, col: pos.col + dist}
        break
        default:
            throw 'invalid direction'
    }
}

function prune(posList) {
    // Prune coordinate overflow
    let i = 0
    while (i < posList.length) {
        if (!isValidTile(posList[i])) {
            posList.splice(i, 1)
            i -= 1
        }
        i += 1
    }
    return posList
}



function enemyColor(color) {
    if (color == 'white') return 'black'
    if (color == 'black') return 'white'
    throw 'invalid color ' + color
}

class Piece {
    constructor(color, type, pos) {
        this.color = color
        this.type = type
        this.pos = pos
        this.hidden = false
    }
}

class Board {
    constructor(size, lightColor, darkColor, borderColor) {
        this.tileSize = size / 8
        this.boardSize = size
        this.lightTileColor = lightColor
        this.darkTileColor = darkColor
        this.borderColor = borderColor
        this.pieces = []
        this.boardCorner = {x: 0, y: 0}
        this.activeSquare = null
    }

    tilePos(pos) {
        if (pos.row < 1 || pos.row > 8 || pos.col < 1 || pos.col > 8) {
            throw 'tilePos: invalid bounds'
        }
    
        this.boardCorner = {
            x: center.x - (this.tileSize * 4),
            y: center.y - (this.tileSize * 4),
        }
    
        let toReturn = {
            x: this.boardCorner.x + ((pos.col-1)*this.tileSize),
            y: this.boardCorner.y + ((8-pos.row)*this.tileSize),
        }

        return toReturn
    }

    coordsToPos(coords) {
        let relative = {
            x: coords.x - this.boardCorner.x,
            y: coords.y - this.boardCorner.y,
        }

        if (relative.x < 0 || relative.y < 0 || relative.x > this.boardSize || relative.y > this.boardSize) {
            return null
        }

        let row = 8 - Math.floor(relative.y / this.tileSize)
        let col = 1 + Math.floor(relative.x / this.tileSize)

        return {row: row, col: col}
    }
    
    tileCenter(pos) {
        let tPos = this.tilePos(pos)
        return {
            x: tPos.x + (this.tileSize/2),
            y: tPos.y + (this.tileSize/2),
        }
    }

    renderMovementNode(pos) {
        let radius = this.tileSize / 3;
        let nodeColor = color(0, 0, 0, 50)
        let center = this.tileCenter(pos)
        noStroke()
        fill(nodeColor)
        circle(center.x, center.y, radius)
    }

    renderPieceCoords(color, type, x, y) {
        let img = getPieceImage(color, type)
        image(img, x, y, this.tileSize, this.tileSize)
    }
    
    renderPieceOnTile(color, type, pos) {
        let center = this.tileCenter({row: pos.row, col: pos.col})
        let img = getPieceImage(color, type)
        image(img, center.x, center.y, this.tileSize, this.tileSize)
    }

    render(pos) {
        imageMode(CENTER)
        let boardCorner = {
            x: pos.x - (this.boardSize/2),
            y: pos.y - (this.boardSize/2),
        }
    
        let padding = 5
        let paddingColor = color(100)
        let textColor = color(100)
    
        fill(paddingColor)
        rect(boardCorner.x - padding, boardCorner.y - padding, this.boardSize + 2*padding, this.boardSize + 2*padding)
        fill(this.lightTileColor)
        rect(boardCorner.x, boardCorner.y, this.boardSize, this.boardSize)
    
        
        let cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    
        // Render Tiles + Text
        textSize(Math.ceil(this.tileSize/5))
        for (var row = 1; row <= 8; row++) {
            for (var col = 1; col <= 8; col++) {
                let pos = this.tilePos({row: row, col: col})
                if (col % 2 == row % 2) {
                    fill(this.darkTileColor)
                } else {
                    fill(this.lightTileColor)
                }
    
                rect(pos.x, pos.y,this.tileSize, this.tileSize)
    
                // Text
                if (row == 1) {
                    fill(textColor)
                    text(cols[col-1], pos.x + this.tileSize - 18, pos.y + this.tileSize - 9)
                }
    
                if (col == 1) {
                    fill(textColor)
                    text(row, pos.x + 6, pos.y + 21)
                }
            }
        }

        // Render pieces
        this.pieces.forEach(piece => {
            if (!piece.hidden) {
                this.renderPieceOnTile(piece.color, piece.type, piece.pos)
            }
        })

        if (this.activeSquare != null) {
            this.renderMovementOptions(this.getPieceOnTile(this.activeSquare))
        }
    }

    // Add Piece
    addPiece(color, type, pos) {
        if (this.tileInfo(pos, 'white') == 'empty') {
            this.pieces.push(new Piece(color, type, pos))
        } else {
            throw 'piece already on that tile'
        }
    }

    getPieceOnTile(pos) {
        let found = this.pieces.find(element => element.pos.row == pos.row && element.pos.col == pos.col)
        if (found == undefined) {
            found = null
        }

        return found
    }

    getIndexOnTile(pos) {
        let found = this.pieces.findIndex(element => element.pos.row == pos.row && element.pos.col == pos.col)
        if (found == undefined) {
            found = null
        }

        return found
    }

    tileInfo(pos, color) {
        if (!isValidTile(pos)) return 'invalid'
        let piece = this.getPieceOnTile(pos)
        if (piece == null) return 'empty'
        if (piece.color == color) return 'friendly'
        if (piece.color == enemyColor(color)) return 'enemy'
        throw 'tileinfo gone wrong'
    }

    traverse(pos, dir, color) {
        var path = []
        var dist = 0
        var done = false
        var currentPos = null

        while (!done) {
            dist += 1
            currentPos = t(pos, dir, dist)
            let info = this.tileInfo(currentPos, color)
            if (info == 'invalid' || info == 'friendly') {
                done = true
            } else if (info == 'enemy') {
                path.push(currentPos)
                done = true
            } else if (info == 'empty') {
                path.push(currentPos)
            } else {
                throw `info ${info} is not right`
            }
        }

        done = false
        dist = 0

        while (!done) {
            dist -= 1
            currentPos = t(pos, dir, dist)
            let info = this.tileInfo(currentPos, color)
            if (info == 'invalid' || info == 'friendly') {
                done = true
            } else if (info == 'enemy') {
                path.push(currentPos)
                done = true
            } else if (info == 'empty') {
                path.push(currentPos)
            } else {
                throw `info ${info} is not right`
            }
        }

        return path
    }

    getPieceLocations(color, type) {
        let desiredPieces = this.pieces.filter(element => element.color == color && element.type == type)
        return desiredPieces.map(element => element.pos)
    }

    renderMovementOptions(piece) {
        let options = this.getPieceMovementOptions(piece)

        options.forEach(option => {
            this.renderMovementNode(option)
        })
    }

    getPieceMovementOptions(piece) {
        if (piece == null) {
            return []
        }


        var options = []

        switch(piece.type) {
            case 'pawn':
                let push, push2, captureRight, captureLeft
                if (piece.color == 'white') {
                    push = t(piece.pos, 'v', 1)
                    push2 = t(piece.pos, 'v', 2)
                    captureLeft = t(piece.pos, 'd-', -1)
                    captureRight = t(piece.pos, 'd+', 1)
                } else {
                    push = t(piece.pos, 'v', -1)
                    push2 = t(piece.pos, 'v', -2)
                    captureLeft = t(piece.pos, 'd-', 1)
                    captureRight = t(piece.pos, 'd+', -1)
                }

                if (this.tileInfo(push, piece.color) == 'empty') {
                    options.push(push)
                    if (this.tileInfo(push2, piece.color) == 'empty') {
                        if ((piece.color == 'white' && piece.pos.row == 2) || 
                        (piece.color == 'black' && piece.pos.row == 7)) {
                            options.push(push2)
                        }
                    }
                }

                if (this.tileInfo(captureLeft, piece.color) == 'enemy') {
                    options.push(captureLeft)
                }

                if (this.tileInfo(captureLeft, piece.color) == 'enemy') {
                    options.push(captureLeft)
                }
            break
            case 'king':
                let kingShape = [
                    {row: piece.pos.row + 1, col: piece.pos.col - 1},
                    {row: piece.pos.row + 1, col: piece.pos.col + 0},
                    {row: piece.pos.row + 1, col: piece.pos.col + 1},
                    {row: piece.pos.row + 0, col: piece.pos.col - 1},
                    {row: piece.pos.row + 0, col: piece.pos.col + 1},
                    {row: piece.pos.row - 1, col: piece.pos.col - 1},
                    {row: piece.pos.row - 1, col: piece.pos.col + 0},
                    {row: piece.pos.row - 1, col: piece.pos.col + 1},
                ]
                kingShape.forEach(movement => {
                    let info = this.tileInfo(movement, piece.color)
                    if (info == 'enemy' || info == 'empty') {
                        options.push(movement)
                    }
                })

            break
            case 'rook':
                options = options.concat(this.traverse(piece.pos, 'h', piece.color))
                options = options.concat(this.traverse(piece.pos, 'v', piece.color))

            break
            case 'knight':
                let shape = [
                    {row: piece.pos.row + 2, col: piece.pos.col + 1},
                    {row: piece.pos.row + 2, col: piece.pos.col - 1},
                    {row: piece.pos.row + 1, col: piece.pos.col + 2},
                    {row: piece.pos.row + 1, col: piece.pos.col - 2},
                    {row: piece.pos.row - 1, col: piece.pos.col + 2},
                    {row: piece.pos.row - 1, col: piece.pos.col - 2},
                    {row: piece.pos.row - 2, col: piece.pos.col + 1},
                    {row: piece.pos.row - 2, col: piece.pos.col - 1},
                ]
                shape.forEach(movement => {
                    let info = this.tileInfo(movement, piece.color)
                    if (info == 'enemy' || info == 'empty') {
                        options.push(movement)
                    }
                })

            break
            case 'bishop':
                options = options.concat(this.traverse(piece.pos, 'd+', piece.color))
                options = options.concat(this.traverse(piece.pos, 'd-', piece.color))
            break
            case 'queen':
                options = options.concat(this.traverse(piece.pos, 'd+', piece.color))
                options = options.concat(this.traverse(piece.pos, 'd-', piece.color))
                options = options.concat(this.traverse(piece.pos, 'h', piece.color))
                options = options.concat(this.traverse(piece.pos, 'v', piece.color))

            break

        }

        return options
    }

    movePiece(piece, pos) {
        // get piece index
        let index = this.getIndexOnTile(piece.pos)
        if (this.pieces[index].type != piece.type) {
            throw 'WTF: Types are different'
        }

        // Check if move is valid
        let options = this.getPieceMovementOptions(piece)
        let found = options.find(element => element.row == pos.row && element.col == pos.col)
        if (found == undefined) {
            return false // Invalid move
        } else {
            // Check if it is a capture
            let capturedIndex = this.getIndexOnTile(pos)

            if (capturedIndex != -1) {
                this.pieces.splice(capturedIndex, 1)
                if (index > capturedIndex) {
                    index -= 1;
                }
            }

            

            this.pieces[index].pos = pos
            return true
        }

    }
}
