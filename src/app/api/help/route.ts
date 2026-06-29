import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  try {
    const helpRequests = await prisma.helpRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(helpRequests);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, lat, lng } = body;

  try {
    const helpRequest = await prisma.helpRequest.create({
      data: {
        message: message || null,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      },
    });
    return Response.json(helpRequest, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: "Erreur lors de la création", code: 500, details: String(e) },
      { status: 500 }
    );
  }
}
