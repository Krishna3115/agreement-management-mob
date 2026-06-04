// Decodes the JWT payload to read roles without a backend call.
// The token is NOT trusted for security (backend enforces that) —
// this is only for choosing which screens to show.

export function getRolesFromToken(): string[] {
  const token = localStorage.getItem("jwt_token");
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Our backend sets subject=username, but if you add roles to the token
    // claims later, read them here. For now we expose a helper that the
    // app can also override by calling the /api/salespeople list, etc.
    return payload.roles || payload.authorities || [];
  } catch {
    return [];
  }
}

// Since the current backend token only has the username (subject),
// we determine role by probing an admin-only endpoint once after login.
// Simpler approach: store the role at login time (see LoginPage update).
export function getStoredRole(): "ADMIN" | "SALESPERSON" | null {
  const r = localStorage.getItem("user_role");
  if (r === "ADMIN" || r === "SALESPERSON") return r;
  return null;
}

export function setStoredRole(role: "ADMIN" | "SALESPERSON") {
  localStorage.setItem("user_role", role);
}

export function clearStoredRole() {
  localStorage.removeItem("user_role");
}
