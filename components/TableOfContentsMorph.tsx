'use client';

import { useEffect, useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';

interface TableOfContentsProps {
    className?: string;
}

interface TocItem {
    id: string;
    title: string;
    level: number;
}

export default function TableOfContentsMorph({ className = '' }: TableOfContentsProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(80);

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
        }
    };

    if (!isClient || tocItems.length === 0) {
        return null;
    }



    return (
        <>
            <div className={`bg-slate-950 px-2 py-2  rounded-full  text-white dark-button  bottom-20 fixed z-50 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto`}>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center gap-2'>
                        {/* Circular Progress Indicator */}
                        <div className='w-6 h-6 bg-white rounded-full' />

                        {/* Active Section */}
                        <h3 className='text-sm font-medium w-40 truncate' >{tocItems.find(item => item.id === activeId)?.title}</h3>

                        {/* Toggle Button */}
                        <button className={` py-1 rounded-md`} onClick={() => setIsExpanded(!isExpanded)} aria-label='Toggle Table of Contents' >
                            <ChevronsUpDown size={16} className={`${isExpanded ? 'rotate-180' : ''} transition duration-200 text-gray-200`} />
                        </button>
                    </div>
                    {/* Percentage Progress */}
                    <div className='py-2 px-4 rounded-full bg-white/10'>
                    <h3 className='text-sm font-medium' >{progress}%</h3>
                    </div>
                </div>

            </div >

        </>
    );
}
