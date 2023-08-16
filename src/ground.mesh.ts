import * as BABYLON from "@babylonjs/core";

export class GroundMesh {
  public static buildGround() {
    //color
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
      width: 15,
      height: 16,
    });
    ground.material = groundMat;
  }
}
