import * as BABYLON from "@babylonjs/core";
import earcut from "earcut";

export class CarMesh {
  static buildCar(scene: BABYLON.Scene) {
    //base
    const outline = [
      new BABYLON.Vector3(-0.3, 0, -0.1),
      new BABYLON.Vector3(0.2, 0, -0.1),
    ];

    //curved front
    for (let i = 0; i < 20; i++) {
      outline.push(
        new BABYLON.Vector3(
          0.2 * Math.cos((i * Math.PI) / 40),
          0,
          0.2 * Math.sin((i * Math.PI) / 40) - 0.1
        )
      );
    }

    //top
    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    //back formed automatically

    //car face UVs
    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

    //car material
    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/car.png"
    );

    const car = BABYLON.MeshBuilder.ExtrudePolygon(
      "car",
      {
        shape: outline,
        depth: 0.2,
        faceUV: faceUV,
        wrap: true,
      },
      scene,
      earcut
    );
    car.material = carMat;

    //wheel face UVs
    const wheelUV = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    //car material
    const wheelMat = new BABYLON.StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/wheel.png"
    );

    const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {
      diameter: 0.125,
      height: 0.05,
      faceUV: wheelUV,
    });
    wheelRB.material = wheelMat;
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    //Animate the Wheels
    const animWheel = new BABYLON.Animation(
      "wheelAnimation",
      "rotation.y",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const wheelKeys = [];

    //At the animation key 0, the value of rotation.y is 0
    wheelKeys.push({
      frame: 0,
      value: 0,
    });

    //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
    wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI,
    });

    //set the keys
    animWheel.setKeys(wheelKeys);

    //Link this animation to a wheel
    wheelRB.animations = [];
    wheelRB.animations.push(animWheel);

    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;

    return car;
  }
}
