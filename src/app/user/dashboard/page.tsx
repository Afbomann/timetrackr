import { authenticateToken } from "@/libs/authentication";
import prisma from "@/libs/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import UserDashboardClient from "./userDashboardClient";
import { TServerActionResponse } from "@/libs/types";

export const metadata: Metadata = {
  title: "Brukerpanel",
};

export default async function UserDashboardPage() {
  const authenticatedToken = await authenticateToken();

  if (!authenticatedToken) return redirect("/auth/login");

  const userFound = await prisma.user.findFirst({
    where: { id: authenticatedToken.id },
    include: {
      workSessions: {
        select: { start: true, end: true, status: true },
        orderBy: { id: "desc" },
      },
    },
  });

  if (!userFound) return redirect("/auth/login");

  const activeWorkSessionFound = userFound.workSessions.find(
    (workSession) => workSession.status == "active"
  );

  async function toggleWorkSessionActiveServer(): Promise<TServerActionResponse> {
    "use server";

    const authenticatedTokenNew = await authenticateToken();

    if (!authenticatedTokenNew) return { err: "Uatorisert." };

    const userFoundNew = await prisma.user.findFirst({
      where: { id: authenticatedTokenNew.id },
      include: { workSessions: true },
    });

    if (!userFoundNew) return { err: "Uatorisert." };

    const activeWorkSessionFoundNew = userFoundNew.workSessions.find(
      (workSession) => workSession.status == "active"
    );

    if (activeWorkSessionFoundNew) {
      await prisma.workSession.update({
        where: { id: activeWorkSessionFoundNew.id },
        data: { status: "ended", end: new Date() },
      });

      return { suc: "Vellykket!" };
    } else {
      await prisma.workSession.create({
        data: {
          start: new Date(),
          status: "active",
          userID: authenticatedTokenNew.id,
        },
      });

      return { suc: "Vellykket!" };
    }
  }

  return (
    <div className="p-[30px]">
      <h2 className="font-bold text-lg lg:text-xl">
        {userFound.lastName}, {userFound.firstName}
      </h2>

      <UserDashboardClient
        activeWorkSession={
          activeWorkSessionFound ? activeWorkSessionFound.start : null
        }
        toggleWorkSessionActiveServer={toggleWorkSessionActiveServer}
        workSessions={userFound.workSessions}
      />
    </div>
  );
}
