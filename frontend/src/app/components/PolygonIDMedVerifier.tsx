"use client";

import { useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";
import { Spinner } from "@nextui-org/react";
import QRCode from "react-qr-code";

import { io } from "socket.io-client";
import { useTheme } from "next-themes";
import { DarkIcon } from "../icons/Dark";
import { LightIcon } from "../icons/Light";
import { DoctorVerification } from "@/constants/types";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

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

    const { address } = useAccount();

    useEffect(() => {
        setModalTheme(theme as "light" | "dark");
    }, [theme]);

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

            if (currentSocketEvent.fn === "handleMedVerification") {
                if (currentSocketEvent.status === "IN_PROGRESS") {
                    setIsHandlingVerification(true);
                } else {
                    setIsHandlingVerification(false);
                    setVerificationCheckComplete(true);
                    if (currentSocketEvent.status === "DONE") {
                        setVerificationMessage("✅ License proof validated");
                        setTimeout(() => {
                            reportVerificationResult(true);
                        }, 2000);
                    } else {
                        setVerificationMessage("❌ Error verifying license");
                    }
                }
            }
        }
    }, [socketEvents]);

    // callback, send verification result back to app
    const reportVerificationResult = (result: boolean) => {
        if (!result) {
            toast.error("You are not authorized to verify this license");
        }

        if (typeof window !== "undefined" && result) {
            const doctorVerification: DoctorVerification | undefined = localStorage.getItem("doctorVerification")
                ? JSON.parse(localStorage.getItem("doctorVerification") as string)
                : undefined;
            if (!doctorVerification) {
                const newDoctorVerification: DoctorVerification = {
                    doctorWalletAddress: address!,
                    licenseNumber,
                    isVerified: true,
                };

                localStorage.setItem("doctorVerification", JSON.stringify(newDoctorVerification));
            } else {
                if (doctorVerification.doctorWalletAddress !== address || doctorVerification.licenseNumber !== licenseNumber) {
                    toast.info("Setting up new verified license");
                }

                localStorage.setItem(
                    "doctorVerification",
                    JSON.stringify({
                        ...doctorVerification,
                        isVerified: true,
                    })
                );
            }
        }
        onVerificationResult(result);
    };

    return (
        <div className={`${modalTheme === "light" ? "bg-white text-black" : "bg-[#242424] text-white"} rounded-md h-full`}>
            {qrCodeData && (
                <div className="flex flex-col text-sm h-full justify-between">
                    {isHandlingVerification && (
                        <div className="flex flex-col w-full justify-center items-center gap-2 mt-20">
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
                        <p className="text-2xl font-sans text-center">
                            <span className="font-bold">Type:</span> {qrCodeData.body?.scope[0].query.type}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
