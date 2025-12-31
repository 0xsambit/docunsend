import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get a single transfer
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const transfer = await prisma.transfer.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						accessLogs: true,
						recipients: true,
					},
				},
				accessLogs: {
					orderBy: { createdAt: "desc" },
					take: 50,
				},
			},
		});

		if (!transfer) {
			return NextResponse.json(
				{ error: "Transfer not found" },
				{ status: 404 }
			);
		}

		// Check ownership
		if (transfer.creatorId !== session.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		return NextResponse.json({ transfer });
	} catch (error) {
		console.error("Error fetching transfer:", error);
		return NextResponse.json(
			{ error: "Failed to fetch transfer" },
			{ status: 500 }
		);
	}
}

// PATCH - Update a transfer
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const transfer = await prisma.transfer.findUnique({
			where: { id },
		});

		if (!transfer) {
			return NextResponse.json(
				{ error: "Transfer not found" },
				{ status: 404 }
			);
		}

		if (transfer.creatorId !== session.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await request.json();
		const {
			title,
			description,
			status,
			expiresAt,
			maxDownloads,
			passcode,
			viewOnce,
		} = body;

		let passcodeHash = transfer.passcodeHash;
		if (passcode !== undefined) {
			if (passcode) {
				const bcrypt = await import("bcryptjs");
				passcodeHash = await bcrypt.hash(passcode, 10);
			} else {
				passcodeHash = null;
			}
		}

		const updated = await prisma.transfer.update({
			where: { id },
			data: {
				title: title ?? transfer.title,
				description: description ?? transfer.description,
				status: status ?? transfer.status,
				expiresAt: expiresAt ? new Date(expiresAt) : transfer.expiresAt,
				maxDownloads: maxDownloads ?? transfer.maxDownloads,
				passcodeHash,
				viewOnce: viewOnce ?? transfer.viewOnce,
				revokedAt: status === "REVOKED" ? new Date() : transfer.revokedAt,
			},
		});

		return NextResponse.json({ transfer: updated });
	} catch (error) {
		console.error("Error updating transfer:", error);
		return NextResponse.json(
			{ error: "Failed to update transfer" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a transfer
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const session = await getSession();

		if (!session?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const transfer = await prisma.transfer.findUnique({
			where: { id },
		});

		if (!transfer) {
			return NextResponse.json(
				{ error: "Transfer not found" },
				{ status: 404 }
			);
		}

		if (transfer.creatorId !== session.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Delete file from blob storage
		if (transfer.storageKey) {
			try {
				await del(transfer.storageKey);
			} catch (e) {
				console.error("Failed to delete blob:", e);
			}
		}

		await prisma.transfer.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting transfer:", error);
		return NextResponse.json(
			{ error: "Failed to delete transfer" },
			{ status: 500 }
		);
	}
}
