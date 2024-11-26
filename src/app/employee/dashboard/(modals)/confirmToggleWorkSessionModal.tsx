"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import { TServerActionResponse } from "@/libs/types";

export default function ConfirmToggleWorkSessionModal(props: {
  activeWorkSession: boolean;
  isOpen: boolean;
  onClose: () => void;
  toggleWorkSessionActiveServer: () => Promise<TServerActionResponse>;
}) {
  const [status, setStatus] = useState({ err: "", loading: false });

  if (!props.isOpen) return;

  async function toggleWorkSessionActiveClient() {
    setStatus((prev) => (prev = { ...prev, err: "", loading: true }));

    await props
      .toggleWorkSessionActiveServer()
      .then((response) => {
        if (response)
          if (response.err) {
            setStatus(
              (prev) => (prev = { ...prev, err: response.err!, loading: false })
            );
          } else if (response.suc) {
            setStatus((prev) => (prev = { ...prev, err: "", loading: false }));
            location.reload();
          }
      })
      .catch((err) => {
        setStatus(
          (prev) =>
            (prev = { ...prev, err: `Feilkode: ${err}`, loading: false })
        );
      });
  }

  return createPortal(
    <div className="w-screen h-screen fixed top-0 flex flex-col justify-center items-center">
      <div
        className="absolute w-screen h-screen bg-black opacity-50"
        onClick={() => {
          setStatus((prev) => (prev = { ...prev, err: "", loading: false }));
          props.onClose();
        }}
      />
      <div className="bg-slate-100 w-[400px] max-w-[85%] p-[25px] z-30">
        <p className="text-base lg:text-lg">
          {props.activeWorkSession
            ? "Er du sikker på at du vil avslutte arbeidsøkten?"
            : "Er du sikker på at du vil starte en ny arbeidsøkt?"}
        </p>

        {status.loading && (
          <p className="mt-[5px] text-sm lg:text-base">Laster...</p>
        )}

        {status.err && (
          <p className="mt-[5px] text-sm lg:text-base text-red-500">
            {status.err}
          </p>
        )}

        <div
          className={`${
            !status.err && !status.loading ? "mt-[20px]" : "mt-[10px]"
          } flex gap-[10px]`}
        >
          <button
            className="bg-[#1A1A1A] px-[20px] py-[4px] text-white text-base lg:text-lg"
            onClick={async () => await toggleWorkSessionActiveClient()}
          >
            Ja
          </button>
          <button
            className="bg-[#1A1A1A] px-[20px] py-[4px] text-white text-base lg:text-lg"
            onClick={() => {
              setStatus(
                (prev) => (prev = { ...prev, err: "", loading: false })
              );
              props.onClose();
            }}
          >
            Nei
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
