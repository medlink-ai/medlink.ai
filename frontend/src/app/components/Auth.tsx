"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalContent, Tooltip, useDisclosure } from "@nextui-org/react";
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { MetaMaskAvatar } from "react-metamask-avatar";
import axios from "axios";
import { Consumer } from "@/constants/types";
import { ChainlinkFunctionContext } from "../providers";

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

    const { consumer, setConsumer } = useContext(ChainlinkFunctionContext);

    const [input, setInput] = useState("");

    const createConsumer = useCallback(async () => {
        await axios.post<Consumer>("/consumer/api").then((consumer) => {
            const { consumerAddress, subscriptionId } = consumer.data;
            localStorage.setItem("consumer", JSON.stringify({ consumerAddress, subscriptionId }));
            setConsumer(consumer.data);
        });
    }, []);

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

            if (!localStorage.getItem("consumer")) {
                toast.promise(createConsumer, {
                    pending: "Creating consumer",
                    success: "Consumer created successfully🥳",
                    error: "Consumer creation failed, please try again 🤯",
                });
            }
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

    const { isOpen, onOpen, onClose } = useDisclosure();

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
                            <DropdownItem key="new" onClick={onOpen}>
                                View Profile
                            </DropdownItem>

                            <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                onClick={() => {
                                    disconnect();
                                    redirect("/?unauth=true");
                                }}
                            >
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
            <Modal className="w-fit pt-12 pb-8 px-8" isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-md font-semibold text-primary">Address: {address}</h2>
                        <h2 className="text-md font-semibold text-primary">Consumer Address: {consumer?.consumerAddress}</h2>
                        <h2 className="text-md font-semibold text-primary">Subscription ID: {consumer?.subscriptionId}</h2>
                        <div className="flex w-full justify-center items-center gap-4">
                            <Tooltip
                                className="whitespace-pre-line"
                                showArrow={true}
                                content={`Consumer is by right automatically created the first time you sign in.
                            Only use this if something goes wrong. (e.g. Requests are continuously failing, 
                                this is likely due to fund being ran out in Chainlink Function)`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="fill-warning mr-1">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                </svg>
                            </Tooltip>

                            <Input
                                className="w-full"
                                variant="underlined"
                                onChange={(e) => setInput(e.currentTarget.value)}
                                placeholder={`Type "I hereby confirm to create a new Consumer" to proceed`}
                            />

                            <Button
                                className="text-white bg-green-1100 dark:bg-green-1000 disabled:bg-zinc-500 dark:disabled:bg-zinc-500 disabled:cursor-not-allowed"
                                disabled={input !== "I hereby confirm to create a new Consumer"}
                                onClick={() => {
                                    setConsumer(undefined);
                                    toast.promise(createConsumer, {
                                        pending: "Creating consumer",
                                        success: "Consumer created successfully🥳",
                                        error: "Consumer creation failed, please try again 🤯",
                                    });
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    );
}
