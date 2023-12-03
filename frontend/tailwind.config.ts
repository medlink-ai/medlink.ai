import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    1000: "#0f0f0f",
                },
                green: {
                    1000: "#21C49A",
                    1100: "#095251",
                },
            },
        },
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        background: "#ffffff",
                        foreground: "#0D001A",
                        primary: {
                            "50": "#edfcf6",
                            "100": "#d4f7e8",
                            "200": "#adedd5",
                            "300": "#77debd",
                            "400": "#40c7a0",
                            "500": "#21c49a",
                            "600": "#108b6e",
                            "700": "#0d6f5a",
                            "800": "#0c483c",
                            "900": "#095251",
                            DEFAULT: "#21c49a",
                            foreground: "#0D001A",
                        },
                        focus: "#21C49A",
                    },
                },
                dark: {
                    colors: {
                        background: "#232323",
                        foreground: "#ffffff",
                        primary: {
                            "50": "#edfcf6",
                            "100": "#d4f7e8",
                            "200": "#adedd5",
                            "300": "#77debd",
                            "400": "#40c7a0",
                            "500": "#21c49a",
                            "600": "#108b6e",
                            "700": "#0d6f5a",
                            "800": "#0c483c",
                            "900": "#095251",
                            DEFAULT: "#0d5849",
                            foreground: "#ffffff",
                        },
                        focus: "#21C49A",
                    },
                },
            },
        }),
        // require("daisyui"),
    ],
    // daisyui: {
    //     light: {
    //         ...require("daisyui/src/theming/themes")["light"],
    //         primary: "blue",
    //         secondary: "teal",
    //     },
    //     dark: {
    //         ...require("daisyui/src/theming/themes")["dark"],
    //         primary: "blue",
    //         secondary: "teal",
    //     },
    // },
};
export default config;
