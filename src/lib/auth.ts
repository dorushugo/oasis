import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  return session;
}

export function unauthorizedResponse() {
  return Response.json(
    { error: "Non autorisé", code: 401 },
    { status: 401 }
  );
}
