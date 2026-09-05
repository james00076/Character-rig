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
 * These PNGs are pre-scaled to their final display size (baked in via a
 * one-off smooth resize, see ARMOR_PIPELINE.md's "worked example" section)
 * rather than scaled up live by Phaser — the source sheet was a JPEG, and
 * scaling its 8x8 JPEG-block compression artifacts live with nearest-
 * neighbor filtering made them visible as a grid of faint lines over every
 * piece. Baking the scale in with a smooth resampler once fixed that, so
 * every item here uses scale 1 (only the rig's overall container scale
 * applies on top). Origin/offset are still tuned against the placeholder
 * body in placeholderBody.ts and will need re-tuning once a real body
 * sprite replaces it.
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

/** Per-tier nudges for pieces that don't quite match the rest after the shared tuning above. */
const CHEST_TWEAKS: Partial<Record<(typeof TIERS)[number], { offsetX?: number; offsetY?: number }>> = {};

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
      offsetY: 40,
    });
    const chestTweak = CHEST_TWEAKS[tier];
    items.push({
      id: `${tier}_chest`,
      name: `${label} Plate`,
      slot: EquipmentSlot.Chest,
      textureKey: `${tier}_chest`,
      originX: 0.5,
      originY: 0.35,
      offsetX: chestTweak?.offsetX ?? 0,
      offsetY: chestTweak?.offsetY ?? -20,
    });
    items.push({
      id: `${tier}_legs`,
      name: `${label} Legs`,
      slot: EquipmentSlot.Legs,
      textureKey: `${tier}_legs`,
      originX: 0.5,
      originY: 0.08,
      offsetY: -14,
    });
  }
  return items;
}
