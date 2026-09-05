import Phaser from "phaser";
import { RigDemoScene } from "./scenes/RigDemoScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: 520,
  height: 640,
  pixelArt: true,
  backgroundColor: "#3a3f4b",
  scene: [RigDemoScene],
});
