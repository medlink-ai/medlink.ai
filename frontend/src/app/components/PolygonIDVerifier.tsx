"use client";

import { useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useDisclosure, Spinner } from "@nextui-org/react";
import QRCode from "react-qr-code";
import Link from "next/link";

import { io } from "socket.io-client";
import { ProviderDetail } from "@/constants/types";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "./ThemeSwitch";
import { DarkIcon } from "../icons/Dark";
import { LightIcon } from "../icons/Light";

export default function PolygonIDVerifier({
    credentialType,
    onVerificationResult,
    verifier,
    max_range,
    min_range,
    patient_wallet_address,
    item,
    style,
}: {
    credentialType: string;
    onVerificationResult: Dispatch<SetStateAction<boolean>>;
    verifier: string;
    max_range: string;
    min_range: string;
    patient_wallet_address: string;
    item: ProviderDetail;
    style: string;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sessionId, setSessionId] = useState("");
    const [qrCodeData, setQrCodeData] = useState<{ body: any } | null>(null);
    const [isHandlingVerification, setIsHandlingVerification] = useState(false);
    const [verificationCheckComplete, setVerificationCheckComplete] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [socketEvents, setSocketEvents] = useState<{ fn: string; status: string }[]>([]);

    const { theme } = useTheme();
    const [modalTheme, setModalTheme] = useState<"light" | "dark">(theme as "light" | "dark");

    const serverUrl = window.location.href.startsWith("https") ? process.env.NEXT_PUBLIC_VERIFICATION_SERVER_PUBLIC_URL! : process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL!;

    const getQrCodeApi = (sessionId: string, verifier: string, max_range: string, min_range: string, patient_wallet_address: string) => `${serverUrl}/api/get-auth-qr?sessionId=${sessionId}&schema=${encodeURIComponent(process.env.NEXT_PUBLIC_POLYGON_ID_SCHEME as string)}&verifier=${encodeURIComponent(verifier)}&max_range=${max_range}&min_range=${min_range}&patient_wallet_address=${patient_wallet_address}`;

    const socket = useMemo(()=> io(serverUrl), [serverUrl]);

    useEffect(() => {
        socket.on("connect", () => {
        setSessionId(socket.id);
        socket.on(socket.id, (arg) => {
            setSocketEvents((socketEvents) => [...socketEvents, arg]);
        });
        });
    }, [socket]);

    useEffect(() => {
        const fetchQrCode = async () => {
            const response = await fetch(getQrCodeApi(sessionId, verifier, max_range, min_range, patient_wallet_address));
            const data = await response.text();
            return JSON.parse(data);
        };

        if (sessionId) {
            fetchQrCode().then(setQrCodeData).catch(console.error);
        }
    }, [sessionId]);

    // socket event side effects
    useEffect(() => {
        if (socketEvents.length) {
            const currentSocketEvent = socketEvents[socketEvents.length - 1];

            if (currentSocketEvent.fn === "handleVerification") {
                if (currentSocketEvent.status === "IN_PROGRESS") {
                    setIsHandlingVerification(true);
                } else {
                    setIsHandlingVerification(false);
                    setVerificationCheckComplete(true);
                    if (currentSocketEvent.status === "DONE") {
                        setVerificationMessage("✅ Drug prescription proof validated");
                        setTimeout(() => {
                            reportVerificationResult(true);
                        }, 2000);
                        socket.close();
                    } else {
                        setVerificationMessage("Error verifying prescription");
                    }
                }
            }
        }
    }, [socketEvents]);

    // callback, send verification result back to app
    const reportVerificationResult = (result: boolean) => {
        onVerificationResult(result);
    };

    return (
        <div className={`h-fit ${style}`}>
            <div className="p-6 border-1 border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:bg-opacity-70 hover:transition-background cursor-pointer flex flex-col justify-center items-center rounded-lg gap-2" onClick={onOpen}>
                <h1 className="text-lg font-bold bg-zinc-200 dark:bg-zinc-900 py-1 px-2 rounded-lg">{verifier}</h1>
                <h2 className="text-md font-semibold text-primary">{item.product_name}</h2>
                <h3 className="text-md">{item.indication}</h3>
            </div>

            {qrCodeData && (
                <Modal
                    className={`w-fit ${modalTheme === "light" ? "bg-white text-black" : "bg-default-50 text-white"}`}
                    isOpen={isOpen}
                    onClose={onClose}
                    size="xl"
                >
                    <ModalContent>
                        <ModalHeader className="flex justify-center text-md mt-8">
                            To verify your valid drug prescription, please use your Polygon ID Wallet App to scan this QR Code.
                        </ModalHeader>

                        <ModalBody className="flex justify-center text-sm">
                            {isHandlingVerification && (
                                <div>
                                    <p style={{ fontSize: "16px", fontFamily: "sans-serif" }}>Authenticating...</p>
                                    <Spinner className="my-2" size="lg" color="primary" />
                                </div>
                            )}
                            <div className="text-md flex justify-center">{verificationMessage}</div>

                            {qrCodeData && !isHandlingVerification && !verificationCheckComplete && (
                                <div className="flex flex-col justify-center items-center mb-1 gap-2">
                                    <QRCode value={JSON.stringify(qrCodeData)} />
                                    {theme === "dark" && (
                                        <div className="flex gap-2 justify-center items-center">
                                            <p>Change to light mode if unable to scan</p>
                                            <div
                                                onClick={() => setModalTheme(modalTheme === "dark" ? "light" : "dark")}
                                                className="hover:cursor-pointer"
                                            >
                                                {modalTheme === "dark" ? <LightIcon /> : <DarkIcon />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {qrCodeData.body?.scope[0].query && (
                                <div style={{ marginTop: "10px" }}>
                                    <p style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                                        <span style={{ fontWeight: "bold" }}>Type:</span> {qrCodeData.body?.scope[0].query.type}
                                    </p>
                                </div>
                            )}

                            {qrCodeData.body.message && (
                                <p style={{ fontSize: "16px", fontFamily: "sans-serif" }}>
                                    <span style={{ fontWeight: "bold" }}>Verifier:</span> {qrCodeData.body.message}
                                </p>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button>
                                <Link
                                    href="https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start"
                                    target="_blank"
                                    className="flex gap-2 justify-center items-center"
                                >
                                    <h1>Download the Polygon ID Wallet App</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="dark:fill-white">
                                        <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                                    </svg>
                                </Link>
                            </Button>

                            <Button>
                                <div className="flex gap-2 justify-center items-center">
                                    <h1>Get a {credentialType} VC</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="dark:fill-white">
                                        <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                                    </svg>
                                </div>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}
