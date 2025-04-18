import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Digital Marketplace
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Buy and sell digital products with ease. From software to digital art,
          find everything you need in one place.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">Start Selling</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
