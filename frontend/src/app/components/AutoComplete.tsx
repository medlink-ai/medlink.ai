"use client";

import React, { Dispatch, Key, SetStateAction, useEffect, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { Autocomplete, AutocompleteItem, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function AutoComplete() {
    const [input, setInput] = useState("");
    const [products, setProducts] = useState<{ key: string; label: string; value: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const getProducts = debounce(async () => {
            const res = await axios.get(`/price_index/api?input=${input}`);
            setProducts(
                res.data.product.map((product: string) => ({
                    key: product,
                    label: product,
                    value: product,
                }))
            );
        }, 300);

        getProducts();

        return () => {
            getProducts.cancel();
        };
    }, [input]);

    return (
        <div className="flex flex-col w-full">
            <Autocomplete
                defaultItems={products}
                radius="full"
                label="Search for"
                placeholder="Medicine"
                menuTrigger="input"
                onInput={(e) => {
                    setInput(e.currentTarget.value);
                }}
            >
                {(product) => (
                    <AutocompleteItem
                        key={product.key}
                        value={product.value}
                        onClick={() => {
                            router.push(`/price_index/${encodeURIComponent(product.value)}`);
                        }}
                    >
                        {product.label}
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </div>
    );
}
