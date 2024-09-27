"use server";

import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

// Interface untuk Card
export interface Card {
  pokemonName: string;
  pokemonId: number;
  image: string; // Pastikan image tidak null
  quantity?: number; // Pastikan quantity bersifat opsional
}

export interface id {
  userId: number;
}

// Fungsi untuk membuat pengguna
export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User registration failed");
  }
};

// Fungsi untuk memeriksa apakah kartu sudah ada
export const findExistingCard = async (userId: string, pokemonId: number) => {
  return await prisma.card.findFirst({
    where: {
      userId: Number(userId),
      pokemonId,
    },
  });
};

export const getUserId = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      cards: true,
    },
  });

  return user;
};

// Fungsi untuk menyimpan kartu
export const saveCard = async (userId: string, newCard: Card) => {
  // Cek apakah kartu sudah ada
  const existingCard = await findExistingCard(userId, newCard.pokemonId);

  if (existingCard) {
    // Jika kartu ada, increment quantity-nya
    return await prisma.card.update({
      where: { id: existingCard.id },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  }

  return await prisma.card.create({
    data: {
      userId: Number(userId),
      pokemonId: newCard.pokemonId,
      pokemonName: newCard.pokemonName,
      image: newCard.image, // Pastikan tidak null
      quantity: 1,
    },
  });
};
