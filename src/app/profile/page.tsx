"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="rounded-lg border bg-card p-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="space-y-2">
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{session.user?.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
          <div className="pt-4">
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 