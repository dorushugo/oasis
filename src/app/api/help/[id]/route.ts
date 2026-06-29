import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/help/[id]">
) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const { id } = await ctx.params;
  const body = await request.json();

  try {
    const existing = await prisma.helpRequest.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Signalement non trouvé", code: 404 }, { status: 404 });
    }

    const helpRequest = await prisma.helpRequest.update({
      where: { id },
      data: { status: body.status || "handled" },
    });
    return Response.json(helpRequest);
  } catch {
    return Response.json({ error: "Erreur serveur", code: 500 }, { status: 500 });
  }
}
