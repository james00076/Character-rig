# Armor Pipeline

How art (from Gemini or anywhere else) becomes an equippable item on the rig,
and how to bring this whole system into the main PixelScape project.

## How the rig works

`src/rig/CharacterRig.ts` is a paperdoll: one body sprite plus one sprite per
equipped slot (`src/rig/types.ts` → `EquipmentSlot`: Head, Shoulders, Chest,
Cape, Legs, Feet, MainHand, OffHand). Every equipped sprite's position comes
from an **attachment table** (`src/rig/data/humanoidAttachments.ts`) — for
each frame of each body animation, it lists where every slot should sit in
body-local pixels. The rig re-reads that table on every animation frame, so
gear tracks the body through a walk cycle, an attack swing, whatever — it's
not glued at one static offset.

Facing left/right is one call: `rig.setFacing(-1)`. The rig flips the body
and every equipped sprite and mirrors their X offsets automatically. Art
should always be drawn facing right (the default); you never draw a
left-facing variant.

Paint order (back to front) is `DEFAULT_SLOT_DEPTH` in `types.ts`: Cape →
OffHand → body → Legs/Feet → Chest → Shoulders → MainHand → Head. An item can
override this with `depthOverride` (e.g. a shield held up in front while
blocking). Note that Legs/Feet sit *in front of* the body, not behind it —
the body sprite already has its own bare legs drawn into its texture, so
leg armor has to paint over that or it's invisible (this bit a first pass
at this rig: Legs was defaulted to a negative depth by analogy with Cape,
and equipped boots silently rendered behind the body and were never seen).

The demo (`src/scenes/RigDemoScene.ts`) runs partly on real art now:
`src/data/tieredArmor.ts` equips actual Gemini-generated Head/Chest/Legs
pieces across six tiers (Slate → Royal), sliced from a reference sheet —
see the walkthrough below. Everything else (Cape, Shoulders, MainHand,
OffHand) still runs on procedurally-generated placeholder art
(`src/rig/placeholderBody.ts`, `src/rig/placeholderArt.ts`) so the
mechanism stays verifiable without depending on more external art than
exists yet. Swap the placeholders out; nothing else about the rig needs to
change.

## Getting art out of Gemini in a shape the rig can use

The tier sheet you generated (Slate/Iron/Umber/Crimson/Twilight/Royal ×
Head/Plate/Legs/Full Set) is exactly the right idea — one consistent slot
breakdown across many tiers/skins. Two things matter more than anything else
for it to drop straight into the rig:

1. **Real alpha transparency, not a drawn checkerboard.** Some generated
   images bake the checkerboard pattern into the actual pixels (this
   happened with the two reference JPEGs earlier in this project) — that's
   a JPEG with no alpha channel, and the checkerboard would render as part
   of the sprite, not as transparency. Ask for a **transparent PNG**
   explicitly, and save/export as PNG. A quick sanity check: open the file
   and confirm the background is transparent, not a gray/white checker
   image.

2. **One item per file, on a fixed canvas size per slot, with a consistent
   pivot.** A single big multi-tier sheet has to be cropped into individual
   files before it's usable, and hand-cropping risks each tier's helmet
   sitting at a slightly different pixel within its cell — which then
   means every item needs its own hand-tuned offset. Far less fiddly: ask
   Gemini for one image per item (e.g. "Crimson tier chestplate, front
   view, transparent background, 64×64 canvas, armor centered
   horizontally, neckline at y=20"), keeping canvas size and pivot
   placement identical across every item in a slot. Then every item in
   that slot can share the same `originX/originY` and needs zero
   per-item `offsetX/offsetY` fine-tuning.

   If you only have a sheet (like the one already generated), crop each
   cell to its own PNG at identical cell dimensions and identical position
   within the cell — any image editor's "slice"/grid-export feature works,
   or a short ImageMagick/Pillow script if the grid is regular.

3. **A "Plate" that already includes shoulder spikes/pauldrons is just a
   Chest item.** You don't have to split it into a separate Shoulders
   piece — the rig doesn't require every slot to be filled. Only use the
   Shoulders slot for gear meant to layer independently on top of a chest
   piece (so you can mix-and-match a chest with different pauldrons).

## Worked example: slicing the Slate→Royal tier sheet

`docs/reference/tier-sheet-slate-to-royal.jpg` is a real Gemini output: six
armor tiers × Head/Plate/Legs/Full Set, on a baked-in checkerboard (a JPEG,
so no real alpha — see point 1 above). `src/data/tieredArmor.ts` and
`public/assets/armor/*.png` are the result of slicing it into 18
individual transparent PNGs. The approach, if you need to do this again for
another sheet:

1. **Locate each cell's pixel bounds.** Don't assume a uniform grid — this
   sheet turned out to have 4 icons per row for most tiers but 5 for a few
   (an extra alt-angle helmet render), which shifted where Plate/Legs sat
   in those rows. Detect column boundaries per row by scanning for bands of
   background-only pixels (columns where >90% of pixels match the checker
   colors), skipping the label-text band at the top of each row.
2. **Chroma-key the checkerboard out**, rather than trying to threshold on
   "gray" alone — several tiers (Slate, Iron) *are* gray metal, close
   enough to the checker's own gray/white to risk punching holes in the
   armor. What worked: classify a pixel as background only if it's both
   (a) neutral/desaturated (min and max color channel within ~8 of each
   other) *and* (b) close to one of the checker's two exact brightness
   levels (sampled from a definitely-background patch — here ~182 and
   ~254) within a tight tolerance (~±6). Real armor shading almost never
   lands exactly on those two flat values, so this reliably tells "this
   pixel is a checker tile" apart from "this pixel happens to be gray."
3. **Crop tight to content, not to the nominal cell.** Auto-crop each
   slice to the bounding box of non-background pixels (with a few px of
   padding) so every item's canvas is exactly as big as its art, not the
   sheet's cell size.
4. **Pick a pivot per slot and a shared scale.** These pieces were drawn
   for a much larger/more detailed body than the rig's placeholder, so
   they all needed the same scale-down factor (`SCALE = 0.11` in
   `tieredArmor.ts`) and per-slot origins tuned by eye against the
   placeholder (helmet pivot near the chin at the bottom of its image,
   chest pivot near the neckline at the top, legs pivot at the top where
   they'd hang from the hip). Expect to re-tune all of this once a real
   body replaces the placeholder — these numbers are specific to that
   placeholder's proportions, not universal constants.

## Adding a new item

1. Drop the PNG in `public/assets/armor/` (create the folder) and preload it
   in a scene: `this.load.image('crimson_chest', 'assets/armor/crimson_chest.png')`.
2. Add an `EquipmentItem` entry:

   ```ts
   {
     id: "crimson_chest",
     name: "Crimson Plate",
     slot: EquipmentSlot.Chest,
     textureKey: "crimson_chest",
     // originX/originY: only needed if this item's pivot isn't centered — see below
     // offsetX/offsetY: only needed to nudge one item that doesn't perfectly match the slot's shared pivot
   }
   ```
3. `rig.equip(item)`. That's it — depth, facing mirror, and per-frame
   position all come from the slot and the attachment table for free.

`originX/originY` (default 0.5/0.5) is where in the *item's own image* the
pivot point is — e.g. a chest piece's pivot is usually its neckline-center,
a helmet's is usually its chin/jaw-center, a sword's is its grip. If every
item in a slot is drawn with the same canvas size and the same pivot
position, you set `originX/originY` once per slot and never touch it again
per item.

## Adding a new body animation (walk, attack, etc.)

The placeholder body only has an `idle` animation. To add a real one:

1. Build the Phaser animation as usual (`scene.anims.create({ key: "walk", frames: [...] })`).
2. Add a `humanoidAttachments.walk` entry: an array of `AttachmentFrame`
   objects, **one per animation frame, in the same order** as the frames
   you passed to `anims.create`. Each frame lists the anchor (`x`, `y`,
   optional `angle`) for every slot at that instant of the animation.
3. Call `rig.body.play("walk")` and `rig.setAnimation("walk")` together
   (the rig needs to know which attachment table to read from).

This is the only per-animation authoring work — gear itself never needs to
know about animations.

## Bringing this into the main PixelScape (Vite + Phaser) project

The whole rig is self-contained in `src/rig/`:

- `types.ts`, `CharacterRig.ts` — copy as-is, no changes needed.
- `data/humanoidAttachments.ts` — replace with attachment data for your
  real body art/animations.
- `placeholderBody.ts`, `placeholderArt.ts` — dev-only stand-ins, drop these
  once real art exists.

Then in your scene: preload your real body spritesheet and item textures,
build your real `AttachmentTable`, construct `new CharacterRig(scene, x, y,
bodyTextureKey, attachments)`, and call `rig.equip(item)` / `rig.update()`
from your existing update loop. Nothing else in your project needs to change
— the rig only touches its own container and sprites.
