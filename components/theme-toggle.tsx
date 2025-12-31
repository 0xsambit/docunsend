"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem("theme");
	if (stored === "dark" || stored === "light") return stored;
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<string>("light");

	useEffect(() => {
		setTheme(getInitialTheme());
	}, []);

	useEffect(() => {
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		root.dataset.theme = theme;
		root.classList.toggle("dark", theme === "dark");
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

	return (
		<button
			type="button"
			onClick={toggle}
			className="pill inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground transition hover:scale-[1.02] hover:border-primary"
			aria-label="Toggle theme">
			{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
			<span>{theme === "dark" ? "Light" : "Dark"} mode</span>
		</button>
	);
}
