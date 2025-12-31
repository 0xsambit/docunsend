import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "DosSend | Premium transfers for free",
	description:
		"Ship files and links with pro-grade security, scheduling, analytics, and device controls — all unlocked for every user.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const themeScript = `(() => {
    try {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (prefersDark ? 'dark' : 'light');
      const root = document.documentElement;
      root.dataset.theme = theme;
      root.classList.toggle('dark', theme === 'dark');
    } catch (err) {
      console.error('Theme init failed', err);
    }
  })();`;

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-surface text-foreground`}>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<div className="app-shell">
					<AuthProvider>{children}</AuthProvider>
				</div>
			</body>
		</html>
	);
}
