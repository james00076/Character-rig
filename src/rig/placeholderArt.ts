import Phaser from "phaser";
import { EquipmentSlot } from "./types";
import type { EquipmentItem } from "./types";

function makeTexture(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  draw: (g: Phaser.GameObjects.Graphics) => void,
): void {
  const g = scene.add.graphics();
  draw(g);
  if (scene.textures.exists(key)) scene.textures.remove(key);
  g.generateTexture(key, w, h);
  g.destroy();
  scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
}

/**
 * Generates a small wardrobe of placeholder equipment art so the rig demo
 * can show real slot-swapping without depending on an external art
 * pipeline. Each piece has a genuinely different silhouette (not just a
 * recolor) to prove the rig handles arbitrarily-shaped gear per item, the
 * same way real Gemini-generated pieces will. Swap these for real art per
 * ARMOR_PIPELINE.md whenever it's ready — nothing else about the rig needs
 * to change.
 */
export function createPlaceholderArt(scene: Phaser.Scene): EquipmentItem[] {
  const steel = 0xb9c2cc;
  const steelDark = 0x848f9c;
  const steelLight = 0xe4e9ee;
  const red = 0xb3222f;
  const redDark = 0x7a121c;
  const redLight = 0xe0a3a8;
  const wood = 0x8a5a34;
  const woodDark = 0x5e3b20;

  makeTexture(scene, "guard_chest", 16, 18, (g) => {
    g.fillStyle(steelDark, 1);
    g.fillRect(1, 0, 14, 18);
    g.fillStyle(steel, 1);
    g.fillRect(2, 1, 12, 16);
    g.fillStyle(steelLight, 1);
    g.fillRect(7, 1, 2, 16);
    g.fillStyle(steelDark, 1);
    g.fillRect(2, 8, 12, 1);
  });

  makeTexture(scene, "berserker_chest", 24, 22, (g) => {
    g.fillStyle(redDark, 1);
    g.fillRect(4, 2, 16, 20);
    g.fillStyle(red, 1);
    g.fillRect(5, 3, 14, 18);
    // shoulder spikes jutting out both sides
    g.fillStyle(redLight, 1);
    g.fillTriangle(0, 6, 6, 2, 6, 10);
    g.fillTriangle(24, 6, 18, 2, 18, 10);
    g.fillStyle(redLight, 1);
    g.fillRect(11, 3, 2, 18);
    g.fillStyle(redDark, 1);
    g.fillRect(5, 12, 14, 1);
  });

  makeTexture(scene, "guard_helm", 16, 14, (g) => {
    g.fillStyle(steelDark, 1);
    g.fillCircle(8, 8, 7);
    g.fillStyle(steel, 1);
    g.fillCircle(8, 7, 6);
    g.fillStyle(steelDark, 1);
    g.fillRect(5, 9, 6, 4);
    g.fillStyle(steelLight, 1);
    g.fillRect(7, 1, 2, 5);
  });

  makeTexture(scene, "spiked_helm", 20, 20, (g) => {
    g.fillStyle(redDark, 1);
    g.fillCircle(10, 11, 8);
    g.fillStyle(red, 1);
    g.fillCircle(10, 10, 7);
    g.fillStyle(redDark, 1);
    g.fillRect(6, 12, 8, 5);
    // crown of spikes
    g.fillStyle(redLight, 1);
    g.fillTriangle(10, 0, 7, 6, 13, 6);
    g.fillTriangle(2, 3, 4, 8, 8, 7);
    g.fillTriangle(18, 3, 16, 8, 12, 7);
  });

  makeTexture(scene, "tattered_cape", 16, 24, (g) => {
    g.fillStyle(redDark, 1);
    g.fillRect(2, 0, 12, 16);
    g.fillTriangle(2, 16, 6, 24, 2, 22);
    g.fillTriangle(6, 16, 10, 22, 6, 24);
    g.fillTriangle(10, 16, 14, 24, 10, 22);
    g.fillStyle(0x5c0f16, 1);
    g.fillRect(2, 0, 3, 16);
  });

  makeTexture(scene, "steel_pauldrons", 26, 10, (g) => {
    g.fillStyle(steelDark, 1);
    g.fillCircle(5, 5, 5);
    g.fillCircle(21, 5, 5);
    g.fillStyle(steel, 1);
    g.fillCircle(5, 4, 4);
    g.fillCircle(21, 4, 4);
    g.fillStyle(steelLight, 1);
    g.fillRect(3, 2, 4, 2);
    g.fillRect(19, 2, 4, 2);
  });

  makeTexture(scene, "iron_sword", 8, 24, (g) => {
    g.fillStyle(woodDark, 1);
    g.fillRect(3, 16, 2, 7);
    g.fillStyle(steelDark, 1);
    g.fillRect(0, 14, 8, 2);
    g.fillStyle(steel, 1);
    g.fillRect(3, 1, 2, 14);
    g.fillStyle(steelLight, 1);
    g.fillRect(3, 1, 1, 14);
    g.fillTriangle(2, 1, 6, 1, 4, 0);
  });

  makeTexture(scene, "wood_shield", 14, 18, (g) => {
    g.fillStyle(woodDark, 1);
    g.fillCircle(7, 8, 7);
    g.fillTriangle(1, 12, 13, 12, 7, 18);
    g.fillStyle(wood, 1);
    g.fillCircle(7, 8, 6);
    g.fillStyle(steelDark, 1);
    g.fillCircle(7, 8, 2);
    g.fillStyle(woodDark, 1);
    g.fillRect(2, 7, 10, 1);
    g.fillRect(6, 3, 1, 10);
  });

  // These textures are all drawn tiny (16-26px); scale them up to match
  // the placeholder body's much larger canvas (see placeholderBody.ts).
  const SCALE = 6.5;

  return [
    {
      id: "guard_chest",
      name: "Guard Chestplate",
      slot: EquipmentSlot.Chest,
      textureKey: "guard_chest",
      scale: SCALE,
      offsetY: 6,
    },
    {
      id: "berserker_chest",
      name: "Berserker Plate",
      slot: EquipmentSlot.Chest,
      textureKey: "berserker_chest",
      scale: SCALE,
      offsetY: 13,
    },
    {
      id: "guard_helm",
      name: "Guard Helm",
      slot: EquipmentSlot.Head,
      textureKey: "guard_helm",
      scale: SCALE,
      offsetY: -6,
    },
    {
      id: "spiked_helm",
      name: "Spiked Warhelm",
      slot: EquipmentSlot.Head,
      textureKey: "spiked_helm",
      scale: SCALE,
      offsetY: -13,
    },
    {
      id: "tattered_cape",
      name: "Tattered Cape",
      slot: EquipmentSlot.Cape,
      textureKey: "tattered_cape",
      scale: SCALE,
      originY: 0,
      offsetY: -39,
    },
    {
      id: "steel_pauldrons",
      name: "Steel Pauldrons",
      slot: EquipmentSlot.Shoulders,
      textureKey: "steel_pauldrons",
      scale: SCALE,
    },
    {
      id: "iron_sword",
      name: "Iron Sword",
      slot: EquipmentSlot.MainHand,
      textureKey: "iron_sword",
      scale: SCALE,
      originY: 0.85,
      offsetX: 6,
    },
    {
      id: "wood_shield",
      name: "Wood Shield",
      slot: EquipmentSlot.OffHand,
      textureKey: "wood_shield",
      scale: SCALE,
    },
  ];
}
