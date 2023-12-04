"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter, useSearchParams } from "next/navigation";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { on } from "events";

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
    const { disconnect } = useDisconnect({
        onSuccess: () => {
            signOut();
        },
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
        if (isMounted && !isConnected && session) {
            connect();
            toast("Welcome back!");
        }
        if (isMounted && params.get("unauth")) {
            toast.error("You need to login first!");
            router.replace("/");
        }
    }, [isMounted]);

    return (
        <>
            {isConnected ? (
                <div className="flex gap-4 items-center">
                    <div>Welcome!</div>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                isIconOnly
                                className="w-10 rounded-full ring ring-green-1000 ring-offset-green-1100 ring-offset-2"
                            >
                                <MetaMaskAvatar address={address!} size={40} />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem key="new">View Profile</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => disconnect()}>
                                Disconnect
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            ) : (
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
                    Sign In With Ethereum
                </Button>
            )}
        </>
    );
}
