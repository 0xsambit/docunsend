import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Log download and increment counter
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const transfer = await prisma.transfer.findUnique({
			where: { id },
		});

		if (!transfer) {
			return NextResponse.json(
				{ error: "Transfer not found" },
				{ status: 404 }
			);
		}

		// Check if downloads are allowed
		if (
			transfer.maxDownloads &&
			transfer.downloadCount >= transfer.maxDownloads
		) {
			return NextResponse.json(
				{ error: "Download limit reached" },
				{ status: 410 }
			);
		}

		// Get IP from headers
		const forwardedFor = request.headers.get("x-forwarded-for");
		const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
		const userAgent = request.headers.get("user-agent") || undefined;
		const country = request.headers.get("x-vercel-ip-country") || undefined;

		// Log download
		await prisma.accessLog.create({
			data: {
				transferId: id,
				event: "DOWNLOAD",
				ip,
				country,
				userAgent,
				allowed: true,
			},
		});

		// Increment download count
		await prisma.transfer.update({
			where: { id },
			data: {
				downloadCount: {
					increment: 1,
				},
			},
		});

		return NextResponse.json({
			success: true,
			storageKey: transfer.storageKey,
		});
	} catch (error) {
		console.error("Error logging download:", error);
		return NextResponse.json(
			{ error: "Failed to log download" },
			{ status: 500 }
		);
	}
}
