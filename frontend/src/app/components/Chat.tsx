import { Role } from "@/constants";
import { ScrollShadow, Textarea, Button, Switch } from "@nextui-org/react";
import dayjs from "dayjs";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useAccount } from "wagmi";
import { Message, getSavedMessages, saveMessage, clearLocalStorageKey } from "../utils/utils";
import Image from "next/image";

function ChatBubble({ msg, status }: { msg: Message; status?: "loading" | "error" }) {
    const { address } = useAccount();

    return (
        <div className={`message chat ${msg.sender === Role.BOT ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
                {msg.sender === Role.BOT ? (
                    <Image src="/medlink.ai.png" width="40" height="40" alt="Medlink.AI" className="rounded-full ring ring-green-1100" />
                ) : (
                    <div className="w-10 rounded-full ring ring-green-1000 ring-offset-green-1100 ring-offset-2">
                        <MetaMaskAvatar address={address!} size={40} />
                    </div>
                )}
            </div>
            <div className="chat-header flex gap-2 items-center">
                <div>{msg.sender}</div>
                {msg.timestamp && <time className="text-xs opacity-50">{dayjs(msg.timestamp).format("YYYY-MM-DD HH:mm:ss")}</time>}
            </div>

            <div
                className={`chat-bubble chat-bubble-${msg.sender === Role.BOT ? "accent" : "success"} ${
                    status && (status === "loading" ? "chat-bubble-warning" : "chat-bubble-error")
                }`}
            >
                {msg.text}
            </div>
        </div>
    );
}

export function Chat() {
    const [question, setQuestion] = useState("");
    const [patientContext, setPatientContext] = useState("");
    const [doctorContext, setDoctorContext] = useState("");
    const [answer, setAnswer] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const workerRef = useRef<Worker | null>(null);

    const [mode, setMode] = useState<Role>(Role.PATIENT);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Load only patient's messages from local storage
        const savedMessages = getSavedMessages().filter((msg) => msg.sender === Role.PATIENT || msg.sender === Role.BOT);
        setMessages(savedMessages);
        setPatientContext(savedMessages.map((msg) => msg.text).join(" "));

        if (!workerRef.current) {
            workerRef.current = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

            workerRef.current.onmessage = (e) => {
                if (e.data.error) {
                    setError(e.data.error);
                    setIsLoading(false);
                } else {
                    setAnswer(e.data.answer);
                    const newMessage: Message = { sender: Role.BOT, text: e.data.answer, timestamp: dayjs() };
                    if (mode === Role.PATIENT) {
                        saveMessage(newMessage); // Save bot's response only in Patient mode
                    }
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                    setIsLoading(false);
                }
            };
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inputRef.current?.blur();
        if (question) {
            setIsLoading(true);
            setError(null);
            const newMessage: Message = { sender: mode, text: question, timestamp: dayjs() };
            if (mode === Role.PATIENT) {
                saveMessage(newMessage); // Save patient's message only in Patient mode
            }
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            if (mode === Role.PATIENT) {
                const updatedPatientContext = patientContext + " " + question;
                setPatientContext(updatedPatientContext);
                workerRef.current?.postMessage({ question, context: updatedPatientContext, mode });
            } else {
                const updatedDoctorContext = patientContext + " " + question;
                setDoctorContext(updatedDoctorContext);
                workerRef.current?.postMessage({ question, context: updatedDoctorContext, mode });
            }

            setQuestion("");
        }
    };

    const handleModeChange = () => {
        setMode(mode === Role.PATIENT ? Role.DOCTOR : Role.PATIENT);
    };

    const handleClear = () => {
        setMessages([]);
        clearLocalStorageKey("chat_messages");
    };

    return (
        <div className="flex flex-col justify-between w-full">
            <ScrollShadow className={`2xl:h-[82vh] h-[74vh] px-4  overflow-y-auto`}>
                {messages.map((msg, index) => (
                    <ChatBubble key={index} msg={msg} />
                ))}
                {(isLoading || error) && (
                    <ChatBubble
                        msg={{
                            sender: Role.BOT,
                            text: isLoading ? "Thinking..." : error!,
                            timestamp: dayjs(),
                        }}
                        status={isLoading ? "loading" : "error"}
                    />
                )}
            </ScrollShadow>

            <div className="w-full flex flex-col gap-2 px-4">
                <Textarea
                    disabled={isLoading}
                    ref={inputRef}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />

                <div className="flex w-full justify-end gap-4">
                    <Switch
                        defaultSelected
                        size="lg"
                        onChange={handleModeChange}
                        thumbIcon={({ isSelected, className }) =>
                            isSelected ? (
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 640 512" className="fill-primary">
                                    <path d="M0 224.2C0 100.6 100.2 0 224 0h24c95.2 0 181.2 69.3 197.3 160.2c2.3 13 6.8 25.7 15.1 36l42 52.6c6.2 7.8 9.6 17.4 9.6 27.4c0 24.2-19.6 43.8-43.8 43.8H448v0 32L339.2 365.6c-11 1.4-19.2 10.7-19.2 21.8c0 11.6 9 21.2 20.6 21.9L448 416v16c0 26.5-21.5 48-48 48H320v8c0 13.3-10.7 24-24 24H256v0H96c-17.7 0-32-14.3-32-32V407.3c0-16.7-6.9-32.5-17.1-45.8C16.6 322.4 0 274.1 0 224.2zm352-.2a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM464 384a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm152-24a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM592 480a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM552 312a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm40-24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM552 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512" className="fill-primary">
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16H336c-8.8 0-16-7.2-16-16s7.2-16 16-16V424c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16H256c-8.8 0-16-7.2-16-16V424c0-29.8 20.4-54.9 48-62V304.9c-6-.6-12.1-.9-18.3-.9H178.3c-6.2 0-12.3 .3-18.3 .9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7V311.2zM144 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                                </svg>
                            )
                        }
                    >
                        {mode}
                    </Switch>

                    <Button onClick={handleClear} className="w-fit" disabled={isLoading}>
                        Clear
                    </Button>

                    <Button onClick={handleSubmit} className="w-fit bg-primary" disabled={isLoading}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}
