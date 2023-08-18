import * as BABYLON from "@babylonjs/core";

export class GroundMesh {
  public static buildGround() {
    //Create Village ground
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseTexture = new BABYLON.Texture(
      "/environments/villagegreen.png"
    );
    groundMat.diffuseTexture.hasAlpha = true;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
      width: 24,
      height: 24,
    });
    ground.material = groundMat;

    //large ground
    const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new BABYLON.Texture(
      "/environments/valleygrass.png"
    );

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
      "largeGround",
      "/environments/villageheightmap.png",
      { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
    );
    largeGround.material = largeGroundMat;
    largeGround.position.y = -0.01;

    return ground;
  }
}
