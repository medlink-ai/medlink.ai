"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem, Input } from "@nextui-org/react";
import AutoComplete from "../components/AutoComplete";

export default function PriceIndexWrapper() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="flex w-full h-full items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center max-w-xl gap-6 mb-60">
                <h1 className="font-bold text-4xl">Discover Incredible Deals!</h1>
                <p>
                    Start your search today and receive personalized offers, designed to meet your needs, from our partnered pharmacy and other
                    healthcare providers.
                </p>
                <AutoComplete />
            </div>
        </div>
    );
}
