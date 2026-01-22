import Dexie, { Table } from "dexie";

export interface CellImage {
  id?: number;
  mapId: string;
  cellId: string;
  image: string;
}

class MutisDB extends Dexie {
  cells!: Table<CellImage, number>;

  constructor() {
    super("MutisDB");
    this.version(1).stores({
      cells: "++id,[mapId+cellId]"
    });
  }
}

export const db = new MutisDB();
