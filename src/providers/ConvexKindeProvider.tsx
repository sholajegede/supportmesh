"use client";

import { ReactNode, useCallback, useMemo } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

function useAuthFromKinde() {
  const { getIdTokenRaw, isAuthenticated, isLoading } = useKindeBrowserClient();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      const token = getIdTokenRaw();
      return token ?? null;
    },
    [getIdTokenRaw]
  );

  return useMemo(
    () => ({
      isLoading: isLoading ?? true,
      isAuthenticated: isAuthenticated ?? false,
      fetchAccessToken,
    }),
    [isLoading, isAuthenticated, fetchAccessToken]
  );
}

function ConvexKindeProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromKinde}>
      {children}
    </ConvexProviderWithAuth>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <KindeProvider>
      <ConvexKindeProvider>{children}</ConvexKindeProvider>
    </KindeProvider>
  );
}