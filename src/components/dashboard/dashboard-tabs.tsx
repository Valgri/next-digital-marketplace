"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "./order-list";
import { ProductList } from "./product-list";
import { Order, Product } from "@prisma/client";

interface DashboardTabsProps {
  orders: (Order & {
    product: Product;
  })[];
  products: Product[];
}

export function DashboardTabs({ orders, products }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="orders">My Orders</TabsTrigger>
        <TabsTrigger value="products">My Products</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <OrderList orders={orders} />
      </TabsContent>
      <TabsContent value="products">
        <ProductList products={products} />
      </TabsContent>
    </Tabs>
  );
} 