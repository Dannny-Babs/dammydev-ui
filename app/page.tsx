import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen border-x border-gray-700 pb-20 gap-16  max-w-5xl mx-auto">
        <div className="flex flex-col  items-start w-full">
          <div className="sm:pt-20 pt-10  border-b border-gray-700  w-full"/>
          <h1 className="text-4xl font-medium tracking-tight  p-5 border-b border-gray-700  w-full">Dammy&apos;s  Craft</h1>
          <p className="text-lg py-2 px-5 border-b border-gray-700 w-full">
            A collection of my craft projects
          </p>
          <div className="flex flex-col gap-4 p-5 w-full">
            <div className="flex flex-row gap-4 w-full justify-between items-center">
              <Link href="/color-picker">Color Picker</Link>
              <p className="text-neutral-400">
                Jul 27, 2025
              </p>
            </div>
          </div>
        </div>

    </div>
  );
}
