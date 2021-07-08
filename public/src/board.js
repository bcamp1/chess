class Piece {
    constructor(color, type, movement) {
        this.color = color;
        this.type = type;
        this.row = 1;
        this.col = 1;
    }
}

class King extends Piece {
    constructor(color) {
        super(color, 'king')
    }
}