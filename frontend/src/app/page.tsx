import { Button } from "@nextui-org/react";

export default function Home() {
    return (
        <main className="flex flex-col justify-center items-center w-full h-full p-24 bg-background">
            <div className="w-80 h-62 flex flex-col justify-center items-center rounded-2xl bg-background drop-shadow-xl p-8 gap-6">
                <div className="w-full">
                    <h1 className="font-bold">Sign In</h1>
                    <p>To continues with Medlink.AI</p>
                </div>

                <Button color="primary">Login With Ethereum</Button>
            </div>
        </main>
    );
}
