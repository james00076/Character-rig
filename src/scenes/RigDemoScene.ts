import Phaser from "phaser";
import { CharacterRig } from "../rig/CharacterRig";
import { createPlaceholderArt } from "../rig/placeholderArt";
import { BODY_ANIM_KEY, BODY_TEXTURE_KEYS, createPlaceholderBody } from "../rig/placeholderBody";
import { humanoidAttachments } from "../rig/data/humanoidAttachments";
import { createTieredArmorItems, preloadTieredArmor } from "../data/tieredArmor";
import { EquipmentSlot } from "../rig/types";
import type { EquipmentItem } from "../rig/types";

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  [EquipmentSlot.Head]: "Head",
  [EquipmentSlot.Shoulders]: "Shoulders",
  [EquipmentSlot.Chest]: "Chest",
  [EquipmentSlot.Cape]: "Cape",
  [EquipmentSlot.Legs]: "Legs",
  [EquipmentSlot.Feet]: "Feet",
  [EquipmentSlot.MainHand]: "Main Hand",
  [EquipmentSlot.OffHand]: "Off Hand",
};

export class RigDemoScene extends Phaser.Scene {
  private rig!: CharacterRig;

  constructor() {
    super("RigDemoScene");
  }

  preload(): void {
    preloadTieredArmor(this);
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#3a3f4b");

    createPlaceholderBody(this);
    const items = [...createPlaceholderArt(this), ...createTieredArmorItems()];

    this.rig = new CharacterRig(
      this,
      this.scale.width / 2,
      this.scale.height - 40,
      BODY_TEXTURE_KEYS[0],
      humanoidAttachments,
      BODY_ANIM_KEY,
    );
    this.rig.container.setScale(4);
    this.rig.body.play(BODY_ANIM_KEY);
    this.rig.setAnimation(BODY_ANIM_KEY);

    // start with a base loadout so the demo doesn't open on a bare body
    const bySlot = groupBySlot(items);
    this.rig.equip(bySlot[EquipmentSlot.Chest]![0]!);
    this.rig.equip(bySlot[EquipmentSlot.Head]![0]!);
    this.rig.equip(bySlot[EquipmentSlot.Legs]![0]!);

    this.buildUI(bySlot);

    document.getElementById("facing-btn")!.onclick = () => {
      this.rig.setFacing(this.rig.getFacing() === 1 ? -1 : 1);
    };
  }

  update(): void {
    this.rig.update();
  }

  private buildUI(bySlot: Partial<Record<EquipmentSlot, EquipmentItem[]>>): void {
    const root = document.getElementById("ui")!;
    root.innerHTML = "";

    (Object.keys(bySlot) as EquipmentSlot[]).forEach((slot) => {
      const group = document.createElement("div");
      group.className = "slot-group";

      const heading = document.createElement("h2");
      heading.textContent = SLOT_LABELS[slot];
      group.appendChild(heading);

      const buttons: HTMLButtonElement[] = [];

      const refreshActive = (activeId: string | null) => {
        buttons.forEach((b) => b.classList.toggle("active", b.dataset.itemId === activeId));
      };

      const noneBtn = document.createElement("button");
      noneBtn.textContent = "None";
      noneBtn.onclick = () => {
        this.rig.unequip(slot);
        refreshActive(null);
      };
      group.appendChild(noneBtn);
      buttons.push(noneBtn);

      for (const item of bySlot[slot]!) {
        const btn = document.createElement("button");
        btn.textContent = item.name;
        btn.dataset.itemId = item.id;
        btn.onclick = () => {
          this.rig.equip(item);
          refreshActive(item.id);
        };
        group.appendChild(btn);
        buttons.push(btn);
      }

      const equipped = this.rig.getEquipped(slot);
      refreshActive(equipped?.id ?? null);

      root.appendChild(group);
    });
  }
}

function groupBySlot(items: EquipmentItem[]): Partial<Record<EquipmentSlot, EquipmentItem[]>> {
  const out: Partial<Record<EquipmentSlot, EquipmentItem[]>> = {};
  for (const item of items) {
    (out[item.slot] ??= []).push(item);
  }
  return out;
}
