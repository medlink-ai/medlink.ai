import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { AuthOptions, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export const authOption: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0",
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0",
                },
            },
            async authorize(credentials, req) {
                try {
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        nonce: await getCsrfToken({ req: { headers: req.headers } }),
                    });

                    if (result.success) {
                        return {
                            id: siwe.address,
                        };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            },
        }),
    ],
};

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    console.log("called auth");
    return getServerSession(...args, authOption);
}
