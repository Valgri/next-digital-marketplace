import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return product;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions);
  const product = await getProduct((await params).id);

  if (!product) {
    notFound();
  }

  const isOwner = session?.user?.id === product.userId;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="container py-8 min-w-[100%]">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={product.user.image || undefined} />
                  <AvatarFallback>
                    {product.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{product.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(product.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${product.price}</span>
              {isOwner || isAdmin ? (
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/products/${product.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" asChild>
                    <Link href={`/products/${product.id}/delete`}>Delete</Link>
                  </Button>
                </div>
              ) : (
                <Button className="cursor-pointer">Buy Now</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 