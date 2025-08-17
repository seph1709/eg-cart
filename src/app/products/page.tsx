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
import { ExternalLink, Pencil, Trash } from "lucide-react";
import { products as initialProducts } from "@/app/products/data";
import { useState } from "react";


type SortKey = "name" | "price" | "dateAdded";
type SortOrder = "asc" | "desc";
type SearchKey = "name" | "price";

const LIMIT_OPTIONS = [5, 10, 20, 50, 100];



function Page() {

    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState<SearchKey>("name");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [limit, setLimit] = useState<number>(10);

    // Filter products by selected search key
    const filteredProducts = initialProducts
        .filter((product) => {
            if (searchKey === "name") {
                return product.name.toLowerCase().includes(search.toLowerCase());
            } else if (searchKey === "price") {
                // Allow searching price as string or number
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
                    new Date(a.dateAdded).getTime() -
                    new Date(b.dateAdded).getTime();
            }
            return sortOrder === "asc" ? compare : -compare;
        });

    const limitedProducts = filteredProducts.slice(0, limit);
    

    return (
        <div>
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
                limitOptions={LIMIT_OPTIONS}
            />
            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Classification</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Coordinates</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {limitedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.classification}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>₱ {product.price}</TableCell>
                            <TableCell>{product.available.toString()}</TableCell>
                            <TableCell>{product.supplier}</TableCell>
                            <TableCell className="flex justify-around">
                                <div>x: {product.coordinates.x}</div>
                                <div>y: {product.coordinates.y}</div>
                            </TableCell>
                            <TableCell>
                                {new Date(product.dateAdded).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-x-5">
                                    <ExternalLink size={16} />
                                    <Pencil size={16} />
                                    <Trash size={16} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Page;
