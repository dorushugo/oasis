import { prisma } from "@/lib/prisma";
import type { CoolingSpot, Notification, HelpRequest } from "@/generated/prisma";

export async function getOpenSpots(): Promise<CoolingSpot[]> {
  try {
    return await prisma.coolingSpot.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getAllSpots(): Promise<CoolingSpot[]> {
  try {
    return await prisma.coolingSpot.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getRecentNotifications(limit = 20): Promise<Notification[]> {
  try {
    return await prisma.notification.findMany({
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getCriticalAlert(): Promise<Notification | null> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await prisma.notification.findFirst({
      where: {
        severity: "critical",
        publishedAt: { gte: oneDayAgo },
      },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return null;
  }
}

export async function getPendingHelpRequests(): Promise<HelpRequest[]> {
  try {
    return await prisma.helpRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
