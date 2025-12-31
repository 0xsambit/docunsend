"use client";

import { useState, useRef, useCallback } from "react";
import {
	Upload,
	X,
	FileText,
	Link as LinkIcon,
	Lock,
	Calendar,
	Hash,
	Eye,
	Mail,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface UploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
	const [activeTab, setActiveTab] = useState<"file" | "link">("file");
	const [dragActive, setDragActive] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [linkTarget, setLinkTarget] = useState("");
	const [passcode, setPasscode] = useState("");
	const [expiresAt, setExpiresAt] = useState("");
	const [maxDownloads, setMaxDownloads] = useState("");
	const [requireEmail, setRequireEmail] = useState(false);
	const [viewOnce, setViewOnce] = useState(false);

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			setSelectedFile(e.dataTransfer.files[0]);
		}
	}, []);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("type", activeTab === "file" ? "FILE" : "LINK");
			formData.append("title", title);
			formData.append("description", description);

			if (activeTab === "file" && selectedFile) {
				formData.append("file", selectedFile);
			} else if (activeTab === "link") {
				formData.append("linkTarget", linkTarget);
			}

			if (passcode) formData.append("passcode", passcode);
			if (expiresAt) formData.append("expiresAt", expiresAt);
			if (maxDownloads) formData.append("maxDownloads", maxDownloads);
			formData.append("requireEmail", requireEmail.toString());
			formData.append("viewOnce", viewOnce.toString());

			const response = await fetch("/api/transfers", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			setShareUrl(data.shareUrl);
			onSuccess();
		} catch (error) {
			console.error("Upload error:", error);
			alert("Failed to create transfer");
		} finally {
			setIsUploading(false);
		}
	};

	const copyToClipboard = () => {
		if (shareUrl) {
			navigator.clipboard.writeText(shareUrl);
		}
	};

	const resetAndClose = () => {
		setSelectedFile(null);
		setShareUrl(null);
		setTitle("");
		setDescription("");
		setLinkTarget("");
		setPasscode("");
		setExpiresAt("");
		setMaxDownloads("");
		setRequireEmail(false);
		setViewOnce(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-surface-raised border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between p-6 border-b border-border">
					<h2 className="text-xl font-semibold">
						{shareUrl ? "Link Created!" : "New Transfer"}
					</h2>
					<button
						onClick={resetAndClose}
						className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>

				{shareUrl ? (
					<div className="p-6 space-y-4">
						<div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
							<p className="text-sm text-muted mb-2">Your shareable link:</p>
							<div className="flex items-center gap-2">
								<input
									type="text"
									readOnly
									value={shareUrl}
									className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm"
								/>
								<button
									onClick={copyToClipboard}
									className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
									Copy
								</button>
							</div>
						</div>
						<button
							onClick={resetAndClose}
							className="w-full py-3 bg-surface-hover rounded-lg hover:bg-border transition-colors">
							Done
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						{/* Tabs */}
						<div className="flex border-b border-border">
							<button
								type="button"
								onClick={() => setActiveTab("file")}
								className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
									activeTab === "file"
										? "text-accent border-b-2 border-accent"
										: "text-muted hover:text-foreground"
								}`}>
								<FileText className="w-4 h-4 inline mr-2" />
								Upload File
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("link")}
								className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
									activeTab === "link"
										? "text-accent border-b-2 border-accent"
										: "text-muted hover:text-foreground"
								}`}>
								<LinkIcon className="w-4 h-4 inline mr-2" />
								Share Link
							</button>
						</div>

						<div className="p-6 space-y-4">
							{/* File Upload */}
							{activeTab === "file" && (
								<div
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
									className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
										dragActive
											? "border-accent bg-accent/10"
											: "border-border hover:border-accent/50"
									}`}>
									{selectedFile ? (
										<div className="space-y-2">
											<FileText className="w-12 h-12 mx-auto text-accent" />
											<p className="font-medium">
												{selectedFile.name}
											</p>
											<p className="text-sm text-muted">
												{formatBytes(selectedFile.size)}
											</p>
											<button
												type="button"
												onClick={() => setSelectedFile(null)}
												className="text-sm text-red-400 hover:text-red-300">
												Remove
											</button>
										</div>
									) : (
										<div className="space-y-2">
											<Upload className="w-12 h-12 mx-auto text-muted" />
											<p className="text-muted">
												Drag & drop your file here, or{" "}
												<button
													type="button"
													onClick={() =>
														fileInputRef.current?.click()
													}
													className="text-accent hover:underline">
													browse
												</button>
											</p>
											<p className="text-xs text-muted">
												PDF, Word, Excel, Images up to 100MB
											</p>
										</div>
									)}
									<input
										ref={fileInputRef}
										type="file"
										onChange={handleFileSelect}
										className="hidden"
										accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
									/>
								</div>
							)}

							{/* Link Input */}
							{activeTab === "link" && (
								<div>
									<label className="block text-sm font-medium mb-2">
										URL to share
									</label>
									<input
										type="url"
										value={linkTarget}
										onChange={(e) => setLinkTarget(e.target.value)}
										placeholder="https://example.com/document"
										className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
										required={activeTab === "link"}
									/>
								</div>
							)}

							{/* Title */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Title
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="My Document"
									className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Description{" "}
									<span className="text-muted font-normal">
										(optional)
									</span>
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Add a note for recipients..."
									rows={2}
									className="w-full bg-surface border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
								/>
							</div>

							{/* Security Options */}
							<div className="border-t border-border pt-4">
								<p className="text-sm font-medium mb-3 flex items-center gap-2">
									<Lock className="w-4 h-4" />
									Security Options
								</p>

								<div className="space-y-3">
									{/* Passcode */}
									<div className="flex items-center gap-3">
										<Lock className="w-4 h-4 text-muted" />
										<input
											type="text"
											value={passcode}
											onChange={(e) => setPasscode(e.target.value)}
											placeholder="Set passcode (optional)"
											className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>

									{/* Expiry */}
									<div className="flex items-center gap-3">
										<Calendar className="w-4 h-4 text-muted" />
										<input
											type="datetime-local"
											value={expiresAt}
											onChange={(e) =>
												setExpiresAt(e.target.value)
											}
											className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>

									{/* Max Downloads */}
									<div className="flex items-center gap-3">
										<Hash className="w-4 h-4 text-muted" />
										<input
											type="number"
											value={maxDownloads}
											onChange={(e) =>
												setMaxDownloads(e.target.value)
											}
											placeholder="Max downloads (unlimited)"
											min="1"
											className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>

									{/* Toggles */}
									<div className="flex items-center justify-between">
										<label className="flex items-center gap-2 text-sm cursor-pointer">
											<Mail className="w-4 h-4 text-muted" />
											Require email to view
										</label>
										<button
											type="button"
											onClick={() =>
												setRequireEmail(!requireEmail)
											}
											className={`w-10 h-6 rounded-full transition-colors ${
												requireEmail ? "bg-accent" : "bg-border"
											}`}>
											<div
												className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
													requireEmail
														? "translate-x-5"
														: "translate-x-1"
												}`}
											/>
										</button>
									</div>

									<div className="flex items-center justify-between">
										<label className="flex items-center gap-2 text-sm cursor-pointer">
											<Eye className="w-4 h-4 text-muted" />
											View once (self-destruct)
										</label>
										<button
											type="button"
											onClick={() => setViewOnce(!viewOnce)}
											className={`w-10 h-6 rounded-full transition-colors ${
												viewOnce ? "bg-accent" : "bg-border"
											}`}>
											<div
												className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
													viewOnce
														? "translate-x-5"
														: "translate-x-1"
												}`}
											/>
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="p-6 border-t border-border">
							<button
								type="submit"
								disabled={
									isUploading ||
									(activeTab === "file" && !selectedFile) ||
									(activeTab === "link" && !linkTarget)
								}
								className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
								{isUploading ? (
									<span className="flex items-center justify-center gap-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Creating...
									</span>
								) : (
									"Create Transfer"
								)}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
