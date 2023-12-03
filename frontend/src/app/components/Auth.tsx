"use client";

import { Button } from "@nextui-org/react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter, useSearchParams } from "next/navigation";

export async function getServerSideProps(context: any) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}

export default function Auth() {
    const params = useSearchParams();
    const router = useRouter();

    const { signMessageAsync } = useSignMessage();
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { data: session, status } = useSession();

    const [isMounted, setIsMounted] = useState(false);

    const handleLogin = useCallback(async () => {
        try {
            const callbackUrl = "/price_index";
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: "Sign in with Ethereum to the app.",
                uri: window.location.origin,
                version: "1",
                chainId: chain?.id,
                nonce: await getCsrfToken(),
            });
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            });
            signIn("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            });
        } catch (error) {
            window.alert(error);
        }
    }, [address, chain?.id, signMessageAsync]);

    useEffect(() => {
        if (isConnected && !session) {
            handleLogin();
        }
    }, [handleLogin, isConnected, session]);

    useEffect(() => {
        setIsMounted(true);
        if (isMounted && session) {
            toast("Welcome back!");
            connect();
        }
        if (isMounted && params.get("unauth")) {
            toast.error("You need to login first!");
            router.replace("/");
        }
    }, [isMounted]);

    return (
        <>
            {session && <p>Session: {JSON.stringify(session)}</p>}
            <p>Status: {status}</p>
            {address && <p>Address: {address}</p>}
            <div className="w-80 h-62 flex flex-col justify-center items-center rounded-2xl bg-background drop-shadow-xl p-8 gap-6">
                <div className="w-full">
                    <h1 className="font-bold">Sign In</h1>
                    <p>To continues with Medlink.AI</p>
                </div>

                <Button
                    color="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isConnected) {
                            connect();
                        } else {
                            handleLogin();
                        }
                    }}
                >
                    Login With Ethereum
                </Button>
            </div>
        </>
    );
}
