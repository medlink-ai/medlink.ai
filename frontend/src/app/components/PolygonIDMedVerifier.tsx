"use client";

import { useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { Spinner } from "@nextui-org/react";
import QRCode from "react-qr-code";

import { io } from "socket.io-client";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "./ThemeSwitch";
import { DarkIcon } from "../icons/Dark";
import { LightIcon } from "../icons/Light";

export default function PolygonIDMedVerifier({
    onVerificationResult,
    walletAddress,
    licenseNumber,
}: {
    onVerificationResult: Dispatch<SetStateAction<boolean>>;
    walletAddress: string;
    licenseNumber: number;
}) {
    const [sessionId, setSessionId] = useState("");
    const [qrCodeData, setQrCodeData] = useState<{ body: any }>();
    const [isHandlingVerification, setIsHandlingVerification] = useState(false);
    const [verificationCheckComplete, setVerificationCheckComplete] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [socketEvents, setSocketEvents] = useState<{ fn: string; status: string }[]>([]);

    const { theme } = useTheme();
    const [modalTheme, setModalTheme] = useState<"light" | "dark">(theme as "light" | "dark");

    const serverUrl = window.location.href.startsWith("https")
        ? (process.env.NEXT_PUBLIC_VERIFICATION_SERVER_PUBLIC_URL as string)
        : (process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL as string);

    const getQrCodeApi = (sessionId: string, walletAddress: string, licenseNumber: number) =>
        `${serverUrl}/api/get-med-auth-qr?sessionId=${sessionId}&walletAddress=${encodeURIComponent(walletAddress)}&licenseNumber=${licenseNumber}`;

    useEffect(() => {
        const socket = io(serverUrl);
        socket.on("connect", () => {
            setSessionId(socket.id);
            socket.on(socket.id, (arg) => {
                setSocketEvents((socketEvents) => [...socketEvents, arg]);
            });
        });
        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        const fetchQrCode = async () => {
            const response = await fetch(getQrCodeApi(sessionId, walletAddress, licenseNumber));
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
        <div>
            {qrCodeData && (
                <div className="flex justify-center text-sm">
                    <div>
                        {isHandlingVerification && (
                            <div>
                                <p className="text-lg font-sans">Authenticating...</p>
                                <Spinner className="my-2" size="lg" color="primary" />
                            </div>
                        )}
                        <div className="text-md flex justify-center">{verificationMessage}</div>

                        {qrCodeData && !isHandlingVerification && !verificationCheckComplete && (
                            <div className="flex flex-col justify-center text-center items-center mb-1 gap-2">
                                <QRCode value={JSON.stringify(qrCodeData)} />
                                {theme === "dark" && (
                                    <div className="flex gap-2 justify-center items-center">
                                        <p>Change to light mode if unable to scan</p>
                                        <div onClick={() => setModalTheme(modalTheme === "dark" ? "light" : "dark")} className="hover:cursor-pointer">
                                            {modalTheme === "dark" ? <LightIcon /> : <DarkIcon />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {qrCodeData.body?.scope[0].query && (
                            <div className="mt-6">
                                <p className="text-2xl font-sans text-center">
                                    <span className="font-bold">Type:</span> {qrCodeData.body?.scope[0].query.type}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
