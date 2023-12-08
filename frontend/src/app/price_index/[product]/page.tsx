"use client";

import PolygonIDVerifier from "@/app/components/PolygonIDVerifier";
import { Input, Breadcrumbs, BreadcrumbItem, Button, Spinner, Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

function Budget({ product }: { product: string }) {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col">
                <h1 className="font-bold text-2xl">How much are you planning to spend on this medicine?</h1>
                <p>Create an order that fits your prescription needs and budget.</p>
            </div>

            <div className="bg-secondary rounded-lg p-6 gap-6 my-6">
                <div className="flex flex-col">
                    <h2 className="font-bold">{product}</h2>
                    <p>Used in the treatment of diabetes</p>
                </div>

                <div className="flex justify-between items-center gap-6 mt-4">
                    <div className="flex flex-col justify-center items-center bg-zinc-200 dark:bg-zinc-900 p-2 rounded-lg w-full">
                        <h3 className="font-bold text-xl">3.15</h3>
                        <div>Lowest Price in PHP</div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-zinc-200 dark:bg-zinc-900 p-2 rounded-lg w-full">
                        <h3 className="font-bold text-xl">6.25</h3>
                        <div>Medium Price in PHP</div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-zinc-200 dark:bg-zinc-900 p-2 rounded-lg w-full">
                        <h3 className="font-bold text-xl">10.00</h3>
                        <div>Highest Price in PHP</div>
                    </div>
                </div>
            </div>
            <Input label="Budget" placeholder="Enter your budget" variant="bordered" radius="sm" type="number" />
        </div>
    );
}

function Providers({ product, setProvedPrescription }: { product: string; setProvedPrescription: Dispatch<SetStateAction<boolean>> }) {
    const [providers, setProviders] = useState<
        {
            issuerOrHowToLink: string;
            credentialType: string;
            information: {
                drugName: string;
                storeName: string;
                description: string;
            };
        }[]
    >([
        {
            issuerOrHowToLink: "https://google.com",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy A Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://chain.link",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy B Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://nextjs.org/",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy C Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://nextjs.org/",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy C Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://nextjs.org/",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy D Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://nextjs.org/",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy E Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://nextjs.org/",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy F Drug Store", description: "Used in the treatment of diabetes" },
        },
        {
            issuerOrHowToLink: "https://nextjs.org/",
            credentialType: "DrugPrescription",
            information: { drugName: product, storeName: "Pharmacy G Drug Store", description: "Used in the treatment of diabetes" },
        },
    ]);

    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    return (
        <div className="w-full h-full overflow-hidden gap-1">
            <div className="flex w-full justify-between items-center mb-2">
                <h1 className="font-bold text-2xl">Providers</h1>

                <Switch
                    defaultSelected
                    size="lg"
                    color="secondary"
                    className="h-full"
                    onChange={(e) => {
                        setViewMode(e.target.checked ? "list" : "grid");
                    }}
                    thumbIcon={({ isSelected, className }) =>
                        isSelected ? (
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
                                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z" />
                            </svg>
                        )
                    }
                />
            </div>

            <div className={viewMode === "list" ? "flex flex-col gap-2 h-full overflow-y-auto" : "grid grid-cols-2 gap-2 overflow-y-auto"}>
                {providers.map((provider, index) => (
                    <PolygonIDVerifier
                        key={index}
                        providerInformation={provider.information}
                        issuerOrHowToLink={provider.issuerOrHowToLink}
                        credentialType={provider.credentialType}
                        onVerificationResult={setProvedPrescription}
                        style={index === providers.length - 1 ? "mb-10" : ""}
                    />
                ))}
            </div>
        </div>
    );
}

function Breadcrumb({ product, confirmation = false }: { product: string; confirmation: boolean }) {
    const router = useRouter();
    return (
        <Breadcrumbs>
            <BreadcrumbItem
                onPress={() => {
                    router.push("/price_index");
                }}
            >
                Price Index
            </BreadcrumbItem>
            <BreadcrumbItem>{product}</BreadcrumbItem>
            {confirmation && <BreadcrumbItem>Confirm Order</BreadcrumbItem>}
        </Breadcrumbs>
    );
}

function ConfirmOrder({ product, onCancel }: { product: string; onCancel: () => void }) {
    const USD_TO_MATIC_EXCHANGE_RATE = 0.01;

    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder for medicine details
    const medicineDetails = {
        name: product,
        priceUSD: 10.99, // Add your actual price in USD
    };

    const totalPriceUSD = parseFloat((quantity * medicineDetails.priceUSD).toFixed(2));
    const totalPriceMatic = parseFloat((totalPriceUSD * USD_TO_MATIC_EXCHANGE_RATE).toFixed(4));

    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const handlePay = async () => {
        // Implement your payment logic here
        setIsLoading(true);
        // Simulating payment process with a delay
        setTimeout(() => {
            alert(`Order confirmed for ${quantity} ${medicineDetails.name}`);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex w-full h-full items-center justify-center text-center">
            <div className="flex flex-col w-2xl gap-10">
                <div className="flex flex-col">
                    <h1 className="text-6xl font-bold">Confirm Your Order</h1>
                    <p className="text-lg font-semibold text-zinc-500">Please review and confirm your medicine order</p>
                </div>

                <div className="flex justify-between items-start gap-10 w-full">
                    <div className="flex flex-col w-96 text-left items-start gap-2">
                        <p className="font-bold text-md">Medicine</p>
                        <p className="font-bold text-teal-500">{medicineDetails.name}</p>
                    </div>

                    <div className="flex flex-col w-fit items-start text-left gap-2">
                        <p className="font-bold text-md">Quantity</p>
                        <div className="flex items-center">
                            <Button
                                isIconOnly
                                size="sm"
                                className="bg-teal-500 text-white rounded-sm"
                                onClick={handleDecrement}
                                disabled={quantity === 1}
                            >
                                -
                            </Button>
                            <input
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="text-center w-12 mx-2"
                                readOnly
                            />
                            <Button isIconOnly size="sm" className="bg-teal-500 text-white rounded-sm" onClick={handleIncrement}>
                                +
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col w-28 items-start text-left gap-2">
                        <p className="font-bold text-md">Total Prices</p>
                        <div className="flex flex-col text-left space-y-1">
                            <p className="font-bold text-md">{totalPriceMatic} MATIC</p>
                            <p className="text-xs">(${totalPriceUSD} USD</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center w-full gap-2">
                    <Button className="bg-gray-300 text-gray-700 border rounded-lg px-4 py-2 w-[30%]" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button className="bg-teal-500 text-white rounded-lg px-4 py-2 w-[70%]" onClick={handlePay} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Confirm Order"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Page({ params }: { params: { product: string } }) {
    const decodedProducts = decodeURIComponent(params.product);
    const [provedPrescription, setProvedPrescription] = useState(false);

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] py-6 px-6">
            <Breadcrumb product={decodedProducts} confirmation={provedPrescription} />

            <div className="flex w-full h-full gap-6 py-4">
                {!provedPrescription ? (
                    <>
                        <Budget product={decodedProducts} />
                        <Providers product={decodedProducts} setProvedPrescription={setProvedPrescription} />
                    </>
                ) : (
                    <ConfirmOrder product={decodedProducts} onCancel={() => setProvedPrescription(false)} />
                )}
            </div>
        </div>
    );
}
