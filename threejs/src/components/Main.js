import Renderer from "./Renderer";
import Camera from "./Camera";

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
  Object3D,
  MeshBasicMaterial,
} from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import Model from "./Model";
import { OrbitControls } from "./OrbitControls.js";
import chess from "./assets/Chess_set.glb";
import boardTopTexture from "./assets/chessBoardTop.png";
import boardSideTexture from "./assets/chessBoardSide.png";
import boardBottomTexture from "./assets/chessBoardBottom.jpg";
import Collisions from "./Raycaster.js";

const mapa = require("./assets/mapa.js");

export default class Main {
  constructor(container) {
    // właściwości klasy
    this.container = container;
    this.scene = new Scene();

    // połączenie z websocketem i pobranie danych o kolorze pionków
    this.websocket = new WebSocket(
      `wss://${window.location.hostname}:${window.location.port}/sockets/Szaszki`
    );
    // this.websocket = new WebSocket(`ws://localhost:5500/sockets/Szaszki`)

    this.websocket.onopen = (e) => {
      this.websocket.send(JSON.stringify({ type: "init" }));
    };

    this.pieces = {};

    this.greenFields = [];

    // odbieranie danych z serwera
    this.websocket.onmessage = (e) => {
      this.data = JSON.parse(e.data);
      console.log(this.data);
      switch (this.data.type) {
        case "init":
          this.pieces = this.data;
          this.Board = this.data.board;
          break;
        case "moveOptions":
          console.log(this.data.moves);

          /*
                        podczas generowania zielonych pól dla dozwolonych ruchów pole a1 jest równe -39.5, -39.5
                        kolejna plansza w każdą stronę będzie przesunięta o 11.25
                    */
          this.greenFields.forEach((mesh) => this.scene.remove(mesh));
          this.greenFields = [];
          this.scene.remove(this.selectedPiece);

          this.selectedPiece = new Mesh(
            new PlaneGeometry(10, 10),
            new MeshStandardMaterial({ color: 0xe6d30b })
          );
          this.selectedPiece.boardPosition = this.data.clicked;
          this.selectedPiece.rotation.x = -Math.PI / 2;
          let x = 0;
          let z = 0;
          if (this.data.clicked.length == 3) {
            for (const property in mapa) {
              if (this.data.clicked[1] + this.data.clicked[2] == property) {
                x = mapa[property][0];
                z = mapa[property][1];
                break;
              }
            }
            this.selectedPiece.position.set(x, 0.25, z);
          } else {
            for (const property in mapa) {
              if (this.data.clicked == property) {
                x = mapa[property][0];
                z = mapa[property][1];
                break;
              }
            }
            this.selectedPiece.position.set(x, 0.25, z);
          }
          this.scene.add(this.selectedPiece);

          this.data.moves.forEach((pos) => {
            if (
              (pos.includes("+") == true || pos.includes("#") == true) &&
              pos != "O-O" &&
              pos != "O-O-O"
            ) {
              pos = pos.substr(0, pos.length - 1);
            }
            if (pos.includes("x") == false && pos != "O-O" && pos != "O-O-O") {
              this.plane = new Mesh(
                new PlaneGeometry(10, 10),
                new MeshStandardMaterial({ color: 0x2cde62 })
              );
              this.plane.boardPosition = pos;
            } else if (
              pos.includes("x") == true &&
              pos != "O-O" &&
              pos != "O-O-O"
            ) {
              this.plane = new Mesh(
                new PlaneGeometry(10, 10),
                new MeshStandardMaterial({ color: 0xc21f0a })
              );
              let temp = pos.split("x");
              pos = "x" + temp[1];
              this.plane.boardPosition = pos;
            }
            if (pos == "O-O") {
              this.plane = new Mesh(
                new PlaneGeometry(10, 10),
                new MeshStandardMaterial({ color: 0x2cde62 })
              );
              this.plane.boardPosition = pos;
              pos = "g1";
            }
            if (pos == "O-O-O") {
              this.plane = new Mesh(
                new PlaneGeometry(10, 10),
                new MeshStandardMaterial({ color: 0x2cde62 })
              );
              this.plane.boardPosition = pos;
              pos = "c1";
            }

            this.plane.rotation.x = -Math.PI / 2;
            if (pos.length == 3) {
              for (const property in mapa) {
                if (pos[1] + pos[2] == property) {
                  x = mapa[property][0];
                  z = mapa[property][1];
                  break;
                }
              }
              this.plane.position.set(x, 0.25, z);
            } else {
              for (const property in mapa) {
                if (pos == property) {
                  x = mapa[property][0];
                  z = mapa[property][1];
                  break;
                }
              }
              this.plane.position.set(x, 0.25, z);
            }
            this.scene.add(this.plane);
            this.greenFields.push(this.plane);
          });

          // przekazanie do raycastera pól do wyboru oraz pozycji zaznaczonego elementu
          this.raycaster.greenFields = this.greenFields;
          this.raycaster.selectedPiece = this.selectedPiece;

          break;

        case "move":
          if (
            this.data.ischeck ||
            this.data.ischeckmate ||
            this.data.isstalemate ||
            this.data.isdraw
          ) {
            console.log(
              this.data.ischeck,
              this.data.ischeckmate,
              this.data.isdraw,
              this.data.isstalemate
            );
            if (this.data.ischeck) {
              this.Board = this.data.board;
              this.puzle();
              alert("check");
            }
            if (this.data.ischeckmate) {
              alert("koniec gry");
              this.websocket.send(JSON.stringify({ type: "end" }));
              this.raycaster = "";
            }
            if (this.data.isstalemate) {
              alert("koniec gry");
              this.websocket.send(JSON.stringify({ type: "end" }));
              this.raycaster = "";
            }
            if (this.data.isdraw) {
              alert("koniec gry");
              this.websocket.send(JSON.stringify({ type: "end" }));
              this.raycaster = "";
            }
          } else {
            this.Board = this.data.board;
            this.puzle();
          }
          break;
        case "end":
          alert(`wygrał ${this.data.winner}`);
          break;
      }
    };

    // właściwości klasy ciąg dalszy
    this.renderer = new Renderer(this.scene, container);
    this.camera = new Camera(
      75,
      this.renderer.threeRenderer.domElement.width,
      this.renderer.threeRenderer.domElement.height
    );
    this.camera.position.set(0, 90, 0);
    this.camera.lookAt(0, 0, 0);

    this.light = new AmbientLight(0xffffff);
    this.scene.add(this.light);

    const controls = new OrbitControls(
      this.camera,
      this.renderer.threeRenderer.domElement
    );

    const gridHelper = new GridHelper(10000, 100);
    this.scene.add(gridHelper);

    //stats - statystyki wydajności

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb

    document.body.appendChild(this.stats.dom);

    // zegar - vide lekcja 4

    this.clock = new Clock();

    // manager loadingu, pozwala monitorować progress oraz fakt zakończenia ładowania

    this.manager = new LoadingManager();
    this.manager2 = new LoadingManager();

    // model
    this.white = new Model(this.scene, this.manager);
    this.white.load(chess);

    this.manager.onLoad = () => {
      this.whitePieces = [];
      this.meshWhitePieces = [];
      this.white.chessSet.children.forEach((mesh) => {
        mesh.material.color.set(0xeaebda);
        this.obj = new Object3D();
        this.obj.add(mesh.clone());
        this.obj.children[0].scale.set(0.37, 0.37, 0.37);
        this.whitePieces.push(this.obj);
        this.scene.add(this.obj);
        this.obj.position.set(0, 0, 0);
        this.meshWhitePieces.push(this.obj.children[0]);
      });

      this.whitePieces[0].name = "q";
      this.whitePieces[0].boardPosition = "d1";
      this.whitePieces[0].children[0].position.set(-66, 0, 35.25);
      this.whitePieces[1].name = "r";
      this.whitePieces[1].boardPosition = "a1";
      this.whitePieces[1].children[0].position.set(-65.5, 0, 16.5);
      this.whitePieces[2].name = "p";
      this.whitePieces[2].boardPosition = "a2";
      this.whitePieces[2].children[0].position.set(-56.5, 0, 44.5);
      this.whitePieces[3].name = "b";
      this.whitePieces[3].boardPosition = "c1";
      this.whitePieces[3].children[0].position.set(-56.5, 0, 35);
      this.whitePieces[4].name = "k";
      this.whitePieces[4].boardPosition = "e1";
      this.whitePieces[4].children[0].position.set(-37.5, 0, 16.5);
      this.whitePieces[5].name = "r";
      this.whitePieces[5].boardPosition = "h1";
      this.whitePieces[5].children[0].position.set(-38, 0, 35);
      this.whitePieces[6].name = "n";
      this.whitePieces[6].boardPosition = "b1";
      this.whitePieces[6].children[0].position.set(-56.5, 0, 16.5);
      this.whitePieces[7].name = "b";
      this.whitePieces[7].boardPosition = "f1";
      this.whitePieces[7].children[0].position.set(-47, 0, 16.5);
      this.whitePieces[8].name = "p";
      this.whitePieces[8].boardPosition = "b2";
      this.whitePieces[8].children[0].position.set(-47, 0, 44.5);
      this.whitePieces[9].name = "p";
      this.whitePieces[9].boardPosition = "c2";
      this.whitePieces[9].children[0].position.set(-38, 0, 44.5);
      this.whitePieces[10].name = "p";
      this.whitePieces[10].boardPosition = "d2";
      this.whitePieces[10].children[0].position.set(-65.5, 0, 44.5);
      this.whitePieces[11].name = "p";
      this.whitePieces[11].boardPosition = "e2";
      this.whitePieces[11].children[0].position.set(-38, 0, 26);
      this.whitePieces[12].name = "p";
      this.whitePieces[12].boardPosition = "f2";
      this.whitePieces[12].children[0].position.set(-47, 0, 26);
      this.whitePieces[13].name = "p";
      this.whitePieces[13].boardPosition = "g2";
      this.whitePieces[13].children[0].position.set(-56.5, 0, 26);
      this.whitePieces[14].name = "p";
      this.whitePieces[14].boardPosition = "h2";
      this.whitePieces[14].children[0].position.set(-65.5, 0, 26);
      this.whitePieces[15].name = "k";
      this.whitePieces[15].boardPosition = "g1";
      this.whitePieces[15].children[0].position.set(-47, 0, 35);
    };
    setTimeout(() => {
      this.black = new Model(this.scene, this.manager2);
      this.black.load(chess);

      this.manager2.onLoad = () => {
        this.blackPieces = [];
        this.meshBlackPieces = [];
        this.black.chessSet.children.forEach((mesh) => {
          mesh.material.color.set(0x404040);
          this.obj = new Object3D();
          this.obj.add(mesh.clone());
          this.obj.children[0].scale.set(0.37, 0.37, 0.37);
          this.blackPieces.push(this.obj);
          this.scene.add(this.obj);
          this.obj.position.set(0, 0, 0);
          this.meshBlackPieces.push(this.obj.children[0]);
        });
        this.blackPieces[0].name = "q";
        this.blackPieces[0].boardPosition = "d8";
        this.blackPieces[0].children[0].position.set(-66, 0, 35.25);
        this.blackPieces[1].name = "r";
        this.blackPieces[1].boardPosition = "a8";
        this.blackPieces[1].children[0].position.set(-65.5, 0, 16.5);
        this.blackPieces[2].name = "p";
        this.blackPieces[2].boardPosition = "a7";
        this.blackPieces[2].children[0].position.set(-56.5, 0, 44.5);
        this.blackPieces[3].name = "b";
        this.blackPieces[3].boardPosition = "c8";
        this.blackPieces[3].children[0].position.set(-56.5, 0, 35);
        this.blackPieces[4].name = "k";
        this.blackPieces[4].boardPosition = "e8";
        this.blackPieces[4].children[0].position.set(-37.5, 0, 16.5);
        this.blackPieces[5].name = "r";
        this.blackPieces[5].boardPosition = "h8";
        this.blackPieces[5].children[0].position.set(-38, 0, 35);
        this.blackPieces[6].name = "n";
        this.blackPieces[6].boardPosition = "b8";
        this.blackPieces[6].children[0].position.set(-56.5, 0, 16.5);
        this.blackPieces[7].name = "b";
        this.blackPieces[7].boardPosition = "f8";
        this.blackPieces[7].children[0].position.set(-47, 0, 16.5);
        this.blackPieces[8].name = "p";
        this.blackPieces[8].boardPosition = "b7";
        this.blackPieces[8].children[0].position.set(-47, 0, 44.5);
        this.blackPieces[9].name = "p";
        this.blackPieces[9].boardPosition = "c7";
        this.blackPieces[9].children[0].position.set(-38, 0, 44.5);
        this.blackPieces[10].name = "p";
        this.blackPieces[10].boardPosition = "d7";
        this.blackPieces[10].children[0].position.set(-65.5, 0, 44.5);
        this.blackPieces[11].name = "p";
        this.blackPieces[11].boardPosition = "e7";
        this.blackPieces[11].children[0].position.set(-38, 0, 26);
        this.blackPieces[12].name = "p";
        this.blackPieces[12].boardPosition = "f7";
        this.blackPieces[12].children[0].position.set(-47, 0, 26);
        this.blackPieces[13].name = "p";
        this.blackPieces[13].boardPosition = "g7";
        this.blackPieces[13].children[0].position.set(-56.5, 0, 26);
        this.blackPieces[14].name = "p";
        this.blackPieces[14].boardPosition = "h7";
        this.blackPieces[14].children[0].position.set(-65.5, 0, 26);
        this.blackPieces[15].name = "k";
        this.blackPieces[15].boardPosition = "g8";
        this.blackPieces[15].children[0].position.set(-47, 0, 35);

        this.puzle();

        this.raycaster = new Collisions(
          this.scene,
          this.camera,
          this.whitePieces,
          this.blackPieces,
          this.pieces,
          this.websocket,
          mapa,
          this.Board,
          this.meshWhitePieces,
          this.meshBlackPieces
        );

        this.render();
      };
    }, 800);

    let materials = [];
    materials[0] = new MeshStandardMaterial({
      side: DoubleSide,
      map: new TextureLoader().load(boardSideTexture),
    });
    materials[1] = new MeshStandardMaterial({
      side: DoubleSide,
      map: new TextureLoader().load(boardSideTexture),
    });
    materials[2] = new MeshStandardMaterial({
      side: DoubleSide,
      map: new TextureLoader().load(boardTopTexture),
    });
    materials[3] = new MeshStandardMaterial({
      side: DoubleSide,
      map: new TextureLoader().load(boardBottomTexture),
    });
    materials[4] = new MeshStandardMaterial({
      side: DoubleSide,
      map: new TextureLoader().load(boardSideTexture),
    });
    materials[5] = new MeshStandardMaterial({
      side: DoubleSide,
      map: new TextureLoader().load(boardSideTexture),
    });

    this.board = new Mesh(new BoxGeometry(100, 5, 100), materials);
    this.board.position.set(0, -2.5, 0);

    this.scene.add(this.board);

    //!! do późniejszego wywalenia
    const axes = new AxesHelper(1000);
    this.board.add(axes);
  }

  puzle() {
    let x = 0;
    let z = 0;
    this.Board.forEach((square, index) => {
      if (square != null) {
        if (index < 16) {
          // białe pionki
          for (const property in mapa) {
            if (square == property) {
              x = mapa[property][0];
              z = mapa[property][1];
              break;
            }
          }
          this.whitePieces[index].position.set(x, 0, z);
          this.whitePieces[index].boardPosition = square;
        } else {
          // czarne pionki
          for (const property in mapa) {
            if (square == property) {
              x = mapa[property][0];
              z = mapa[property][1];
              break;
            }
          }
          this.blackPieces[index % 16].position.set(x, 0, z);
          this.blackPieces[index % 16].boardPosition = square;
        }
      } else {
        if (index < 16) {
          // białe pionki
          try {
            this.scene.remove(this.whitePieces[index]);
            this.whitePieces[index].boardPosition = null;
          } catch {}
        } else {
          // czarne pionki
          try {
            this.scene.remove(this.blackPieces[index % 16]);
            this.blackPieces[index % 16].boardPosition = null;
          } catch {}
        }
      }
    });
  }

  render() {
    // początek pomiaru wydajności
    this.stats.begin();

    this.renderer.render(this.scene, this.camera);

    //this.raycaster.updatePos()

    // koniec statystyk
    this.stats.end();

    requestAnimationFrame(this.render.bind(this));
  }
}
