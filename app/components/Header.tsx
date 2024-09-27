import { auth } from "../auth";
import Link from "next/link";
import { SignOut } from "./Signout";

const Header = async () => {
  const session = await auth();
  // console.log(session);

  // Fungsi untuk menangani logout

  return (
    <div className="flex justify-between items-center p-4">
      <Link href={"/"}>
        <h1 className="text-3xl font-bold">Gacha Pokemon</h1>
      </Link>
      <div className="flex items-center">
        {" "}
        {/* Tambahkan flex di sini */}
        {session ? (
          <>
            <Link
              href={`/dashboard/${session?.user?.id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2" // Tambahkan margin kanan
            >
              Dashboard
            </Link>
            <SignOut />
          </>
        ) : (
          <>
            <Link
              href={"/login"}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
