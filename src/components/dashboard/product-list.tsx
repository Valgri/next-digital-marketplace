import { Product } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't created any products yet.</p>
        <Button asChild className="mt-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow">
          <Link href="/products/new">Create Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="cursor-pointer hover:bg-muted/50 transition-all duration-200 shadow-sm hover:shadow-md border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {product.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(product.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm font-medium text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild className="cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="destructive" asChild className="cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.id}/delete`}>Delete</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}