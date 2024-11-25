import { cookies } from "next/headers";
import { TAuthenticatedToken } from "./types";
import jsonwebtoken from "jsonwebtoken";
import prisma from "./prisma";

export async function authenticateToken(): Promise<TAuthenticatedToken | null> {
  const cookies_ = await cookies();
  const tokenCookie = cookies_.get("token");

  if (!tokenCookie) return null;

  return await new Promise((resolve) => {
    jsonwebtoken.verify(
      tokenCookie.value,
      process.env.TOKEN_JWT_SECRET!,
      //@ts-expect-error will work
      async (err, decoded: { id: string }) => {
        if (err) return resolve(null);

        const userFound = await prisma.user.findFirst({
          where: { id: decoded.id },
        });

        if (!userFound) return resolve(null);

        resolve({
          id: decoded.id,
          firstName: userFound.firstName,
          type: userFound.type,
        });
      }
    );
  });
}
