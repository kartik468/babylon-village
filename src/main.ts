import earcut from "earcut";
import "./style.css";
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Inspector } from "@babylonjs/inspector";
import { CarMesh } from "./car.mesh";
import { HouseMesh } from "./house.mesh";
import { GroundMesh } from "./ground.mesh";
import { AxesMesh } from "./axes.mesh";
import { Slide } from "./helper/Slide";
import { SkyMesh } from "./sky.mesh";
import { FountainMesh } from "./fountain.mesh";
import { LampMesh } from "./lamp.mesh";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
console.log(canvas);

const engine = new BABYLON.Engine(canvas);

let carReady = true;

// ===========
const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2.5,
    150,
    new BABYLON.Vector3(0, 60, 0)
  );
  camera.attachControl(canvas, true);

  camera.upperBetaLimit = Math.PI / 2.2;

  const light = new BABYLON.DirectionalLight(
    "dir01",
    new BABYLON.Vector3(0, -1, 1),
    scene
  );
  light.position = new BABYLON.Vector3(0, 50, -100);

  // Shadow generator
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

  addDayToNightControl(scene, light);

  addHitBox(scene);
  addDudeWalkingInVillage(scene, shadowGenerator, camera);
  // addDudeWalkingCollision(scene, shadowGenerator);

  // addSphereDemo(scene);
  const ground = GroundMesh.buildGround();
  (ground.material as BABYLON.StandardMaterial).maxSimultaneousLights = 5;
  ground.receiveShadows = true;

  buildHouses();

  buildCar(scene);

  addSky(scene);

  addTrees(scene);

  // addUFO(scene);

  addFountain(scene);

  addLamps(scene);

  AxesMesh.buildAxes(6, scene);
  return scene;
};

const addHitBox = (scene: BABYLON.Scene) => {
  const wireMat = new BABYLON.StandardMaterial("wireMat");
  wireMat.wireframe = true;

  const hitBox = BABYLON.MeshBuilder.CreateBox("hitBox", {
    width: 0.5,
    height: 0.6,
    depth: 4.5,
  });
  hitBox.material = wireMat;
  hitBox.position.x = 3.1;
  hitBox.position.y = 0.3;
  hitBox.position.z = -5;
};

const addDudeWalkingCollision = (
  scene: BABYLON.Scene,
  shadowGenerator: BABYLON.ShadowGenerator
) => {
  const track: Slide[] = [];
  track.push(new Slide(180, 2.5));
  track.push(new Slide(0, 5));
  BABYLON.SceneLoader.ImportMeshAsync(
    "him",
    "/scenes/Dude/",
    "Dude.babylon",
    scene
  ).then((result) => {
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    shadowGenerator.addShadowCaster(dude, true);

    dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.LOCAL
    );
    const startRotation = dude.rotationQuaternion.clone();

    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      const carMesh = scene.getMeshByName("car");
      const hitBox = scene.getMeshByName("hitBox");
      if (carReady) {
        if (
          !dude.getChildren()[1].intersectsMesh(hitBox) &&
          carMesh.intersectsMesh(hitBox)
        ) {
          return;
        }
      }
      dude.movePOV(0, 0, step);
      distance += step;

      if (distance > track[p].dist) {
        dude.rotate(
          BABYLON.Axis.Y,
          BABYLON.Tools.ToRadians(track[p].turn),
          BABYLON.Space.LOCAL
        );
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });
  });
};

const addDudeWalkingInVillage = (
  scene: BABYLON.Scene,
  shadowGenerator: BABYLON.ShadowGenerator,
  camera: BABYLON.ArcRotateCamera
) => {
  const track: Slide[] = [];
  track.push(new Slide(86, 7));
  track.push(new Slide(-85, 14.8));
  track.push(new Slide(-93, 16.5));
  track.push(new Slide(48, 25.5));
  track.push(new Slide(-112, 30.5));
  track.push(new Slide(-72, 33.2));
  track.push(new Slide(42, 37.5));
  track.push(new Slide(-98, 45.2));
  track.push(new Slide(0, 47));

  // https://playground.babylonjs.com/#SFW46K#1
  BABYLON.SceneLoader.ImportMeshAsync(
    "him",
    "/scenes/Dude/",
    "Dude.babylon",
    scene
  ).then((result) => {
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    shadowGenerator.addShadowCaster(dude, true);

    camera.parent = dude;

    dude.position = new BABYLON.Vector3(-6, 0, 0);
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-95),
      BABYLON.Space.LOCAL
    );
    const startRotation = dude.rotationQuaternion.clone();

    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
      distance += step;

      if (distance > track[p].dist) {
        dude.rotate(
          BABYLON.Axis.Y,
          BABYLON.Tools.ToRadians(track[p].turn),
          BABYLON.Space.LOCAL
        );
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new BABYLON.Vector3(-6, 0, 0);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });
  });
};

const addSphereDemo = (scene: BABYLON.Scene) => {
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.25 });
  sphere.position = new BABYLON.Vector3(2, 0, 2);

  //end points for the line sequence in an array
  //y component can be non zero
  const points = [];
  points.push(new BABYLON.Vector3(2, 0, 2));
  points.push(new BABYLON.Vector3(2, 0, -2));
  points.push(new BABYLON.Vector3(-2, 0, -2));
  points.push(points[0]); //close the triangle;

  BABYLON.MeshBuilder.CreateLines("triangle", { points: points });

  const track: any = [];
  track.push(new Slide(Math.PI / 2, 4));
  track.push(new Slide((3 * Math.PI) / 4, 8));
  track.push(new Slide((3 * Math.PI) / 4, 8 + 4 * Math.sqrt(2)));

  let distance = 0;
  let step = 0.05;
  let p = 0;

  scene.onBeforeRenderObservable.add(() => {
    sphere.movePOV(0, 0, step);
    distance += step;

    if (distance > track[p].dist) {
      sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
      p += 1;
      p %= track.length;
      if (p === 0) {
        distance = 0;
        sphere.position = new BABYLON.Vector3(2, 0, 2); //reset to initial conditions
        sphere.rotation = BABYLON.Vector3.Zero(); //prevents error accumulation
      }
    }
  });
};

const buildHouses = () => {
  const detached_house = HouseMesh.buildHouse(1) as any;
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = HouseMesh.buildHouse(2) as any;
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = []; //each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
  places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
  places.push([1, (5 * Math.PI) / 4, 0, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);

  //Create instances from the first two that were built
  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance("house" + i);
    } else {
      houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
};

const buildCar = (scene: BABYLON.Scene) => {
  const carMeshObj = new CarMesh(scene);
  const car = carMeshObj.car;
  //   car.rotation.x = -Math.PI / 2;
  car.position.y = 0.16;
  car.position.x = 3;
  car.position.z = 8;

  car.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, Math.PI / 2);

  carMeshObj.animateWheels();

  carMeshObj.animateCar();

  return carMeshObj.car;
};

const addSky = (scene: BABYLON.Scene) => {
  const sky = new SkyMesh(scene);
};

const addFountain = (scene: BABYLON.Scene) => {
  const fountain = new FountainMesh(scene);
};
const addTrees = (scene: BABYLON.Scene) => {
  const spriteManagerTrees = new BABYLON.SpriteManager(
    "treesManager",
    "textures/palm.png",
    2000,
    { width: 512, height: 1024 },
    scene
  );

  //We create trees at random positions
  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }
};

// const addUFO = (scene: BABYLON.Scene) => {
//   const spriteManagerUFO = new BABYLON.SpriteManager(
//     "UFOManager",
//     "/environments/ufo.png",
//     1,
//     { width: 128, height: 76 }
//   );
//   const ufo = new BABYLON.Sprite("ufo", spriteManagerUFO);
//   ufo.playAnimation(0, 16, true, 125);
//   ufo.position.y = 5;
//   ufo.position.z = 0;
//   ufo.width = 2;
//   ufo.height = 1;
// };

const addLamps = (scene: BABYLON.Scene) => {
  const lamp = new LampMesh(scene).lamp;
  lamp.position = new BABYLON.Vector3(2, 0, 2);
  lamp.rotation = BABYLON.Vector3.Zero();
  lamp.rotation.y = -Math.PI / 4;
  lamp.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);

  const lamp3 = lamp.clone("lamp3");
  lamp3.position.z = -8;

  const lamp1 = lamp.clone("lamp1");
  lamp1.position.x = -8;
  lamp1.position.z = 1.2;
  lamp1.rotation.y = Math.PI / 2;

  const lamp2 = lamp1.clone("lamp2");
  lamp2.position.x = -2.7;
  lamp2.position.z = 0.8;
  lamp2.rotation.y = -Math.PI / 2;
};

const addDayToNightControl = (scene: BABYLON.Scene, light: BABYLON.Light) => {
  // GUI
  const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const panel = new GUI.StackPanel();
  panel.width = "220px";
  panel.top = "-25px";
  panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  adt.addControl(panel);

  const header = new GUI.TextBlock();
  header.text = "Night to Day";
  header.height = "30px";
  header.color = "white";
  panel.addControl(header);

  const slider = new GUI.Slider();
  slider.minimum = 0;
  slider.maximum = 1;
  slider.borderColor = "black";
  slider.color = "gray";
  slider.background = "white";
  slider.value = 1;
  slider.height = "20px";
  slider.width = "200px";
  slider.onValueChangedObservable.add((value) => {
    if (light) {
      light.intensity = value;
    }
  });
  panel.addControl(slider);
};

const scene = await createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

Inspector.Show(scene, {});
