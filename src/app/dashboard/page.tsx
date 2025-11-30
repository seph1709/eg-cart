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
import { Product } from "./types";
import toast, { Toaster } from "react-hot-toast";
import LoadingIndicator from "@/components/Loading";

type SortKey = "name" | "price" | "dateAdded";
type SortOrder = "asc" | "desc";
type SearchKey = "name" | "price";

function Page() {
  const [search, setSearch] = useState("");
  const [searchKey, setSearchKey] = useState<SearchKey>("name");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [limit, setLimit] = useState<number>(10);
  const [seletedItem, setSelectedItem] = useState<number | null>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function fetchProduct() {
    const products = await getProducts();
    setIsLoading(false);
    setProducts(products);
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const filteredProducts = products
    .filter((product: Product) => {
      if (searchKey === "name") {
        return product.name.toLowerCase().includes(search.toLowerCase());
      } else if (searchKey === "price") {
        return product.price.toString().includes(search);
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
      }
      return sortOrder === "asc" ? compare : -compare;
    });

  const limitedProducts = filteredProducts.slice(0, limit);

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
        />
        <Table className="border h-[100px]  ">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Coordinates ( x , y )</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-scroll  max-w-full">
            {isLoading ? (
              <LoadingIndicator />
            ) : products.length !== 0 ? (
              limitedProducts.map((product, index) => (
                <TableRow key={product.id}>
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
              ))
            ) : (
              <></>
            )}
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
