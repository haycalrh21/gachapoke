"use client";

import { getUserId } from "@/app/action/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name?: string;
  email?: string;
  cards?: Card[];
}

interface Card {
  id: number;
  userId: number;
  pokemonName: string;
  pokemonId: number;
  image?: string; // Pastikan untuk menambahkan properti image
  quantity?: number;
}

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (id: string) => {
    setLoading(true);
    try {
      const res = await getUserId(id);
      setLoading(false);
      if (res) {
        setUser({
          id: res.id,
          name: res.name,
          email: res.email,
          cards: [...res.cards],
        });
        // console.log("User found:", res);
      } else {
        // console.log("User not found");
      }
    } catch (error) {
      setLoading(false); // Pastikan untuk menonaktifkan loading jika terjadi error
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser(id);
  }, [id]); // Pastikan id ditambahkan sebagai dependensi

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
      {loading ? (
        <p className="text-center mt-4 text-gray-500">Loading...</p> // Menampilkan pesan loading
      ) : user ? (
        <div>{/* Tampilkan informasi pengguna di sini, jika diperlukan */}</div>
      ) : (
        <p className="mt-4 text-red-500">User not found.</p>
      )}

      {/* Kartu Pokemon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {user?.cards && user.cards.length > 0 ? (
          user.cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center border p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <img
                src={card.image}
                alt={card.pokemonName}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <h3 className="font-medium text-center text-lg">
                {card.pokemonName}
              </h3>
              <p className="text-sm text-gray-500">ID: {card.pokemonId}</p>
              <p className="text-sm text-gray-500">Jumlah: {card.quantity}</p>
            </div>
          ))
        ) : (
          <p className="mt-4 text-gray-500">No cards found for this user.</p>
        )}
      </div>
    </div>
  );
}
