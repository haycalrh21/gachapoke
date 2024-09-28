"use client";
import { saveCard } from "@/app/action/user";
import React from "react";

interface GachaResult {
  name: string;
  image: string;
  url: string; // Tambahkan properti 'url' untuk menghindari kesalahan
}

const getPokemonId = (url: string): number => {
  const regex = /\/([0-9]+)\//;
  const match = url.match(regex);
  return match ? parseInt(match[1], 10) : -1;
};

const ButtonSave: React.FC<{
  gachaResult: GachaResult | null;
  userId: string;
  loading: boolean; // Memastikan prop ini ada
}> = ({ gachaResult, userId, loading }) => {
  // Tambahkan loading di sini

  const handleSave = async () => {
    if (gachaResult) {
      console.log("Saving data:", gachaResult);
      const newCard = {
        pokemonName: gachaResult.name,
        pokemonId: getPokemonId(gachaResult.url), // Menggunakan url dari gachaResult
        image: gachaResult.image,
      };
      try {
        const savedCard = await saveCard(userId, newCard);
        console.log("Data has been saved!", savedCard);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      console.warn("No gacha result to save.");
    }
  };

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default ButtonSave;
