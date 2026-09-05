import Phaser from "phaser";
import { DEFAULT_SLOT_DEPTH, EquipmentSlot } from "./types";
import type { AttachmentPoint, AttachmentTable, EquipmentItem } from "./types";

const BODY_DEPTH = 0;

/**
 * A paperdoll rig: one body sprite plus a sprite per equipped slot, kept in
 * sync with the body's current animation frame via an AttachmentTable.
 *
 * Usage:
 *   const rig = new CharacterRig(scene, x, y, "hero_body", attachments);
 *   rig.equip(chestplateItem);
 *   rig.setFacing(-1); // face left
 *   // in the scene's update loop:
 *   rig.update();
 */
export class CharacterRig {
  readonly scene: Phaser.Scene;
  readonly container: Phaser.GameObjects.Container;
  readonly body: Phaser.GameObjects.Sprite;

  private attachments: AttachmentTable;
  private equipped = new Map<EquipmentSlot, EquipmentItem>();
  private sprites = new Map<EquipmentSlot, Phaser.GameObjects.Sprite>();
  private facing: 1 | -1 = 1;
  private currentAnimKey: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bodyTextureKey: string,
    attachments: AttachmentTable,
    defaultAnimKey = "idle",
  ) {
    this.scene = scene;
    this.attachments = attachments;
    this.currentAnimKey = defaultAnimKey;

    this.body = scene.add.sprite(0, 0, bodyTextureKey);
    this.body.setOrigin(0.5, 1);
    this.body.setDepth(BODY_DEPTH);

    this.container = scene.add.container(x, y, [this.body]);

    this.body.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => this.syncAll());
    this.body.on(Phaser.Animations.Events.ANIMATION_START, () => this.syncAll());
  }

  /** Switch which animation's attachment frames should be used to place gear (call alongside body.play()). */
  setAnimation(animKey: string): void {
    this.currentAnimKey = animKey;
    this.syncAll();
  }

  /** Face the rig right (1) or left (-1). Mirrors both the body and every mirrorable equipped item. */
  setFacing(direction: 1 | -1): void {
    if (this.facing === direction) return;
    this.facing = direction;
    this.body.setFlipX(direction === -1);
    for (const [slot, sprite] of this.sprites) {
      const item = this.equipped.get(slot)!;
      if (item.mirrorable !== false) sprite.setFlipX(direction === -1);
    }
    this.syncAll();
  }

  getFacing(): 1 | -1 {
    return this.facing;
  }

  /** Equip an item into its slot, replacing whatever was there. */
  equip(item: EquipmentItem): void {
    this.unequip(item.slot);

    const sprite = this.scene.add.sprite(0, 0, item.textureKey);
    sprite.setOrigin(item.originX ?? 0.5, item.originY ?? 0.5);
    sprite.setScale(item.scale ?? 1);
    if (item.mirrorable !== false) sprite.setFlipX(this.facing === -1);

    const depth = item.depthOverride ?? DEFAULT_SLOT_DEPTH[item.slot];
    sprite.setDepth(depth);

    this.container.add(sprite);
    this.container.sort("depth");

    this.sprites.set(item.slot, sprite);
    this.equipped.set(item.slot, item);
    this.syncSlot(item.slot);
  }

  /** Remove whatever is equipped in a slot, if anything. */
  unequip(slot: EquipmentSlot): void {
    const sprite = this.sprites.get(slot);
    if (!sprite) return;
    sprite.destroy();
    this.sprites.delete(slot);
    this.equipped.delete(slot);
  }

  getEquipped(slot: EquipmentSlot): EquipmentItem | undefined {
    return this.equipped.get(slot);
  }

  isEquipped(slot: EquipmentSlot): boolean {
    return this.equipped.has(slot);
  }

  /** Call every frame (or whenever the body's position/frame may have changed) to keep gear glued on. */
  update(): void {
    this.syncAll();
  }

  destroy(): void {
    this.container.destroy();
  }

  private currentFrameIndex(): number {
    const frame = this.body.anims.currentFrame;
    if (!frame) return 0;
    const frames = this.attachments[this.currentAnimKey];
    const max = frames ? frames.length - 1 : 0;
    return Phaser.Math.Clamp(frame.index, 0, Math.max(max, 0));
  }

  private lookupAnchor(slot: EquipmentSlot): AttachmentPoint | undefined {
    const frames = this.attachments[this.currentAnimKey];
    if (!frames || frames.length === 0) return undefined;
    const frame = frames[this.currentFrameIndex()];
    return frame?.[slot];
  }

  private syncAll(): void {
    for (const slot of this.sprites.keys()) this.syncSlot(slot);
  }

  private syncSlot(slot: EquipmentSlot): void {
    const sprite = this.sprites.get(slot);
    const item = this.equipped.get(slot);
    if (!sprite || !item) return;

    const anchor = this.lookupAnchor(slot);
    if (!anchor) {
      // No anchor authored for this frame/slot combo: hide rather than
      // leaving gear frozen in a stale, now-wrong position.
      sprite.setVisible(false);
      return;
    }
    sprite.setVisible(true);

    const mirror = item.mirrorable !== false ? this.facing : 1;
    const offsetX = item.offsetX ?? 0;
    const offsetY = item.offsetY ?? 0;

    sprite.setPosition(
      mirror * (anchor.x + offsetX),
      anchor.y + offsetY,
    );

    if (anchor.angle !== undefined) {
      sprite.setAngle(mirror * anchor.angle);
    }
  }
}
