"use client";

import { TServerActionResponse } from "@/libs/types";
import { FormEvent, useState } from "react";

export default function AuthLoginClient(props: {
  loginServer: (input: {
    username: string;
    password: string;
  }) => Promise<TServerActionResponse>;
}) {
  const [input, setInput] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ err: "", loading: false });

  async function loginClient(e: FormEvent) {
    e.preventDefault();

    setStatus((prev) => (prev = { ...prev, err: "", loading: false }));

    if (!input.username)
      return setStatus(
        (prev) => (prev = { ...prev, err: "Skriv inn ditt brukernavn." })
      );

    if (!input.password)
      return setStatus(
        (prev) => (prev = { ...prev, err: "Skriv inn ditt passord." })
      );

    setStatus((prev) => (prev = { ...prev, err: "", loading: true }));

    await props
      .loginServer(input)
      .then((response: TServerActionResponse) => {
        if (response.err) {
          setStatus(
            (prev) => (prev = { ...prev, err: response.err!, loading: false })
          );
        } else {
          setStatus((prev) => (prev = { ...prev, err: "", loading: false }));
        }
      })
      .catch((err: string) =>
        setStatus((prev) => (prev = { ...prev, err: err, loading: false }))
      );
  }

  return (
    <form
      onSubmit={loginClient}
      className="w-[400px] max-w-[85%] bg-slate-100 mx-auto mt-[20dvh] p-[25px]"
    >
      <p className="tracking-wider text-center text-base lg:text-lg">
        Logg-inn på kontoen din
      </p>

      <div className="flex flex-col gap-[5px] mt-[20px]">
        <label className="text-sm lg:text-base">Brukernavn</label>
        <input
          type="text"
          className="text-sm lg:text-base py-[3px] px-[5px] outline-none"
          value={input.username}
          onChange={(e) =>
            setInput((prev) => (prev = { ...prev, username: e.target.value }))
          }
        ></input>
      </div>

      <div className="flex flex-col gap-[5px] mt-[15px]">
        <label className="text-sm lg:text-base">Passord</label>
        <input
          type="password"
          className="text-sm lg:text-base py-[3px] px-[5px] outline-none"
          value={input.password}
          onChange={(e) =>
            setInput((prev) => (prev = { ...prev, password: e.target.value }))
          }
        ></input>
      </div>

      {status.loading && (
        <p className="mt-[5px] text-sm lg:text-base">Logger inn...</p>
      )}

      {status.err && (
        <p className="mt-[5px] text-sm lg:text-base text-red-500">
          {status.err}
        </p>
      )}

      <button
        className={`${
          !status.err && !status.loading ? "mt-[20px]" : "mt-[10px]"
        } bg-[#1A1A1A] px-[15px] py-[6px] text-white text-sm lg:text-base w-[40%]`}
        type="submit"
      >
        Logg-inn
      </button>
    </form>
  );
}
