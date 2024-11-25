"use client";

import { TServerActionResponse } from "@/libs/types";
import { useState } from "react";

export default function UserDashboardClient(props: {
  activeWorkSession: Date | null;
  toggleWorkSessionActiveServer: () => Promise<TServerActionResponse>;
}) {
  const [activeWorkSession, setActiveWorkSession] = useState(
    props.activeWorkSession
  );

  async function toggleWorkSessionActiveClient() {
    await props
      .toggleWorkSessionActiveServer()
      .then((response) => {
        if (response.suc) {
          setActiveWorkSession((prev) => (prev = prev ? null : new Date()));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <button
        onClick={async () => await toggleWorkSessionActiveClient()}
        className={`${
          activeWorkSession ? "bg-red-400" : "bg-green-400"
        } px-[15px] py-[6px] text-base lg:text-lg mt-[15px]`}
      >
        {activeWorkSession ? "Avslutt arbeidsøkt" : "Start arbeidsøkt"}
      </button>
    </>
  );
}
