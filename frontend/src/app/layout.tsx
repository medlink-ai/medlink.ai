import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Nav from "@/app/components/Navbar";

const albert_sans = Albert_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Medlink.AI",
    description: "Your onchain drug store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${albert_sans.className} min-h-screen`}>
                <Providers>
                    <Nav />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
