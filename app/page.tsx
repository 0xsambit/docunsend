"use client";

import Link from "next/link";
import { useState } from "react";
import {
	Shield,
	Eye,
	Lock,
	Clock,
	BarChart3,
	Zap,
	ArrowRight,
	FileText,
	Globe,
	Download,
	Play,
	Users,
	Sparkles,
	ChevronRight,
	Mail,
	CheckCircle2,
	MousePointerClick,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const stats = [
	{ value: "10K+", label: "Files Shared" },
	{ value: "99.9%", label: "Uptime" },
	{ value: "50ms", label: "Avg Response" },
	{ value: "Free", label: "Forever" },
];

const features = [
	{
		icon: <FileText className="w-5 h-5" />,
		title: "Drag & Drop Upload",
		description: "Upload any file type instantly. PDFs, docs, images, videos—we handle it all.",
		color: "from-blue-500 to-cyan-500",
	},
	{
		icon: <Lock className="w-5 h-5" />,
		title: "Password Protection",
		description: "Lock your files with a passcode. Only authorized viewers get access.",
		color: "from-violet-500 to-purple-500",
	},
	{
		icon: <Clock className="w-5 h-5" />,
		title: "Auto-Expiring Links",
		description: "Set links to expire after a date or number of views. You're in control.",
		color: "from-orange-500 to-amber-500",
	},
	{
		icon: <BarChart3 className="w-5 h-5" />,
		title: "Real-Time Analytics",
		description: "See exactly who viewed your files, when, and from where—in real-time.",
		color: "from-emerald-500 to-green-500",
	},
	{
		icon: <Eye className="w-5 h-5" />,
		title: "View-Once Mode",
		description: "Self-destructing files. After one view, they're gone. Perfect for sensitive data.",
		color: "from-rose-500 to-pink-500",
	},
	{
		icon: <Download className="w-5 h-5" />,
		title: "Download Limits",
		description: "Restrict how many times a file can be downloaded. Track every download.",
		color: "from-indigo-500 to-blue-500",
	},
];

const useCases = [
	{
		icon: <Users className="w-6 h-6" />,
		title: "Founders & Startups",
		description: "Share pitch decks with investors. Track who's interested by their engagement.",
	},
	{
		icon: <FileText className="w-6 h-6" />,
		title: "Legal & Contracts",
		description: "Send sensitive documents with confidence. Know when they've been reviewed.",
	},
	{
		icon: <Mail className="w-6 h-6" />,
		title: "Sales Teams",
		description: "Share proposals and know exactly when prospects open them. Perfect timing for follow-ups.",
	},
	{
		icon: <Sparkles className="w-6 h-6" />,
		title: "Creators & Agencies",
		description: "Deliver client work securely. Get notified the moment they view your deliverables.",
	},
];

const howItWorks = [
	{
		step: "01",
		title: "Upload Your File",
		description: "Drag and drop or click to upload. We support all file types.",
	},
	{
		step: "02",
		title: "Set Your Rules",
		description: "Add password, expiry date, download limits—whatever you need.",
	},
	{
		step: "03",
		title: "Share the Link",
		description: "Get a secure link. Share via email, Slack, or anywhere.",
	},
	{
		step: "04",
		title: "Track Everything",
		description: "Watch in real-time as recipients view and engage with your files.",
	},
];

export default function HomePage() {
	const [email, setEmail] = useState("");

	return (
		<div className="min-h-screen bg-surface text-foreground">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-surface/60 backdrop-blur-2xl border-b border-border/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Link href="/" className="flex items-center gap-2.5 group">
							<div className="w-9 h-9 rounded-xl bg-linear-to-br from-accent via-cyan-500 to-accent flex items-center justify-center shadow-lg shadow-accent/25 group-hover:shadow-accent/40 transition-shadow">
								<Zap className="w-5 h-5 text-white" />
							</div>
							<span className="font-bold text-xl tracking-tight">Docunsend</span>
						</Link>

						<nav className="hidden md:flex items-center gap-8">
							<Link href="#features" className="text-sm text-muted hover:text-foreground transition-colors">
								Features
							</Link>
							<Link href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">
								How it Works
							</Link>
							<Link href="#use-cases" className="text-sm text-muted hover:text-foreground transition-colors">
								Use Cases
							</Link>
						</nav>

						<div className="flex items-center gap-3">
							<ThemeToggle />
							<Link
								href="/api/auth/signin"
								className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
								Sign In
							</Link>
							<Link
								href="/api/auth/signin"
								className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-accent text-white rounded-full hover:bg-accent/90 transition-all hover:scale-105 shadow-lg shadow-accent/25">
								Get Started
								<ChevronRight className="w-4 h-4" />
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Hero */}
			<section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
				{/* Background Effects */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-accent/5 to-cyan-500/5 rounded-full blur-3xl" />
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-4xl mx-auto">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
							<Sparkles className="w-4 h-4" />
							The free alternative to expensive file sharing
						</div>

						{/* Headline */}
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
							Share files with
							<span className="block mt-2 bg-linear-to-r from-accent via-cyan-400 to-accent bg-clip-text text-transparent">
								confidence & control
							</span>
						</h1>

						{/* Subheadline */}
						<p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
							Track who views your documents, protect them with passwords, 
							set expiry dates, and get real-time analytics. 
							No subscriptions. No limits. Completely free.
						</p>

						{/* CTA Group */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
							<Link
								href="/api/auth/signin"
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-accent text-white rounded-full hover:bg-accent/90 transition-all hover:scale-105 shadow-xl shadow-accent/25">
								Start Sharing — It's Free
								<ArrowRight className="w-5 h-5" />
							</Link>
							<Link
								href="#how-it-works"
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-surface-raised border border-border rounded-full hover:bg-surface-hover hover:border-border/80 transition-all group">
								<Play className="w-4 h-4 text-accent" />
								See How It Works
							</Link>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
							{stats.map((stat) => (
								<div key={stat.label} className="text-center">
									<div className="text-2xl sm:text-3xl font-bold text-accent mb-1">{stat.value}</div>
									<div className="text-sm text-muted">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Social Proof Bar */}
			<section className="py-12 border-y border-border/50 bg-surface-raised/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<p className="text-center text-sm text-muted mb-6">Trusted by teams at</p>
					<div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-50">
						{["Startups", "Agencies", "Law Firms", "Sales Teams", "Founders"].map((name) => (
							<span key={name} className="text-lg font-semibold tracking-wide">{name}</span>
						))}
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section id="features" className="py-24 sm:py-32">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
							Features
						</div>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
							Everything you need to share securely
						</h2>
						<p className="text-lg text-muted max-w-2xl mx-auto">
							Professional-grade security features. No enterprise pricing.
						</p>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group relative bg-surface-raised border border-border rounded-2xl p-6 hover:border-accent/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
								<div className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
									<span className="text-white">{feature.icon}</span>
								</div>
								<h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">{feature.title}</h3>
								<p className="text-muted leading-relaxed">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section id="how-it-works" className="py-24 sm:py-32 bg-surface-raised/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
							How It Works
						</div>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
							Simple. Secure. Smart.
						</h2>
						<p className="text-lg text-muted max-w-2xl mx-auto">
							Get started in seconds. No learning curve.
						</p>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{howItWorks.map((item, index) => (
							<div key={item.step} className="relative">
								{index < howItWorks.length - 1 && (
									<div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-linear-to-r from-border to-transparent" />
								)}
								<div className="text-5xl font-bold text-accent/20 mb-4">{item.step}</div>
								<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
								<p className="text-muted">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Use Cases */}
			<section id="use-cases" className="py-24 sm:py-32">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
							Use Cases
						</div>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
							Built for professionals
						</h2>
						<p className="text-lg text-muted max-w-2xl mx-auto">
							From pitch decks to contracts, know when your documents get attention.
						</p>
					</div>

					<div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
						{useCases.map((useCase) => (
							<div
								key={useCase.title}
								className="flex gap-5 p-6 bg-surface-raised border border-border rounded-2xl hover:border-accent/30 transition-all">
								<div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
									{useCase.icon}
								</div>
								<div>
									<h3 className="text-lg font-semibold mb-1">{useCase.title}</h3>
									<p className="text-muted">{useCase.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 sm:py-32">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-accent via-accent to-cyan-500 p-12 sm:p-16 text-center">
						{/* Background pattern */}
						<div className="absolute inset-0 opacity-10">
							<div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
						</div>
						
						<div className="relative">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
								<MousePointerClick className="w-4 h-4" />
								No credit card required
							</div>
							
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
								Ready to take control?
							</h2>
							<p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
								Stop wondering if your files were seen. Start knowing.
								Join thousands already sharing smarter.
							</p>

							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<Link
									href="/api/auth/signin"
									className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-white text-accent rounded-full hover:bg-white/90 transition-all hover:scale-105 shadow-xl">
									Get Started Free
									<ArrowRight className="w-5 h-5" />
								</Link>
							</div>

							<div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
								<span className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4" />
									Free forever
								</span>
								<span className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4" />
									No limits
								</span>
								<span className="flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4" />
									Full analytics
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border py-12 sm:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-2.5">
							<div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-cyan-500 flex items-center justify-center">
								<Zap className="w-4 h-4 text-white" />
							</div>
							<span className="font-bold text-lg">Docunsend</span>
						</div>
						
						<div className="flex items-center gap-6 text-sm text-muted">
							<Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
							<Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
							<Link href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</Link>
						</div>

						<p className="text-sm text-muted">
							© {new Date().getFullYear()} Docunsend. Free & open.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
