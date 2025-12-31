"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	ArrowLeft,
	Eye,
	Download,
	XCircle,
	Globe,
	Monitor,
	Clock,
	TrendingUp,
	Copy,
	ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/providers/session-provider";
import { formatRelativeTime, formatBytes } from "@/lib/utils";

interface Analytics {
	transferId: string;
	summary: {
		totalViews: number;
		totalDownloads: number;
		blockedAttempts: number;
		uniqueViewers: number;
		downloadCount: number;
		maxDownloads: number | null;
	};
	viewsByCountry: Record<string, number>;
	dailyViews: Record<string, number>;
	recentActivity: Array<{
		id: string;
		event: "VIEW" | "DOWNLOAD" | "BLOCKED";
		ip: string | null;
		country: string | null;
		userAgent: string | null;
		createdAt: string;
		allowed: boolean;
	}>;
}

interface Transfer {
	id: string;
	title: string;
	fileName: string | null;
	fileSize: number | null;
	status: string;
	createdAt: string;
}

export default function TransferAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { session, loading: authLoading } = useAuth();
	const router = useRouter();
	const [analytics, setAnalytics] = useState<Analytics | null>(null);
	const [transfer, setTransfer] = useState<Transfer | null>(null);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!authLoading && !session) {
			router.push("/");
		}
	}, [session, authLoading, router]);

	useEffect(() => {
		if (session && id) {
			fetchData();
		}
	}, [session, id]);

	const fetchData = async () => {
		try {
			const [analyticsRes, transferRes] = await Promise.all([
				fetch(`/api/transfers/${id}/analytics`),
				fetch(`/api/transfers/${id}`),
			]);

			if (analyticsRes.ok && transferRes.ok) {
				const analyticsData = await analyticsRes.json();
				const transferData = await transferRes.json();
				setAnalytics(analyticsData);
				setTransfer(transferData.transfer);
			}
		} catch (error) {
			console.error("Failed to fetch analytics:", error);
		} finally {
			setLoading(false);
		}
	};

	const copyLink = async () => {
		const url = `${window.location.origin}/view/${id}`;
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const eventColors = {
		VIEW: "text-blue-400 bg-blue-400/10",
		DOWNLOAD: "text-green-400 bg-green-400/10",
		BLOCKED: "text-red-400 bg-red-400/10",
	};

	const eventIcons = {
		VIEW: <Eye className="w-4 h-4" />,
		DOWNLOAD: <Download className="w-4 h-4" />,
		BLOCKED: <XCircle className="w-4 h-4" />,
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!analytics || !transfer) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-muted">Transfer not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-surface">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-surface-raised border-b border-border">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link
								href="/dashboard"
								className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
								<ArrowLeft className="w-5 h-5" />
							</Link>
							<div>
								<h1 className="font-semibold">{transfer.title}</h1>
								{transfer.fileName && (
									<p className="text-sm text-muted">
										{transfer.fileName}
										{transfer.fileSize &&
											` • ${formatBytes(transfer.fileSize)}`}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={copyLink}
								className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-hover rounded-lg hover:bg-border transition-colors">
								<Copy className="w-4 h-4" />
								{copied ? "Copied!" : "Copy Link"}
							</button>
							<Link
								href={`/view/${id}`}
								target="_blank"
								className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
								<ExternalLink className="w-4 h-4" />
								Open
							</Link>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<div className="bg-surface-raised border border-border rounded-xl p-4">
						<div className="flex items-center gap-2 text-muted mb-2">
							<Eye className="w-4 h-4" />
							<span className="text-sm">Total Views</span>
						</div>
						<p className="text-3xl font-bold">{analytics.summary.totalViews}</p>
					</div>
					<div className="bg-surface-raised border border-border rounded-xl p-4">
						<div className="flex items-center gap-2 text-muted mb-2">
							<Download className="w-4 h-4" />
							<span className="text-sm">Downloads</span>
						</div>
						<p className="text-3xl font-bold">
							{analytics.summary.totalDownloads}
							{analytics.summary.maxDownloads && (
								<span className="text-lg text-muted">
									/{analytics.summary.maxDownloads}
								</span>
							)}
						</p>
					</div>
					<div className="bg-surface-raised border border-border rounded-xl p-4">
						<div className="flex items-center gap-2 text-muted mb-2">
							<TrendingUp className="w-4 h-4" />
							<span className="text-sm">Unique Viewers</span>
						</div>
						<p className="text-3xl font-bold">
							{analytics.summary.uniqueViewers}
						</p>
					</div>
					<div className="bg-surface-raised border border-border rounded-xl p-4">
						<div className="flex items-center gap-2 text-muted mb-2">
							<XCircle className="w-4 h-4" />
							<span className="text-sm">Blocked</span>
						</div>
						<p className="text-3xl font-bold text-red-400">
							{analytics.summary.blockedAttempts}
						</p>
					</div>
				</div>

				<div className="grid lg:grid-cols-[2fr_1fr] gap-6">
					{/* Recent Activity */}
					<div className="bg-surface-raised border border-border rounded-xl">
						<div className="px-6 py-4 border-b border-border">
							<h2 className="font-semibold">Recent Activity</h2>
						</div>
						{analytics.recentActivity.length === 0 ? (
							<div className="p-8 text-center text-muted">
								<Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<p>No activity yet</p>
							</div>
						) : (
							<div className="divide-y divide-border">
								{analytics.recentActivity.map((activity) => (
									<div
										key={activity.id}
										className="px-6 py-4 flex items-center gap-4">
										<div
											className={`p-2 rounded-lg ${
												eventColors[activity.event]
											}`}>
											{eventIcons[activity.event]}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<span className="font-medium capitalize">
													{activity.event.toLowerCase()}
												</span>
												{activity.country && (
													<span className="text-sm text-muted flex items-center gap-1">
														<Globe className="w-3 h-3" />
														{activity.country}
													</span>
												)}
											</div>
											{activity.userAgent && (
												<p className="text-xs text-muted truncate flex items-center gap-1">
													<Monitor className="w-3 h-3" />
													{activity.userAgent.slice(0, 50)}
													...
												</p>
											)}
										</div>
										<div className="text-sm text-muted flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{formatRelativeTime(activity.createdAt)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Views by Country */}
					<div className="bg-surface-raised border border-border rounded-xl">
						<div className="px-6 py-4 border-b border-border">
							<h2 className="font-semibold">Views by Country</h2>
						</div>
						{Object.keys(analytics.viewsByCountry).length === 0 ? (
							<div className="p-8 text-center text-muted">
								<Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<p>No geographic data</p>
							</div>
						) : (
							<div className="p-4 space-y-3">
								{Object.entries(analytics.viewsByCountry)
									.sort(([, a], [, b]) => b - a)
									.slice(0, 10)
									.map(([country, count]) => (
										<div
											key={country}
											className="flex items-center justify-between">
											<span className="flex items-center gap-2">
												<Globe className="w-4 h-4 text-muted" />
												{country}
											</span>
											<span className="font-medium">{count}</span>
										</div>
									))}
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
