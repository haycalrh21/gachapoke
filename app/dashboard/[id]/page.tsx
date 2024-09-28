"use client";

import { getUserId } from "@/app/action/user";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Spinner from "@/app/components/spinner";

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
  image?: string;
  quantity?: number;
}

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async (id: string) => {
      try {
        const res = await getUserId(id);
        if (res) {
          setUser({
            id: res.id,
            name: res.name,
            email: res.email,
            cards: [...res.cards],
          });
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser(id);
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>

      <Suspense fallback={<Spinner />}>
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
            <Spinner />
          )}
        </div>
      </Suspense>
    </div>
  );
}
