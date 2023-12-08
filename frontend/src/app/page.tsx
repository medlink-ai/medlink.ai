"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Chat } from "./components/Chat";
import { Button, Divider } from "@nextui-org/react";
import { useAccount } from "wagmi";
import { ChainlinkFunctionContext } from "./providers";
import { isUndefined } from "lodash";

export default function Home() {
    const [isDealExpanded, setIsDealExpanded] = useState(true);
    const { isConnected } = useAccount();

    const { consumer } = useContext(ChainlinkFunctionContext);

    return (
        <main className="flex flex-col items-center w-full h-[calc(100vh-64px)] bg-background">
            {!isConnected && (
                <div>
                    <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-opacity-70 backdrop-blur-md z-50">
                        <div className="flex h-full justify-center items-center">Please sign in to enjoy Medlink.AI</div>
                    </div>
                </div>
            )}
            {isConnected && isUndefined(consumer) && (
                <div>
                    <div className="absolute top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-background bg-opacity-70 backdrop-blur-md z-50">
                        <div className="flex h-full justify-center items-center">Please wait for consumer creation before enjoying Medlink.AI</div>
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
