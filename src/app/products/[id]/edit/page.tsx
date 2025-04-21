import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { ProductForm } from "@/components/products/product-form";

interface EditProductPageProps {
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

export default async function EditProductPage({ params }: EditProductPageProps) {
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

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        <ProductForm initialData={product} isEditing />
      </div>
    </div>
  );
} 