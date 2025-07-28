"use client"

import Button from "./ui/button"
import ColorPicker from "./ColorPicker"
import { CheckIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getContrastColor, getContrastRatio, rgbToHex, hexToRgbValues, getColorSuggestions } from "@/lib/color-utils"
import { getAccessibilityLevel, getContrastStatus, getAccessibilityBadge } from "@/lib/accessibility-utils"

interface A11yMenuProps {
    initialColor?: string;
    backgroundColor?: string;
    onColorChange?: (color: string) => void;
    onClose?: () => void;
    onApply?: (color: string) => void;
}

const HashtagIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M11.097 1.515a.75.75 0 0 1 .589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 1 1 1.47.294L16.665 7.5h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.2 6h3.585a.75.75 0 0 1 0 1.5h-3.885l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 1 1-1.47-.294l1.02-5.103H3.75a.75.75 0 0 1 0-1.5h3.885l1.2-6H5.25a.75.75 0 0 1 0-1.5h3.885l1.08-5.397a.75.75 0 0 1 .882-.588ZM10.365 9l-1.2 6h4.47l1.2-6h-4.47Z"
                clipRule="evenodd"
            />
        </svg>
    );
};





export default function A11yMenu({
    initialColor = "#E89623",
    backgroundColor = "#FFFFFF",
    onColorChange,
    onClose,
    onApply
}: A11yMenuProps) {


    const [selectedColor, setSelectedColor] = useState(initialColor);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [background, setBackground] = useState(backgroundColor);
    const [contrastRatio, setContrastRatio] = useState(4.51);
    const [rgbValues, setRgbValues] = useState({ r: 232, g: 150, b: 35 });
    const [suggestions, setSuggestions] = useState<Array<{
        hex: string;
        contrastRatio: number;
        level: string;
        label: string;
    }>>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    useEffect(() => {
        const updateContrastRatio = async () => {
            try {
                const result = await getContrastRatio(selectedColor, background);
                setContrastRatio(result.contrastRatio);
            } catch (error) {
                console.error('Failed to calculate contrast ratio:', error);
            }
        };

        updateContrastRatio();
    }, [selectedColor, background]);

    // Update RGB values when hex color changes
    useEffect(() => {
        setRgbValues(hexToRgbValues(selectedColor));
    }, [selectedColor]);

    // Fetch color suggestions when colors change
    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoadingSuggestions(true);
            try {
                console.log('Fetching suggestions for:', selectedColor, 'on', background);
                const result = await getColorSuggestions(selectedColor, background);
                console.log('Received suggestions:', result.suggestions);
                setSuggestions(result.suggestions);
            } catch (error) {
                console.error('Failed to fetch color suggestions:', error);
                // Fallback to empty suggestions on error
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [selectedColor, background]);



    return (

        <div className="flex flex-row gap-4 items-start justify-center   rounded-2xl p-2 border-1 border-gray-300 shadow-md ">
            <div className="flex flex-col gap-2 items-center justify-between   w-[300px] ">
                <ColorPicker
                    value={selectedColor} // Changed from default_value to value
                    onChange={setSelectedColor}
                    backgroundHex={background}
                />

                <div className="flex flex-row gap-2 items-center justify-center w-full mt-4">
                    <div className="flex flex-col gap-1 items-start justify-center w-1/3">
                        <h3 className="text-sm font-medium font-sans text-neutral-800">
                            Hex
                        </h3>
                        <div className="flex flex-row gap-2 items-center justify-start text-sm uppercase font-sans text-neutral-800 bg-gray-50 rounded-lg px-2 py-2 border-1 border-gray-200 h-12 ">
                            <HashtagIcon className="size-4 text-zinc-600/40" />
                            <input type="text" value={selectedColor.replace('#', '')} onChange={(e) => setSelectedColor('#' + e.target.value)} className="w-full bg-transparent outline-none text-center" />
                        </div>
                    </div>
                    <div className="flex flex-row w-2/3 gap-2 items-start justify-center">
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <h3 className="text-sm font-medium font-sans text-neutral-800">
                                R
                            </h3>
                            <div className="flex items-center text-center justify-center text-sm font-sans text-neutral-800 bg-gray-50 rounded-lg px-2 py-2 border-1 border-gray-200 h-12 w-full">
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgbValues.r}
                                    onChange={(e) => {
                                        const r = parseInt(e.target.value) || 0;
                                        setRgbValues(prev => ({ ...prev, r }));
                                        setSelectedColor(rgbToHex(r, rgbValues.g, rgbValues.b));
                                    }}
                                    className="w-full bg-transparent outline-none text-center items-center justify-center"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <h3 className="text-sm font-medium font-sans text-neutral-800">
                                G
                            </h3>
                            <div className="flex items-center text-center justify-center text-sm font-sans text-neutral-800 bg-gray-50 rounded-lg px-2 py-2 border-1 border-gray-200 h-12 w-full">
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgbValues.g}
                                    onChange={(e) => {
                                        const g = parseInt(e.target.value) || 0;
                                        setRgbValues(prev => ({ ...prev, g }));
                                        setSelectedColor(rgbToHex(rgbValues.r, g, rgbValues.b));
                                    }}
                                    className="w-full bg-transparent outline-none text-center items-center justify-center"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                            <h3 className="text-sm font-medium font-sans text-neutral-800">
                                B
                            </h3>
                            <div className="flex items-center text-center justify-center text-sm font-sans text-neutral-800 bg-gray-50 rounded-lg px-2 py-2 border-1 border-gray-200 h-12 w-full">
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgbValues.b}
                                    onChange={(e) => {
                                        const b = parseInt(e.target.value) || 0;
                                        setRgbValues(prev => ({ ...prev, b }));
                                        setSelectedColor(rgbToHex(rgbValues.r, rgbValues.g, b));
                                    }}
                                    className="w-full bg-transparent outline-none text-center items-center justify-center   "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center  w-[300px]">
                <div className="flex flex-row gap-2 items-center justify-center w-full">
                    <div
                        className="self-stretch h-20 rounded-lg w-full outline-1 outline-offset-[-1px] outline-stone-900/10 inline-flex flex-col justify-end items-start gap-2.5 overflow-hidden"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <div className={`self-stretch px-2 py-1.5 inline-flex justify-start items-center gap-2.5 ${getContrastColor(selectedColor) === 'white' ? 'bg-black/20' : 'bg-white/20'}`}>
                            <div className={`justify-start text-sm uppercase font-sans ${getContrastColor(selectedColor)}`}>{selectedColor}</div>
                        </div>
                    </div>
                    <div className="self-stretch w-full h-20 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-stone-900/10 inline-flex flex-col justify-end items-start gap-2.5 overflow-hidden"
                        style={{ backgroundColor: background }}
                    >
                        <div className={`self-stretch px-2 py-1.5 inline-flex justify-start items-center gap-2.5 ${getContrastColor(background) === 'white' ? 'bg-black/20' : 'bg-white/20'}`}>
                            <div className={`justify-start text-sm uppercase font-sans ${getContrastColor(background)}`}>{background}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <h3 className="text-sm font-medium font-sans text-neutral-800">
                        Contrast Ratio
                    </h3>
                    <div className="flex flex-row gap-2 items-center justify-start w-full bg-gray-50 rounded-lg pl-4 pr-2 py-2 border-1 border-gray-200">
                        <h2 className="text-2xl font-semibold font-sans text-neutral-800">
                            {contrastRatio.toFixed(2)}:1
                        </h2>
                        {getContrastStatus(contrastRatio).passes ? (
                            <CheckIcon className="w-6 h-6 text-green-600" />
                        ) : (
                            <XIcon className="w-6 h-6 text-red-600" />
                        )}

                        <div className="flex flex-col gap-2 items-end justify-end w-full ">
                            {(() => {
                                const badge = getAccessibilityBadge(contrastRatio);
                                return (
                                    <>
                                        <div className={`px-3 py-1 rounded-md text-sm font-semibold ${badge.bgColor} ${badge.color}`}>
                                            {badge.text}
                                        </div>

                                    </>
                                );
                            })()}
                        </div>

                    </div>
                    <p className="text-sm font-medium font-sans text-gray-500">
                        {getAccessibilityLevel(contrastRatio).description}
                    </p>
                </div>

                <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium font-sans text-neutral-800">
                            Suggestions
                        </h3>

                    </div>
                    <div className="flex flex-wrap gap-2 items-start justify-start w-full bg-gray-50 rounded-xl p-2 border-1 border-slate-200 min-h-[60px]">
                        {loadingSuggestions ? (
                            <div className="flex items-center justify-center w-full py-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                                <button
                                    className="h-10 w-10 rounded-lg border border-gray-400/40 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 hover:scale-105 transition-transform relative group"
                                    style={{ backgroundColor: suggestion.hex }}
                                    key={`${suggestion.hex}-${selectedColor}-${index}`}
                                    onClick={() => {
                                        setSelectedColor(suggestion.hex);
                                    }}
                                    title={`${suggestion.label} - ${suggestion.hex}`}
                                    aria-label={`Select color ${suggestion.hex} with contrast ratio ${suggestion.contrastRatio}`}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {suggestion.level}
                                        </span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="flex items-center justify-center w-full py-2 text-gray-500 text-sm">
                                No suggestions available
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-row gap-2 items-end justify-end w-full">
                    <Button className="bg-gray-50 text-gray-800 hover:bg-gray-100 flex flex-row gap-2 items-center justify-center h-11" variant="secondary" onClick={() => {
                        setSelectedColor(initialColor);
                        onClose?.();
                    }}>
                        Cancel
                    </Button>
                    <Button className=" text-white  shadow-sm flex flex-row gap-2 items-center justify-center h-11 px-6" onClick={() => {
                        onApply?.(selectedColor);
                    }}>
                        Apply Fix
                    </Button>
                </div>

            </div>

        </div>
    )
}
