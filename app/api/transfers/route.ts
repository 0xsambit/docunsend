import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";

// GET - List all transfers for the current user
export async function GET(request: NextRequest) {
	try {
		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const transfers = await prisma.transfer.findMany({
			where: {
				creatorId: session.id,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				_count: {
					select: {
						accessLogs: true,
						recipients: true,
					},
				},
			},
		});

		return NextResponse.json({ transfers });
	} catch (error) {
		console.error("Error fetching transfers:", error);
		return NextResponse.json(
			{ error: "Failed to fetch transfers" },
			{ status: 500 }
		);
	}
}

// POST - Create a new transfer (with optional file upload)
export async function POST(request: NextRequest) {
	try {
		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const title = formData.get("title") as string;
		const description = formData.get("description") as string | null;
		const type = (formData.get("type") as "FILE" | "LINK") || "FILE";
		const linkTarget = formData.get("linkTarget") as string | null;
		const passcode = formData.get("passcode") as string | null;
		const expiresAt = formData.get("expiresAt") as string | null;
		const maxDownloads = formData.get("maxDownloads") as string | null;
		const requireEmail = formData.get("requireEmail") === "true";
		const viewOnce = formData.get("viewOnce") === "true";
		const allowDownload = formData.get("allowDownload") !== "false";

		// Get or create default workspace for user
		let workspace = await prisma.workspace.findFirst({
			where: {
				members: {
					some: {
						userId: session.id,
					},
				},
			},
		});

		if (!workspace) {
			// Create default workspace
			workspace = await prisma.workspace.create({
				data: {
					name: "My Workspace",
					slug: `ws-${nanoid(8)}`,
					members: {
						create: {
							userId: session.id,
							role: "OWNER",
						},
					},
				},
			});
		}

		let storageKey: string | null = null;
		let fileName: string | null = null;
		let fileSize: number | null = null;

		// Upload file if provided
		if (file && type === "FILE") {
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			const blob = await put(`transfers/${nanoid()}/${file.name}`, buffer, {
				access: "public",
				contentType: file.type,
			});

			storageKey = blob.url;
			fileName = file.name;
			fileSize = file.size;
		}

		// Hash passcode if provided
		let passcodeHash: string | null = null;
		if (passcode) {
			const bcrypt = await import("bcryptjs");
			passcodeHash = await bcrypt.hash(passcode, 10);
		}

		// Generate unique share slug
		const shareSlug = generateSlug(10);

		const transfer = await prisma.transfer.create({
			data: {
				id: shareSlug,
				workspaceId: workspace.id,
				creatorId: session.id,
				type,
				title: title || fileName || "Untitled Transfer",
				description,
				status: "ACTIVE",
				storageKey,
				storageProvider: storageKey ? "vercel-blob" : null,
				fileName,
				fileSize,
				linkTarget: type === "LINK" ? linkTarget : null,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
				maxDownloads: maxDownloads ? parseInt(maxDownloads) : null,
				passcodeHash,
				viewOnce,
				allowReshare: !requireEmail,
			},
		});

		return NextResponse.json({
			transfer,
			shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/view/${transfer.id}`,
		});
	} catch (error) {
		console.error("Error creating transfer:", error);
		return NextResponse.json(
			{ error: "Failed to create transfer" },
			{ status: 500 }
		);
	}
}
