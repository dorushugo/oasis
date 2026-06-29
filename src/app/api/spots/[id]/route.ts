import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/spots/[id]">
) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const { id } = await ctx.params;
  const body = await request.json();

  try {
    const existing = await prisma.coolingSpot.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Lieu non trouvé", code: 404 }, { status: 404 });
    }

    const spot = await prisma.coolingSpot.update({ where: { id }, data: body });
    return Response.json(spot);
  } catch {
    return Response.json({ error: "Erreur serveur", code: 500 }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/spots/[id]">
) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const { id } = await ctx.params;

  try {
    const existing = await prisma.coolingSpot.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Lieu non trouvé", code: 404 }, { status: 404 });
    }

    await prisma.coolingSpot.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Erreur serveur", code: 500 }, { status: 500 });
  }
}
