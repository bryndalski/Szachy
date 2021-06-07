
import { GLTFLoader } from "./GLTFLoader.js"

export default class Model {
    constructor(scene, manager) {
        this.scene = scene;
        // this.mesh = null;
        this.manager = manager;
        // this.geometry = null
    }

    load(path) {
        // loader plików gltf <= próbowałem go przerobić na klasy
        // var mixer
        const loader = new GLTFLoader(this.manager);

        loader.load(path,
            function (gltf) {

                this.chessSet = gltf.scene.children[0]

            }.bind(this)
        );
    }

    unload() {
        this.scene.remove(this.model); // ew funkcja do usunięcia modelu ze sceny
    }
}