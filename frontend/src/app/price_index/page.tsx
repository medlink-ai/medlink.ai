import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PriceIndexWrapper from "./PriceIndexWrapper";

export default async function Page() {
    const session = await getServerSession(authOption);

    if (!session) {
        redirect("/?unauth=true");
    }

    return (
        <main className="h-[calc(100vh-64px)] bg-background">
            <PriceIndexWrapper />
        </main>
    );
}
