// Ajustes de precisión basados en las dimensiones 736x843
const START_X = 110; // Margen izquierdo hasta la primera columna
const START_Y = 385; // Inicio de la rejilla principal (debajo del ático)
const CELL_W = 90;  // Ancho de cada recuadro blanco
const CELL_H = 90;  // Alto de cada recuadro blanco
const GAP_X = 18;    // Espacio horizontal entre ventanas
const GAP_Y = 16;    // Espacio vertical entre ventanas

const COLS = 5;
const ROWS = 4;

const windows = Array.from({ length: ROWS * COLS }, (_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;

  // Omitimos la posición de la puerta (fila 3, columnas 1 y 2 si empezamos de 0)
  // O simplemente generamos todas y filtramos la puerta manualmente si prefieres
  if (col === 2 && (row === 3 || row === 2)) return null;

  return {
    id: `w${i + 1}`,
    x: START_X + col * (CELL_W + GAP_X),
    y: START_Y + row * (CELL_H + GAP_Y),
    w: CELL_W,
    h: CELL_H
  };
}).filter(Boolean); // Eliminamos los huecos de la puerta

export const map = {
  id: "mutis-family5",
  image: "/G_KhHM6XMAAh5fs.jpeg",
  width: 736,
  height: 843,
  cells: [
    { id: "attic", x: 312, y: 260, w: 112, h: 104 }, // Ventana superior central
    ...windows 
  ] as any
};
