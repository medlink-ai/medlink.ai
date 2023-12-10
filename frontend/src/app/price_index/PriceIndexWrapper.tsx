"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem, Input } from "@nextui-org/react";
import AutoComplete from "../components/AutoComplete";

export default function PriceIndexWrapper() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="flex w-full h-full items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center max-w-xl gap-6 mb-20">
                <h1 className="font-bold text-center text-5xl mb-2">Budget-Friendly Deals on Essential Medications!</h1>
                <p className="text-center text-base mb-5">
                    Get personalized offers today from our trusted partners in pharmacy and healthcare. Best deals for quality and safe medications
                    based on your budget.
                </p>
                <AutoComplete />
            </div>
        </div>
    );
}
