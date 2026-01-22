"use client";

import { db } from "@/db/dexie";
import { useCellImage } from "@/hooks/useCellImage";
import { map } from "@/maps/megazord";

/* ---------- utils ---------- */

function fileToBase64Compressed(
  file: File,
  maxSize = 1024,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(
        maxSize / img.width,
        maxSize / img.height,
        1
      );

      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context null");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject("Image load error");
    };

    img.src = objectUrl;
  });
}

/* ---------- CellOverlay ---------- */

function CellOverlay({
  cell,
  onPickFile,
}: {
  cell: typeof map.cells[number];
  onPickFile: (cellId: string) => void;
}) {
  const data = useCellImage(map.id, cell.id);

  return (
    <div
      onClick={() => onPickFile(cell.id)}
      className="absolute cursor-pointer border border-white/30 hover:border-blue-500 hover:shadow-lg transition"
      style={{
        left: `${(cell.x / map.width) * 100}%`,
        top: `${(cell.y / map.height) * 100}%`,
        width: `${(cell.w / map.width) * 100}%`,
        height: `${(cell.h / map.height) * 100}%`,
      }}
    >
      <img
        src={data?.image || "/clic.png"}
        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
        draggable={false}
      />
    </div>
  );
}

/* ---------- ImageOverlay ---------- */

export function ImageOverlay() {
  const upload = async (cellId: string, file: File) => {
    try {
      const base64 = await fileToBase64Compressed(file);

      const existing = await db.cells
        .where("[mapId+cellId]")
        .equals([map.id, cellId])
        .first();

      if (existing) {
        await db.cells.update(existing.id!, {
          image: base64,
        });
      } else {
        await db.cells.add({
          mapId: map.id,
          cellId,
          image: base64,
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const openFilePicker = (cellId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener(
      "change",
      () => {
        const file = input.files?.[0];
        if (file) upload(cellId, file);
      },
      { once: true }
    );

    document.body.appendChild(input); // Safari requirement
    input.click();
    document.body.removeChild(input);
  };

  return (
    <div className="absolute inset-0">
      {map.cells.map(cell => (
        <CellOverlay
          key={cell.id}
          cell={cell}
          onPickFile={openFilePicker}
        />
      ))}
    </div>
  );
}
