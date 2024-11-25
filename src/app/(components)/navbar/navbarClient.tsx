"use client";

import { TAuthenticatedToken } from "@/libs/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavbarClient(props: {
  authenticatedToken: TAuthenticatedToken | null;
  logoutServer: () => Promise<void>;
}) {
  const [hamburgerToggled, setHamburgerToggled] = useState(false);

  return (
    <>
      <nav className="w-screen h-[70px] bg-slate-100 flex items-center">
        <div className="ml-[7%]">
          <Link href="/">
            <Image
              onClick={() => setHamburgerToggled(() => false)}
              className="w-[140px] navbar-desktop:w-[170px]"
              src="/images/logo.svg"
              alt="Logo image"
              width={170}
              height={40}
            />
          </Link>
        </div>
        <div className="ml-auto mr-[7%] flex items-center gap-[20px]">
          {!props.authenticatedToken && (
            <Link
              href="/auth/login"
              className="bg-[#FF5B24] px-[15px] py-[6px] text-white text-sm lg:text-base hidden navbar-desktop:block"
            >
              Logg-inn
            </Link>
          )}

          {props.authenticatedToken && (
            <Link
              href="/employee/dashboard"
              className="text-sm lg:text-base hidden navbar-desktop:block"
            >
              {props.authenticatedToken.firstName}
            </Link>
          )}

          {props.authenticatedToken && (
            <button
              onClick={async () => await props.logoutServer()}
              className="bg-[#1A1A1A] px-[15px] py-[6px] text-white text-sm lg:text-base hidden navbar-desktop:block"
            >
              Logg-ut
            </button>
          )}

          <div
            onClick={() => setHamburgerToggled((prev) => (prev = !prev))}
            className="flex flex-col gap-[9px] navbar-desktop:hidden"
          >
            <div
              className={`bg-black w-[30px] h-[2px] ${
                hamburgerToggled && "rotate-[45deg] translate-y-[11px]"
              }`}
            />
            <div
              className={`bg-black w-[30px] h-[2px] ${
                hamburgerToggled && "opacity-0"
              }`}
            />
            <div
              className={`bg-black w-[30px] h-[2px] ${
                hamburgerToggled && "rotate-[-45deg] translate-y-[-11px]"
              }`}
            />
          </div>
        </div>
      </nav>

      {hamburgerToggled && (
        <nav className="absolute w-[70%] h-screen bg-slate-200 flex flex-col gap-[15px] navbar-desktop:hidden p-[20px]">
          {!props.authenticatedToken && (
            <Link
              onClick={() => setHamburgerToggled(() => false)}
              href="/auth/login"
              className="bg-[#FF5B24] px-[15px] py-[6px] text-white"
            >
              Logg-inn
            </Link>
          )}

          {props.authenticatedToken && (
            <Link
              onClick={() => setHamburgerToggled(() => false)}
              className="bg-slate-100 px-[15px] py-[6px]"
              href="/employee/dashboard"
            >
              {props.authenticatedToken.firstName}
            </Link>
          )}

          {props.authenticatedToken && (
            <button
              onClick={async () => {
                await props.logoutServer();
                setHamburgerToggled(() => false);
              }}
              className="bg-[#1A1A1A] px-[15px] py-[6px] text-white text-left"
            >
              Logg-ut
            </button>
          )}
        </nav>
      )}
    </>
  );
}
