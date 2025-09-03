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
            animate={{
                opacity: 1,
                y: 0,
                width: isExpanded ? 330 : 320,
                height: isExpanded ? 330 : 64,
                borderRadius: isExpanded ? 24  : 130
            }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40,
                opacity: { duration: 0.3 }
            }}
        >
            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className={styles.expandedContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                        <h3 className={styles.tocTitle}>Table of Contents</h3>
                        <div className={styles.tocList}>
                            {tocItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className={`flex flex-col  align-left text-left space-y-2 gap-2`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        delay: index * 0.02,
                                        duration: 0.1,
                                        ease: "easeOut"
                                    }}
                                >
                                    <motion.button
                                        onClick={() => scrollToSection(item.id)}
                                        className={`flex flex-row  align-left text-left space-y-2 gap-2 ${activeId === item.id ? 'text-white' : 'text-neutral-400'} hover:text-white hover:cursor-pointer`}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.99 }}
                                        transition={{ duration: 0.1 }}
                                    >


                                        {/* Section Number */}
                                        <span className={`text-sm `}>{(index + 1).toString().padStart(2, '0')}.</span>
                                        <h3 className={`text-sm  `}>{item.title}</h3>

                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header - Always Visible */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {/* Circular Progress Indicator */}
                    <div className={styles.progressContainer}>
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
                                strokeDasharray="62.83"
                                animate={{
                                    strokeDashoffset: 62.83 - (progress / 100) * 62.83
                                }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            />
                        </svg>
                    </div>

                    {/* Active Section */}
                    <h3 className={styles.activeSection}>
                        {tocItems.find(item => item.id === activeId)?.title || 'Table of Contents'}
                    </h3>

                    {/* Toggle Button */}
                    <button
                        className={styles.toggleButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label='Toggle Table of Contents'
                    >
                        <motion.div
                            whileTap={{ scale: 0.85 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <ChevronsUpDown size={16} className={styles.toggleIcon} />
                        </motion.div>
                    </button>
                </div>

                {/* Percentage Progress */}
                <div className={styles.progressBadge}>
                    <span className={styles.progressText}>
                        {progress}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
