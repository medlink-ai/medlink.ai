"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Auth from "./Auth";

export default function Nav() {
    const pathname = usePathname();

    const { data: session, status } = useSession();

    return (
        <Navbar
            position="static"
            className="bg-green-1100 text-white"
            classNames={{
                item: ["data-[active=true]:text-green-1000"],
            }}
            maxWidth="full"
        >
            <NavbarBrand className="gap-4">
                <Image src="/medlink.ai.png" width="40" height="40" alt="Medlink.AI" className="rounded-[50px]" />
                <Link href="#" className="font-semibold text-white">
                    Medlink.AI
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={pathname === "/"}>
                    <Link href="/">Home</Link>
                </NavbarItem>
                <NavbarItem isActive={pathname.startsWith("/price_index")}>
                    <Link href="/price_index" className={`${status === "unauthenticated" && "pointer-events-none text-gray-400"}`}>
                        Price Index
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitch />

                <NavbarItem className="hidden lg:flex">
                    <Auth />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
