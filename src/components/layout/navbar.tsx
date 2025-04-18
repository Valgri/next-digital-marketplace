"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold">
            Digital Marketplace
          </Link>
          <Link
            href="/products"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/products" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Products
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Admin
            </Link>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <UserNav />
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 