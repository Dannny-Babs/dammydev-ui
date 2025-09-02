'use client';

import { useEffect, useState } from 'react';

interface TableOfContentsProps {
    className?: string;
}

interface TocItem {
    id: string;
    title: string;
    level: number;
}

export function TableOfContents({ className = '' }: TableOfContentsProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Extract headings from the page
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const items: TocItem[] = [];
        const usedIds = new Set<string>();

        headings.forEach((heading, index) => {
            let id = heading.id || heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';

            // Ensure unique IDs
            if (usedIds.has(id)) {
                id = `${id}-${index}`;
            }
            usedIds.add(id);

            if (id) {
                // Set the id if it doesn't exist or if it's a duplicate
                heading.id = id;

                items.push({
                    id,
                    title: heading.textContent || '',
                    level: parseInt(heading.tagName.charAt(1))
                });
            }
        });

        setTocItems(items);

        // Set up intersection observer for active section
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0% -35% 0%',
                threshold: 0
            }
        );

        headings.forEach((heading) => {
            if (heading.id) {
                observer.observe(heading);
            }
        });

        return () => {
            headings.forEach((heading) => {
                observer.unobserve(heading);
            });
        };
    }, [isClient]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'

            });
            // Close mobile menu after clicking
            setIsMobileMenuOpen(false);
        }
    };

    if (!isClient || tocItems.length === 0) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 ${className}`}
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent' }}>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
                        Table of Contents
                    </h3>
                    <nav className="space-y-1">
                        {tocItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`cursor-pointer px-2 py-1.5 text-sm rounded-md transition-all duration-200 ${activeId === item.id
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    } ${item.level === 1 ? 'pl-2' :
                                        item.level === 2 ? 'pl-4' :
                                            item.level === 3 ? 'pl-6' :
                                                item.level === 4 ? 'pl-8' :
                                                    'pl-10'
                                    }`}
                            >
                                {item.title}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Floating Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="relative p-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200"
                    aria-label="Toggle table of contents"
                >
                    <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                        <div className="h-[2px] w-4 bg-slate-600 rounded-full"></div>
                        <div className="h-[2px] w-4 bg-slate-600 rounded-full"></div>
                        <div className="h-[2px] w-4 bg-slate-600 rounded-full"></div>
                    </div>
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <div className="absolute top-12 left-0 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-lg z-50 max-h-[calc(100vh-6rem)] overflow-y-auto">
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
                                    Table of Contents
                                </h3>
                                <nav className="space-y-1">
                                    {tocItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`block w-full text-left px-2 py-1.5 text-sm rounded-md transition-all duration-200 ${activeId === item.id
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                } ${item.level === 1 ? 'pl-2' :
                                                    item.level === 2 ? 'pl-4' :
                                                        item.level === 3 ? 'pl-6' :
                                                            item.level === 4 ? 'pl-8' :
                                                                'pl-10'
                                                }`}
                                        >
                                            {item.title}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
