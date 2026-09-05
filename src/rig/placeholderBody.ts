import Phaser from "phaser";

export const BODY_ANIM_KEY = "idle";
export const BODY_TEXTURE_KEYS = ["body_idle_0", "body_idle_1"];

/**
 * Draws a humanoid silhouette in code, sized to actually match the scale
 * of the real armor pieces in public/assets/armor/ (roughly 90-160px wide
 * per piece), and registers a 2-frame "idle" animation from it. This is
 * still not real character art — swap it for a real animated body
 * spritesheet when one exists, and add a matching AttachmentTable entry
 * per real animation (see data/humanoidAttachments.ts). But unlike the
 * first pass at this placeholder, its proportions are deliberately built
 * to fit under the actual equipped gear instead of being an arbitrary
 * tiny stand-in.
 */
export function createPlaceholderBody(scene: Phaser.Scene): void {
  const w = 200;
  const h = 340;
  const g = scene.add.graphics();

  const skin = 0xe0a878;
  const skinDark = 0xc08858;
  const tunic = 0x4a6fa5;
  const tunicDark = 0x395580;
  const pants = 0x4a4a52;
  const pantsDark = 0x35353c;
  const hair = 0x3a2a1e;

  const draw = (bob: number) => {
    g.clear();

    // legs (planted, unaffected by breathing bob)
    g.fillStyle(pants, 1);
    g.fillRoundedRect(50, 220, 42, 120, 8);
    g.fillRoundedRect(108, 220, 42, 120, 8);
    g.fillStyle(pantsDark, 1);
    g.fillRoundedRect(50, 220, 12, 120, 6);
    g.fillRoundedRect(108, 220, 12, 120, 6);

    // torso
    g.fillStyle(tunic, 1);
    g.fillRoundedRect(40, 100 + bob, 120, 122, 14);
    g.fillStyle(tunicDark, 1);
    g.fillRoundedRect(40, 100 + bob, 18, 122, 10);

    // arms
    g.fillStyle(skin, 1);
    g.fillRoundedRect(10, 108 + bob, 30, 128, 12);
    g.fillRoundedRect(160, 108 + bob, 30, 128, 12);
    g.fillStyle(skinDark, 1);
    g.fillRoundedRect(10, 108 + bob, 30, 14, 8);
    g.fillRoundedRect(160, 108 + bob, 30, 14, 8);

    // neck
    g.fillStyle(skin, 1);
    g.fillRect(85, 92 + bob, 30, 20);

    // head
    g.fillStyle(skin, 1);
    g.fillCircle(100, 55 + bob, 42);
    g.fillStyle(hair, 1);
    g.fillRoundedRect(58, 14 + bob, 84, 26, { tl: 20, tr: 20, bl: 0, br: 0 });
  };

  BODY_TEXTURE_KEYS.forEach((key) => {
    if (scene.textures.exists(key)) scene.textures.remove(key);
  });

  draw(0);
  g.generateTexture(BODY_TEXTURE_KEYS[0], w, h);
  draw(-4);
  g.generateTexture(BODY_TEXTURE_KEYS[1], w, h);

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
