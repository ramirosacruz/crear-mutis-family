"use client";

import { db } from "@/db/dexie";
import { useCellImage } from "@/hooks/useCellImage";
import { map } from "@/maps/megazord";

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
  const upload = (cellId: string, file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const existing = await db.cells
        .where("[mapId+cellId]")
        .equals([map.id, cellId])
        .first();

      if (existing) {
        await db.cells.update(existing.id!, {
          image: reader.result as string,
        });
      } else {
        await db.cells.add({
          mapId: map.id,
          cellId,
          image: reader.result as string,
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const openFilePicker = (cellId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) upload(cellId, file);
    });

    document.body.appendChild(input); // 👈 importante para Safari
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
