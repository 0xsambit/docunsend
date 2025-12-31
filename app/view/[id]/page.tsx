"use client";

import { useState, useEffect, use } from "react";
import {
	FileText,
	Lock,
	Mail,
	Download,
	ExternalLink,
	AlertCircle,
	Eye,
	Shield,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface TransferData {
	id: string;
	title: string;
	description: string | null;
	type: "FILE" | "LINK";
	fileName: string | null;
	fileSize: number | null;
	requiresPasscode: boolean;
	requiresEmail: boolean;
	viewOnce: boolean;
	createdAt: string;
	branding: {
		primaryColor: string;
		accentColor: string;
		background: string;
		logoUrl: string | null;
	} | null;
}

interface AccessData {
	storageKey: string | null;
	linkTarget: string | null;
	type: "FILE" | "LINK";
	fileName: string | null;
}

export default function ViewPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const [transfer, setTransfer] = useState<TransferData | null>(null);
	const [accessData, setAccessData] = useState<AccessData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [passcode, setPasscode] = useState("");
	const [email, setEmail] = useState("");
	const [verifying, setVerifying] = useState(false);
	const [step, setStep] = useState<"loading" | "gate" | "view" | "error">("loading");

	useEffect(() => {
		fetchTransfer();
	}, [id]);

	const fetchTransfer = async () => {
		try {
			const response = await fetch(`/api/view/${id}`);
			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to load transfer");
				setStep("error");
				return;
			}

			setTransfer(data.transfer);

			// Check if we need to show gate
			if (data.transfer.requiresPasscode || data.transfer.requiresEmail) {
				setStep("gate");
			} else {
				// No gate required, verify access immediately
				await verifyAccess("", "");
			}
		} catch (err) {
			setError("Failed to load transfer");
			setStep("error");
		} finally {
			setLoading(false);
		}
	};

	const verifyAccess = async (code: string, userEmail: string) => {
		setVerifying(true);
		try {
			const response = await fetch(`/api/view/${id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					passcode: code,
					email: userEmail,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.requiresPasscode) {
					setError("Invalid passcode");
				} else if (data.requiresEmail) {
					setError("Email is required");
				} else {
					setError(data.error || "Access denied");
				}
				return;
			}

			setAccessData(data);
			setStep("view");
			setError(null);
		} catch (err) {
			setError("Failed to verify access");
		} finally {
			setVerifying(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		verifyAccess(passcode, email);
	};

	const handleDownload = async () => {
		if (!accessData?.storageKey) return;

		try {
			// Log download
			await fetch(`/api/view/${id}/download`, { method: "POST" });

			// Open download
			window.open(accessData.storageKey, "_blank");
		} catch (err) {
			console.error("Download failed:", err);
		}
	};

	// Custom branding styles
	const brandingStyles = transfer?.branding
		? {
				"--brand-primary": transfer.branding.primaryColor,
				"--brand-accent": transfer.branding.accentColor,
		  }
		: {};

	if (step === "loading" || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-surface">
				<div className="text-center">
					<div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted">Loading...</p>
				</div>
			</div>
		);
	}

	if (step === "error") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-surface p-4">
				<div className="max-w-md w-full text-center">
					<div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
						<AlertCircle className="w-8 h-8 text-red-400" />
					</div>
					<h1 className="text-2xl font-bold mb-2">Link Unavailable</h1>
					<p className="text-muted mb-6">{error}</p>
					<a
						href="/"
						className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
						Go to Homepage
					</a>
				</div>
			</div>
		);
	}

	if (step === "gate" && transfer) {
		return (
			<div
				className="min-h-screen flex items-center justify-center bg-surface p-4"
				style={brandingStyles as React.CSSProperties}>
				<div className="max-w-md w-full">
					<div className="bg-surface-raised border border-border rounded-2xl p-8">
						{/* Logo/Icon */}
						<div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
							<Shield className="w-8 h-8 text-accent" />
						</div>

						<h1 className="text-2xl font-bold text-center mb-2">
							{transfer.title}
						</h1>

						{transfer.description && (
							<p className="text-muted text-center mb-6">
								{transfer.description}
							</p>
						)}

						{/* File info */}
						<div className="flex items-center justify-center gap-4 mb-6 text-sm text-muted">
							{transfer.type === "FILE" ? (
								<>
									<FileText className="w-4 h-4" />
									<span>{transfer.fileName}</span>
									{transfer.fileSize && (
										<span>• {formatBytes(transfer.fileSize)}</span>
									)}
								</>
							) : (
								<>
									<ExternalLink className="w-4 h-4" />
									<span>Protected Link</span>
								</>
							)}
						</div>

						{/* Security badges */}
						<div className="flex items-center justify-center gap-2 mb-6">
							{transfer.requiresPasscode && (
								<span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs">
									<Lock className="w-3 h-3" />
									Passcode Protected
								</span>
							)}
							{transfer.viewOnce && (
								<span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
									<Eye className="w-3 h-3" />
									View Once
								</span>
							)}
						</div>

						{error && (
							<div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{transfer.requiresEmail && (
								<div>
									<label className="block text-sm font-medium mb-2">
										<Mail className="w-4 h-4 inline mr-2" />
										Your Email
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="you@example.com"
										required
										className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
									/>
									<p className="text-xs text-muted mt-1">
										Required to access this content
									</p>
								</div>
							)}

							{transfer.requiresPasscode && (
								<div>
									<label className="block text-sm font-medium mb-2">
										<Lock className="w-4 h-4 inline mr-2" />
										Passcode
									</label>
									<input
										type="password"
										value={passcode}
										onChange={(e) => setPasscode(e.target.value)}
										placeholder="Enter passcode"
										required
										className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
									/>
								</div>
							)}

							<button
								type="submit"
								disabled={verifying}
								className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors">
								{verifying ? (
									<span className="flex items-center justify-center gap-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Verifying...
									</span>
								) : (
									"Access Content"
								)}
							</button>
						</form>
					</div>

					<p className="text-center text-xs text-muted mt-6">Secured by Docunsend</p>
				</div>
			</div>
		);
	}

	// View step - show content
	return (
		<div className="min-h-screen bg-surface" style={brandingStyles as React.CSSProperties}>
			{/* Header */}
			<header className="sticky top-0 z-40 bg-surface-raised border-b border-border">
				<div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-accent/10 rounded-lg">
							{transfer?.type === "FILE" ? (
								<FileText className="w-5 h-5 text-accent" />
							) : (
								<ExternalLink className="w-5 h-5 text-accent" />
							)}
						</div>
						<div>
							<h1 className="font-semibold">{transfer?.title}</h1>
							{transfer?.fileName && (
								<p className="text-xs text-muted">
									{transfer.fileName}
									{transfer.fileSize &&
										` • ${formatBytes(transfer.fileSize)}`}
								</p>
							)}
						</div>
					</div>

					{accessData?.type === "FILE" && accessData.storageKey && (
						<button
							onClick={handleDownload}
							className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
							<Download className="w-4 h-4" />
							Download
						</button>
					)}

					{accessData?.type === "LINK" && accessData.linkTarget && (
						<a
							href={accessData.linkTarget}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
							<ExternalLink className="w-4 h-4" />
							Open Link
						</a>
					)}
				</div>
			</header>

			{/* Content */}
			<main className="max-w-4xl mx-auto px-4 py-8">
				{transfer?.description && (
					<div className="bg-surface-raised border border-border rounded-xl p-6 mb-6">
						<p className="text-muted">{transfer.description}</p>
					</div>
				)}

				{accessData?.type === "FILE" && accessData.storageKey && (
					<div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
						{/* PDF Viewer */}
						{transfer?.fileName?.toLowerCase().endsWith(".pdf") ? (
							<iframe
								src={`${accessData.storageKey}#toolbar=0`}
								className="w-full h-[80vh]"
								title={transfer.title}
							/>
						) : /* Image Viewer */ transfer?.fileName?.match(
								/\.(jpg|jpeg|png|gif|webp)$/i
						  ) ? (
							<img
								src={accessData.storageKey}
								alt={transfer.title}
								className="w-full h-auto"
							/>
						) : (
							/* Generic file preview */
							<div className="p-12 text-center">
								<FileText className="w-16 h-16 mx-auto text-muted mb-4" />
								<h2 className="text-xl font-semibold mb-2">
									{transfer?.fileName}
								</h2>
								<p className="text-muted mb-6">
									This file type cannot be previewed in the browser.
								</p>
								<button
									onClick={handleDownload}
									className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
									<Download className="w-5 h-5" />
									Download File
								</button>
							</div>
						)}
					</div>
				)}

				{accessData?.type === "LINK" && (
					<div className="bg-surface-raised border border-border rounded-xl p-12 text-center">
						<ExternalLink className="w-16 h-16 mx-auto text-accent mb-4" />
						<h2 className="text-xl font-semibold mb-2">Protected Link</h2>
						<p className="text-muted mb-6">
							Click the button below to access the content
						</p>
						<a
							href={accessData.linkTarget || "#"}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
							<ExternalLink className="w-5 h-5" />
							Open Link
						</a>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="text-center py-8 text-xs text-muted">Secured by Docunsend</footer>
		</div>
	);
}
