"use client";
import React, { useState } from "react";
import ButtonSave from "./ButtonSave";
import Image from "next/image";
import Spinner from "../spinner";

// Mendefinisikan interface untuk Pokemon
interface Pokemon {
  name: string;
  url: string;
}

interface GachaResult {
  name: string;
  image: string;
  url: string;
}

// Fungsi untuk mendapatkan ID Pokemon dari URL
const getPokemonId = (url: string): number => {
  const regex = /\/([0-9]+)\//;
  const match = url.match(regex);
  return match ? parseInt(match[1], 10) : -1;
};

// Komponen ButtonGacha
const ButtonGacha: React.FC<{ pokemonData: Pokemon[]; userId: string }> = ({
  pokemonData,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gachaResult, setGachaResult] = useState<GachaResult | null>(null); // State untuk menyimpan hasil gacha

  const handleGacha = async (): Promise<GachaResult> => {
    let gachaResult: Pokemon;
    const guaranteedPokemon = pokemonData[0];
    const isDuplicate = Math.random() <= 0.1;

    if (isDuplicate && pokemonData.length > 0) {
      gachaResult = guaranteedPokemon;
    } else {
      const randomIndex = Math.floor(Math.random() * pokemonData.length);
      gachaResult = pokemonData[randomIndex];
    }

    const result: GachaResult = {
      name: gachaResult.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
        gachaResult.url
      )}.png`,
      url: gachaResult.url,
    };

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await handleGacha();
      setGachaResult(result);
      console.log("Hasil Gacha:", result);
    } catch (error) {
      console.error("Error during gacha:", error);
      // Tampilkan pesan kesalahan jika diinginkan
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {isLoading && <Spinner />}
      <form onSubmit={handleSubmit} className="flex justify-center mb-4">
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200"
        >
          {isLoading ? <Spinner /> : "Gacha"}
        </button>
      </form>

      {gachaResult && (
        <div className="flex items-center bg-white shadow-lg rounded-lg p-4">
          <Image
            src={gachaResult.image}
            alt={gachaResult.name}
            width={200}
            height={200}
            className="mr-3"
          />
          <span className="flex-1 text-lg font-semibold">
            {gachaResult.name}
          </span>
          <ButtonSave
            gachaResult={gachaResult}
            userId={userId}
            loading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default ButtonGacha;
