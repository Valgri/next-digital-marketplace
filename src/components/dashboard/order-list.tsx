import { Order, Product } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderListProps {
  orders: (Order & {
    product: Product;
  })[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven&apos;t made any purchases yet.</p>
        <Button asChild className="mt-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="cursor-pointer hover:bg-muted/50 transition-all duration-200 shadow-sm hover:shadow-md border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {order.product.title}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Payment Intent: {order.paymentIntent}
                </p>
                <p className="text-sm font-medium text-primary">
                  ${order.product.price.toFixed(2)}
                </p>
              </div>
              <Button asChild className="cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/products/${order.product.id}`}>View Product</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}