"use client";

import TableToolBar from "@/components/table-tool-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Frown, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
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

import { editProductPath } from "@/path";
import { useRouter } from "next/navigation";
import { deleteProduct, getProducts } from "@/api/apiProduct";
import { Product, SearchKey, SortKey, SortOrder } from "@/app/dashboard/types";
import toast, { Toaster } from "react-hot-toast";
import LoadingIndicator from "@/components/Loading";

function Page() {
  const [search, setSearch] = useState(
    typeof window !== "undefined" ? localStorage.getItem("search") ?? "" : ""
  );
  const [searchKey, setSearchKey] = useState<SearchKey>(
    typeof window !== "undefined"
      ? (localStorage.getItem("searchKey") as SearchKey) ?? "name"
      : "name"
  );
  const [sortKey, setSortKey] = useState<SortKey>(
    typeof window !== "undefined"
      ? (localStorage.getItem("sortKey") as SortKey) ?? "name"
      : "name"
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    typeof window !== "undefined"
      ? (localStorage.getItem("sortOrder") as SortOrder) ?? "asc"
      : "asc"
  );
  const [limit, setLimit] = useState<number>(
    typeof window !== "undefined"
      ? localStorage.getItem("limit") == null
        ? 10
        : Number(localStorage.getItem("limit"))
      : 10
  );
  const [seletedItem, setSelectedItem] = useState<number | null>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const router = useRouter();

  async function fetchProduct() {
    const products = await getProducts();
    setIsLoading(false);
    setProducts(products);
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products
    .filter((product: Product) => {
      const prodCategory = product.category;
      const savedCategory =
        typeof window !== "undefined"
          ? localStorage.getItem("category-filter") ?? category
          : category;
      const isCategorizeEnabled =
        savedCategory !== "all" && prodCategory !== savedCategory;

      if (searchKey === "name") {
        if (isCategorizeEnabled) {
          return false;
        } else {
          return product.name.toLowerCase().includes(search.toLowerCase());
        }
      } else if (searchKey === "id") {
        if (isCategorizeEnabled) {
          return false;
        } else {
          return product.id.toString().includes(search);
        }
      }
      return true;
    })
    .sort((a, b) => {
      let compare = 0;
      if (sortKey === "name") {
        compare = a.name.localeCompare(b.name);
      } else if (sortKey === "price") {
        compare = a.price - b.price;
      } else if (sortKey === "dateAdded") {
        compare =
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      } else if (sortKey === "expirationDate") {
        compare =
          new Date(a.expirationDate).getTime() -
          new Date(b.expirationDate).getTime();
      }
      return sortOrder === "asc" ? compare : -compare;
    });

  const limitedProducts = filteredProducts.slice(0, limit);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete item</DialogTitle>
            <DialogDescription>
              Are you sure do you want to delete this item?
              <br />
              {`name: ${limitedProducts.at(seletedItem!)?.name}`}
              <br />
              {`ID: ${limitedProducts.at(seletedItem!)?.id}`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                role="button"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                role="button"
                className="cursor-pointer"
                onClick={() =>
                  deleteProduct(limitedProducts.at(seletedItem!)!.id!).then(
                    ({ data, error }) => {
                      console.log({ data, error });
                      if (error) {
                        toast.error("Error deleting product: " + error.message);
                      } else {
                        toast.success("Product deleted successfully!");
                        fetchProduct();
                      }
                    }
                  )
                }
              >
                delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>

        {/* Toolbar + Category filter (same UI area) */}
        <div className="flex items-center gap-3 mb-3">
          <TableToolBar
            search={search}
            setSearch={setSearch}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            limit={limit}
            setLimit={setLimit}
            categories={categories}
            setCategory={setCategory}
            category={category}
          />
        </div>

        <Table className="border h-[100px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Coordinates ( x , y )</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-scroll max-w-full">
            {limitedProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.classification}</TableCell>
                <TableCell>{product.currentStockLevel}</TableCell>
                <TableCell>₱ {product.price}</TableCell>
                <TableCell>{product.available.toString()}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell className="flex justify-around items-center self-center h-full">
                  <div>{product.coordinates.x}</div>
                  <div>{product.coordinates.y}</div>
                </TableCell>
                <TableCell>{product.expirationDate}</TableCell>
                <TableCell>{product.dateAdded}</TableCell>
                <TableCell>
                  <div className="flex gap-x-5">
                    <Pencil
                      size={16}
                      role="button"
                      className="cursor-pointer"
                      onClick={async () => {
                        router.push(editProductPath(product.id));
                      }}
                    />
                    <DialogTrigger
                      asChild
                      role="button"
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => setSelectedItem(index)}
                    >
                      <Trash size={16} />
                    </DialogTrigger>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && isLoading === false ? (
          <div className="h-full w-full flex justify-center items-center text-md mt-10">
            <Frown /> <span className="ml-2">No products found</span>
          </div>
        ) : (
          <></>
        )}
      </Dialog>
    </>
  );
}

export default Page;
