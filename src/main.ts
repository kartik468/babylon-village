import earcut from "earcut";
import "./style.css";
import * as BABYLON from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
console.log(canvas);

const engine = new BABYLON.Engine(canvas);

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    10,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  const box = BABYLON.MeshBuilder.CreateBox("box", {
    width: 2,
    height: 1.5,
    depth: 3,
  });
  box.position = new BABYLON.Vector3(-2, 4.2, 0.1);

  box.rotation.y = Math.PI / 4;
  box.rotation.y = BABYLON.Tools.ToRadians(45);

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 10,
    height: 10,
  });

  return scene;
};

const scene = await createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

Inspector.Show(scene, {});
