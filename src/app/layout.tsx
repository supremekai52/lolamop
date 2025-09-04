import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Zen Kolam - Complete Kolam Analyzer & Generator Platform",
	description: "Analyze, generate, and learn about traditional South Indian kolam patterns. AI-powered analysis, mathematical algorithms, and cultural preservation.",
	keywords: "kolam, rangoli, South Indian art, geometric patterns, mathematical art, cultural heritage, pattern analysis, AI",
	authors: [{ name: "Rishi Balamurugan" }],
	openGraph: {
		title: "Zen Kolam Platform",
		description: "Complete platform for kolam pattern analysis and generation",
		type: "website",
		locale: "en_US",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
