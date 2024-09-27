"use client";
import { useEffect, useState } from "react";
import { saveCard } from "../action/user";
import { useRouter } from "next/navigation";

// Tentukan tipe data yang diambil dari API
interface Pokemon {
  name: string;
  url: string;
}

interface Card {
  pokemonName: string;
  pokemonId: number; // Pastikan ini sebagai number
  image: string; // Tambahkan properti image
}

interface HomeProps {
  session: { user?: { id: string } };
}

export default function Home({ session }: HomeProps) {
  const router = useRouter();
  // State untuk menyimpan data Pokémon
  const [data, setData] = useState<Pokemon[]>([]);
  const [gachaResult, setGachaResult] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk mengambil data Pokémon dari API dengan offset 0 dan limit 1000
  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000"
      );
      if (!res.ok) throw new Error("Gagal mengambil data Pokémon");
      const result = await res.json();
      setData(result.results); // Update state dengan data yang diambil
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  // Mendapatkan ID Pokémon dari URL
  const getPokemonId = (url: string) => {
    const parts = url.split("/");
    return Number(parts[parts.length - 2]); // Pastikan mengembalikan ID sebagai number
  };

  const handleGacha = () => {
    setIsLoading(true);
    setTimeout(() => {
      const isDuplicate = Math.random() <= 0.1;
      if (isDuplicate && data.length > 0) {
        setGachaResult(data[0]); // Mengambil Pokémon pertama jika duplicate
      } else {
        const randomIndex = Math.floor(Math.random() * data.length);
        setGachaResult(data[randomIndex]);
      }
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    const userId = session?.user?.id; // Ambil userId dari session
    if (!userId || !gachaResult) {
      router.push("/login");
      return;
    }

    const newCard: Card = {
      pokemonName: gachaResult.name,
      pokemonId: getPokemonId(gachaResult.url),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
        gachaResult.url
      )}.png`,
    };

    try {
      const savedCard = await saveCard(userId, newCard);
      console.log(savedCard);
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      ) : gachaResult ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Hasil Gacha</h2>
          <div className="border p-6 rounded-lg shadow-lg w-80">
            {" "}
            {/* Lebarkan kartu */}
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
                gachaResult.url
              )}.png`}
              alt={gachaResult.name}
              className="w-full h-auto mb-2"
            />
            <p className="text-center text-lg font-medium">
              {gachaResult.name}
            </p>
          </div>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Silakan lakukan gacha!</h2>
        </div>
      )}

      <div className="flex justify-center mb-4 mt-4">
        {" "}
        {/* Tambahkan flexbox untuk tombol gacha */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGacha}
          disabled={isLoading}
        >
          {isLoading ? "Menggacha..." : "Gacha"}
        </button>
      </div>
    </div>
  );
}
