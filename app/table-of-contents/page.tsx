import { TableOfContents } from "@/components/table-of-contents";
import TableOfContentsMorph from "@/components/TableOfContentsMorph";
import Image from "next/image";

export default function TableOfContentsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-950 font-sans">
            <div className="md:px-8 px-4 md:py-16 py-24 md:mt-16 mt-4 max-w-7xl mx-auto leading-8">
                <div className="flex gap-12">
                    {/* Table of Contents Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block w-80 flex-shrink-0 justify-between">
                        <TableOfContents />
                        <TableOfContentsMorph />
                    </div>

                    <div className="flex-1 max-w-4xl">
                        {/* Mobile floating dock - positioned via CSS */}
                        <div className="lg:hidden">
                            <TableOfContentsMorph />
                        </div>

                        <h1 className="text-4xl font-bold" id="table-of-contents">Component Showcase: Table of Contents</h1>
                        <p className="text-base mt-4">A collection of my craft projects, from simple interactions to complex animation and UI components.  Welcome to my Apothecary, and feel free to explore my creations.</p>
                        <p className="text-base mt-4">
                            Today I want to show you a project that I have been working on, it is a table of contents component that I built to replicate the normal TOC experience, where you can navigate to a section by clicking on the table of contents.
                        </p>

                        <Image src="https://bytescale.mobbin.com/FW25bBB/image/mobbin.com/prod/content/app_screens/884a9fc6-418f-4742-a7c6-103a777cc4bd.png?f=webp&w=1920&q=85&fit=shrink-cover&extend-bottom=120&image=%2Fmobbin.com%2Fprod%2Fwatermark%2F1.0%2Fa570f3d9-2433-49f5-8c83-5e5f6bdee07a&gravity=bottom&v=1.0" alt="Table of Contents" width={1000} height={1000} priority className="rounded-lg border border-slate-200 mt-4" />


                        <section id="section-2" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="how-did-i-make-this">How did I make this?</h3>
                            <p className="text-base mt-2">Well for this component, I used the table of contents, I built mine around the usage of  HTML Id tags, I learnt about id tag navigation and how to use it to scroll to the section. </p>
                            <p className="text-base mt-4">I also used the useEffect hook to ensure the table of contents is only rendered after the component is mounted, I also used the useState hook to manage the state of the table of contents, since it is a client side component.</p>
                            <p className="text-base mt-4">The ui  is quite simple, but I think it is a good example of how to use the table of contents component. I wanted to go with a vertical table of contents. You can see the example below.</p>
                        </section>
                        <Image src="https://media.nngroup.com/media/editor/2023/09/16/visual-layout.png" alt="Visual Layout" width={1000} height={1000} priority className="rounded-lg border border-slate-200 mt-4" />
                        <section id="section-3" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="what-was-used-to-build-this">What was used to build this?</h3>
                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="frameworks">Frameworks</h4>
                            <p className="text-base mt-2">I used the following technologies to build this component:</p>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>React</li>
                                <li>Next.js</li>
                                <li>Tailwind CSS</li>
                                <li>TypeScript</li>
                            </ul>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="design-libraries">Design Libraries</h4>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>Shadcn UI</li>
                                <li>Hugeicons</li>
                                <li>Google Fonts</li>
                            </ul>
                        </section>
                        <section id="section-4" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="what-was-learned">What was learned</h3>
                            <p className="text-base mt-2">I learned about the use of the id tag to navigate to a section, and the use of the useEffect hook to ensure the table of contents is only rendered after the component is mounted.</p>
                            <p className="text-base mt-4">
                                The goal behind this was to try and replicate the notion like experience, where you can navigate to a section by clicking on the table of contents. Which isn&apos;t just a text table of contents, but a visual table of contents navigated by clicking on the dashes by the section.
                            </p>

                        </section>

                        <section id="section-5" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="future-updates">Future Updates</h3>
                            <p className="text-base mt-2">I plan to add more features to the table of contents component, such as the ability to add custom sections, and the ability to add custom titles to the sections.</p>
                            <p className="text-base mt-4">I also plan to add the ability to add custom icons to the sections, and the ability to add custom colors to the sections.</p>
                        </section>

                        {/* Bottom gradient overlay */}
                        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-40"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}