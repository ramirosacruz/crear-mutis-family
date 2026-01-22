 "use client";

import { db } from "@/db/dexie";
import { useCellImage } from "@/hooks/useCellImage";
import { map } from "@/maps/megazord";

export function ImageOverlay() {
  const upload = (cellId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      await db.cells.put({
        mapId: map.id,
        cellId,
        image: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = (cellId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) upload(cellId, file);
    };

    input.click();
  };

  return (
    <div className="absolute inset-0">
      {map.cells.map(cell => {
        const data = useCellImage(map.id, cell.id);

        return (
          <div
            key={cell.id}
            onClick={() => openFilePicker(cell.id)}
            className="
              absolute
              cursor-pointer
              border border-white/30
              hover:border-blue-500
              hover:shadow-lg
              transition
            "
            style={{
              left: `${(cell.x / map.width) * 100}%`,
              top: `${(cell.y / map.height) * 100}%`,
              width: `${(cell.w / map.width) * 100}%`,
              height: `${(cell.h / map.height) * 100}%`
            }}
          >
            <img
              src={data?.image || "/clic.png"}
              className="
              opacity-10
                w-full h-full object-cover
                 
                transition
              "
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
