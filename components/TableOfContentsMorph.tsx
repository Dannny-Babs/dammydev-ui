'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown } from 'lucide-react';
import styles from './TableOfContentsMorph.module.css';

interface TableOfContentsProps {
    className?: string;
}

interface TocItem {
    id: string;
    title: string;
    level: number;
}

export default function TableOfContentsMorph({ }: TableOfContentsProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [progress, setProgress] = useState(0);

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
                        // Calculate progress based on current section
                        const currentIndex = items.findIndex(item => item.id === entry.target.id);
                        if (currentIndex !== -1) {
                            const newProgress = Math.round(((currentIndex + 1) / items.length) * 100);
                            setProgress(newProgress);
                        }
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
        <motion.div
            className={`${styles.container} ${isExpanded ? styles.expanded : styles.collapsed}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className={styles.expandedContent}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className={styles.tocList}>
                            {tocItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className={`flex flex-col  align-left text-left space-y-2 gap-2`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.025,
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }}
                                    whileHover={{ x: 4 }}
                                >
                                    <motion.button
                                        onClick={() => scrollToSection(item.id)}
                                        className={`flex flex-row  align-left text-left space-y-2 gap-2 text-neutral-300 hover:text-white hover:cursor-pointer`}

                                        transition={{
                                            delay: index * 0.025,
                                            duration: 0.15,
                                            ease: "easeInOut"
                                        }}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                    >


                                        {/* Section Number */}
                                        <span className={`text-sm `}>{(index + 1).toString().padStart(2, '0')}.</span>
                                        <h3 className={`text-sm `}>{item.title}</h3>

                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header - Always Visible */}
            <motion.div
                className={styles.header}
                layout
            >
                <div className={styles.headerLeft}>
                    {/* Circular Progress Indicator */}
                    <motion.div
                        className={styles.progressContainer}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <svg className={styles.progressSvg} viewBox="0 0 24 24">
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                className={styles.progressBackground}
                            />
                            <motion.circle
                                cx="12"
                                cy="12"
                                r="10"
                                className={styles.progressBar}
                                initial={{ strokeDasharray: "0 62.83" }}
                                animate={{ strokeDasharray: `${(progress / 100) * 62.83} 62.83` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </svg>
                    </motion.div>

                    {/* Active Section */}
                    <motion.h3
                        className={styles.activeSection}
                        key={activeId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tocItems.find(item => item.id === activeId)?.title || 'Table of Contents'}
                    </motion.h3>

                    {/* Toggle Button */}
                    <motion.button
                        className={styles.toggleButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label='Toggle Table of Contents'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <ChevronsUpDown size={16} className={styles.toggleIcon} />
                        </motion.div>
                    </motion.button>
                </div>

                {/* Percentage Progress */}
                <motion.div
                    className={styles.progressBadge}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <motion.span
                        key={progress}
                        initial={{ scale: 1.2, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={styles.progressText}
                    >
                        {progress}%
                    </motion.span>
                </motion.div>
            </motion.div>


        </motion.div>
    );
}
