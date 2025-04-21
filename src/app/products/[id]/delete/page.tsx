import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DeleteProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    return null;
  }

  return product;
}

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await getServerSession(authOptions);
  const product = await getProduct(params.id);

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!product) {
    notFound();
  }

  if (product.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/products");
  }

  async function deleteProduct() {
    "use server";

    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    redirect("/products");
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Delete Product</h1>
        <div className="space-y-4">
          <p>Are you sure you want to delete this product?</p>
          <p className="text-muted-foreground">
            This action cannot be undone. This will permanently delete the product
            and remove it from our servers.
          </p>
          <div className="flex gap-2">
            <form action={deleteProduct}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
            <Button variant="outline" asChild>
              <Link href={`/products/${params.id}`}>Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 