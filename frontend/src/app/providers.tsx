"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { SessionProvider, getSession } from "next-auth/react";
import { publicProvider } from "wagmi/providers/public";
import { useEffect } from "react";

export const { chains, publicClient } = configureChains([mainnet, polygon, optimism, arbitrum], [publicProvider()]);

const config = createConfig({
    autoConnect: true,
    publicClient,
});

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
    useEffect(() => {
        console.log(JSON.stringify(session));
    }, [session]);
    return (
        <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <WagmiConfig config={config}>
                    <SessionProvider session={session}>{children}</SessionProvider>
                </WagmiConfig>
            </NextThemesProvider>
        </NextUIProvider>
    );
}
