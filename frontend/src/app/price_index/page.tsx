import React from "react";
import AutoComplete from "../components/AutoComplete";
import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(authOption);

    if (!session) {
        redirect("/?unauth=true");
    }

    return (
        <main className="flex flex-col items-center justify-between p-4 bg-background">
            <AutoComplete />
        </main>
    );
}
