"use client";

import { Button, Textarea } from "@nextui-org/react";
import { useState } from "react";

function Chat({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-background shadow-md w-96 h-[70vh] rounded-2xl drop-shadow-xl flex flex-col justify-between">
            <div className="flex w-full bg-primary justify-between p-2 rounded-t-2xl items-center">
                <div className="font-semibold">Medlink.AI Chatbot</div>
                <Button isIconOnly className="rounded-full" size="sm" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </Button>
            </div>

            <div className="flex flex-col p-4">
                <div>{/* chat goes here */}</div>
                <div className="w-full flex flex-col gap-2">
                    <Textarea />
                    <div className="flex w-full justify-end">
                        <Button className="w-fit">Send</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-10 right-10 flex flex-col z-10">
            {isOpen ? (
                <Chat onClose={() => setIsOpen(false)} />
            ) : (
                <Button variant="shadow" isIconOnly color="primary" size="lg" className="rounded-full right-0" onClick={() => setIsOpen(!isOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                        <path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM224 160c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H288v48c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V272H176c-8.8 0-16-7.2-16-16V224c0-8.8 7.2-16 16-16h48V160z" />
                    </svg>
                </Button>
            )}
        </div>
    );
}
