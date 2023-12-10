import { Role } from "@/constants";
import { ScrollShadow, Textarea, Button, Switch, Spinner, Tooltip } from "@nextui-org/react";
import dayjs from "dayjs";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useAccount } from "wagmi";
import PolygonIDMedVerifier from "./PolygonIDMedVerifier";
import { Message, getSavedMessages, saveMessage, clearLocalStorageKey } from "../utils/utils";
import Image from "next/image";
import axios from "axios";
import { DoctorVerification } from "@/constants/types";
import { isUndefined } from "lodash";

function VerifyDoctor({ setIsVerified }: { setIsVerified: Dispatch<SetStateAction<boolean>> }) {
    const [licenseNumber, setLicenseNumber] = useState<number | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            if (!licenseNumber) {
                // Make request to obtain licenseNumber
                try {
                    const requestParams = {
                        consumerAddress: "0xc78c81c16621eb4ae4244b8f79e5c059f775ecc2",
                        subscriptionId: "1148",
                        walletAddress: "0xbdA087c59180Ee0E6e660591e907F59DcC30f0EF",
                    };

                    await axios.post("http://localhost:8080/api/chainlink-functions/function-request-license", requestParams);
                    await new Promise((resolve) => setTimeout(resolve, 5000));

                    const data = {
                        consumerAddress: "0xc78c81c16621eb4ae4244b8f79e5c059f775ecc2",
                    };

                    const response = await axios.post(`http://localhost:8080/api/chainlink-functions/function-response-license`, data);
                    setLicenseNumber(response.data);
                    console.log("response.data", response.data);
                } catch (error) {
                    console.error("Error fetching or processing data:", error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col h-full w-full justify-center items-center p-8 gap-6">
            <h1 className="font-bold font-sans text-xl w-[50%] text-center">
                To verify your credential as a licensed medical practitioner, please use your Polygon ID Wallet app to scan this QR code.
            </h1>
            <div className="h-[50%] my-6">
                {!licenseNumber ? (
                    <div className="flex flex-col gap-4 justify-center items-center h-full">
                        <h1 className="font-semibold text-lg">Loading License Verifier...</h1>
                        <Spinner />
                    </div>
                ) : (
                    <PolygonIDMedVerifier
                        onVerificationResult={setIsVerified}
                        walletAddress={"0xbdA087c59180Ee0E6e660591e907F59DcC30f0EF"}
                        licenseNumber={licenseNumber as number}
                    />
                )}
            </div>
            <h3 className="text-center w-[50%] text-base">
                Please note: This procedure will utilize decentralized oracle networks to authenticate the validity of a medical professional’s
                license in a specific country.
            </h3>
        </div>
    );
}

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
    // const [patientContext, setPatientContext] = useState("");
    // const [doctorContext, setDoctorContext] = useState("");
    const [answer, setAnswer] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const workerRef = useRef<Worker | null>(null);

    const [mode, setMode] = useState<Role>(Role.PATIENT);

    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && mode === Role.DOCTOR) {
            const doctorVerification: DoctorVerification | undefined = localStorage.getItem("doctorVerification")
                ? JSON.parse(localStorage.getItem("doctorVerification") as string)
                : undefined;

            setIsVerified(!isUndefined(doctorVerification) && doctorVerification!.isVerified);
        }
    }, [mode]);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    // useEffect(() => {
    //     // Load only patient's messages from local storage
    //     const savedMessages = getSavedMessages().filter((msg) => msg.sender === Role.PATIENT || msg.sender === Role.BOT);
    //     setMessages(savedMessages);
    //     setPatientContext(savedMessages.map((msg) => msg.text).join(" "));

    //     if (!workerRef.current) {
    //         workerRef.current = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

    //         workerRef.current.onmessage = (e) => {
    //             if (e.data.error) {
    //                 setError(e.data.error);
    //                 setIsLoading(false);
    //             } else {
    //                 setAnswer(e.data.answer);
    //                 const newMessage: Message = { sender: Role.BOT, text: e.data.answer, timestamp: dayjs() };
    //                 if (mode === Role.PATIENT) {
    //                     saveMessage(newMessage); // Save bot's response only in Patient mode
    //                 }
    //                 setMessages((prevMessages) => [...prevMessages, newMessage]);
    //                 setIsLoading(false);
    //             }
    //         };
    //     }

    //     return () => {
    //         if (workerRef.current) {
    //             workerRef.current.terminate();
    //             workerRef.current = null;
    //         }
    //     };
    // }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        inputRef.current?.blur();
        if (question) {
            setIsLoading(true);
            setError(null);
            const newMessage: Message = { sender: mode, text: question, timestamp: dayjs() };
            setQuestion("");

            // if (mode === Role.PATIENT) {
            //     saveMessage(newMessage); // Save patient's message only in Patient mode
            // }
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // if (mode === Role.PATIENT) {
            //     const updatedPatientContext = patientContext + " " + question;
            //     setPatientContext(updatedPatientContext);
            //     workerRef.current?.postMessage({ question, context: updatedPatientContext, mode });
            // } else {
            //     const updatedDoctorContext = patientContext + " " + question;
            //     setDoctorContext(updatedDoctorContext);
            //     workerRef.current?.postMessage({ question, context: updatedDoctorContext, mode });
            // }

            await axios
                .post("/chat/api", {
                    prompt: question,
                })
                .then((res) => {
                    // setMessages((prevMessages) => [...prevMessages, { sender: Role.BOT, text: res.data, timestamp: dayjs() }]);
                    console.log("res.data", res.data);
                });
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
        <div className="flex flex-col justify-between w-full h-[calc(100vh-64px)]">
            {(isVerified && mode === Role.DOCTOR) || mode === Role.PATIENT ? (
                <ScrollShadow className={`2xl:h-[82vh] h-[74vh] px-4 overflow-y-auto`}>
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
            ) : (
                <VerifyDoctor setIsVerified={setIsVerified} />
            )}

            <div className="w-full flex flex-col gap-2 px-4 py-2">
                {((isVerified && mode === Role.DOCTOR) || mode === Role.PATIENT) && (
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
                )}

                <div className="flex w-full justify-between gap-4">
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
                        <div className="flex gap-1 justify-center items-center">
                            {mode}
                            {mode === Role.DOCTOR && (
                                <Tooltip
                                    showArrow
                                    content={
                                        isVerified ? (
                                            <div className="flex flex-col gap-1 justify-center items-center p-1">
                                                Verified doctor{" "}
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        clearLocalStorageKey("doctorVerification");
                                                        setIsVerified(false);
                                                    }}
                                                >
                                                    Clear verification
                                                </Button>
                                            </div>
                                        ) : (
                                            "Unverified doctor"
                                        )
                                    }
                                >
                                    {isVerified ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="fill-success">
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="fill-warning">
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                                        </svg>
                                    )}
                                </Tooltip>
                            )}
                        </div>
                    </Switch>

                    {((isVerified && mode === Role.DOCTOR) || mode === Role.PATIENT) && (
                        <div className="flex justify-center items-center gap-2">
                            <Button onClick={handleClear} className="w-fit" disabled={isLoading}>
                                Clear
                            </Button>

                            <Button onClick={handleSubmit} className="w-fit bg-primary text-white" disabled={isLoading}>
                                Send
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
