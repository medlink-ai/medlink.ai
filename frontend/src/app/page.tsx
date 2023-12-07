"use client";

import { Role } from "@/constants";
import { useState } from "react";
import { Chat } from "./components/Chat";
import { Button, Divider } from "@nextui-org/react";
import { useAccount } from "wagmi";

export default function Home() {
    const [isDealExpanded, setIsDealExpanded] = useState(true);

    const { isConnected } = useAccount();

    return (
        <main className="flex flex-col items-center w-full h-[calc(100vh-64px)] bg-background">
            {!isConnected && (
                <div>
                    <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-opacity-70 backdrop-blur-md z-50">
                        <div className="flex h-full justify-center items-center">Please sign in to enjoy Medlink.AI</div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-5 w-full h-full p-2">
                <div className={`${isDealExpanded ? "col-span-4" : "col-span-5"} flex justify-items-center items-center`}>
                    <Chat />
                </div>

                <div className={`${isDealExpanded ? "w-full col-span-1" : "w-0 col-span-0 collapse"} flex `}>
                    <Divider orientation="vertical" className="mr-4" />
                    <div>Some information</div>
                </div>
            </div>

            <Button isIconOnly className="absolute right-0 top-[50%]" size="sm" onClick={() => setIsDealExpanded(!isDealExpanded)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="10"
                    viewBox="0 0 320 512"
                    className={`${isDealExpanded && "rotate-180"} transition-all dark:fill-white`}
                >
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                </svg>
            </Button>
        </main>
    );
}
