"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Chat } from "./components/Chat";
import { Button, Divider } from "@nextui-org/react";
import { useAccount } from "wagmi";

export const ChainlinkFunctionContext = createContext<{ isConsumerDetected: boolean; setIsConsumerDetected: Dispatch<SetStateAction<boolean>> } | {}>(
    {}
);

export default function Home() {
    const [isDealExpanded, setIsDealExpanded] = useState(true);

    const [isConsumerDetected, setIsConsumerDetected] = useState(localStorage.getItem("consumer") ? true : false);

    const { isConnected } = useAccount();

    return (
        <main className="flex flex-col items-center w-full h-[calc(100vh-64px)] bg-background">
            <ChainlinkFunctionContext.Provider value={{ isConsumerDetected, setIsConsumerDetected }}>
                {!isConnected && (
                    <div>
                        <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-opacity-70 backdrop-blur-md z-50">
                            <div className="flex h-full justify-center items-center">Please sign in to enjoy Medlink.AI</div>
                        </div>
                    </div>
                )}
                {isConnected && !isConsumerDetected && (
                    <div>
                        <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-background bg-opacity-70 backdrop-blur-md z-50">
                            <div className="flex h-full justify-center items-center">
                                Please wait for consumer creation before enjoying Medlink.AI
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex w-full h-full p-2">
                    <div className={`${isDealExpanded ? "w-[80%]" : "w-full"} flex justify-items-center items-center transition-all`}>
                        <Chat />
                    </div>

                    <div className={`${isDealExpanded ? "w-[20%]" : "w-0 collapse"} flex transition-all`}>
                        <Divider orientation="vertical" className="mr-4" />
                        <div>Some information</div>
                    </div>
                </div>
            </ChainlinkFunctionContext.Provider>
        </main>
    );
}
