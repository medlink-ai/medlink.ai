"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useDisclosure, Spinner } from "@nextui-org/react";
import QRCode from "react-qr-code";
import Link from "next/link";

import { io } from "socket.io-client";

export default function PolygonIDVerifier({
    providerInformation,
    credentialType,
    issuerOrHowToLink,
    onVerificationResult,
    style,
}: {
    providerInformation: {
        drugName: string;
        storeName: string;
        description: string;
    };
    credentialType: string;
    issuerOrHowToLink: string;
    onVerificationResult: Dispatch<SetStateAction<boolean>>;
    style: string;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sessionId, setSessionId] = useState("");
    const [qrCodeData, setQrCodeData] = useState<{ body: any } | null>(null);
    const [isHandlingVerification, setIsHandlingVerification] = useState(false);
    const [verificationCheckComplete, setVerificationCheckComplete] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [socketEvents, setSocketEvents] = useState<{ fn: string; status: string }[]>([]);

    const serverUrl = window.location.href.startsWith("https")
        ? process.env.NEXT_PUBLIC_VERIFICATION_SERVER_PUBLIC_URL!
        : process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL!;

    const getQrCodeApi = (sessionId: string) => serverUrl + `/api/get-auth-qr?sessionId=${sessionId}`;

    const socket = io(serverUrl);

    useEffect(() => {
        socket.on("connect", () => {
            setSessionId(socket.id);
            // only watch this session's events
            socket.on(socket.id, (arg) => {
                setSocketEvents((socketEvents) => [...socketEvents, arg]);
            });
        });
    }, []);

    useEffect(() => {
        const fetchQrCode = async () => {
            const response = await fetch(getQrCodeApi(sessionId));
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
            <div
                className="p-6 border-1 border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:bg-opacity-70 hover:transition-background cursor-pointer flex flex-col justify-center items-center rounded-lg gap-2"
                onClick={onOpen}
            >
                <h1 className="text-lg font-bold bg-zinc-200 dark:bg-zinc-900 py-1 px-2 rounded-lg">{providerInformation.storeName.toUpperCase()}</h1>
                <h2 className="text-md font-semibold text-primary">{providerInformation.drugName}</h2>
                <h3 className="text-md">{providerInformation.description}</h3>
            </div>

            {qrCodeData && (
                <Modal className="w-fit" isOpen={isOpen} onClose={onClose} size="xl">
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
                                <div className="flex justify-center items-center mb-1">
                                    <QRCode value={JSON.stringify(qrCodeData)} />
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
                                <Link href={issuerOrHowToLink} target="_blank" className="flex gap-2 justify-center items-center">
                                    <h1>Get a {credentialType} VC</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="dark:fill-white">
                                        <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                                    </svg>
                                </Link>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}