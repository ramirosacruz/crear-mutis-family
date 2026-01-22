"use client";

import { shareFinalImage } from "@/utils/shareImage";

export function ShareButton() {
    return null
    return (
        <button
            onClick={shareFinalImage}
            className="bg-pink-600 text-white px-4 py-2 rounded"
        >
            Compartir
        </button>
    );
}
