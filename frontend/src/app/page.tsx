import Auth from "./components/Auth";

export default async function Home() {
    return (
        <main className="flex flex-col justify-center items-center w-full h-full p-24 bg-background">
            <Auth />
        </main>
    );
}
