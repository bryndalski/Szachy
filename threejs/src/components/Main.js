import Renderer from './Renderer';
import Camera from './Camera';

import {
    Scene,
    AmbientLight,
    BoxGeometry,
    LoadingManager,
    Clock,
    Vector3,
    GridHelper,
    Mesh,
    MeshStandardMaterial,
    TextureLoader,
    DoubleSide,
    AxesHelper,
    PlaneGeometry,
} from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import Model from "./Model"
import { OrbitControls } from './OrbitControls.js'
import chess from "./assets/Chess_set.glb"
import boardTopTexture from "./assets/chessBoardTop.png"
import boardSideTexture from "./assets/chessBoardSide.png"
import boardBottomTexture from "./assets/chessBoardBottom.jpg"
import Collisions from "./Raycaster.js"

export default class Main {
    constructor(container) {
        // właściwości klasy
        this.container = container;
        this.scene = new Scene();

        // połączenie z websocketem i pobranie danych o kolorze pionków
        this.websocket = new WebSocket(`wss://${window.location.hostname}:${window.location.port}/sockets/Szaszki`)

        this.websocket.onopen = (e) => {
            this.websocket.send(JSON.stringify({ type: "init" }))
        }

        this.pieces = {}
        this.fieldsMap = new Map()
        this.fieldsMap.set('a', 1)
        this.fieldsMap.set('b', 2)
        this.fieldsMap.set('c', 3)
        this.fieldsMap.set('d', 4)
        this.fieldsMap.set('e', 5)
        this.fieldsMap.set('f', 6)
        this.fieldsMap.set('g', 7)
        this.fieldsMap.set('h', 8)

        this.greenFields = []

        // odbieranie danych z serwera
        this.websocket.onmessage = (e) => {
            console.log(e.data)
            this.data = JSON.parse(e.data)
            console.log(this.data)
            switch (this.data.type) {
                case "init":
                    this.pieces = JSON.parse(e.data)
                    this.board = this.pieces.loadBoard
                    break;
                case "moveOptions":
                    if (this.data.ischeck || this.data.ischeckmate || this.data.isstalemate || this.data.isdraw) {
                        console.log(this.data.ischeck, this.data.ischeckmate, this.data.isdraw, this.data.isstalemate)
                        console.log("to już jest koniec... gry")
                        if (this.data.ischeck) {

                        }
                        if (this.data.ischeckmate) {

                        }
                        if (this.data.isstalemate) {

                        }
                        if (this.data.isdraw) {

                        }
                    } else {
                        console.log(this.data.moves)

                        /*
                            podczas generowania zielonych pól dla dozwolonych ruchów pole a1 jest równe -39.5, -39.5
                            kolejna plansza w każdą stronę będzie przesunięta o 11.25
                        */
                        this.greenFields.forEach(mesh => this.scene.remove(mesh))
                        this.greenFields = []
                        this.scene.remove(this.selectedPiece)

                        this.selectedPiece = new Mesh(new PlaneGeometry(10, 10), new MeshStandardMaterial({ color: 0xe6d30b }))
                        this.selectedPiece.boardPosition = this.data.clicked
                        this.selectedPiece.rotation.x = -Math.PI / 2
                        if (this.data.clicked.length == 3) {
                            this.selectedPiece.position.set(-39.5 + 11.25 * (this.fieldsMap.get(this.data.clicked[1]) - 1), 0.25, -39.5 + 11.25 * (parseInt(this.data.clicked[2]) - 1))
                        } else {
                            this.selectedPiece.position.set(-39.5 + 11.25 * (this.fieldsMap.get(this.data.clicked[0]) - 1), 0.25, -39.5 + 11.25 * (parseInt(this.data.clicked[1]) - 1))
                        }
                        this.scene.add(this.selectedPiece)

                        this.data.moves.forEach(pos => {
                            this.plane = new Mesh(new PlaneGeometry(10, 10), new MeshStandardMaterial({ color: 0x2cde62 }))
                            this.plane.boardPosition = pos
                            this.plane.rotation.x = -Math.PI / 2
                            if (pos.length == 3) {
                                this.plane.position.set(-39.5 + 11.25 * (this.fieldsMap.get(pos[1]) - 1), 0.25, -39.5 + 11.25 * (parseInt(pos[2]) - 1))
                            } else {
                                this.plane.position.set(-39.5 + 11.25 * (this.fieldsMap.get(pos[0]) - 1), 0.25, -39.5 + 11.25 * (parseInt(pos[1]) - 1))
                            }
                            this.scene.add(this.plane)
                            this.greenFields.push(this.plane)
                        })

                        // przekazanie do raycastera pól do wyboru oraz pozycji zaznaczonego elementu
                        this.raycaster.greenFields = this.greenFields
                        this.raycaster.selectedPiece = this.selectedPiece
                    }

                    break;

                case "move":
                    console.log(this.data.move)
                    break;
            }
        }

        // właściwości klasy ciąg dalszy
        this.renderer = new Renderer(this.scene, container);
        this.camera = new Camera(75, this.renderer.threeRenderer.domElement.width, this.renderer.threeRenderer.domElement.height);
        this.camera.position.set(0, 90, 0)
        this.camera.lookAt(0, 0, 0)

        this.light = new AmbientLight(0xffffff)
        this.scene.add(this.light)

        const controls = new OrbitControls(this.camera, this.renderer.threeRenderer.domElement);

        const gridHelper = new GridHelper(10000, 100);
        this.scene.add(gridHelper);

        //stats - statystyki wydajności

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb

        document.body.appendChild(this.stats.dom);

        // zegar - vide lekcja 4

        this.clock = new Clock()

        // manager loadingu, pozwala monitorować progress oraz fakt zakończenia ładowania

        this.manager = new LoadingManager();
        this.manager2 = new LoadingManager();

        // model
        this.whitePieces = new Model(this.scene, this.manager);
        this.whitePieces.load(chess);

        this.manager.onLoad = () => {
            console.log("MODEL LOADED!!!")
            console.log(this.whitePieces)
            this.scene.add(this.whitePieces.chessSet)

            this.whitePieces.chessSet.scale.set(0.37, 0.37, 0.37)

            this.whitePieces.chessSet.children.forEach((mesh, index) => {
                mesh.material.color.set(0xeaebda)
            });

            //!!! przesunięcie o jedno polę po osi x lub z == 30.5s
            // Object.assign(thi.efefefef, {chess pram})
            this.whitePieces.chessSet.children[0].name = "q"
            this.whitePieces.chessSet.children[0].boardPosition = "d1"
            this.whitePieces.chessSet.children[0].position.set(-193, 0, -11.5)
            this.whitePieces.chessSet.children[1].name = "r"
            this.whitePieces.chessSet.children[1].boardPosition = "a1"
            this.whitePieces.chessSet.children[1].position.set(-284, 0, -62.5)
            this.whitePieces.chessSet.children[2].name = "p"
            this.whitePieces.chessSet.children[2].boardPosition = "a2"
            this.whitePieces.chessSet.children[2].position.set(-259, 0, 43.5)
            this.whitePieces.chessSet.children[3].name = "b"
            this.whitePieces.chessSet.children[3].boardPosition = "c1"
            this.whitePieces.chessSet.children[3].position.set(-198, 0, -11.5)
            this.whitePieces.chessSet.children[4].name = "k"
            this.whitePieces.chessSet.children[4].boardPosition = "e1"
            this.whitePieces.chessSet.children[4].position.set(-87, 0, -62.5)
            this.whitePieces.chessSet.children[5].name = "r"
            this.whitePieces.chessSet.children[5].boardPosition = "h1"
            this.whitePieces.chessSet.children[5].position.set(4, 0, -11.5)
            this.whitePieces.chessSet.children[6].name = "n"
            this.whitePieces.chessSet.children[6].boardPosition = "b1"
            this.whitePieces.chessSet.children[6].position.set(-229, 0, -62.5)
            this.whitePieces.chessSet.children[7].name = "b"
            this.whitePieces.chessSet.children[7].boardPosition = "f1"
            this.whitePieces.chessSet.children[7].position.set(-81, 0, -62.5)
            this.whitePieces.chessSet.children[8].name = "p"
            this.whitePieces.chessSet.children[8].boardPosition = "b2"
            this.whitePieces.chessSet.children[8].position.set(-204, 0, 43.5)
            this.whitePieces.chessSet.children[9].name = "p"
            this.whitePieces.chessSet.children[9].boardPosition = "c2"
            this.whitePieces.chessSet.children[9].position.set(-148, 0, 43.5)
            this.whitePieces.chessSet.children[10].name = "p"
            this.whitePieces.chessSet.children[10].boardPosition = "d2"
            this.whitePieces.chessSet.children[10].position.set(-193, 0, 43.5)
            this.whitePieces.chessSet.children[11].name = "p"
            this.whitePieces.chessSet.children[11].boardPosition = "e2"
            this.whitePieces.chessSet.children[11].position.set(-87, 0, -6.5)
            this.whitePieces.chessSet.children[12].name = "p"
            this.whitePieces.chessSet.children[12].boardPosition = "f2"
            this.whitePieces.chessSet.children[12].position.set(-82, 0, -6.5)
            this.whitePieces.chessSet.children[13].name = "p"
            this.whitePieces.chessSet.children[13].boardPosition = "g2"
            this.whitePieces.chessSet.children[13].position.set(-76, 0, -6.5)
            this.whitePieces.chessSet.children[14].name = "p"
            this.whitePieces.chessSet.children[14].boardPosition = "h2"
            this.whitePieces.chessSet.children[14].position.set(-71, 0, -6.5)
            this.whitePieces.chessSet.children[15].name = "k"
            this.whitePieces.chessSet.children[15].boardPosition = "g1"
            this.whitePieces.chessSet.children[15].position.set(-51, 0, -11.5)
        };
        setTimeout(() => {
            this.blackPieces = new Model(this.scene, this.manager2);
            this.blackPieces.load(chess)

            this.manager2.onLoad = () => {

                this.isLoaded = true;
                //
                console.log("MODEL LOADED!!!")
                console.log(this.blackPieces)
                this.scene.add(this.blackPieces.chessSet)

                this.blackPieces.chessSet.scale.set(0.37, 0.37, 0.37)

                this.blackPieces.chessSet.children.forEach(mesh => {
                    mesh.material.color.set(0x404040)
                });

                //!!! przesunięcie o jedno polę po osi x lub z == 30.5
                this.blackPieces.chessSet.children[0].name = "q"
                this.blackPieces.chessSet.children[0].boardPosition = "d8"
                this.blackPieces.chessSet.children[0].position.set(-193, 0, 202)
                this.blackPieces.chessSet.children[1].name = "r"
                this.blackPieces.chessSet.children[1].boardPosition = "a8"
                this.blackPieces.chessSet.children[1].position.set(-284, 0, 151)
                this.blackPieces.chessSet.children[2].name = "p"
                this.blackPieces.chessSet.children[2].boardPosition = "a7"
                this.blackPieces.chessSet.children[2].position.set(-259, 0, 196)
                this.blackPieces.chessSet.children[3].name = "b"
                this.blackPieces.chessSet.children[3].boardPosition = "c8"
                this.blackPieces.chessSet.children[3].position.set(-198, 0, 202)
                this.blackPieces.chessSet.children[4].name = "k"
                this.blackPieces.chessSet.children[4].boardPosition = "e8"
                this.blackPieces.chessSet.children[4].position.set(-87, 0, 151)
                this.blackPieces.chessSet.children[5].name = "r"
                this.blackPieces.chessSet.children[5].boardPosition = "h8"
                this.blackPieces.chessSet.children[5].position.set(4, 0, 202)
                this.blackPieces.chessSet.children[6].name = "n"
                this.blackPieces.chessSet.children[6].boardPosition = "b8"
                this.blackPieces.chessSet.children[6].position.set(-229, 0, 151)
                this.blackPieces.chessSet.children[7].name = "b"
                this.blackPieces.chessSet.children[7].boardPosition = "f8"
                this.blackPieces.chessSet.children[7].position.set(-81, 0, 151)
                this.blackPieces.chessSet.children[8].name = "p"
                this.blackPieces.chessSet.children[8].boardPosition = "b7"
                this.blackPieces.chessSet.children[8].position.set(-204, 0, 196)
                this.blackPieces.chessSet.children[9].name = "p"
                this.blackPieces.chessSet.children[9].boardPosition = "c7"
                this.blackPieces.chessSet.children[9].position.set(-148, 0, 196)
                this.blackPieces.chessSet.children[10].name = "p"
                this.blackPieces.chessSet.children[10].boardPosition = "d7"
                this.blackPieces.chessSet.children[10].position.set(-193, 0, 196)
                this.blackPieces.chessSet.children[11].name = "p"
                this.blackPieces.chessSet.children[11].boardPosition = "e7"
                this.blackPieces.chessSet.children[11].position.set(-87, 0, 146)
                this.blackPieces.chessSet.children[12].name = "p"
                this.blackPieces.chessSet.children[12].boardPosition = "f7"
                this.blackPieces.chessSet.children[12].position.set(-82, 0, 146)
                this.blackPieces.chessSet.children[13].name = "p"
                this.blackPieces.chessSet.children[13].boardPosition = "g7"
                this.blackPieces.chessSet.children[13].position.set(-76, 0, 146)
                this.blackPieces.chessSet.children[14].name = "p"
                this.blackPieces.chessSet.children[14].boardPosition = "h7"
                this.blackPieces.chessSet.children[14].position.set(-71, 0, 146)
                this.blackPieces.chessSet.children[15].name = "n"
                this.blackPieces.chessSet.children[15].boardPosition = "g8"
                this.blackPieces.chessSet.children[15].position.set(-51, 0, 202)

                console.log("raycaster")
                this.raycaster = new Collisions(this.scene, this.camera, this.whitePieces, this.blackPieces, this.pieces, this.websocket, this.fieldsMap)

                this.puzle()

                this.render();
            };
        }, 800)



        let materials = []
        materials[0] = new MeshStandardMaterial({ side: DoubleSide, map: new TextureLoader().load(boardSideTexture) })
        materials[1] = new MeshStandardMaterial({ side: DoubleSide, map: new TextureLoader().load(boardSideTexture) })
        materials[2] = new MeshStandardMaterial({ side: DoubleSide, map: new TextureLoader().load(boardTopTexture) })
        materials[3] = new MeshStandardMaterial({ side: DoubleSide, map: new TextureLoader().load(boardBottomTexture) })
        materials[4] = new MeshStandardMaterial({ side: DoubleSide, map: new TextureLoader().load(boardSideTexture) })
        materials[5] = new MeshStandardMaterial({ side: DoubleSide, map: new TextureLoader().load(boardSideTexture) })

        this.board = new Mesh(new BoxGeometry(100, 5, 100), materials)
        this.board.position.set(0, -2.5, 0)

        this.scene.add(this.board)

        //!! do późniejszego wywalenia
        const axes = new AxesHelper(1000)
        this.board.add(axes)
    }

    puzle() {
        // this.usedW = []
        // this.usedB = []
        // for (let i = 0; i < 8; i++) { // i = numerki
        //     for (let j = 0; j < 8; j++) { // j = literki
        //         if (this.board[i][j] != null) {
        //             if (this.board[i][j].color = "b") {
        //                 let restOfPieces = this.blackPieces.chessSet.children
        //                 for (let k = 0; k < this.usedB; k++) {
        //                     restOfPieces = restOfPieces.filter(x => x.uuid != this.usedB[k].uuid)
        //                 }
        //                 restOfPieces = restOfPieces.filter(x => x.type == this.board[i][j])[0]
        //                 this.piecePos = restOfPieces.boardPosition
        //                 let x
        //                 let z
        //                 x = this.fieldsMap.get(this.piecePos[0]) - j
        //                 z = parseInt(this.piecePos.boardPosition[1]) - i

        //                 if (Math.abs(30.5 * x) > Math.abs(30.5 * z)) {
        //                     this.v2 = new Vector3(this.toMove[0].position.x - 30.5 * x, 0, this.toMove[0].position.z - 30.5 * z)
        //                 } else {
        //                     this.v2 = new Vector3(this.toMove[0].position.x - 30.5 * x, 0, this.toMove[0].position.z - 30.5 * z)
        //                 }

        //                 console.log(this.v2)

        //                 this.boardPosition = this.destPos

        //                 console.log(this.board[i][j])
        //             }
        //             if (this.board[i][j].color = "w") {
        //                 console.log(this.board[i][j])
        //             }
        //         }

        //     }
        // }
    }

    render() {

        console.log("render leci")


        // początek pomiaru wydajności
        this.stats.begin()

        this.renderer.render(this.scene, this.camera);

        this.raycaster.updatePos()

        // koniec statystyk
        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }
}