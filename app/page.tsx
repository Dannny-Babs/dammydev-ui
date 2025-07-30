import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen border-x border-gray-700 pb-20 gap-16 max-w-5xl mx-auto">
      <div className="flex flex-col  items-start w-full">
        <div className="sm:pt-20 pt-10  border-b border-gray-700  w-full bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10" />
        <h1 className=" text-[3.5rem] sm:text-9xl font-medium  tracking-tighter  px-5 py-4 border-b border-gray-700  w-full">The Apothecary</h1>
        <h2 className="text-sm font-medium tracking-tight  px-5 py-2 border-b border-gray-700  w-full">Made by <span className="text-blue-400"> <Link href="https://dammydev.me/" className="hover:underline hover:text-blue-400">Dammy</Link></span></h2>
        <p className=" py-2 px-5 border-b border-gray-700 w-full">
          A collection of my craft projects, from simple interactions to complex animation and UI components.  Welcome to my Apothecary, and feel free to explore my creations.
        </p>
        <div className="flex flex-col gap-4 p-5 w-full">
          <div className="flex flex-row gap-4 w-full justify-between items-center">
            <Link href="/color-picker" className="hover:underline hover:text-blue-400">Contrast Checker</Link>
            <p className="text-neutral-400 text-sm">
              Jul 27, 2025
            </p>
          </div>
          <div className="flex flex-row gap-4 w-full justify-between items-center">
            <Link href="/morph-surface" className="hover:underline hover:text-blue-400">Morph Surface Interaction</Link>
            <p className="text-neutral-400 text-sm">
              Jul 30, 2025
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
