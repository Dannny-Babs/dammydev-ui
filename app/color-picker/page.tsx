"use client"
import Button from "@/components/ui/button";
import { ChevronRightIcon, InfoIcon } from "lucide-react";
import AccessibleColorPicker from "@/components/a11y-menu";

export default function ColorPicker() {
    return (
        <div className="flex flex-col gap-12 items-center  font-sans justify-center bg-white min-h-screen">
            <h2 className="text-xl font-medium text-neutral-300 tracking-tight">Color Picker</h2>
            <div className="flex flex-row gap-4 items-center justify-center relative">
                <div className="flex flex-row gap-4 items-center justify-center px-4 py-2 rounded-full border-2 border-red-600 border-dashed ">
                    <h2 className="text-xl font-medium text-neutral-300 tracking-tight">Color Picker</h2>
                </div>
                <div className="flex  justify-center p-1 items-center rounded-full bg-red-600 absolute  right-[-12px] top-[-12px] ">
                    <InfoIcon className="w-6 h-6 text-white" />
                </div>
            </div>



            <Button variant="primary" >
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm font-medium text-white"   >Start Analysis</p>
                    <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                </div>
            </Button>
            <AccessibleColorPicker />

        </div>
    )
}