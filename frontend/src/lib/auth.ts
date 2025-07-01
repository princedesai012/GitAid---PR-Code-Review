import { authOptions } from "./authOptions";
import { getServerSession as _getServerSession } from "next-auth";

// Server-side session helper
export async function getServerSession() {
  return await _getServerSession(authOptions);
}

// Client-side auth exports
export { signIn, signOut } from "next-auth/react";