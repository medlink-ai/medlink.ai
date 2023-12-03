import React from "react";
import AutoComplete from "../components/AutoComplete";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export default async function Page() {
    return (
        <main className="flex flex-col items-center justify-between p-4 bg-background">
            <AutoComplete />
        </main>
    );
}
