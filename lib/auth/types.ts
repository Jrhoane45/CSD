import type { Role } from "@/lib/types";

export type { Role };

/** A signed-in identity. In demo mode this is a lightweight local identity. */
export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  role: Role;
}

export interface AuthState {
  /** The signed-in identity, or null when signed out. */
  user: AuthUser | null;
  /** The active role (demo: the role toggle; real backends derive it from the account). */
  role: Role;
  /** Hydration complete — safe to trust user/role. */
  ready: boolean;
}

/**
 * The seam between the app and whatever provides identity. A demo adapter backs
 * the local, no-login experience; a Supabase adapter (behind env config) will
 * implement the same surface for real accounts.
 */
export interface AuthAdapter {
  readonly mode: AuthMode;
  getState(): AuthState;
  subscribe(cb: () => void): () => void;
  /** Switch the active role. Demo affordance; real backends may restrict this. */
  setRole(role: Role): void;
  signIn(input: { email: string; name?: string }): Promise<AuthUser>;
  signOut(): Promise<void>;
}

export type AuthMode = "demo" | "supabase";
