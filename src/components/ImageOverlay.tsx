 "use client";

import heic2any from "heic2any";
import { db } from "@/db/dexie";
import { useCellImage } from "@/hooks/useCellImage";
import { map } from "@/maps/megazord";

/* ---------- utils ---------- */

async function normalizeImage(file: File): Promise<File> {
  if (file.type === "image/heic" || file.type === "image/heif") {
    const convertedBlob = (await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    })) as Blob;

    return new File([convertedBlob], "image.jpg", {
      type: "image/jpeg",
    });
  }

  return file;
}

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
      canvas.width = Math.max(1, img.width * scale);
      canvas.height = Math.max(1, img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
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
      role="button"
      tabIndex={0}
      onClick={() => onPickFile(cell.id)}
      onKeyDown={e => e.key === "Enter" && onPickFile(cell.id)}
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
    const normalized = await normalizeImage(file);
    const base64 = await fileToBase64Compressed(normalized);

    const existing = await db.cells
      .where("[mapId+cellId]")
      .equals([map.id, cellId])
      .first();

    if (existing) {
      await db.cells.update(existing.id!, { image: base64 });
    } else {
      await db.cells.add({
        mapId: map.id,
        cellId,
        image: base64,
      });
    }
  };

  const openFilePicker = (cellId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.heic,.heif";
    input.style.display = "none";

    const onChange = () => {
      const file = input.files?.[0];
      if (file) upload(cellId, file);

      input.removeEventListener("change", onChange);
      document.body.removeChild(input);
    };

    input.addEventListener("change", onChange);
    document.body.appendChild(input);
    input.click();
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
