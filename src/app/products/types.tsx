import { Dispatch, SetStateAction } from "react";



export type SortKey = "name" | "price" | "dateAdded";
export type SortOrder = "asc" | "desc";
export type SearchKey = "name" | "price";

export interface TableToolBarProps {
    search: string;
    setSearch:Dispatch<SetStateAction<string>>;
    searchKey: SearchKey;
    setSearchKey: Dispatch<SetStateAction<SearchKey>>;
    sortKey: SortKey;
    setSortKey:Dispatch<SetStateAction<SortKey>>;
    sortOrder: SortOrder;
    setSortOrder: Dispatch<SetStateAction<SortOrder>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    limitOptions: number[];
}