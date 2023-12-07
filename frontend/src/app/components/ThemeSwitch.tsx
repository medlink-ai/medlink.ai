"use client";

import { DarkIcon } from "@/app/icons/Dark";
import { LightIcon } from "@/app/icons/Light";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="hover:cursor-pointer">
            {theme === "dark" ? <DarkIcon /> : <LightIcon />}
        </div>
    );
}
