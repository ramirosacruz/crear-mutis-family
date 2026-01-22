 import { db } from "@/db/dexie";
import { map } from "@/maps/megazord";

export async function generateFinalImage(): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = map.width;
  canvas.height = map.height;

  const ctx = canvas.getContext("2d")!;
  const base = new Image();
  base.src = map.image;
  await base.decode();

  ctx.drawImage(base, 0, 0);

  const images = await db.cells.where("mapId").equals(map.id).toArray();

  for (const cell of map.cells) {
    const found = images.find(i => i.cellId === cell.id);
    if (!found) continue;

    const img = new Image();
    img.src = found.image;
    await img.decode();

    ctx.drawImage(img, cell.x, cell.y, cell.w, cell.h);
  }

  ctx.font = "bold 80px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    "TE PRESENTO A MIS MUTIS",
    map.width / 2,
    map.height - 80
  );

  return new Promise(r => canvas.toBlob(b => r(b!), "image/png"));
}
