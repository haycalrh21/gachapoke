import React, { Suspense } from "react";
import ButtonGacha from "./ButtonGacha";
import { auth } from "@/app/auth";
import Spinner from "../spinner";

// Mendefinisikan interface untuk Pokemon
interface Pokemon {
  name: string;
  url: string;
}

// Komponen utama
const CardGacha: React.FC = async () => {
  const session = await auth(); // Mendapatkan session user
  const userId = session?.user?.id; // Ambil userId dari session

  // Memastikan userId didefinisikan
  if (!userId) {
    return <div>User not authenticated</div>; // Atau handle sesuai kebutuhan
  }

  // Mengambil data Pokémon dari API
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000"
  );
  const result = await res.json();
  const pokemonData: Pokemon[] = result.results;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Card Gacha</h1>
      <Suspense fallback={<Spinner />}>
        <ButtonGacha pokemonData={pokemonData} userId={userId} />
      </Suspense>
    </div>
  );
};

export default CardGacha;
