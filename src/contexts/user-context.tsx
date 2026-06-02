"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import PageLoader from "@/components/page-loader";
import { useRouter } from "next/navigation";

interface UserData {
  _id: Id<"users">;
  email: string;
  kindeId: string;
  firstName?: string;
  lastName?: string;
}

type UserContextType = {
  user: ReturnType<typeof useKindeBrowserClient>["user"];
  profile?: UserData;
  setProfile: React.Dispatch<React.SetStateAction<UserData | undefined>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const userId = user?.id;

  const fetchedProfile = useQuery(
    api.users.getUserByKindeId,
    userId ? { kindeId: userId } : "skip"
  );
  
  const [profile, setProfile] = useState<UserData | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (fetchedProfile === null && userId) {
      setError("Profile not found.");
    } else if (fetchedProfile) {
      setProfile(fetchedProfile as UserData);
      setError(undefined);
    }
  }, [fetchedProfile, userId]);

  useEffect(() => {
    if (error) {
      router.push("/");
    }
  }, [error, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}