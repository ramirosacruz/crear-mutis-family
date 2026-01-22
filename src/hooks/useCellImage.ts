import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/dexie";

export function useCellImage(mapId: string, cellId: string) {
  return useLiveQuery(
    () => db.cells.get({ mapId, cellId }),
    [mapId, cellId]
  );
}
