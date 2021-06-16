import { Raycaster, Vector2, Vector3 } from "three"

export default class Collisions extends Raycaster {
    constructor(scene, camera, whitePieces, BlackPieces, pieces, websocket, mapa, board, meshWhitePieces, meshBlackPieces) {
        super()
        this.scene = scene
        this.websocket = websocket
        this.camera = camera
        this.whitePieces = whitePieces
        this.blackPieces = BlackPieces
        this.color = pieces.color
        this.greenFields = []
        this.selectedPiece = {}
        this.mapa = mapa
        this.board = board
        this.meshWhitePieces = meshWhitePieces
        this.meshBlackPieces = meshBlackPieces

        window.addEventListener('click', (e) => {
            this.mouseVector = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
            this.setFromCamera(this.mouseVector, this.camera);
            if (this.color == "white") {
                this.intersects = this.intersectObjects(this.meshWhitePieces);
                if (this.intersects[0]) {
                    this.websocket.send(JSON.stringify({ type: "moveOptions", position: this.intersects[0].object.parent.boardPosition }))
                }
            } else {
                this.intersects = this.intersectObjects(this.meshBlackPieces);
                if (this.intersects[0]) {
                    this.websocket.send(JSON.stringify({ type: "moveOptions", position: this.intersects[0].object.parent.boardPosition }))
                }
            }

            if (this.greenFields.length > 0) {
                this.newPosition = this.intersectObjects(this.greenFields)
                if (this.newPosition[0]) {
                    if (this.newPosition[0].object.boardPosition.includes("x") && this.color == "white") {
                        this.scene.remove(this.blackPieces.filter(x => x.boardPosition == this.newPosition[0].object.boardPosition[1] + this.newPosition[0].object.boardPosition[2])[0])
                        this.blackPieces.filter(x => x.boardPosition == this.newPosition[0].object.boardPosition[1] + this.newPosition[0].object.boardPosition[2])[0].boardPosition = null
                    } else if (this.newPosition[0].object.boardPosition.includes("x") && this.color == "black") {
                        this.scene.remove(this.whitePieces.filter(x => x.boardPosition == this.newPosition[0].object.boardPosition[1] + this.newPosition[0].object.boardPosition[2])[0])
                        this.whitePieces.filter(x => x.boardPosition == this.newPosition[0].object.boardPosition[1] + this.newPosition[0].object.boardPosition[2])[0].boardPosition = null
                    }
                    if (this.newPosition[0].object.boardPosition == "O-O") {

                        if (this.color == "white") {
                            this.piecePos = 'e1'
                            this.destPos = 'g1'
                            this.toMove = this.whitePieces.filter(x => x.boardPosition == this.piecePos)
                            this.rook = this.whitePieces.filter(x => x.boardPosition == 'h1')[0]
                            this.x = 0
                            this.z = 0
                            for (const property in mapa) {
                                if ('f1' == property) {
                                    this.x = mapa[property][0]
                                    this.z = mapa[property][1]
                                    break
                                }
                            }
                            this.rook.position.x = this.x
                            this.rook.position.z = this.z
                            this.rook.boardPosition = 'f1'
                        } else {
                            this.piecePos = 'e8'
                            this.destPos = 'g8'
                            this.toMove = this.blackPieces.filter(x => x.boardPosition == this.piecePos)
                            this.rook = this.whitePieces.filter(x => x.boardPosition == 'h8')[0]
                            this.x = 0
                            this.z = 0
                            for (const property in mapa) {
                                if ('f8' == property) {
                                    this.x = mapa[property][0]
                                    this.z = mapa[property][1]
                                    break
                                }
                            }
                            this.rook.position.x = this.x
                            this.rook.position.z = this.z
                            this.rook.boardPosition = 'f8'
                        }


                        let x = 0
                        let z = 0

                        for (const property in mapa) {
                            if (this.destPos == property) {
                                x = mapa[property][0]
                                z = mapa[property][1]
                                break
                            }
                        }

                        if (Math.abs(x) > Math.abs(z)) {
                            this.v2 = new Vector3(x, Math.abs(x) / 2, z)
                        } else {
                            this.v2 = new Vector3(x, Math.abs(z) / 2, z)
                        }

                        // this.pozycjaWlasciwa = this.v2.clone()
                        // this.v2.x = Math.floor(this.v2.x)
                        // this.v2.z = Math.floor(this.v2.z)
                        // this.toMove[0].position.x = parseInt(this.toMove[0].position.x.toFixed(0))
                        // this.toMove[0].position.z = parseInt(this.toMove[0].position.z.toFixed(0))

                        // console.log(this.toMove[0].position)
                        // console.log(this.v2)

                        // this.czyPrzeszlo = false

                        this.toMove[0].position.x = this.v2.x
                        this.toMove[0].position.z = this.v2.z
                        this.toMove[0].boardPosition = this.destPos
                        //this.fading = 20

                        this.board = []

                        this.whitePieces.forEach(obj => {
                            this.board.push(obj.boardPosition)
                        })
                        this.blackPieces.forEach(obj => {
                            this.board.push(obj.boardPosition)
                        })

                        this.websocket.send(JSON.stringify({ type: "move", piecePos: this.piecePos, destPos: this.destPos, board: this.board }))

                        this.greenFields.forEach(mesh => this.scene.remove(mesh))
                        this.scene.remove(this.selectedPiece)
                        this.greenFields = []
                        this.selectedPiece = {}
                    } else if (this.newPosition[0].object.boardPosition == "O-O-O") {
                        if (this.color == "white") {
                            this.piecePos = 'e1'
                            this.destPos = 'c1'
                            this.toMove = this.whitePieces.filter(x => x.boardPosition == this.piecePos)
                            this.rook = this.whitePieces.filter(x => x.boardPosition == 'a1')[0]
                            this.x = 0
                            this.z = 0
                            for (const property in mapa) {
                                if ('d1' == property) {
                                    this.x = mapa[property][0]
                                    this.z = mapa[property][1]
                                    break
                                }
                            }
                            this.rook.position.x = this.x
                            this.rook.position.z = this.z
                            this.rook.boardPosition = 'd1'
                        } else {
                            this.piecePos = 'e8'
                            this.destPos = 'c8'
                            this.toMove = this.blackPieces.filter(x => x.boardPosition == this.piecePos)
                            this.rook = this.whitePieces.filter(x => x.boardPosition == 'a8')[0]
                            this.x = 0
                            this.z = 0
                            for (const property in mapa) {
                                if ('d8' == property) {
                                    this.x = mapa[property][0]
                                    this.z = mapa[property][1]
                                    break
                                }
                            }
                            this.rook.position.x = this.x
                            this.rook.position.z = this.z
                            this.rook.boardPosition = 'd8'
                        }


                        let x = 0
                        let z = 0

                        for (const property in mapa) {
                            if (this.destPos == property) {
                                x = mapa[property][0]
                                z = mapa[property][1]
                                break
                            }
                        }

                        if (Math.abs(x) > Math.abs(z)) {
                            this.v2 = new Vector3(x, Math.abs(x) / 2, z)
                        } else {
                            this.v2 = new Vector3(x, Math.abs(z) / 2, z)
                        }

                        // this.pozycjaWlasciwa = this.v2.clone()
                        // this.v2.x = Math.floor(this.v2.x)
                        // this.v2.z = Math.floor(this.v2.z)
                        // this.toMove[0].position.x = parseInt(this.toMove[0].position.x.toFixed(0))
                        // this.toMove[0].position.z = parseInt(this.toMove[0].position.z.toFixed(0))

                        // console.log(this.toMove[0].position)
                        // console.log(this.v2)

                        // this.czyPrzeszlo = false

                        this.toMove[0].position.x = this.v2.x
                        this.toMove[0].position.z = this.v2.z
                        this.toMove[0].boardPosition = this.destPos
                        //this.fading = 20

                        this.board = []

                        this.whitePieces.forEach(obj => {
                            this.board.push(obj.boardPosition)
                        })
                        this.blackPieces.forEach(obj => {
                            this.board.push(obj.boardPosition)
                        })

                        this.websocket.send(JSON.stringify({ type: "move", piecePos: this.piecePos, destPos: this.destPos, board: this.board }))

                        this.greenFields.forEach(mesh => this.scene.remove(mesh))
                        this.scene.remove(this.selectedPiece)
                        this.greenFields = []
                        this.selectedPiece = {}
                    } else {
                        this.piecePos = this.selectedPiece.boardPosition
                        this.destPos = this.newPosition[0].object.boardPosition

                        if (this.destPos.length == 3) {
                            this.destPos = this.destPos[1] + this.destPos[2]
                        }

                        if (this.color == "white") {
                            this.toMove = this.whitePieces.filter(x => x.boardPosition == this.piecePos)
                        } else {
                            this.toMove = this.blackPieces.filter(x => x.boardPosition == this.piecePos)
                        }


                        let x = 0
                        let z = 0

                        for (const property in mapa) {
                            if (this.destPos == property) {
                                x = mapa[property][0]
                                z = mapa[property][1]
                                break
                            }
                        }

                        if (Math.abs(x) > Math.abs(z)) {
                            this.v2 = new Vector3(x, Math.abs(x) / 2, z)
                        } else {
                            this.v2 = new Vector3(x, Math.abs(z) / 2, z)
                        }

                        // this.pozycjaWlasciwa = this.v2.clone()
                        // this.v2.x = Math.floor(this.v2.x)
                        // this.v2.z = Math.floor(this.v2.z)
                        // this.toMove[0].position.x = parseInt(this.toMove[0].position.x.toFixed(0))
                        // this.toMove[0].position.z = parseInt(this.toMove[0].position.z.toFixed(0))

                        // console.log(this.toMove[0].position)
                        // console.log(this.v2)

                        // this.czyPrzeszlo = false

                        this.toMove[0].position.x = this.v2.x
                        this.toMove[0].position.z = this.v2.z
                        this.toMove[0].boardPosition = this.destPos
                        //this.fading = 20

                        this.board = []

                        this.whitePieces.forEach(obj => {
                            this.board.push(obj.boardPosition)
                        })
                        this.blackPieces.forEach(obj => {
                            this.board.push(obj.boardPosition)
                        })

                        this.websocket.send(JSON.stringify({ type: "move", piecePos: this.piecePos, destPos: this.destPos, board: this.board }))

                        this.greenFields.forEach(mesh => this.scene.remove(mesh))
                        this.scene.remove(this.selectedPiece)
                        this.greenFields = []
                        this.selectedPiece = {}
                    }

                }
            }


        });
    }

    updatePos() {
        // if (this.fading > 0) {
        //     if (this.toMove[0].position.x != this.v2.x && this.toMove[0].position.x < this.v2.x) {
        //         this.toMove[0].position.x += 0.5
        //     } else if (this.toMove[0].position.x != this.v2.x && this.toMove[0].position.x > this.v2.x) {
        //         this.toMove[0].position.x -= 0.5
        //     }
        //     if (this.toMove[0].position.z != this.v2.z && this.toMove[0].position.z < this.v2.z) {
        //         this.toMove[0].position.z += 0.5
        //     } else if (this.toMove[0].position.z != this.v2.z && this.toMove[0].position.z > this.v2.z) {
        //         this.toMove[0].position.z -= 0.5
        //     }
        //     if (this.toMove[0].position.y < this.v2.y && !this.czyPrzeszlo) {
        //         this.toMove[0].position.y += 0.5
        //     } else if ((this.toMove[0].position.y >= this.v2.y || this.czyPrzeszlo) && this.toMove[0].position.y > 0) {
        //         this.czyPrzeszlo = true
        //         this.toMove[0].position.y -= 0.5
        //     }
        //     this.fading -= 0.01
        // }
    }

}