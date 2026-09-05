import Phaser from "phaser";

export const BODY_ANIM_KEY = "idle";
export const BODY_TEXTURE_KEYS = ["body_idle_0", "body_idle_1"];

/**
 * Draws a bare-bones humanoid silhouette in code and registers a 2-frame
 * "idle" animation from it. This exists purely so the rig demo has
 * *something* to equip gear onto without depending on external art —
 * swap it for a real animated body spritesheet when one exists, and add a
 * matching AttachmentTable entry per real animation (see
 * data/humanoidAttachments.ts).
 */
export function createPlaceholderBody(scene: Phaser.Scene): void {
  const w = 32;
  const h = 48;
  const g = scene.add.graphics();

  const skin = 0xe8b98a;
  const tunic = 0x4a6fa5;
  const tunicDark = 0x395580;
  const pants = 0x3a3a3a;

  const draw = (bob: number) => {
    g.clear();

    // legs (planted, unaffected by breathing bob)
    g.fillStyle(pants, 1);
    g.fillRect(11, 34, 4, 13);
    g.fillRect(17, 34, 4, 13);

    // torso
    g.fillStyle(tunic, 1);
    g.fillRect(9, 14 + bob, 14, 20);
    g.fillStyle(tunicDark, 1);
    g.fillRect(9, 14 + bob, 3, 20);

    // arms
    g.fillStyle(skin, 1);
    g.fillRect(5, 16 + bob, 4, 14);
    g.fillRect(23, 16 + bob, 4, 14);

    // head
    g.fillStyle(skin, 1);
    g.fillCircle(16, 9 + bob, 7);
  };

  BODY_TEXTURE_KEYS.forEach((key, i) => {
    draw(-i); // frame 0: bob=0, frame 1: bob=-1 (shift up one px)
    if (scene.textures.exists(key)) scene.textures.remove(key);
    g.generateTexture(key, w, h);
  });

  g.destroy();

  BODY_TEXTURE_KEYS.forEach((key) => {
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  });

  scene.anims.create({
    key: BODY_ANIM_KEY,
    frames: BODY_TEXTURE_KEYS.map((key) => ({ key })),
    frameRate: 2,
    repeat: -1,
  });
}
