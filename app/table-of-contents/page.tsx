import { TableOfContents } from "@/components/table-of-contents";
import TableOfContentsMorph from "@/components/TableOfContentsMorph";

export default function TableOfContentsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-950 font-sans">
            <div className="md:px-8 px-4 md:py-16 py-24 md:mt-16 mt-4 max-w-7xl mx-auto leading-8">
                <div className="flex gap-12">
                    {/* Table of Contents Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block w-80 flex-shrink-0 justify-between pb-16">
                        <TableOfContents />
                    </div>

                    <div className="flex-1 max-w-4xl md:pb-28 pb-20">
                        {/* Mobile floating dock - positioned via CSS */}
                        <div className="items-center justify-center flex">
                            <TableOfContentsMorph />
                        </div>

                        <h1 className="text-4xl font-bold" id="table-of-contents">Table of Contents Component – Development Log</h1>

                        <section id="section-2" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="why-i-built-it">Why I Built It</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="the-problem-with-long-documents">The Problem with Long Documents</h4>
                            <p className="text-base mt-2">While working on the company&apos;s privacy policy and terms of service pages, I realized how painfully long those documents were. Users needed a way to quickly jump around instead of endlessly scrolling, and there wasn&apos;t a clean, built-in way to do that.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="the-goal">The Goal</h4>
                            <p className="text-base mt-2">I wanted to build a table of contents (TOC) that:</p>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>Shows where you are in the document</li>
                                <li>Lets you jump directly to any section</li>
                                <li>Works smoothly on both web and mobile</li>
                            </ul>
                        </section>

                        <section id="section-3" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="first-version-basic-sidebar-toc">First Version: Basic Sidebar TOC</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="using-html-ids-for-navigation">Using HTML IDs for Navigation</h4>
                            <p className="text-base mt-2">I started simple: each heading in the document had an HTML id, and the sidebar TOC linked directly to it. Clicking on a section in the TOC scrolled the page to the right spot.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="tree-structure-for-headings">Tree Structure for Headings</h4>
                            <p className="text-base mt-2">I made the hierarchy clear by reading heading tags (H1–H6) and adjusting padding so it looked like a proper outline rather than a flat list.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="state-management-with-react-hooks">State Management with React Hooks</h4>
                            <p className="text-base mt-2">I used useState and useEffect to:</p>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>Highlight the active section as you scroll</li>
                                <li>Ensure the TOC rendered only after the page mounted</li>
                                <li>Keep everything synced on the client side</li>
                            </ul>
                        </section>

                        <section id="section-4" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="mobile-ux-challenges">Mobile UX Challenges</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="why-the-sidebar-didnt-work-on-mobile">Why the Sidebar Didn&apos;t Work on Mobile</h4>
                            <p className="text-base mt-2">The vertical sidebar was fine for web, but it ate up too much space on mobile screens. I needed something lighter and less intrusive.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="exploring-other-layouts">Exploring Other Layouts</h4>
                            <p className="text-base mt-2">I looked at:</p>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>Notion&apos;s minimal side indicators</li>
                                <li>Pinterest designs for navigation patterns</li>
                                <li>Dock-style menus for inspiration</li>
                            </ul>
                        </section>

                        <section id="section-5" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="final-solution-floating-dock-toc">Final Solution: Floating Dock TOC</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="how-it-works">How It Works</h4>
                            <p className="text-base mt-2">On mobile, the TOC starts as a small floating dock with:</p>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>A circular progress indicator showing how far you are in the document (e.g., &quot;28% done&quot;)</li>
                                <li>A tap-to-expand interaction that opens the full TOC for easy navigation</li>
                                <li>A gradient overlay so it fades naturally as you scroll instead of looking static</li>
                            </ul>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="fully-custom-built">Fully Custom-Built</h4>
                            <p className="text-base mt-2">I didn&apos;t use any external libraries. The whole thing was coded from scratch so it felt native to the product rather than like a bolted-on widget.</p>
                        </section>

                        <section id="section-6" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="motion-and-animation-design">Motion and Animation Design</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="spring-animations-for-snappy-interactions">Spring Animations for Snappy Interactions</h4>
                            <p className="text-base mt-2">I didn&apos;t want robotic or slow transitions. The TOC opens with spring-based animations, where I tweaked the stiffness and dampness values until the motion felt snappy but natural.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="circular-progress-indicator-animation">Circular Progress Indicator Animation</h4>
                            <p className="text-base mt-2">The progress circle uses a dash array effect so it feels dynamic rather than static when updating.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="hover-and-selection-feedback">Hover and Selection Feedback</h4>
                            <p className="text-base mt-2">When you hover over an item, it shifts slightly along the X-axis by 4px — kind of like sliding out a CD tray. The hover states use ease-out curves so interactions feel smooth without being sluggish.</p>
                        </section>

                        <section id="section-7" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="future-ideas">Future Ideas</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="minimal-indicators">Minimal Indicators</h4>
                            <p className="text-base mt-2">I might experiment with a Notion-style layout where mobile shows only subtle markers rather than a full TOC dock.</p>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="custom-icons-per-section">Custom Icons per Section</h4>
                            <p className="text-base mt-2">Adding icons for each heading could make scanning even faster, though I&apos;m cautious about adding visual clutter.</p>
                        </section>

                        <section id="section-8" className="mt-8">
                            <h3 className="text-xl font-semibold text-slate-700" id="takeaways">Takeaways</h3>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="what-i-learned">What I Learned</h4>
                            <p className="text-base mt-2">Building this wasn&apos;t just about solving navigation — it was about making the experience feel good. The motion, the feedback, the mobile layout, all of it combined into something that:</p>
                            <ul className="text-base mt-2 list-disc list-inside pl-4">
                                <li>Helps users navigate long documents easily</li>
                                <li>Feels polished with animation and interaction details</li>
                                <li>Works consistently across web and mobile</li>
                            </ul>

                            <h4 className="text-lg font-semibold text-slate-700 mt-4" id="next-steps">Next Steps</h4>
                            <p className="text-base mt-2">I&apos;m planning to turn this into a full portfolio case study with visuals, motion mockups, and the entire design rationale so it reads like a proper product story instead of just a dev diary.</p>
                        </section>

                        {/* Bottom gradient overlay */}
                        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-40"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}