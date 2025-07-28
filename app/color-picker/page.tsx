"use client"
import Button from "@/components/ui/button";
import { ChevronRightIcon, InfoIcon } from "lucide-react";
import A11yMenu from "@/components/a11y-menu";
import { useState, useEffect } from "react";

export default function ContrastChecker() {
    const [currentScene, setCurrentScene] = useState<'initial' | 'error'>('initial');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.classList.contains('inaccessible-element')) {
                e.preventDefault();
                e.stopPropagation();

                setSelectedElement(target);
                setIsMenuOpen(true);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const handleStartAnalysis = () => {
        setIsLoading(true);
        // Simulate loading/scanning
        setTimeout(() => {
            setCurrentScene('error');
            setIsLoading(false);
        }, 2000);
    };

    const handleErrorClick = () => {
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
        setSelectedElement(null);
    };

    const handleApplyFix = (newColor: string) => {
        // Apply the color fix to the DOM
        console.log('Applying color fix:', newColor);

        if (selectedElement) {
            selectedElement.style.color = newColor;
        }

        setIsMenuOpen(false);
        setSelectedElement(null);
        // Could move to next error or complete
    };

    const handleColorChange = (newHex: string) => {
        const el = document.getElementById("target");
        if (el) {
            el.style.color = newHex;
        }
    };

    useEffect(() => {
        const el = document.getElementById("target");
        if (el) el.style.color = "#1C9488";  // match your default
    }, []);

    if (currentScene === 'initial') {
        return (
            <div className="flex flex-col gap-12 items-center font-sans justify-center bg-white min-h-screen">
                <div className="flex flex-col gap-4 items-center">
                    <h2 className="text-xl font-medium text-neutral-300 tracking-tight">Accessibility Checker</h2>

                    <p className="text-sm text-neutral-500 text-center max-w-md">
                        Scan your page for accessibility issues and fix them with our color picker
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={handleStartAnalysis}
                    loading={isLoading}
                    className="font-medium"
                >
                    <div className="flex flex-row gap-3 items-center">
                        <span> Start Analysis</span>
                        <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                    </div>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 items-center font-sans justify-center bg-white min-h-screen">


            {/* Error Element - Clickable */}
            <div className="flex flex-row gap-4 items-center justify-center relative"
                onClick={handleErrorClick}
            >
                <div className="flex flex-row gap-4 items-center justify-center px-4 py-2 rounded-full border-2 border-red-600 border-dashed ">
                    <h2 className="text-xl font-medium text-neutral-300 tracking-tight" id="target">Low Contrast Text</h2>
                </div>
                <div className="flex  justify-center p-1 items-center rounded-full bg-red-600 absolute  right-[-12px] top-[-12px] ">
                    <InfoIcon className="w-6 h-6 text-white" />
                </div>
            </div>
            {isMenuOpen === false && (
                <div className="flex flex-col gap-4 items-center">
                    <h2 className="text-xl font-medium text-neutral-800 tracking-tight mt-4">Found Issues</h2>
                    <p className="text-sm text-neutral-600 text-center max-w-sm">
                        Click the error above to open the color picker and fix the contrast issue
                    </p>
                </div>
            )}


            {/* Color Picker Menu */}
            {isMenuOpen && (

                <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
                    <A11yMenu
                        initialColor="#E89623"
                        backgroundColor="#FFFFFF"
                        onColorChange={handleColorChange}
                        onClose={handleCloseMenu}
                        onApply={handleApplyFix}
                    />
                </div>

            )}
        </div>
    );
}