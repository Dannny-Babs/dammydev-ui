"use client"

import Button from "./ui/button"
import ColorPicker from "./ColorPicker"
import { CheckIcon, XIcon } from "lucide-react"

import { useEffect, useState } from "react"
import clsx from "clsx"
import { getContrastColor, getContrastRatio, rgbToHex, hexToRgbValues } from "@/lib/color-utils"
import { getAccessibilityLevel, getContrastStatus, getAccessibilityBadge } from "@/lib/accessibility-utils"

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





export default function AccessibleColorPicker() {


    const [selectedColor, setSelectedColor] = useState("#E89623");
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
    const [contrastRatio, setContrastRatio] = useState(4.51);
    const [rgbValues, setRgbValues] = useState({ r: 232, g: 150, b: 35 });
    const [suggestions, setSuggestions] = useState([
        "#E89623",
        "#E89623",
        "#828181",
        "#555968",
        "#2C2C2C",
        "#3C3C434A",

    ]);

    useEffect(() => {
        const updateContrastRatio = async () => {
            try {
                const result = await getContrastRatio(selectedColor, backgroundColor);
                setContrastRatio(result.contrastRatio);
            } catch (error) {
                console.error('Failed to calculate contrast ratio:', error);
            }
        };

        updateContrastRatio();
    }, [selectedColor, backgroundColor]);

    // Update RGB values when hex color changes
    useEffect(() => {
        setRgbValues(hexToRgbValues(selectedColor));
    }, [selectedColor]);



    return (

        <div className="flex flex-row gap-4 items-start justify-center   rounded-2xl p-2 border-1 border-gray-300 shadow-md ">
            <div className="flex flex-col gap-2 items-center justify-between   w-[300px] ">
                <ColorPicker default_value={selectedColor} onChange={setSelectedColor} />

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
                        style={{ backgroundColor: backgroundColor }}
                    >
                        <div className={`self-stretch px-2 py-1.5 inline-flex justify-start items-center gap-2.5 ${getContrastColor(backgroundColor) === 'white' ? 'bg-black/20' : 'bg-white/20'}`}>
                            <div className={`justify-start text-sm uppercase font-sans ${getContrastColor(backgroundColor)}`}>{backgroundColor}</div>
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
                    <p className="text-sm font-medium font-sans text-neutral-800">
                        {getAccessibilityLevel(contrastRatio).description}
                    </p>
                </div>

                <div className="flex flex-col gap-2 items-start justify-center w-full">
                    <h3 className="text-sm font-medium font-sans text-neutral-800">
                        Suggestions
                    </h3>
                    <div className="flex flex-wrap gap-2 items-start justify-start w-full bg-gray-50 rounded-xl p-2 border-1 border-slate-200 ">
                        {
                            suggestions.map((suggestion) => (
                                <button
                                    className="h-10 w-10 rounded-lg border border-gray-400/40 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 hover:scale-105 transition-transform"
                                    style={{ backgroundColor: suggestion }}
                                    key={suggestion}
                                    onClick={() => {
                                        setSelectedColor(suggestion);
                                    }}
                                    title={`Select color ${suggestion}`}
                                    aria-label={`Select color ${suggestion}`}
                                >

                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-row gap-2 items-end justify-end w-full">
                    <Button className="bg-gray-50 text-gray-800 hover:bg-gray-100 flex flex-row gap-2 items-center justify-center" variant="secondary" onClick={() => {
                        setSelectedColor("#E89623");
                    }}>
                        Cancel
                    </Button>
                    <Button className="bg-green-700 text-white hover:bg-green-800 shadow-sm flex flex-row gap-2 items-center justify-center" onClick={() => {
                        console.log(selectedColor);
                    }}>
                        Save
                    </Button>
                </div>

            </div>

        </div>
    )
}
