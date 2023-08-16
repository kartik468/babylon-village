import * as BABYLON from "@babylonjs/core";
export class HouseMesh {
  public static buildHouse(width: number) {
    const box = HouseMesh.buildBox(width);
    const roof = HouseMesh.buildRoof(width);

    return BABYLON.Mesh.MergeMeshes(
      [box, roof],
      true,
      false,
      null as any,
      false,
      true
    );
  }
  public static buildBox(width: number) {
    //texture
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    if (width == 2) {
      boxMat.diffuseTexture = new BABYLON.Texture(
        "https://assets.babylonjs.com/environments/semihouse.png"
      );
    } else {
      boxMat.diffuseTexture = new BABYLON.Texture(
        "https://assets.babylonjs.com/environments/cubehouse.png"
      );
    }

    //options parameter to set different images on each side
    const faceUV = [];
    if (width == 2) {
      faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
    } else {
      faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
    }
    // top 4 and bottom 5 not seen so not set

    /**** World Objects *****/
    const box = BABYLON.MeshBuilder.CreateBox("box", {
      width: width,
      faceUV: faceUV,
      wrap: true,
    });
    box.material = boxMat;
    box.position.y = 0.5;

    return box;
  }

  public static buildRoof(width: number) {
    //texture
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/roof.jpg"
    );

    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
      diameter: 1.3,
      height: 1.2,
      tessellation: 3,
    });
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.scaling.y = width;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    return roof;
  }
}
