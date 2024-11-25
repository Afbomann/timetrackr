import { authenticateToken } from "@/libs/authentication";
import { redirect } from "next/navigation";
import AuthLoginClient from "./authLoginClient";
import { TServerActionResponse } from "@/libs/types";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";
import jsonwebtoken from "jsonwebtoken";
import { cookies } from "next/headers";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Logg-inn" };

export default async function AuthLoginPage() {
  const authenticatedToken = await authenticateToken();

  if (authenticatedToken) return redirect("/employee/dashboard");

  async function loginServer(input: {
    username: string;
    password: string;
  }): Promise<TServerActionResponse> {
    "use server";

    const authenticatedTokenNew = await authenticateToken();

    if (authenticatedTokenNew) return { err: "Uatorisert." };

    if (!input.username) return { err: "Skriv inn ditt brukernavn." };

    if (!input.password) return { err: "Skriv inn ditt passord." };

    const userFound = await prisma.user.findFirst({
      where: { username: input.username },
    });

    if (!userFound) return { err: "Feil brukernavn eller passord." };

    const passwordMatch = await bcrypt.compare(
      input.password,
      userFound.password
    );

    if (!passwordMatch) return { err: "Feil brukernavn eller passord." };

    const cookies_ = await cookies();
    const token = jsonwebtoken.sign(
      { id: userFound.id },
      process.env.TOKEN_JWT_SECRET!,
      { expiresIn: "1h" }
    );
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    cookies_.set("token", token, {
      expires: expires,
      httpOnly: true,
      secure: true,
    });

    return { suc: "Vellykket!" };
  }

  return <AuthLoginClient loginServer={loginServer} />;
}
