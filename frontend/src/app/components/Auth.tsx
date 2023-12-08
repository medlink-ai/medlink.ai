"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
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

            const createConsumer = async () => {
                await axios.post<Consumer>("/consumer/api").then((consumer) => {
                    const { consumerAddress, subscriptionId } = consumer.data;
                    localStorage.setItem("consumer", JSON.stringify({ consumerAddress, subscriptionId }));
                    setConsumer(consumer.data);
                });
            };

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
            <Modal className="w-fit py-12 px-8" isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-md font-semibold text-primary">Address: {address}</h2>
                        <h2 className="text-md font-semibold text-primary">Consumer Address: {consumer?.consumerAddress}</h2>
                        <h2 className="text-md font-semibold text-primary">Subscription ID: {consumer?.subscriptionId}</h2>
                    </div>
                </ModalContent>
            </Modal>
        </>
    );
}
