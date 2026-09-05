/**
 * Core data types for the paperdoll character rig.
 *
 * The rig equips per-item art (not palette-swapped recolors) onto named
 * attachment points that live on the character's body. Each body animation
 * frame can define its own anchor for every slot, so gear tracks limbs
 * through a walk cycle, attack swing, etc. instead of just sitting at one
 * fixed offset.
 */

/** Equipment slots the rig knows how to render. Extend as new gear types show up. */
export const EquipmentSlot = {
  Head: "head",
  Shoulders: "shoulders",
  Chest: "chest",
  Cape: "cape",
  Legs: "legs",
  Feet: "feet",
  MainHand: "mainHand",
  OffHand: "offHand",
} as const;
export type EquipmentSlot = (typeof EquipmentSlot)[keyof typeof EquipmentSlot];

/** Default paint order (back to front) when two slots don't specify a depthOverride. */
export const DEFAULT_SLOT_DEPTH: Record<EquipmentSlot, number> = {
  [EquipmentSlot.Cape]: -10,
  [EquipmentSlot.OffHand]: -2,
  [EquipmentSlot.Legs]: -1,
  [EquipmentSlot.Chest]: 1,
  [EquipmentSlot.Shoulders]: 2,
  [EquipmentSlot.MainHand]: 3,
  [EquipmentSlot.Head]: 4,
  [EquipmentSlot.Feet]: -1,
};

/** Where a slot's item should sit for one specific body animation frame. */
export interface AttachmentPoint {
  /** X offset from the body's origin, in body-local pixels, authored for the right-facing pose. */
  x: number;
  /** Y offset from the body's origin, in body-local pixels. */
  y: number;
  /** Rotation in degrees, authored for the right-facing pose. */
  angle?: number;
}

/** Every slot's anchor for a single frame of a body animation. Slots with no gear equipped are simply absent. */
export type AttachmentFrame = Partial<Record<EquipmentSlot, AttachmentPoint>>;

/**
 * Per-animation list of attachment frames. The array index must line up
 * 1:1 with the body sprite's animation frame index (frame 0 of the "walk"
 * anim uses attachments.walk[0], frame 1 uses attachments.walk[1], ...).
 */
export type AttachmentTable = Record<string, AttachmentFrame[]>;

/** Definition of one equippable item. Art is authored per-item; the rig only needs to know how to place it. */
export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  /** Phaser texture key this item's sprite renders from (preload it before equipping). */
  textureKey: string;
  /** Sprite origin, 0-1. Defaults to (0.5, 0.5). Set this to match where the art's "pivot" is drawn. */
  originX?: number;
  originY?: number;
  /** Manual nudge in pixels, applied after the attachment anchor, for art that doesn't line up perfectly. */
  offsetX?: number;
  offsetY?: number;
  /** Uniform scale multiplier applied on top of the rig's overall scale. Defaults to 1. */
  scale?: number;
  /** Overrides DEFAULT_SLOT_DEPTH for this specific item, e.g. a weapon held behind the body while sheathed. */
  depthOverride?: number;
  /**
   * Whether this item should flip and mirror its X offset when the body faces left.
   * Set false for symmetric gear whose offset is authored as 0 either way (rare).
   * Defaults to true.
   */
  mirrorable?: boolean;
}
