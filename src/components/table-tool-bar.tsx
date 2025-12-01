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
  setSearchKey,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  limit,
  setLimit,
  category,
  setCategory,
  categories,
}: TableToolBarProps) {
  return (
    <div className="flex items-center justify-between mb-4 gap-10 flex-wrap">
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              {typeof window !== "undefined"
                ? (localStorage.getItem("SearchKey") ?? search) === "name"
                  ? "Search by name"
                  : "Search by ID"
                : "id"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("SearchKey", "name");
                }
                setSearchKey("name");
              }}
            >
              Product Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("SearchKey", "id");
                }
                setSearchKey("id");
              }}
            >
              Product Id
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder={
            typeof window !== "undefined"
              ? (localStorage.getItem("SearchKey") ?? search) === "name"
                ? "Search products..."
                : "Search id..."
              : "name"
          }
          value={search}
          onChange={(e) => {
            if (typeof window !== "undefined") {
              localStorage.setItem("search", e.target.value);
            }
            setSearch(e.target.value);
          }}
          className="max-w-xs"
          type={"text"}
        />
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="limit" className="text-sm">
          Show
        </label>
        <Select
          value={limit.toString()}
          onValueChange={(val) => {
            if (typeof window !== "undefined") {
              localStorage.setItem("limit", val);
            }
            setLimit(Number(val));
          }}
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
        <span className="text-sm w-[180px]">Sort by</span>
        <div>
          <Select
            value={(localStorage.getItem("sortKey") as SortKey) ?? sortKey}
            onValueChange={(val) => {
              console.log(val);

              localStorage.setItem("sortKey", val);
              setSortKey(val as SortKey);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="expirationDate">Expiration Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select
          value={
            typeof window !== "undefined"
              ? (localStorage.getItem("sortOrder") as SortOrder) ?? sortOrder
              : sortOrder
          }
          onValueChange={(val) => {
            if (typeof window !== "undefined") {
              localStorage.setItem("sortOrder", val);
            }
            setSortOrder(val as SortOrder);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm  whitespace-nowrap">Category:</span>
          <Select
            value={
              typeof window !== "undefined"
                ? localStorage.getItem("category-filter") ?? category
                : category
            }
            onValueChange={(v) => {
              setCategory(v);
              if (typeof window !== "undefined") {
                localStorage.setItem("category-filter", v);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button>
            <Link href={addProductPath} className="flex">
              <Plus size={16} className="mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableToolBar;
