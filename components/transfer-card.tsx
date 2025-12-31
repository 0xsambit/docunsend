"use client";

import { useState } from "react";
import Link from "next/link";
import {
	MoreVertical,
	Copy,
	Trash2,
	Eye,
	Download,
	ExternalLink,
	Lock,
	Clock,
	FileText,
	Link as LinkIcon,
	BarChart3,
	XCircle,
} from "lucide-react";
import { formatBytes, formatRelativeTime } from "@/lib/utils";

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

interface TransferCardProps {
	transfer: Transfer;
	onDelete: (id: string) => void;
	onRevoke: (id: string) => void;
}

export function TransferCard({ transfer, onDelete, onRevoke }: TransferCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const shareUrl = `${window.location.origin}/view/${transfer.id}`;

	const copyLink = async () => {
		await navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const statusColors = {
		DRAFT: "bg-yellow-500/20 text-yellow-400",
		ACTIVE: "bg-green-500/20 text-green-400",
		EXPIRED: "bg-red-500/20 text-red-400",
		REVOKED: "bg-gray-500/20 text-gray-400",
	};

	return (
		<div className="bg-surface-raised border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-3 min-w-0">
					<div className="p-2 bg-accent/10 rounded-lg shrink-0">
						{transfer.type === "FILE" ? (
							<FileText className="w-5 h-5 text-accent" />
						) : (
							<LinkIcon className="w-5 h-5 text-accent" />
						)}
					</div>
					<div className="min-w-0">
						<h3 className="font-medium truncate">{transfer.title}</h3>
						{transfer.description && (
							<p className="text-sm text-muted truncate">
								{transfer.description}
							</p>
						)}
						<div className="flex items-center gap-3 mt-2 text-xs text-muted">
							{transfer.fileName && (
								<span className="flex items-center gap-1">
									<FileText className="w-3 h-3" />
									{formatBytes(transfer.fileSize || 0)}
								</span>
							)}
							<span className="flex items-center gap-1">
								<Eye className="w-3 h-3" />
								{transfer._count.accessLogs} views
							</span>
							<span className="flex items-center gap-1">
								<Download className="w-3 h-3" />
								{transfer.downloadCount}
								{transfer.maxDownloads && `/${transfer.maxDownloads}`}
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{/* Status Badge */}
					<span
						className={`px-2 py-0.5 rounded-full text-xs font-medium ${
							statusColors[transfer.status]
						}`}>
						{transfer.status}
					</span>

					{/* Security Indicators */}
					{transfer.passcodeHash && (
						<span title="Password protected">
							<Lock className="w-4 h-4 text-muted" />
						</span>
					)}
					{transfer.expiresAt && (
						<span title={`Expires ${formatRelativeTime(transfer.expiresAt)}`}>
							<Clock className="w-4 h-4 text-muted" />
						</span>
					)}

					{/* Actions Menu */}
					<div className="relative">
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
							<MoreVertical className="w-4 h-4" />
						</button>

						{menuOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={() => setMenuOpen(false)}
								/>
								<div className="absolute right-0 top-10 bg-surface-raised border border-border rounded-lg shadow-xl z-50 py-1 min-w-40">
									<button
										onClick={() => {
											copyLink();
											setMenuOpen(false);
										}}
										className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2">
										<Copy className="w-4 h-4" />
										{copied ? "Copied!" : "Copy link"}
									</button>
									<Link
										href={`/view/${transfer.id}`}
										target="_blank"
										className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2">
										<ExternalLink className="w-4 h-4" />
										Open link
									</Link>
									<Link
										href={`/dashboard/transfers/${transfer.id}`}
										className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2">
										<BarChart3 className="w-4 h-4" />
										Analytics
									</Link>
									<hr className="my-1 border-border" />
									{transfer.status === "ACTIVE" && (
										<button
											onClick={() => {
												onRevoke(transfer.id);
												setMenuOpen(false);
											}}
											className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2 text-yellow-400">
											<XCircle className="w-4 h-4" />
											Revoke
										</button>
									)}
									<button
										onClick={() => {
											onDelete(transfer.id);
											setMenuOpen(false);
										}}
										className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2 text-red-400">
										<Trash2 className="w-4 h-4" />
										Delete
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Created time */}
			<p className="text-xs text-muted mt-3">
				Created {formatRelativeTime(transfer.createdAt)}
			</p>
		</div>
	);
}
