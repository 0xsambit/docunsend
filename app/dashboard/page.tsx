import { auth } from "@/lib/auth";
import { ArrowUpRight, Lock, ShieldCheck, Upload, Gauge, Globe2 } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
	const session = await auth();

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
						Dashboard
					</p>
					<h1 className="text-3xl font-semibold text-[color:var(--fg)]">
						Welcome{session?.user?.id ? ", you’re authenticated" : ""}
					</h1>
					<p className="text-sm text-[color:var(--muted)]">
						Build, schedule, and monitor transfers. All premium controls are
						available for every account.
					</p>
				</div>
				<Link
					href="/api/auth/signout"
					className="pill inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
					Sign out
					<ArrowUpRight size={16} />
				</Link>
			</header>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{["Create transfer", "Schedule drop", "Add custom domain"].map(
					(action, idx) => (
						<div
							key={action}
							className="glass flex items-center justify-between rounded-xl border border-[color:var(--border)] px-4 py-4 text-sm font-semibold text-[color:var(--fg)]">
							<span>{action}</span>
							<ArrowUpRight size={16} />
						</div>
					)
				)}
			</div>

			<section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
				<div className="glass space-y-4 rounded-2xl border border-[color:var(--border)] p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
								Transfers
							</p>
							<h2 className="text-xl font-semibold text-[color:var(--fg)]">
								Ready for implementation
							</h2>
						</div>
						<Upload size={18} />
					</div>
					<p className="text-sm text-[color:var(--muted)]">
						Next steps: build upload/link creation, expiry + passcode controls,
						device locks, and recipient delivery. These cards will list recent
						transfers once APIs land.
					</p>
					<div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 text-sm text-[color:var(--muted)]">
						No transfers yet.
					</div>
				</div>

				<div className="glass space-y-4 rounded-2xl border border-[color:var(--border)] p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-[color:var(--fg)]">
							Security controls
						</h3>
						<Lock size={18} />
					</div>
					<div className="space-y-3 text-sm">
						{[
							"Passcodes + view-once",
							"Device fingerprint allow/deny",
							"Geo/IP insights + throttling",
							"Instant revoke",
						].map((item) => (
							<div
								key={item}
								className="flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-[color:var(--fg)]">
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

			<section className="grid gap-5 lg:grid-cols-3">
				<div className="glass space-y-3 rounded-2xl border border-[color:var(--border)] p-6">
					<div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
						<span>Usage</span>
						<Gauge size={16} />
					</div>
					<p className="text-3xl font-semibold text-[color:var(--fg)]">∞</p>
					<p className="text-sm text-[color:var(--muted)]">
						Unlimited transfers and analytics.
					</p>
				</div>
				<div className="glass space-y-3 rounded-2xl border border-[color:var(--border)] p-6">
					<div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
						<span>Custom domain</span>
						<Globe2 size={16} />
					</div>
					<p className="text-lg font-semibold text-[color:var(--fg)]">
						Add your hostname
					</p>
					<p className="text-sm text-[color:var(--muted)]">
						UI stub — wire to domain model and verification flow.
					</p>
				</div>
				<div className="glass space-y-3 rounded-2xl border border-[color:var(--border)] p-6">
					<div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
						<span>Next steps</span>
						<ShieldCheck size={16} />
					</div>
					<p className="text-sm text-[color:var(--muted)]">
						Implement uploads (Vercel Blob or S3), recipient delivery, analytics
						logging, and revoke endpoints.
					</p>
				</div>
			</section>
		</main>
	);
}
