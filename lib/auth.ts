import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { Role } from "@prisma/client";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export interface SessionUser {
  userId: string;
  role: Role;
  tenantId: string;
}

/**
 * Verifies the Supabase access token, then resolves authorization data from
 * PostgreSQL. tenantId and role are deliberately never accepted from cookies,
 * request payloads, or user-editable JWT metadata.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase Auth environment variables are not configured");
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Read-only Server Components cannot write cookies. A Supabase
          // middleware should refresh tokens for those requests.
        }
      },
    },
  });

  // getUser() validates the JWT with Supabase Auth. Do not authorize from
  // getSession(), because that method only reads local cookie state.
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  // User.id is expected to use the same UUID as auth.users.id.
  return prisma.user.findFirst({
    where: {
      id: authUser.id,
      isActive: true,
    },
    select: {
      id: true,
      role: true,
      tenantId: true,
    },
  }).then((user) =>
    user
      ? { userId: user.id, role: user.role, tenantId: user.tenantId }
      : null,
  );
}
