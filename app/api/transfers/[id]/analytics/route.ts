import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Type for AccessLog from Prisma
type AccessLog = {
	id: string;
	transferId: string;
	recipientId: string | null;
	event: "VIEW" | "DOWNLOAD" | "BLOCKED";
	ip: string | null;
	country: string | null;
	userAgent: string | null;
	allowed: boolean;
	createdAt: Date;
};

// GET - Get analytics for a transfer
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
				accessLogs: {
					orderBy: { createdAt: "desc" },
				},
				recipients: true,
			},
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

		// Aggregate analytics
		const totalViews = transfer.accessLogs.filter(
			(log: AccessLog) => log.event === "VIEW"
		).length;
		const totalDownloads = transfer.accessLogs.filter(
			(log: AccessLog) => log.event === "DOWNLOAD"
		).length;
		const blockedAttempts = transfer.accessLogs.filter(
			(log: AccessLog) => log.event === "BLOCKED"
		).length;

		// Unique viewers by IP
		const uniqueIPs = new Set(
			transfer.accessLogs.filter((log: AccessLog) => log.ip).map((log: AccessLog) => log.ip)
		);

		// Views by country
		const viewsByCountry: Record<string, number> = {};
		transfer.accessLogs.forEach((log: AccessLog) => {
			if (log.country) {
				viewsByCountry[log.country] = (viewsByCountry[log.country] || 0) + 1;
			}
		});

		// Recent activity (last 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		const recentLogs = transfer.accessLogs.filter(
			(log: AccessLog) => new Date(log.createdAt) > sevenDaysAgo
		);

		// Daily breakdown
		const dailyViews: Record<string, number> = {};
		recentLogs.forEach((log: AccessLog) => {
			const day = new Date(log.createdAt).toISOString().split("T")[0];
			dailyViews[day] = (dailyViews[day] || 0) + 1;
		});

		return NextResponse.json({
			transferId: id,
			summary: {
				totalViews,
				totalDownloads,
				blockedAttempts,
				uniqueViewers: uniqueIPs.size,
				downloadCount: transfer.downloadCount,
				maxDownloads: transfer.maxDownloads,
			},
			viewsByCountry,
			dailyViews,
			recentActivity: transfer.accessLogs.slice(0, 20).map((log: AccessLog) => ({
				id: log.id,
				event: log.event,
				ip: log.ip,
				country: log.country,
				userAgent: log.userAgent,
				createdAt: log.createdAt,
				allowed: log.allowed,
			})),
		});
	} catch (error) {
		console.error("Error fetching analytics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch analytics" },
			{ status: 500 }
		);
	}
}
