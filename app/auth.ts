import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prismaClient";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Validasi credentials
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        // Menggunakan findUnique untuk mencari pengguna berdasarkan email
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        // Memverifikasi keberadaan user dan password
        if (!user || !(await compare(password, user.password as string))) {
          throw new Error("Invalid email or password.");
        }

        // Mengembalikan objek user sesuai dengan tipe User
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string, // Memastikan id adalah string
        },
      };
    },

    async jwt({ token, user }) {
      console.log("JWT Callback", { token, user });
      if (user) {
        token.id = user.id; // Pastikan user.id adalah string
      }
      return token;
    },
  },
});
