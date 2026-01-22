"use client";

 import { db } from "@/db/dexie";
import { map } from "@/maps/megazord";

export function ZoneInputs() {
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

    return (
        <div className="space-y-2">
            {map.cells.map(cell => (
                <label
                    key={cell.id}
                    className="
      group
      relative
      flex flex-col items-center justify-center
      w-full h-32
      rounded-xl
      border-2 border-dashed border-blue-400
      bg-blue-50
      text-blue-700
      cursor-pointer
      transition
      hover:bg-blue-100 hover:border-blue-600
      focus-within:ring-2 focus-within:ring-blue-500
    "
                >
                    <span className="text-xs font-semibold absolute top-2 left-3 opacity-70">
                        Celda {cell.id}
                    </span>

                    <span className="text-sm font-medium group-hover:scale-105 transition">
                        📷 Hacé clic para subir imagen
                    </span>

                    <span className="text-xs opacity-60 mt-1">
                        JPG o PNG
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) upload(cell.id, file);
                        }}
                    />
                </label>
            ))}

        </div>
    );
}
