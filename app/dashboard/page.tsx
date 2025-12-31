"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Plus,
	Search,
	FileText,
	Link as LinkIcon,
	BarChart3,
	Settings,
	LogOut,
	Menu,
	X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UploadModal } from "@/components/upload-modal";
import { TransferCard } from "@/components/transfer-card";
import { useAuth } from "@/components/providers/session-provider";

interface Transfer {
	id: string;
	type: "FILE" | "LINK";
	title: string;
	description: string | null;
	status: "DRAFT" | "ACTIVE" | "EXPIRED" | "REVOKED";
	fileName: string | null;
	fileSize: number | null;
	linkTarget: string | null;
	expiresAt: string | null;
	maxDownloads: number | null;
	downloadCount: number;
	passcodeHash: string | null;
	viewOnce: boolean;
	createdAt: string;
	_count: {
		accessLogs: number;
		recipients: number;
	};
}

export default function DashboardPage() {
	const { session, loading } = useAuth();
	const router = useRouter();
	const [transfers, setTransfers] = useState<Transfer[]>([]);
	const [loadingTransfers, setLoadingTransfers] = useState(true);
	const [uploadModalOpen, setUploadModalOpen] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	useEffect(() => {
		if (!loading && !session) {
			router.push("/");
		}
	}, [session, loading, router]);

	useEffect(() => {
		if (session) {
			fetchTransfers();
		}
	}, [session]);

	const fetchTransfers = async () => {
		try {
			const response = await fetch("/api/transfers");
			if (response.ok) {
				const data = await response.json();
				setTransfers(data.transfers);
			}
		} catch (error) {
			console.error("Failed to fetch transfers:", error);
		} finally {
			setLoadingTransfers(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this transfer?")) return;

		try {
			const response = await fetch(`/api/transfers/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				setTransfers((prev) => prev.filter((t) => t.id !== id));
			}
		} catch (error) {
			console.error("Failed to delete transfer:", error);
		}
	};

	const handleRevoke = async (id: string) => {
		try {
			const response = await fetch(`/api/transfers/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "REVOKED" }),
			});
			if (response.ok) {
				setTransfers((prev) =>
					prev.map((t) => (t.id === id ? { ...t, status: "REVOKED" } : t))
				);
			}
		} catch (error) {
			console.error("Failed to revoke transfer:", error);
		}
	};

	const handleSignOut = async () => {
		await fetch("/api/auth/signout", { method: "POST" });
		router.push("/");
	};

	const filteredTransfers = transfers.filter((t) => {
		const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || t.status === statusFilter.toUpperCase();
		return matchesSearch && matchesStatus;
	});

	const stats = {
		total: transfers.length,
		active: transfers.filter((t) => t.status === "ACTIVE").length,
		totalViews: transfers.reduce((sum, t) => sum + t._count.accessLogs, 0),
		totalDownloads: transfers.reduce((sum, t) => sum + t.downloadCount, 0),
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-surface">
			{/* Mobile Header */}
			<header className="lg:hidden sticky top-0 z-40 bg-surface-raised border-b border-border px-4 py-3">
				<div className="flex items-center justify-between">
					<button
						onClick={() => setSidebarOpen(true)}
						className="p-2 hover:bg-surface-hover rounded-lg">
						<Menu className="w-5 h-5" />
					</button>
					<Link href="/dashboard" className="font-bold text-lg">
						Docunsend
					</Link>
					<ThemeToggle />
				</div>
			</header>

			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-raised border-r border-border transform transition-transform lg:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center justify-between px-6 py-5 border-b border-border">
						<Link href="/dashboard" className="font-bold text-xl">
							Docunsend
						</Link>
						<button
							onClick={() => setSidebarOpen(false)}
							className="lg:hidden p-1 hover:bg-surface-hover rounded">
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-1">
						<Link
							href="/dashboard"
							className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-accent/10 text-accent font-medium">
							<FileText className="w-5 h-5" />
							Transfers
						</Link>
						<Link
							href="/dashboard/analytics"
							className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted hover:bg-surface-hover hover:text-foreground transition-colors">
							<BarChart3 className="w-5 h-5" />
							Analytics
						</Link>
						<Link
							href="/dashboard/settings"
							className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted hover:bg-surface-hover hover:text-foreground transition-colors">
							<Settings className="w-5 h-5" />
							Settings
						</Link>
					</nav>

					{/* User */}
					<div className="px-4 py-4 border-t border-border">
						<div className="flex items-center gap-3 mb-4">
							{session?.user?.image ? (
								<img
									src={session.user.image}
									alt=""
									className="w-10 h-10 rounded-full"
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
									<span className="text-accent font-medium">
										{session?.user?.email?.charAt(0).toUpperCase()}
									</span>
								</div>
							)}
							<div className="flex-1 min-w-0">
								<p className="font-medium truncate">
									{session?.user?.name || "User"}
								</p>
								<p className="text-xs text-muted truncate">
									{session?.user?.email}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<ThemeToggle />
							<button
								onClick={handleSignOut}
								className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors">
								<LogOut className="w-4 h-4" />
								Sign out
							</button>
						</div>
					</div>
				</div>
			</aside>

			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Main Content */}
			<main className="lg:ml-64">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Stats */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<div className="bg-surface-raised border border-border rounded-xl p-4">
							<p className="text-sm text-muted">Total Transfers</p>
							<p className="text-2xl font-bold mt-1">{stats.total}</p>
						</div>
						<div className="bg-surface-raised border border-border rounded-xl p-4">
							<p className="text-sm text-muted">Active</p>
							<p className="text-2xl font-bold mt-1 text-green-400">
								{stats.active}
							</p>
						</div>
						<div className="bg-surface-raised border border-border rounded-xl p-4">
							<p className="text-sm text-muted">Total Views</p>
							<p className="text-2xl font-bold mt-1 text-accent">
								{stats.totalViews}
							</p>
						</div>
						<div className="bg-surface-raised border border-border rounded-xl p-4">
							<p className="text-sm text-muted">Downloads</p>
							<p className="text-2xl font-bold mt-1">{stats.totalDownloads}</p>
						</div>
					</div>

					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
						<h1 className="text-2xl font-bold">Transfers</h1>
						<button
							onClick={() => setUploadModalOpen(true)}
							className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors">
							<Plus className="w-5 h-5" />
							New Transfer
						</button>
					</div>

					{/* Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
							<input
								type="text"
								placeholder="Search transfers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
							/>
						</div>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="px-4 py-2.5 bg-surface-raised border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="expired">Expired</option>
							<option value="revoked">Revoked</option>
						</select>
					</div>

					{/* Transfers List */}
					{loadingTransfers ? (
						<div className="flex items-center justify-center py-12">
							<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
						</div>
					) : filteredTransfers.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="w-12 h-12 mx-auto text-muted mb-4" />
							<h3 className="text-lg font-medium mb-2">No transfers yet</h3>
							<p className="text-muted mb-6">
								Create your first secure transfer to get started
							</p>
							<button
								onClick={() => setUploadModalOpen(true)}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors">
								<Plus className="w-5 h-5" />
								New Transfer
							</button>
						</div>
					) : (
						<div className="space-y-3">
							{filteredTransfers.map((transfer) => (
								<TransferCard
									key={transfer.id}
									transfer={transfer}
									onDelete={handleDelete}
									onRevoke={handleRevoke}
								/>
							))}
						</div>
					)}
				</div>
			</main>

			{/* Upload Modal */}
			<UploadModal
				isOpen={uploadModalOpen}
				onClose={() => setUploadModalOpen(false)}
				onSuccess={fetchTransfers}
			/>
		</div>
	);
}
