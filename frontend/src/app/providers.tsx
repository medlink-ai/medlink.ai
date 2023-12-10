"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";
import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { Consumer } from "@/constants/types";

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
                bodyClassName={() => `text-sm text-${theme === "dark" ? "white" : "black"} font-med block p-3 flex`}
                closeButton={false}
            />
        </>
    );
}

export const ChainlinkFunctionContext = createContext<{
    consumer: Consumer | undefined;
    setConsumer: Dispatch<SetStateAction<Consumer | undefined>>;
}>({
    consumer: undefined,
    setConsumer: () => {},
});

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
    const [consumer, setConsumer] = useState(
        typeof window !== "undefined" && localStorage.getItem("consumer") ? JSON.parse(localStorage.getItem("consumer")!) : undefined
    );

    return (
        <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <WagmiConfig config={config}>
                    <ToastProvider />
                    <SessionProvider session={session}>
                        <ChainlinkFunctionContext.Provider value={{ consumer, setConsumer }}>{children}</ChainlinkFunctionContext.Provider>
                    </SessionProvider>
                </WagmiConfig>
            </NextThemesProvider>
        </NextUIProvider>
    );
}
