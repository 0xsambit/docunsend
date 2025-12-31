"use client";

import { useSession } from "@/components/providers/session-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Activity,
	ArrowRight,
	Clock,
	Download,
	Eye,
	Fingerprint,
	Globe2,
	Lock,
	LogOut,
	Plus,
	Settings,
	Shield,
	Upload,
	Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect } from "react";

const quickActions = [
	{
		title: "New Transfer",
		description: "Upload files and share securely",
		icon: <Upload className="w-5 h-5" />,
		href: "/dashboard/transfers/new",
	},
	{
		title: "Schedule Drop",
		description: "Set up timed delivery",
		icon: <Clock className="w-5 h-5" />,
		href: "/dashboard/transfers/schedule",
	},
	{
		title: "Custom Domain",
		description: "Brand your links",
		icon: <Globe2 className="w-5 h-5" />,
		href: "/dashboard/settings/domains",
	},
];

const securityFeatures = [
	{ icon: <Lock className="w-4 h-4" />, label: "Password Protection", status: "Available" },
	{ icon: <Eye className="w-4 h-4" />, label: "View-Once Mode", status: "Available" },
	{ icon: <Fingerprint className="w-4 h-4" />, label: "Device Locking", status: "Available" },
	{ icon: <Shield className="w-4 h-4" />, label: "Instant Revoke", status: "Available" },
];

export default function Dashboard() {
	const { session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/api/auth/signin");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-[var(--primary)]/20"></div>
					<span className="text-[var(--muted)]">Loading...</span>
				</div>
			</div>
		);
	}

	if (!session?.user) {
		return null;
	}

	return (
		<div className="app-shell min-h-screen">
			<div className="hero-gradient opacity-50" aria-hidden />

			{/* Header */}
			<header className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
				<div className="flex items-center justify-between rounded-2xl card px-6 py-4">
					<div className="flex items-center gap-4">
						<Link href="/" className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
								<Zap className="w-4 h-4 text-white" />
							</div>
							<span className="font-bold text-lg">DocuNsend</span>
						</Link>
					</div>
					<div className="flex items-center gap-3">
						<div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-strong)] text-sm">
							<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
								{session.user.name?.charAt(0) ||
									session.user.email?.charAt(0) ||
									"U"}
							</div>
							<span className="text-[var(--muted)]">{session.user.email}</span>
						</div>
						<ThemeToggle />
						<a href="/api/auth/signout" className="btn btn-ghost text-sm">
							<LogOut className="w-4 h-4" />
							<span className="hidden sm:inline">Sign out</span>
						</a>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 mx-auto max-w-6xl px-6 py-12">
				{/* Welcome Section */}
				<section className="mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold mb-2">
						Welcome back, {session.user.name?.split(" ")[0] || "friend"} 👋
					</h1>
					<p className="text-lg text-[var(--muted)]">
						All premium features unlocked. No limits. No restrictions.
					</p>
				</section>

				{/* Quick Actions */}
				<section className="mb-12">
					<h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
					<div className="grid sm:grid-cols-3 gap-5">
						{quickActions.map((action) => (
							<Link
								key={action.title}
								href={action.href}
								className="card card-hover p-6 flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
									{action.icon}
								</div>
								<div>
									<h3 className="font-semibold mb-1">{action.title}</h3>
									<p className="text-sm text-[var(--muted)]">
										{action.description}
									</p>
								</div>
								<ArrowRight className="w-5 h-5 text-[var(--muted)] ml-auto" />
							</Link>
						))}
					</div>
				</section>

				{/* Main Grid */}
				<div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
					{/* Transfers Section */}
					<section className="card p-6 space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-xl font-semibold">Recent Transfers</h2>
								<p className="text-sm text-[var(--muted)]">
									Your file sharing activity
								</p>
							</div>
							<Link
								href="/dashboard/transfers/new"
								className="btn btn-primary">
								<Plus className="w-4 h-4" />
								New Transfer
							</Link>
						</div>

						<div className="divider" />

						{/* Empty State */}
						<div className="py-12 text-center">
							<div className="w-16 h-16 rounded-2xl bg-[var(--bg-strong)] flex items-center justify-center mx-auto mb-4">
								<Download className="w-8 h-8 text-[var(--muted)]" />
							</div>
							<h3 className="font-semibold text-lg mb-2">No transfers yet</h3>
							<p className="text-[var(--muted)] mb-6 max-w-sm mx-auto">
								Create your first transfer to start sharing files securely
								with all premium features.
							</p>
							<Link
								href="/dashboard/transfers/new"
								className="btn btn-secondary">
								Create your first transfer
								<ArrowRight className="w-4 h-4" />
							</Link>
						</div>
					</section>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Security Features */}
						<section className="card p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Security Features</h3>
								<Shield className="w-5 h-5 text-[var(--primary)]" />
							</div>
							<div className="space-y-3">
								{securityFeatures.map((feature) => (
									<div
										key={feature.label}
										className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
										<div className="flex items-center gap-3 text-sm">
											<span className="text-[var(--primary)]">
												{feature.icon}
											</span>
											{feature.label}
										</div>
										<span className="text-xs font-medium text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">
											{feature.status}
										</span>
									</div>
								))}
							</div>
						</section>

						{/* Analytics Preview */}
						<section className="card p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Analytics</h3>
								<Activity className="w-5 h-5 text-[var(--accent)]" />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 rounded-xl bg-[var(--bg-strong)]">
									<p className="text-2xl font-bold">0</p>
									<p className="text-sm text-[var(--muted)]">
										Total Views
									</p>
								</div>
								<div className="p-4 rounded-xl bg-[var(--bg-strong)]">
									<p className="text-2xl font-bold">0</p>
									<p className="text-sm text-[var(--muted)]">
										Downloads
									</p>
								</div>
							</div>
							<p className="text-sm text-[var(--muted)]">
								Real-time analytics will appear here once you start sharing.
							</p>
						</section>

						{/* Settings Link */}
						<Link
							href="/dashboard/settings"
							className="card card-hover p-6 flex items-center gap-4">
							<div className="w-10 h-10 rounded-xl bg-[var(--bg-strong)] flex items-center justify-center">
								<Settings className="w-5 h-5 text-[var(--muted)]" />
							</div>
							<div className="flex-1">
								<h3 className="font-semibold">Settings</h3>
								<p className="text-sm text-[var(--muted)]">
									Manage your account
								</p>
							</div>
							<ArrowRight className="w-5 h-5 text-[var(--muted)]" />
						</Link>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="relative z-10 mx-auto max-w-6xl px-6 py-8 mt-12 border-t border-[var(--border)]">
				<div className="flex items-center justify-between text-sm text-[var(--muted)]">
					<p>DocuNsend · All features free, forever</p>
					<div className="flex items-center gap-4">
						<Link href="#" className="link-underline">
							Help
						</Link>
						<Link href="#" className="link-underline">
							Privacy
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
