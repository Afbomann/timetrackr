"use client";

import { TAuthenticatedToken } from "@/libs/types";
import Image from "next/image";
import Link from "next/link";

export default function NavbarClient(props: {
  authenticatedToken: TAuthenticatedToken | null;
  logoutServer: () => Promise<void>;
}) {
  return (
    <>
      <nav className="w-screen h-[70px] bg-slate-100 flex items-center">
        <div className="ml-[7%]">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Logo image"
              width={180}
              height={40}
            />
          </Link>
        </div>
        <div className="ml-auto mr-[7%] flex items-center gap-[20px]">
          {!props.authenticatedToken && (
            <Link
              href="/auth/login"
              className="bg-[#FF5B24] px-[15px] py-[6px] text-white text-sm lg:text-base"
            >
              Logg-inn
            </Link>
          )}

          {props.authenticatedToken && (
            <Link href="/user/dashboard" className="text-sm lg:text-base">
              {props.authenticatedToken.firstName}
            </Link>
          )}

          {props.authenticatedToken && (
            <button
              onClick={async () => await props.logoutServer()}
              className="bg-[#1A1A1A] px-[15px] py-[6px] text-white text-sm lg:text-base"
            >
              Logg-ut
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
