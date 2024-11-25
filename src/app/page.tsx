import Link from "next/link";
import { authenticateToken } from "@/libs/authentication";

export default async function HomePage() {
  const authenticatedToken = await authenticateToken();

  return (
    <>
      <h2 className="text-center text-2xl lg:text-3xl mt-[20dvh]">
        TimeTrackr
      </h2>

      <div className="w-fit mx-auto mt-[3dvh]">
        {!authenticatedToken && (
          <Link
            href="/auth/login"
            className="bg-[#FF5B24] px-[15px] py-[6px] text-white text-base lg:text-lg"
          >
            Fortsett til innlogging
          </Link>
        )}

        {authenticatedToken && (
          <Link
            href="/user/dashboard"
            className="bg-[#1A1A1A] px-[15px] py-[6px] text-white text-base lg:text-lg"
          >
            Brukerpanel
          </Link>
        )}
      </div>
    </>
  );
}
