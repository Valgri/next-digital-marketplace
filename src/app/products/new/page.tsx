import { ProductForm } from "@/components/products/product-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Product</h1>
        <ProductForm />
      </div>
    </div>
  );
} 