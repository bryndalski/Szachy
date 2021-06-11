import { Raycaster, Vector2, Vector3 } from "three"

export default class Collisions extends Raycaster {
    constructor(scene, camera, whitePieces, BlackPieces, pieces, websocket, fields) {
        super()
        this.scene = scene
        this.websocket = websocket
        this.camera = camera
        this.whitePieces = whitePieces
        this.blackPieces = BlackPieces
        this.color = pieces.color
        this.greenFields = []
        this.selectedPiece = {}
        this.fieldsMap = fields

        window.addEventListener('click', (e) => {
            this.mouseVector = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
            this.setFromCamera(this.mouseVector, this.camera);
            if (this.color == "white") {
                this.intersects = this.intersectObjects(this.whitePieces.chessSet.children);
                if (this.intersects[0]) {
                    this.distances = this.intersects.map(x => x.distance)
                    this.intersects = this.intersects.filter(x => x.distance == Math.min(...this.distances))
                    this.websocket.send(JSON.stringify({ type: "moveOptions", position: this.intersects[0].object.boardPosition }))
                    console.log(this.intersects[0].object.boardPosition)
                }
            } else {
                this.intersects = this.intersectObjects(this.blackPieces.chessSet.children);
                if (this.intersects[0]) {
                    this.distances = this.intersects.map(x => x.distance)
                    this.intersects = this.intersects.filter(x => x.distance == Math.min(...this.distances))
                    this.websocket.send(JSON.stringify({ type: "moveOptions", position: this.intersects[0].object.boardPosition }))
                    console.log(this.intersects[0].object.boardPosition)
                }
            }

            if (this.greenFields.length > 0) {
                this.newPosition = this.intersectObjects(this.greenFields)
                if (this.newPosition[0]) {
                    this.piecePos = this.selectedPiece.boardPosition
                    this.destPos = this.newPosition[0].object.boardPosition

                    if (this.color == "white") {
                        this.toMove = this.whitePieces.chessSet.children.filter(x => x.boardPosition == this.piecePos)
                    } else {
                        this.toMove = this.blackPieces.chessSet.children.filter(x => x.boardPosition == this.piecePos)
                    }

                    if (this.destPos.length == 3) {
                        this.destPos = this.destPos[1] + this.destPos[2]
                    }

                    this.websocket.send(JSON.stringify({ type: "move", piecePos: this.piecePos, destPos: this.destPos }))

                    this.v1 = this.toMove[0].position

                    let x
                    let z
                    if (this.destPos.length == 3) {
                        x = this.fieldsMap.get(this.toMove[0].boardPosition[0]) - this.fieldsMap.get(this.destPos[1])
                        z = parseInt(this.toMove[0].boardPosition[1]) - parseInt(this.destPos[2])
                    } else {
                        x = this.fieldsMap.get(this.toMove[0].boardPosition[0]) - this.fieldsMap.get(this.destPos[0])
                        z = parseInt(this.toMove[0].boardPosition[1]) - parseInt(this.destPos[1])
                    }

                    if (Math.abs(30.5 * x) > Math.abs(30.5 * z)) {
                        this.v2 = new Vector3(this.toMove[0].position.x - 30.5 * x, Math.abs(30.5 * x) / 2, this.toMove[0].position.z - 30.5 * z)
                    } else {
                        this.v2 = new Vector3(this.toMove[0].position.x - 30.5 * x, Math.abs(30.5 * z) / 2, this.toMove[0].position.z - 30.5 * z)
                    }

                    console.log(this.v2)

                    this.czyPrzeszlo = false

                    this.toMove[0].boardPosition = this.destPos
                    this.fading = 20

                    this.greenFields.forEach(mesh => this.scene.remove(mesh))
                    this.scene.remove(this.selectedPiece)
                    this.greenFields = []
                    this.selectedPiece = {}
                }
            }


        });
    }

    updatePos() {
        if (this.fading > 0) {
            if (this.toMove[0].position.x != this.v2.x && this.toMove[0].position.x < this.v2.x) {
                this.toMove[0].position.x += 0.5
            } else if (this.toMove[0].position.x != this.v2.x && this.toMove[0].position.x > this.v2.x) {
                this.toMove[0].position.x -= 0.5
            }
            if (this.toMove[0].position.z != this.v2.z && this.toMove[0].position.z < this.v2.z) {
                this.toMove[0].position.z += 0.5
            } else if (this.toMove[0].position.z != this.v2.z && this.toMove[0].position.z > this.v2.z) {
                this.toMove[0].position.z -= 0.5
            }
            if (this.toMove[0].position.y < this.v2.y && !this.czyPrzeszlo) {
                this.toMove[0].position.y += 0.5
            } else if ((this.toMove[0].position.y >= this.v2.y || this.czyPrzeszlo) && this.toMove[0].position.y > 0) {
                this.czyPrzeszlo = true
                this.toMove[0].position.y -= 0.5
            }
            this.fading -= 0.01
        }
    }

}