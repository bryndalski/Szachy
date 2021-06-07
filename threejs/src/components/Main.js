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

        this.blackPieces = new Model(this.scene, this.manager2);
        this.blackPieces.load(chess)

        this.manager.onLoad = () => {
            console.log("MODEL LOADED!!!")
            console.log(this.whitePieces)
            this.scene.add(this.whitePieces.chessSet)

            this.whitePieces.chessSet.scale.set(0.37, 0.37, 0.37)

            this.whitePieces.chessSet.children.forEach((mesh, index) => {
                mesh.material.color.set(0xeaebda)
            });

            //!!! przesunięcie o jedno polę po osi x lub y == 30.5s
            this.whitePieces.chessSet.children[0].name = "whiteQueen"
            this.whitePieces.chessSet.children[0].boardPosition = "d1"
            this.whitePieces.chessSet.children[0].position.set(-193, 0, -11.5)
            this.whitePieces.chessSet.children[1].name = "whiteTower1"
            this.whitePieces.chessSet.children[1].boardPosition = "a1"
            this.whitePieces.chessSet.children[1].position.set(-284, 0, -62.5)
            this.whitePieces.chessSet.children[2].name = "whitePawn1"
            this.whitePieces.chessSet.children[2].boardPosition = "a2"
            this.whitePieces.chessSet.children[2].position.set(-259, 0, 43.5)
            this.whitePieces.chessSet.children[3].name = "whiteBishop1"
            this.whitePieces.chessSet.children[3].boardPosition = "c1"
            this.whitePieces.chessSet.children[3].position.set(-198, 0, -11.5)
            this.whitePieces.chessSet.children[4].name = "whiteKing"
            this.whitePieces.chessSet.children[4].boardPosition = "e1"
            this.whitePieces.chessSet.children[4].position.set(-87, 0, -62.5)
            this.whitePieces.chessSet.children[5].name = "whiteTower2"
            this.whitePieces.chessSet.children[5].boardPosition = "h1"
            this.whitePieces.chessSet.children[5].position.set(4, 0, -11.5)
            this.whitePieces.chessSet.children[6].name = "whiteKnight1"
            this.whitePieces.chessSet.children[6].boardPosition = "b1"
            this.whitePieces.chessSet.children[6].position.set(-229, 0, -62.5)
            this.whitePieces.chessSet.children[7].name = "whiteBishop2"
            this.whitePieces.chessSet.children[7].boardPosition = "f1"
            this.whitePieces.chessSet.children[7].position.set(-81, 0, -62.5)
            this.whitePieces.chessSet.children[8].name = "whitePawn2"
            this.whitePieces.chessSet.children[8].boardPosition = "b2"
            this.whitePieces.chessSet.children[8].position.set(-204, 0, 43.5)
            this.whitePieces.chessSet.children[9].name = "whitePawn3"
            this.whitePieces.chessSet.children[9].boardPosition = "c2"
            this.whitePieces.chessSet.children[9].position.set(-148, 0, 43.5)
            this.whitePieces.chessSet.children[10].name = "whitePawn4"
            this.whitePieces.chessSet.children[10].boardPosition = "d2"
            this.whitePieces.chessSet.children[10].position.set(-193, 0, 43.5)
            this.whitePieces.chessSet.children[11].name = "whitePawn5"
            this.whitePieces.chessSet.children[11].boardPosition = "e2"
            this.whitePieces.chessSet.children[11].position.set(-87, 0, -6.5)
            this.whitePieces.chessSet.children[12].name = "whitePawn6"
            this.whitePieces.chessSet.children[12].boardPosition = "f2"
            this.whitePieces.chessSet.children[12].position.set(-82, 0, -6.5)
            this.whitePieces.chessSet.children[13].name = "whitePawn7"
            this.whitePieces.chessSet.children[13].boardPosition = "g2"
            this.whitePieces.chessSet.children[13].position.set(-76, 0, -6.5)
            this.whitePieces.chessSet.children[14].name = "whitePawn8"
            this.whitePieces.chessSet.children[14].boardPosition = "h2"
            this.whitePieces.chessSet.children[14].position.set(-71, 0, -6.5)
            this.whitePieces.chessSet.children[15].name = "whiteKnight2"
            this.whitePieces.chessSet.children[15].boardPosition = "g1"
            this.whitePieces.chessSet.children[15].position.set(-51, 0, -11.5)
        };
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

            //!!! przesunięcie o jedno polę po osi x lub y == 30.5
            this.blackPieces.chessSet.children[0].name = "blackQueen"
            this.blackPieces.chessSet.children[0].boardPosition = "d8"
            this.blackPieces.chessSet.children[0].position.set(-193, 0, 202)
            this.blackPieces.chessSet.children[1].name = "blackTower1"
            this.blackPieces.chessSet.children[1].boardPosition = "a8"
            this.blackPieces.chessSet.children[1].position.set(-284, 0, 151)
            this.blackPieces.chessSet.children[2].name = "blackPawn1"
            this.blackPieces.chessSet.children[2].boardPosition = "a7"
            this.blackPieces.chessSet.children[2].position.set(-259, 0, 196)
            this.blackPieces.chessSet.children[3].name = "blackBishop1"
            this.blackPieces.chessSet.children[3].boardPosition = "c8"
            this.blackPieces.chessSet.children[3].position.set(-198, 0, 202)
            this.blackPieces.chessSet.children[4].name = "blackKing"
            this.blackPieces.chessSet.children[4].boardPosition = "e8"
            this.blackPieces.chessSet.children[4].position.set(-87, 0, 151)
            this.blackPieces.chessSet.children[5].name = "blackTower2"
            this.blackPieces.chessSet.children[5].boardPosition = "h8"
            this.blackPieces.chessSet.children[5].position.set(4, 0, 202)
            this.blackPieces.chessSet.children[6].name = "blackKnight1"
            this.blackPieces.chessSet.children[6].boardPosition = "b8"
            this.blackPieces.chessSet.children[6].position.set(-229, 0, 151)
            this.blackPieces.chessSet.children[7].name = "blackBishop2"
            this.blackPieces.chessSet.children[7].boardPosition = "f8"
            this.blackPieces.chessSet.children[7].position.set(-81, 0, 151)
            this.blackPieces.chessSet.children[8].name = "blackPawn2"
            this.blackPieces.chessSet.children[8].boardPosition = "b7"
            this.blackPieces.chessSet.children[8].position.set(-204, 0, 196)
            this.blackPieces.chessSet.children[9].name = "blackPawn3"
            this.blackPieces.chessSet.children[9].boardPosition = "c7"
            this.blackPieces.chessSet.children[9].position.set(-148, 0, 196)
            this.blackPieces.chessSet.children[10].name = "blackPawn4"
            this.blackPieces.chessSet.children[10].boardPosition = "d7"
            this.blackPieces.chessSet.children[10].position.set(-193, 0, 196)
            this.blackPieces.chessSet.children[11].name = "blackPawn5"
            this.blackPieces.chessSet.children[11].boardPosition = "e7"
            this.blackPieces.chessSet.children[11].position.set(-87, 0, 146)
            this.blackPieces.chessSet.children[12].name = "blackPawn6"
            this.blackPieces.chessSet.children[12].boardPosition = "f7"
            this.blackPieces.chessSet.children[12].position.set(-82, 0, 146)
            this.blackPieces.chessSet.children[13].name = "blackPawn7"
            this.blackPieces.chessSet.children[13].boardPosition = "g7"
            this.blackPieces.chessSet.children[13].position.set(-76, 0, 146)
            this.blackPieces.chessSet.children[14].name = "blackPawn8"
            this.blackPieces.chessSet.children[14].boardPosition = "h7"
            this.blackPieces.chessSet.children[14].position.set(-71, 0, 146)
            this.blackPieces.chessSet.children[15].name = "blackKnight2"
            this.blackPieces.chessSet.children[15].boardPosition = "g8"
            this.blackPieces.chessSet.children[15].position.set(-51, 0, 202)


            this.raycaster = new Collisions(this.scene, this.camera, this.whitePieces, this.blackPieces)
            this.render();
        };

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

    render() {

        console.log("render leci")


        // początek pomiaru wydajności
        this.stats.begin()

        this.renderer.render(this.scene, this.camera);

        // koniec statystyk
        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }
}