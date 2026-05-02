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
import { deleteProduct, getProducts } from "@/api/apiProduct";
import { Product } from "@/app/dashboard/types";
import {
  AlertTriangle,
  ArchiveX,
  CalendarClock,
  Layers,
  PackageCheck,
  Pencil,
  Trash,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { editProductPath, productsPath } from "@/path";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

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
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const router = useRouter();

  function fetchProducts() {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchProducts();
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

  const categoryStockData = Object.entries(
    products.reduce<Record<string, { current: number; min: number }>>(
      (acc, p) => {
        const cat = p.category ?? "Uncategorized";
        if (!acc[cat]) acc[cat] = { current: 0, min: 0 };
        acc[cat].current += p.currentStockLevel;
        acc[cat].min += p.minStockLevel;
        return acc;
      },
      {}
    )
  ).map(([name, { current, min }]) => ({ name, current, min }));

  const expiryChartData = [
    {
      name: "Expired",
      count: products.filter((p) => isExpired(p.expirationDate)).length,
      fill: "#ef4444",
    },
    {
      name: "≤ 7 days",
      count: products.filter(
        (p) =>
          !isExpired(p.expirationDate) && isExpiringSoon(p.expirationDate, 7)
      ).length,
      fill: "#f97316",
    },
    {
      name: "8–30 days",
      count: products.filter(
        (p) =>
          !isExpired(p.expirationDate) &&
          isExpiringSoon(p.expirationDate, 30) &&
          !isExpiringSoon(p.expirationDate, 7)
      ).length,
      fill: "#f59e0b",
    },
    {
      name: "31–90 days",
      count: products.filter(
        (p) =>
          !isExpired(p.expirationDate) &&
          isExpiringSoon(p.expirationDate, 90) &&
          !isExpiringSoon(p.expirationDate, 30)
      ).length,
      fill: "#a3e635",
    },
    {
      name: "90d+",
      count: products.filter(
        (p) =>
          !isExpired(p.expirationDate) && !isExpiringSoon(p.expirationDate, 90)
      ).length,
      fill: "#a1a1aa",
    },
  ];

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
      <Toaster position="top-right" reverseOrder={true} />
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

      {/* Stock by category chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock by Category</CardTitle>
          <p className="text-xs text-muted-foreground">
            Total current stock vs minimum threshold per category
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={categoryStockData}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#f4f4f5" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#71717a" }}
                iconType="square"
                iconSize={10}
              />
              <Bar
                dataKey="current"
                name="Current Stock"
                fill="#18181b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="min"
                name="Min Threshold"
                fill="#a1a1aa"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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

      {/* Expiry distribution chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expiry Distribution</CardTitle>
          <p className="text-xs text-muted-foreground">
            Number of products by how soon they expire
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={expiryChartData}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#f4f4f5" }}
                formatter={(value) => [value, "Products"]}
              />
              <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]}>
                {expiryChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expiring / Expired alert table */}
      {(expiringSoon > 0 || expired > 0) && (
        <Dialog>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item?
                <br />
                {`name: ${deleteTarget?.name}`}
                <br />
                {`ID: ${deleteTarget?.id}`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    if (!deleteTarget) return;
                    deleteProduct(deleteTarget.id).then(({ error }) => {
                      if (error) {
                        toast.error("Error deleting product: " + error.message);
                      } else {
                        toast.success("Product deleted successfully!");
                        fetchProducts();
                      }
                    });
                  }}
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>

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
                    <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <div className="flex gap-x-4">
                            <Pencil
                              size={16}
                              role="button"
                              className="cursor-pointer"
                              onClick={() => router.push(editProductPath(p.id))}
                            />
                            <DialogTrigger asChild>
                              <Trash
                                size={16}
                                role="button"
                                className="cursor-pointer hover:text-red-600"
                                onClick={() => setDeleteTarget(p)}
                              />
                            </DialogTrigger>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Dialog>
      )}
    </div>
  );
}
