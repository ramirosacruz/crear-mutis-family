import { generateFinalImage } from "./exportImage";

export async function shareFinalImage() {
  const blob = await generateFinalImage();
  const file = new File([blob], "mutis.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: "TE PRESENTO A MIS MUTIS"
    });
  } else {
    const url = URL.createObjectURL(blob);
    window.open(url);
  }
}
