import { db } from "@/db/dexie";
import { map } from "@/maps/megazord";
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // importante para canvas
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = src;
  });
}

export async function generateFinalImage(): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = map.width;
  canvas.height = map.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el contexto del canvas");

  // 🟢 Base map
  const base = await loadImage(map.image);
  ctx.drawImage(base, 0, 0);

  // 🟢 Imágenes guardadas
  const images = await db.cells
    .where("mapId")
    .equals(map.id)
    .toArray();

  for (const cell of map.cells) {
    const found = images.find(i => i.cellId === cell.id);
    if (!found?.image) continue;

    try {
      const img = await loadImage(found.image);
      ctx.drawImage(img, cell.x, cell.y, cell.w, cell.h);
    } catch {
      console.warn("Imagen fallida en celda", cell.id);
    }
  }

  // 🟢 Texto final
  ctx.font = "bold 80px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    "TE PRESENTO A MIS MUTIS",
    map.width / 2,
    map.height - 80
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error("No se pudo generar el blob"));
      else resolve(blob);
    }, "image/png");
  });
