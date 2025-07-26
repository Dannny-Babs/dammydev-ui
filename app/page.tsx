import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex  items-start">
        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-4xl font-semibold">Dammy&apos;s Craft</h1>
          <p className="text-lg">
            A collection of my craft projects
          </p>
          <div className="flex flex-col gap-4 mt-4 text-neutral-300">
            <Link href="/color-picker">Color Picker</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
