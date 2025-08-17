"use client";
import { LucideKanban, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { homePath } from "@/path";
import { useTheme } from "next-themes";

function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mx-2"
        >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
    );
}

function Header() {
    return (
        <nav className="fixed w-full z-20 bg-background/95">
            <div className="flex justify-between px-5 py-2.5 items-center">
                <Button className="flex gap-x-2 font-semibold" variant="ghost">
                    <LucideKanban />
                    <Link href={homePath}>
                        <h1 className="text-lg font-semibold">E-G Cart</h1>
                    </Link>
                </Button>
                <div className="flex items-center gap-x-2">
                    <ThemeSwitcher />
                    <Button variant="outline">
                        <h1>Logout</h1>
                    </Button>
                </div>
            </div>
            <Separator />
        </nav>
    );
}

export default Header;
