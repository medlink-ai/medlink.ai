import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Nav from "@/app/components/Navbar";
import { authOption } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Chatbot from "./components/Chatbot";

const albert_sans = Albert_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Medlink.AI",
    description: "Your onchain drug store",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOption);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${albert_sans.className} min-h-screen`}>
                <Providers session={session}>
                    <Nav />
                    {children}
                    {/* <Chatbot /> */}
                </Providers>
            </body>
        </html>
    );
}
