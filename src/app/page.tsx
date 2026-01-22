import { ImageOverlay } from "@/components/ImageOverlay";
import { ShareButton } from "@/components/ShareButton";

export default function Home() {
  return (
    <main className="flex gap-4 p-4 flex-col">
     <div className="text-center space-y-3">
  <div className="text-lg font-semibold">
    🌸 Hola mutis 🌸  
    <br />
    ¡Ya pueden crear su propia familia de mutis! 🐣💕
  </div>

  <div className="text-sm">
    💌 Saludos a
    <a
      href="https://twitter.com/Mikaruangel"
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-300 font-bold mx-1 hover:underline"
    >
      @Mikaruangel
    </a>
    y síganme para más mutis adorables ✨
    <a
      href="https://twitter.com/solrex2000"
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-300 font-bold mx-1 hover:underline"
    >
      @solrex2000
    </a>
    🐾
  </div>

  <div className="font-medium">
    ❓ ¿Cómo funciona?
  </div>

  <div className="text-sm">
    📸 Agregás las fotitos de tus mutis  
    <br />
    💾 y mientras no borres el historial  
    <br />
    ✨ se quedan guardaditas para siempre uwu 🥺💕
  </div>
</div>

      <div className="relative w-[500px] h-[500px]">
        <img
          src="/mutihouse.jpeg"
          style={{}}
          className="absolute inset-0 w-full h-full"
        />
        <ImageOverlay />
      </div>

      <div className="space-y-4">
        <ShareButton />
      </div>
    </main>
  );
}
