// app/page.tsx (Server Component)
import { auth } from "./auth"; // Pastikan ini diimpor dengan benar

import Home from "./components/Home";

export default async function Page() {
  const session = await auth(); // Mengambil data session di sini

  // Memastikan session tidak null sebelum mengakses propertinya
  const userId = session?.user?.id ?? ""; // Gunakan "" jika session atau user null

  return <Home session={{ user: { id: userId } }} />;
}
