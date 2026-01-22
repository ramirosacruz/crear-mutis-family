import { db } from "@/db/dexie";
import { map } from "@/maps/megazord";

/**
 * Carga segura de imágenes (evita EncodingError)
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("No se pudo cargar la imagen"));

    img.src = src;
  });
}

export async function generateFinalImage(): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = map.width;
  canvas.height = map.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no soportado");

  ctx.imageSmoothingQuality = "high";

  // 1️⃣ Imagen base (siempre válida)
  const baseImg = await loadImage(map.image);
  ctx.drawImage(baseImg, 0, 0, map.width, map.height);

  // 2️⃣ Imágenes cargadas por el usuario
  const images = await db.cells
    .where("mapId")
    
    .equals(map.id)
    .toArray();

  for (const cell of map.cells) {
    const found = images.find(i => i.cellId === cell.id);
    if (!found?.image) continue;

    // 🔒 PROTECCIÓN CRÍTICA
    if (!found.image.startsWith("data:")) {
      console.warn("Imagen inválida en celda:", cell.id);
      continue;
    }

    try {
      const img = await loadImage(found.image);
      ctx.drawImage(img, cell.x, cell.y, cell.w, cell.h);
    } catch (err) {
      console.warn("No se pudo dibujar imagen:", cell.id);
    }
  }

  // 3️⃣ Texto final
  ctx.font = "bold 80px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 10;

  ctx.fillText(
    "TE PRESENTO A MIS MUTIS",
    map.width / 2,
    map.height - 80
  );

  return new Promise(resolve =>
    canvas.toBlob(blob => resolve(blob!), "image/png")
  );
}
