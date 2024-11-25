import { authenticateToken } from "@/libs/authentication";
import prisma from "@/libs/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brukerpanel",
};

export default async function UserDashboardPage() {
  const authenticatedToken = await authenticateToken();

  if (!authenticatedToken) return redirect("/auth/login");

  const userFound = await prisma.user.findFirst({
    where: { id: authenticatedToken.id },
  });

  if (!userFound) return redirect("/auth/login");

  return (
    <div className="p-[30px]">
      <h2 className="font-bold text-lg lg:text-xl">
        {userFound.lastName}, {userFound.firstName}
      </h2>

      <p className="text-lg lg:text-xl mt-[15px]">Arbeidsøkter</p>
      <p className="text-base lg:text-lg">Totalt: 0</p>
      <p className="text-base lg:text-lg">Denne måneden: 0</p>

      <p className="text-lg lg:text-xl mt-[15px]">Arbeidstimer</p>
      <p className="text-base lg:text-lg">Totalt: 0</p>
      <p className="text-base lg:text-lg">Denne måneden: 0</p>

      <p className="text-lg lg:text-xl mt-[15px]">
        Du har ingen registrerte arbeidsøkter enda!
      </p>
    </div>
  );
}
