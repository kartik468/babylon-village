import * as BABYLON from "@babylonjs/core";

export class LampMesh {
  lamp!: BABYLON.Mesh;
  lampLight!: BABYLON.SpotLight;

  constructor(private scene: BABYLON.Scene) {
    this.buildLamp();
  }

  buildLamp() {
    const scene = this.scene;
    //add a spotlight and later after a mesh lamp post and a bulb have been created
    //then will make the post a parent to the bulb and
    //the bulb to the parent
    const lampLight = new BABYLON.SpotLight(
      "lampLight",
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, -1, 0),
      Math.PI,
      1,
      scene
    );
    lampLight.diffuse = BABYLON.Color3.Yellow();

    //shape to extrude
    const lampShape = [];
    for (let i = 0; i < 20; i++) {
      lampShape.push(
        new BABYLON.Vector3(
          Math.cos((i * Math.PI) / 10),
          Math.sin((i * Math.PI) / 10),
          0
        )
      );
    }
    lampShape.push(lampShape[0]); //close shape

    //extrusion path
    const lampPath = [];
    lampPath.push(new BABYLON.Vector3(0, 0, 0));
    lampPath.push(new BABYLON.Vector3(0, 10, 0));
    for (let i = 0; i < 20; i++) {
      lampPath.push(
        new BABYLON.Vector3(
          1 + Math.cos(Math.PI - (i * Math.PI) / 40),
          10 + Math.sin(Math.PI - (i * Math.PI) / 40),
          0
        )
      );
    }
    lampPath.push(new BABYLON.Vector3(3, 11, 0));

    const yellowMat = new BABYLON.StandardMaterial("yellowMat");
    yellowMat.emissiveColor = BABYLON.Color3.Yellow();

    //extrude lamp
    const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {
      cap: BABYLON.Mesh.CAP_END,
      shape: lampShape,
      path: lampPath,
      scale: 0.5,
    });

    //add bulb
    const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", {
      diameterX: 1.5,
      diameterZ: 0.8,
    });

    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;

    // const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    //   width: 50,
    //   height: 50,
    // });

    this.lampLight = lampLight;
    this.lamp = lamp;
  }
}
