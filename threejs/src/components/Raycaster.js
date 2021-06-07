import { Raycaster, Vector2 } from "three"

export default class Collisions extends Raycaster {
    constructor(scene, camera, whitePieces, BlackPieces) {
        super()
        this.scene = scene
        this.camera = camera
        this.whitePieces = whitePieces
        this.BlackPieces = BlackPieces

        window.addEventListener('click', (e) => {
            this.mouseVector = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
            this.setFromCamera(this.mouseVector, this.camera);
            this.intersects = this.intersectObjects(this.whitePieces.chessSet.children);
            if (this.intersects[0]) {
                this.distances = this.intersects.map(x => x.distance)
                this.intersects = this.intersects.filter(x => x.distance == Math.min(...this.distances))
                this.intersects[0].object.position.z += 30.5
            }
        });
    }

}