import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SortKey, SortOrder, TableToolBarProps } from "@/app/dashboard/types";
import { LIMIT_OPTIONS } from "@/app/dashboard/constants";
import Link from "next/link";
import { addProductPath } from "@/path";

function TableToolBar({
  search,
  setSearch,
  searchKey,
  setSearchKey,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  limit,
  setLimit,
}: TableToolBarProps) {
  return (
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              {searchKey === "name" ? "Search by name" : "Search by price"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setSearchKey("name")}>
              Product Name
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSearchKey("price")}>
              Price
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder={
            searchKey === "name" ? "Search products..." : "Search price..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
          type={searchKey === "price" ? "number" : "text"}
        />
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="limit" className="text-sm">
          Show
        </label>
        <Select
          value={limit.toString()}
          onValueChange={(val) => setLimit(Number(val))}
        >
          <SelectTrigger className="w-[80px]" id="limit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt.toString()}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm">Sort by</span>
        <Select
          value={sortKey}
          onValueChange={(val) => setSortKey(val as SortKey)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="dateAdded">Date Added</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(val) => setSortOrder(val as SortOrder)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Link href={addProductPath} className="flex">
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default TableToolBar;
