import { EquipmentSlot } from "../rig/types";
import type { EquipmentItem } from "../rig/types";

/**
 * Real Gemini-generated armor, sliced from a 6-tier reference sheet
 * (docs/reference/tier-sheet-slate-to-royal.jpg) into one transparent PNG
 * per tier per slot. Unlike the procedural placeholder set, every piece
 * here is genuinely hand-designed art — this is what proves the rig works
 * with real gear, not just shapes drawn in code.
 *
 * The source sheet only broke gear into Head/Chest/Legs (no separate
 * Shoulders/Cape/hands), and each "Chest" piece already includes its own
 * integrated pauldrons — exactly the "don't need a separate Shoulders
 * piece" case called out in ARMOR_PIPELINE.md.
 *
 * Scale/origin here are tuned against the placeholder body in
 * placeholderBody.ts, which is sized to roughly match these pieces but is
 * still not real character art. When a real body sprite replaces the
 * placeholder, these will need re-tuning to match its actual proportions.
 */

const TIERS = [
  "slate",
  "iron",
  "umber",
  "crimson",
  "twilight",
  "royal",
] as const;

const TIER_LABELS: Record<(typeof TIERS)[number], string> = {
  slate: "Slate",
  iron: "Iron",
  umber: "Umber",
  crimson: "Crimson",
  twilight: "Twilight",
  royal: "Royal",
};

const SCALE = 1.0;
const CHEST_SCALE = 1.3;

export function preloadTieredArmor(scene: Phaser.Scene): void {
  for (const tier of TIERS) {
    for (const slot of ["head", "chest", "legs"] as const) {
      scene.load.image(`${tier}_${slot}`, `assets/armor/${tier}_${slot}.png`);
    }
  }
}

export function createTieredArmorItems(): EquipmentItem[] {
  const items: EquipmentItem[] = [];
  for (const tier of TIERS) {
    const label = TIER_LABELS[tier];
    items.push({
      id: `${tier}_head`,
      name: `${label} Helm`,
      slot: EquipmentSlot.Head,
      textureKey: `${tier}_head`,
      originX: 0.5,
      originY: 0.82,
      scale: SCALE,
      offsetY: 40,
    });
    items.push({
      id: `${tier}_chest`,
      name: `${label} Plate`,
      slot: EquipmentSlot.Chest,
      textureKey: `${tier}_chest`,
      originX: 0.5,
      originY: 0.35,
      scale: CHEST_SCALE,
      offsetY: -20,
    });
    items.push({
      id: `${tier}_legs`,
      name: `${label} Legs`,
      slot: EquipmentSlot.Legs,
      textureKey: `${tier}_legs`,
      originX: 0.5,
      originY: 0.08,
      scale: SCALE,
      offsetY: -14,
    });
  }
  return items;
}
