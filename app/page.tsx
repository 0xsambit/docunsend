import Link from "next/link";
import {
	Activity,
	AlarmClock,
	ArrowUpRight,
	Download,
	Fingerprint,
	Globe2,
	Link2,
	Lock,
	MousePointerClick,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const featureCards = [
	{
		title: "Instant, no limits",
		description:
			"Upload heavy files or generate secure links without paywalls or throttling.",
		icon: <Download size={18} />,
	},
	{
		title: "Time + device locks",
		description: "Expiry windows, view-once, passcodes, and device fingerprinting baked in.",
		icon: <Lock size={18} />,
	},
	{
		title: "Scheduling",
		description: "Prep drops ahead of time and let them go live automatically.",
		icon: <AlarmClock size={18} />,
	},
	{
		title: "Analytics",
		description: "See opens, downloads, locations, devices, and block risky attempts.",
		icon: <Activity size={18} />,
	},
	{
		title: "Custom domains",
		description: "Ship from your own hostname with branded colors and preview cards.",
		icon: <Globe2 size={18} />,
	},
	{
		title: "One-click revoke",
		description: "Kill a transfer instantly or rotate a fresh, tamper-proof link.",
		icon: <ShieldCheck size={18} />,
	},
];

const workflow = [
	{
		title: "Authenticate",
		description: "Sign in once; every premium control is unlocked by default.",
	},
	{
		title: "Configure",
		description:
			"Upload files or paste links, set expiries, passcodes, devices, and domains.",
	},
	{
		title: "Share + monitor",
		description: "Send to contacts or share a smart link while analytics watch in real time.",
	},
];

const security = [
	"Passcodes + view-once",
	"Device fingerprint allow/deny",
	"Geo/IP insights + throttling",
	"Instant revoke + versioned links",
];

export default function Home() {
	return (
		<main className="relative isolate overflow-hidden pb-24">
			<div className="pointer-events-none absolute inset-0 glow-grid" aria-hidden />

			<div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-12 sm:px-10">
				<header className="flex items-center justify-between gap-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)]/70 px-6 py-4 shadow-lg">
					<div className="flex items-center gap-3">
						<div className="pill flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
							<Sparkles size={14} />
							Premium Unlocked
						</div>
						<span className="text-sm text-[color:var(--muted)]">
							DosSend • free forever
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Link
							className="pill hidden items-center gap-2 px-4 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:border-primary hover:text-[color:var(--primary)] sm:inline-flex"
							href="#roadmap">
							Roadmap
							<ArrowUpRight size={16} />
						</Link>
						<ThemeToggle />
					</div>
				</header>

				<section className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
					<div className="flex flex-col gap-8">
						<p className="pill w-fit text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
							DosSend | Everything on
						</p>
						<div className="space-y-5">
							<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
								Pro-grade transfers, scheduling, and analytics —{" "}
								<span className="gradient-text">all free</span>.
							</h1>
							<p className="text-lg text-[color:var(--muted)] sm:max-w-2xl">
								No meters, no paywalls. Ship massive files or smart links
								with expiries, device locks, passcodes, custom domains, and
								real-time threat monitoring. Designed for teams that move
								fast.
							</p>
						</div>
						<div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
							<div className="pill px-4 py-2 font-medium text-[color:var(--fg)]">
								Unlimited premium controls
							</div>
							<div className="pill px-4 py-2 font-medium text-[color:var(--fg)]">
								Vercel-ready · Prisma-backed
							</div>
							<div className="pill px-4 py-2 font-medium text-[color:var(--fg)]">
								Dark + light, tech aesthetic
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-4">
							<Link
								href="/dashboard"
								className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/40 transition hover:translate-y-[-1px] hover:bg-[color:var(--primary-strong)]">
								Authenticate & send
								<ArrowUpRight size={16} />
							</Link>
							<Link
								href="#features"
								className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--fg)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
								Explore the stack
								<MousePointerClick size={16} />
							</Link>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							{[
								"Unlimited sends",
								"Passcodes + device locks",
								"Custom domains",
							].map((item) => (
								<div
									key={item}
									className="glass rounded-xl px-4 py-3 text-sm font-semibold text-[color:var(--fg)]">
									{item}
								</div>
							))}
						</div>
					</div>

					<div className="glass relative overflow-hidden rounded-2xl border border-[color:var(--border)] px-6 py-6 shadow-2xl">
						<div
							className="absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/10 via-transparent to-[color:var(--accent)]/15"
							aria-hidden
						/>
						<div className="relative flex flex-col gap-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
										Live control
									</p>
									<h3 className="text-xl font-semibold">
										Realtime guardrail
									</h3>
								</div>
								<div className="pill px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
									Zero cost
								</div>
							</div>
							<div className="space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card-strong)]/70 p-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-[color:var(--muted)]">
										Status
									</span>
									<span className="text-[color:var(--success)]">
										Secure · Passcode + device lock
									</span>
								</div>
								<div className="fade-divider" />
								<div className="flex items-center justify-between text-sm">
									<span className="text-[color:var(--muted)]">
										Expiry
									</span>
									<span className="text-[color:var(--fg)]">
										View once · 24h fallback
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-[color:var(--muted)]">
										Devices
									</span>
									<span className="text-[color:var(--fg)]">
										Macbook · iPhone · iPad
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-[color:var(--muted)]">
										Auto revoke
									</span>
									<span className="text-[color:var(--warning)]">
										On suspicious access
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3">
									<p className="text-[color:var(--muted)]">Downloads</p>
									<p className="text-2xl font-semibold">0 / ∞</p>
									<p className="text-xs text-[color:var(--muted)]">
										No caps or throttles
									</p>
								</div>
								<div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3">
									<p className="text-[color:var(--muted)]">
										Custom domain
									</p>
									<p className="text-lg font-semibold">
										send.yourbrand.com
									</p>
									<p className="text-xs text-[color:var(--muted)]">
										Premium look by default
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm">
								<div className="flex items-center gap-2 text-[color:var(--muted)]">
									<Fingerprint size={16} />
									Device lock active
								</div>
								<button className="text-[color:var(--primary)]">
									Manage
								</button>
							</div>
						</div>
					</div>
				</section>

				<section id="features" className="space-y-8">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
								Premium surface
							</p>
							<h2 className="text-2xl font-semibold">
								Every DosSend feature, unlocked
							</h2>
						</div>
						<Link
							className="hidden text-sm text-[color:var(--primary)] sm:inline"
							href="/dashboard">
							Go to dashboard
						</Link>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{featureCards.map((feature) => (
							<div
								key={feature.title}
								className="glass flex h-full flex-col gap-3 rounded-xl border border-[color:var(--border)] p-4 transition hover:border-[color:var(--primary)] hover:-translate-y-[1px]">
								<div className="pill inline-flex w-fit items-center gap-2 px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
									{feature.icon}
									Feature
								</div>
								<h3 className="text-lg font-semibold">{feature.title}</h3>
								<p className="text-sm text-[color:var(--muted)]">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
					<div className="glass space-y-5 rounded-2xl border border-[color:var(--border)] p-6">
						<p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
							Workflow
						</p>
						<h3 className="text-xl font-semibold">Zero friction sending</h3>
						<div className="grid gap-4 md:grid-cols-3">
							{workflow.map((step, idx) => (
								<div
									key={step.title}
									className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
									<div className="pill mb-3 inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
										{idx + 1}
										<Link2 size={14} />
									</div>
									<h4 className="text-base font-semibold">
										{step.title}
									</h4>
									<p className="text-sm text-[color:var(--muted)]">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="glass space-y-4 rounded-2xl border border-[color:var(--border)] p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Security controls</h3>
							<Lock size={18} />
						</div>
						<div className="space-y-3">
							{security.map((item) => (
								<div
									key={item}
									className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm">
									<ShieldCheck
										size={16}
										className="text-[color:var(--primary)]"
									/>
									<span>{item}</span>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
					<div className="glass space-y-5 rounded-2xl border border-[color:var(--border)] p-6">
						<div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
							<Activity size={16} /> Live analytics
						</div>
						<h3 className="text-xl font-semibold">See everything in motion</h3>
						<p className="text-sm text-[color:var(--muted)]">
							Live opens, downloads, countries, devices, referrers, and blocked
							attempts are captured per transfer. No limits, no hidden
							dashboards.
						</p>
						<div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
							<div className="flex items-center justify-between text-sm">
								<span className="text-[color:var(--muted)]">Events</span>
								<span className="text-[color:var(--fg)]">
									Realtime stream
								</span>
							</div>
							<div className="mt-3 space-y-2 text-sm">
								{[
									"Download allow · SF, Macbook",
									"Blocked · VPN exit in RU",
									"Open · NYC, iPhone",
								].map((event) => (
									<div
										key={event}
										className="flex items-center justify-between rounded-lg border border-[color:var(--border)] bg-[color:var(--card-strong)] px-3 py-2">
										<span>{event}</span>
										<ArrowUpRight size={14} />
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="glass space-y-5 rounded-2xl border border-[color:var(--border)] p-6">
						<div className="pill inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-[color:var(--primary)]">
							<Sparkles size={14} /> Pricing
						</div>
						<h3 className="text-xl font-semibold">Premium, but free</h3>
						<p className="text-sm text-[color:var(--muted)]">
							DosSend charges for these. We keep them open: scheduling,
							analytics, device locks, custom domains, passcodes, revokes, and
							more.
						</p>
						<div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 text-center">
							<p className="text-5xl font-semibold">$0</p>
							<p className="text-sm text-[color:var(--muted)]">
								Every premium control included
							</p>
							<div className="mt-4 grid gap-2 text-sm text-left">
								{[
									"Unlimited transfers",
									"Custom domains",
									"Full analytics",
									"Device + passcode locks",
									"Scheduling and revoke",
								].map((item) => (
									<div key={item} className="flex items-center gap-2">
										<ArrowUpRight
											size={14}
											className="text-[color:var(--primary)]"
										/>
										<span>{item}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section
					id="roadmap"
					className="glass space-y-6 rounded-2xl border border-[color:var(--border)] p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-semibold">On deck</h3>
						<Link
							href="/changelog"
							className="text-sm text-[color:var(--primary)]">
							View changelog
						</Link>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						{[
							"Workspace roles",
							"Recipient notifications",
							"Webhook audit logs",
						].map((item) => (
							<div
								key={item}
								className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 text-sm">
								<p className="font-semibold">{item}</p>
								<p className="text-[color:var(--muted)]">
									Planned and shipping soon.
								</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
