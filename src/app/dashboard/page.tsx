"use client";

import LoadingIndicator from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/api/apiProduct";
import { Product } from "@/app/dashboard/types";
import {
  AlertTriangle,
  ArchiveX,
  CalendarClock,
  Layers,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productsPath } from "@/path";

function isExpiringSoon(dateStr: string, days = 30) {
  if (!dateStr) return false;
  const exp = new Date(dateStr);
  const now = new Date();
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

function isExpired(dateStr: string) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingIndicator />;

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const lowStock = products.filter(
    (p) => p.currentStockLevel <= p.minStockLevel && p.currentStockLevel > 0
  ).length;
  const outOfStock = products.filter((p) => p.currentStockLevel === 0).length;
  const expiringSoon = products.filter((p) =>
    isExpiringSoon(p.expirationDate)
  ).length;
  const expired = products.filter((p) => isExpired(p.expirationDate)).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.currentStockLevel,
    0
  );

  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    const cat = p.category ?? "Uncategorized";
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Layers,
      sub: `${availableProducts} available`,
    },
    {
      title: "Total Inventory Value",
      value: `₱ ${totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      sub: "based on current stock × price",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      sub: "at or below minimum level",
      alert: lowStock > 0,
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: ArchiveX,
      sub: "zero units remaining",
      alert: outOfStock > 0,
    },
    {
      title: "Expiring Soon",
      value: expiringSoon,
      icon: CalendarClock,
      sub: "within the next 30 days",
      alert: expiringSoon > 0,
    },
    {
      title: "In Stock",
      value: availableProducts,
      icon: PackageCheck,
      sub: "marked as available",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A summary of your inventory at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ title, value, icon: Icon, sub, alert }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon
                size={16}
                className={alert ? "text-destructive" : "text-muted-foreground"}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${alert ? "text-destructive" : ""}`}
              >
                {value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm">{cat}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-sm text-muted-foreground">No categories.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent products */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recently Added</CardTitle>
            <Link
              href={productsPath}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          p.currentStockLevel === 0
                            ? "text-destructive font-medium"
                            : p.currentStockLevel <= p.minStockLevel
                              ? "text-amber-600 font-medium"
                              : ""
                        }
                      >
                        {p.currentStockLevel}
                      </span>
                    </TableCell>
                    <TableCell>₱ {p.price}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {p.dateAdded}
                    </TableCell>
                  </TableRow>
                ))}
                {recentProducts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No products yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Expiring / Expired alert table */}
      {(expiringSoon > 0 || expired > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle size={16} className="text-destructive" />
              Expiry Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products
                  .filter(
                    (p) =>
                      isExpired(p.expirationDate) ||
                      isExpiringSoon(p.expirationDate)
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.expirationDate).getTime() -
                      new Date(b.expirationDate).getTime()
                  )
                  .map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.expirationDate}</TableCell>
                      <TableCell>{p.currentStockLevel}</TableCell>
                      <TableCell>
                        {isExpired(p.expirationDate) ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Expiring Soon
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
