import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="w-fit mx-auto mt-[15dvh] max-w-[85%] flex flex-col items-center">
      <h2 className="text-2xl lg:text-3xl">404 | Ikke Funnet</h2>
      <h4 className="text-lg lg:text-xl">
        Siden du leter etter finnes ikke...
      </h4>
      <Link
        className="text-lg lg:text-xl bg-[#FF5B24] px-[15px] py-[6px] text-white mt-[10px]"
        href="/"
      >
        Gå tilbake til hjem
      </Link>
    </div>
  );
}
