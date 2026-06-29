import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth";

export async function GET() {
  try {
    const spots = await prisma.coolingSpot.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(spots);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  const { name, address, lat, lng, type, capacity, hours, description } = body;

  if (!name || !address || lat === undefined || lng === undefined || !type) {
    return Response.json(
      { error: "Champs obligatoires manquants: name, address, lat, lng, type", code: 400 },
      { status: 400 }
    );
  }

  try {
    const spot = await prisma.coolingSpot.create({
      data: {
        name,
        address,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        type,
        capacity: capacity ? parseInt(capacity) : null,
        hours: hours || null,
        description: description || null,
      },
    });
    return Response.json(spot, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: "Erreur lors de la création", code: 500, details: String(e) },
      { status: 500 }
    );
  }
}
