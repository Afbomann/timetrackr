import { authenticateToken } from "@/libs/authentication";
import NavbarClient from "./navbarClient";
import { cookies } from "next/headers";

export default async function NavbarServer() {
  const authenticatedToken = await authenticateToken();

  async function logoutServer() {
    "use server";

    const cookies_ = await cookies();

    cookies_.delete("token");
  }

  return (
    <NavbarClient
      authenticatedToken={authenticatedToken}
      logoutServer={logoutServer}
    />
  );
}
