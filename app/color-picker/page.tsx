"use client"
import Button from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

export default function ColorPicker() {
    return (
        <div className="flex flex-col gap-12 items-center  font-sans justify-center bg-white min-h-screen">
            <h2 className="text-xl font-medium text-neutral-300 tracking-tight">Color Picker</h2>
            <Button variant="primary"> 
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm font-medium text-white">Start Loading</p>
                    <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                </div>
            </Button>
        </div>
    )
}