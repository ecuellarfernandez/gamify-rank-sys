import type { ReactNode } from "react";
import { Navbar } from "../navigation/Navbar";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4">
                {children}
            </main>
        </div>
    );
}