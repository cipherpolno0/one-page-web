import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./options";

export class UnauthenticatedError extends Error {
  constructor() {
    super("Authentication is required.");
    this.name = "UnauthenticatedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Administrator access is required.");
    this.name = "ForbiddenError";
  }
}

export const getCurrentSession = () => getServerSession(authOptions);

export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session?.user?.id) throw new UnauthenticatedError();
  if (session.user.role !== "ADMIN") throw new ForbiddenError();

  return session.user;
}
