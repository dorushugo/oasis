import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
    return Response.json(notifications);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  const { title, message, target, severity } = body;

  if (!title || !message) {
    return Response.json(
      { error: "Champs obligatoires manquants: title, message", code: 400 },
      { status: 400 }
    );
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        target: target || "all",
        severity: severity || "info",
      },
    });
    return Response.json(notification, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: "Erreur lors de la création", code: 500, details: String(e) },
      { status: 500 }
    );
  }
}
