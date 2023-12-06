"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import css from "styled-jsx/css";

export const { chains, publicClient } = configureChains([mainnet, polygon, optimism, arbitrum], [publicProvider()]);

const config = createConfig({
    autoConnect: true,
    publicClient,
});

function ToastProvider() {
    const { theme } = useTheme();
    const [contextClass, setContextClass] = useState("");

    useEffect(() => {
        setContextClass(`bg-background text-${theme === "dark" ? "white" : "black"} drop-shadow-2xl`);
    }, [theme]);

    return (
        <>
            <style jsx global>
                {`
                    .Toastify__progress-bar {
                        background: ${theme === "dark" ? "#21C49A" : "#21C49A"};
                    }
                    .Toastify__progress-bar--error {
                        background: ${theme === "dark" ? "#e74c3c" : "#e74c3c"};
                    }
                `}
            </style>
            <ToastContainer
                toastClassName={(ctx) =>
                    `${contextClass} absolute flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer top-[50px] right-2 min-w-[300px]`
                }
                bodyClassName={() => `text-sm text-${theme === "dark" ? "white" : "black"} font-med block p-3`}
                closeButton={false}
            />
        </>
    );
}

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
    return (
        <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <WagmiConfig config={config}>
                    <ToastProvider />
                    <SessionProvider session={session}>{children}</SessionProvider>
                </WagmiConfig>
            </NextThemesProvider>
        </NextUIProvider>
    );
}
