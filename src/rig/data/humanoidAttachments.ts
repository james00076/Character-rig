import { EquipmentSlot } from "../types";
import type { AttachmentTable } from "../types";

/**
 * Attachment anchors for the placeholder humanoid body's "idle" animation
 * (see placeholderBody.ts, a 200x340 canvas sized to actually match the
 * real armor pieces in public/assets/armor/). Two frames: a resting pose
 * and a "breathe up" pose. Array index must match the frame order the
 * "idle" Phaser animation was created with.
 *
 * All coordinates are in body-local pixels, authored for the right-facing
 * pose, measured from the body sprite's origin (bottom-center). Negative Y
 * is up. When a real animated body (walk/attack/etc.) replaces this
 * placeholder, add one AttachmentTable entry per animation the same way.
 */
export const humanoidAttachments: AttachmentTable = {
  idle: [
    {
      [EquipmentSlot.Feet]: { x: 0, y: -8 },
      [EquipmentSlot.Legs]: { x: 0, y: -115 },
      [EquipmentSlot.Chest]: { x: 0, y: -175 },
      [EquipmentSlot.Shoulders]: { x: 0, y: -222 },
      [EquipmentSlot.Cape]: { x: 0, y: -225 },
      [EquipmentSlot.Head]: { x: 0, y: -285 },
      [EquipmentSlot.MainHand]: { x: 78, y: -170 },
      [EquipmentSlot.OffHand]: { x: -78, y: -170 },
    },
    {
      [EquipmentSlot.Feet]: { x: 0, y: -8 },
      [EquipmentSlot.Legs]: { x: 0, y: -115 },
      [EquipmentSlot.Chest]: { x: 0, y: -179 },
      [EquipmentSlot.Shoulders]: { x: 0, y: -226 },
      [EquipmentSlot.Cape]: { x: 0, y: -229 },
      [EquipmentSlot.Head]: { x: 0, y: -289 },
      [EquipmentSlot.MainHand]: { x: 78, y: -174 },
      [EquipmentSlot.OffHand]: { x: -78, y: -174 },
    },
  ],
};
