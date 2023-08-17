import * as BABYLON from "@babylonjs/core";

export class FountainMesh {
  constructor(private scene: BABYLON.Scene) {
    this.buildFountain();
  }

  buildFountain() {
    const scene = this.scene;
    const fountainOutline = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0.5, 0, 0),
      new BABYLON.Vector3(0.5, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.05, 0),
      new BABYLON.Vector3(0.05, 0.1, 0),
      new BABYLON.Vector3(0.05, 0.8, 0),
      new BABYLON.Vector3(0.15, 0.9, 0),
    ];

    //Create lathed fountain
    const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {
      shape: fountainOutline,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });
    fountain.position.x = -4;
    fountain.position.z = -6;

    //Switch fountain on and off
    let switched = false;
    const pointerDown = (mesh) => {
      if (mesh === fountain) {
        switched = !switched;
        if (switched) {
          // Start the particle system
          particleSystem.start();
        } else {
          // Stop the particle system
          particleSystem.stop();
        }
      }
    };

    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (pointerInfo.pickInfo.hit) {
            pointerDown(pointerInfo.pickInfo.pickedMesh);
          }
          break;
      }
    });

    // Create a particle system
    const particleSystem = new BABYLON.ParticleSystem("particles", 5000);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png");

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(-4, 0.8, -6); // emitted from the top of the fountain
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.01, 0, -0.01); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.01, 0, 0.01); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-1, 8, 1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 8, -1);

    // Power and speed
    particleSystem.minEmitPower = 0.2;
    particleSystem.maxEmitPower = 0.6;
    particleSystem.updateSpeed = 0.01;
  }
}
