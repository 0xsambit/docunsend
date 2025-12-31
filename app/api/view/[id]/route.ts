import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Public endpoint to fetch transfer for viewing
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const transfer = await prisma.transfer.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				description: true,
				type: true,
				status: true,
				fileName: true,
				fileSize: true,
				expiresAt: true,
				passcodeHash: true,
				viewOnce: true,
				maxDownloads: true,
				downloadCount: true,
				allowReshare: true,
				createdAt: true,
				workspace: {
					select: {
						branding: true,
					},
				},
			},
		});

		if (!transfer) {
			return NextResponse.json(
				{ error: "Transfer not found" },
				{ status: 404 }
			);
		}

		// Check if expired
		if (transfer.expiresAt && new Date(transfer.expiresAt) < new Date()) {
			return NextResponse.json({ error: "Link has expired" }, { status: 410 });
		}

		// Check status
		if (transfer.status === "REVOKED") {
			return NextResponse.json(
				{ error: "Link has been revoked" },
				{ status: 410 }
			);
		}

		if (transfer.status === "EXPIRED") {
			return NextResponse.json({ error: "Link has expired" }, { status: 410 });
		}

		// Check download limits
		if (
			transfer.maxDownloads &&
			transfer.downloadCount >= transfer.maxDownloads
		) {
			return NextResponse.json(
				{ error: "Download limit reached" },
				{ status: 410 }
			);
		}

		return NextResponse.json({
			transfer: {
				id: transfer.id,
				title: transfer.title,
				description: transfer.description,
				type: transfer.type,
				fileName: transfer.fileName,
				fileSize: transfer.fileSize,
				requiresPasscode: !!transfer.passcodeHash,
				requiresEmail: !transfer.allowReshare,
				viewOnce: transfer.viewOnce,
				createdAt: transfer.createdAt,
				branding: transfer.workspace.branding,
			},
		});
	} catch (error) {
		console.error("Error fetching transfer for view:", error);
		return NextResponse.json(
			{ error: "Failed to fetch transfer" },
			{ status: 500 }
		);
	}
}

// POST - Verify access and log view
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { passcode, email } = body;

		const transfer = await prisma.transfer.findUnique({
			where: { id },
		});

		if (!transfer) {
			return NextResponse.json(
				{ error: "Transfer not found" },
				{ status: 404 }
			);
		}

		// Check expiry
		if (transfer.expiresAt && new Date(transfer.expiresAt) < new Date()) {
			await prisma.transfer.update({
				where: { id },
				data: { status: "EXPIRED" },
			});
			return NextResponse.json({ error: "Link has expired" }, { status: 410 });
		}

		if (transfer.status !== "ACTIVE") {
			return NextResponse.json(
				{ error: "Link is not active" },
				{ status: 410 }
			);
		}

		// Verify passcode if required
		if (transfer.passcodeHash) {
			if (!passcode) {
				return NextResponse.json(
					{ error: "Passcode required", requiresPasscode: true },
					{ status: 401 }
				);
			}

			const bcrypt = await import("bcryptjs");
			const valid = await bcrypt.compare(passcode, transfer.passcodeHash);

			if (!valid) {
				// Log blocked attempt
				await logAccess(request, id, null, "BLOCKED", false);
				return NextResponse.json(
					{ error: "Invalid passcode" },
					{ status: 401 }
				);
			}
		}

		// Require email if not allowing reshare
		if (!transfer.allowReshare && !email) {
			return NextResponse.json(
				{ error: "Email required", requiresEmail: true },
				{ status: 401 }
			);
		}

		// Create or find recipient
		let recipientId: string | null = null;
		if (email) {
			const recipient = await prisma.recipient.upsert({
				where: {
					id: `${id}-${email}`,
				},
				create: {
					id: `${id}-${email}`,
					transferId: id,
					channel: "LINK",
					address: email,
					status: "OPENED",
					openedAt: new Date(),
				},
				update: {
					status: "OPENED",
					openedAt: new Date(),
				},
			});
			recipientId = recipient.id;
		}

		// Log view
		await logAccess(request, id, recipientId, "VIEW", true);

		// If view-once, mark as completed
		if (transfer.viewOnce) {
			await prisma.transfer.update({
				where: { id },
				data: { status: "EXPIRED" },
			});
		}

		return NextResponse.json({
			success: true,
			storageKey: transfer.storageKey,
			linkTarget: transfer.linkTarget,
			type: transfer.type,
			fileName: transfer.fileName,
		});
	} catch (error) {
		console.error("Error verifying access:", error);
		return NextResponse.json(
			{ error: "Failed to verify access" },
			{ status: 500 }
		);
	}
}

async function logAccess(
	request: NextRequest,
	transferId: string,
	recipientId: string | null,
	event: "VIEW" | "DOWNLOAD" | "BLOCKED",
	allowed: boolean
) {
	// Get IP from headers
	const forwardedFor = request.headers.get("x-forwarded-for");
	const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
	const userAgent = request.headers.get("user-agent") || undefined;

	// Simple country detection from Vercel headers
	const country = request.headers.get("x-vercel-ip-country") || undefined;

	await prisma.accessLog.create({
		data: {
			transferId,
			recipientId,
			event,
			ip,
			country,
			userAgent,
			allowed,
		},
	});
}
