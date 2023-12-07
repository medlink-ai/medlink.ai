import { authOption } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth({ ...authOption, pages: { signIn: "/", signOut: "/" } });

export { handler as GET, handler as POST };
