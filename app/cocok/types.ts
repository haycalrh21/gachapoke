// src/types.ts

export interface Card {
  pokemonName: string;
  pokemonId: number;
  image?: string; // Optional jika perlu
  quantity?: number; // Pastikan quantity ditambahkan
}

export interface User {
  id: number;
  username: string;
  email: string;
  // Tambahkan properti lain yang diperlukan
}
