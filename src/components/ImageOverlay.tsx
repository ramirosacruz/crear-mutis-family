"use client";

 import { useCellImage } from "@/hooks/useCellImage";
import { map } from "@/maps/megazord";

export function ImageOverlay() {
  return (
    <div className="absolute inset-0">
      {map.cells.map(cell => {
        const data = useCellImage(map.id, cell.id);

        return (
          <div
            key={cell.id}
            className="absolute border border-white/30"
            style={{
              left: `${(cell.x / map.width) * 100}%`,
              top: `${(cell.y / map.height) * 100}%`,
              width: `${(cell.w / map.width) * 100}%`,
              height: `${(cell.h / map.height) * 100}%`
            }}
          >
            {data?.image && (
              <img
                src={data.image}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
