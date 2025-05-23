import { prisma } from "@/lib/db/prisma";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Product, User } from "@prisma/client";

type ProductWithUser = Product & { user: Pick<User, "name" | "image"> };

export const revalidate = 60; // Revalidate every 60 seconds

async function getProducts(): Promise<ProductWithUser[]> {
  const products = await prisma.product.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}

export default async function ProductsPage() {
  const products: ProductWithUser[] = await getProducts();

  return (
    <div className="container py-8 min-w-[100%]">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/products/new">Create Product</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No products yet</h2>
          <p className="text-muted-foreground mb-4">
            Be the first to create a product!
          </p>
          <Button asChild>
            <Link href="/products/new">Create Product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 