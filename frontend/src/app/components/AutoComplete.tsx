"use client";

import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function AutoComplete() {
    const [input, setInput] = useState("");
    const [products, setProducts] = useState<{ key: string; label: string; value: string }[]>([]);

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
        }, 500);

        getProducts();

        return () => {
            getProducts.cancel();
        };
    }, [input]);

    return (
        <div className="flex flex-col w-96">
            <Autocomplete
                defaultItems={products}
                label="Search for"
                placeholder="Medicine"
                onInput={(e) => {
                    setInput(e.currentTarget.value);
                }}
            >
                {(product) => <AutocompleteItem key={product.value}>{product.label}</AutocompleteItem>}
            </Autocomplete>
        </div>
    );
}
