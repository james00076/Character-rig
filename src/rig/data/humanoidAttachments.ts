import { EquipmentSlot } from "../types";
import type { AttachmentTable } from "../types";

/**
 * Attachment anchors for the placeholder humanoid body's "idle" animation
 * (see placeholderBody.ts). Two frames: a resting pose and a 1px "breathe up"
 * pose. Array index must match the frame order the "idle" Phaser animation
 * was created with.
 *
 * All coordinates are in body-local pixels, authored for the right-facing
 * pose, measured from the body sprite's origin (bottom-center). Negative Y
 * is up. When a real animated body (walk/attack/etc.) replaces this
 * placeholder, add one AttachmentTable entry per animation the same way.
 */
export const humanoidAttachments: AttachmentTable = {
  idle: [
    {
      [EquipmentSlot.Feet]: { x: 0, y: -1 },
      [EquipmentSlot.Legs]: { x: 0, y: -14 },
      [EquipmentSlot.Chest]: { x: 0, y: -26 },
      [EquipmentSlot.Shoulders]: { x: 0, y: -31 },
      [EquipmentSlot.Cape]: { x: 0, y: -32 },
      [EquipmentSlot.Head]: { x: 0, y: -39 },
      [EquipmentSlot.MainHand]: { x: 9, y: -20 },
      [EquipmentSlot.OffHand]: { x: -9, y: -20 },
    },
    {
      [EquipmentSlot.Feet]: { x: 0, y: -1 },
      [EquipmentSlot.Legs]: { x: 0, y: -14 },
      [EquipmentSlot.Chest]: { x: 0, y: -27 },
      [EquipmentSlot.Shoulders]: { x: 0, y: -32 },
      [EquipmentSlot.Cape]: { x: 0, y: -33 },
      [EquipmentSlot.Head]: { x: 0, y: -40 },
      [EquipmentSlot.MainHand]: { x: 9, y: -21 },
      [EquipmentSlot.OffHand]: { x: -9, y: -21 },
    },
  ],
};
