"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";
import { usePathname } from "next/navigation";

export default function Nav() {
    const pathname = usePathname();

    return (
        <Navbar position="static" className="bg-green-1100 text-white" maxWidth="full">
            <Image src="/medlink.ai.png" width="40" height="40" alt="Medlink.AI" className="rounded-[50px]" />
            <NavbarBrand>
                <Link href="#" className="font-semibold text-white">
                    Medlink.AI
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={pathname === "/"}>
                    <Link href="/" className={`${pathname === "/" ? "text-green-1000" : "text-white"}`}>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === "/price_index"}>
                    <Link href="/price_index" className={`${pathname === "/price_index" ? "text-green-1000" : "text-white"}`}>
                        Price Index
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitch />

                <NavbarItem className="hidden lg:flex">
                    <Button as={Link} href="#" variant="flat">
                        Login
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
