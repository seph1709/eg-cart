"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { productsPath } from "@/path";
import { insertProducts } from "@/api/apiProduct";
import { Product } from "@/app/dashboard/types";
import toast, { Toaster } from "react-hot-toast";
import {
  categoryOptions,
  classificationOptions,
  emptyProduct,
} from "./constants";
import { EnhancedDatePickerProps } from "../[productId]/edit/types";
import { monthOptions, yearOptions } from "../[productId]/edit/constants";

function EnhancedDatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
}: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(date || new Date());
  const [selectedYear, setSelectedYear] = useState(
    date?.getFullYear() || new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    date?.getMonth() || new Date().getMonth()
  );

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    const newDate = new Date(newYear, selectedMonth, 1);
    setCurrentMonth(newDate);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = parseInt(monthIndex);
    setSelectedMonth(newMonth);
    const newDate = new Date(selectedYear, newMonth, 1);
    setCurrentMonth(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal mt-1 h-9 text-xs",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex gap-2 mb-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="h-8 text-xs w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          initialFocus
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
}

function Page() {
  const router = useRouter();
  const [form, setForm] = useState<Product>(emptyProduct);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      name === "rackLevel" ||
      name === "price" ||
      name === "discount" ||
      name === "minStockLevel" ||
      name === "maxStockLevel" ||
      name === "currentStockLevel"
    ) {
      setForm({ ...form, [name]: Number(value) });
    } else if (name === "x" || name === "y") {
      setForm({
        ...form,
        coordinates: { ...form.coordinates, [name]: Number(value) },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setForm({ ...form, [name]: format(date, "yyyy-MM-dd") });
    } else {
      setForm({ ...form, [name]: "" });
    }
  };

  const handleSwitch = (checked: boolean) => {
    setForm({ ...form, available: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form);

    if (form == emptyProduct) {
      toast.error("Please fill out the form before submitting.");
      return;
    }
    insertProducts(form).then(({ data, error }) => {
      console.log({ data, error });

      if (error) {
        toast.error("Error adding product: " + error.message);
      } else {
        toast.success("Product added successfully!");
        router.push(productsPath);
      }
    });
  };

  const handleCancel = () => {
    router.push(productsPath);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex justify-center items-center motion-preset-fade">
        <style jsx global>{`
          /* Chrome, Safari, Edge, Opera */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
        <Card className="w-full max-w-7xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Add New Product</CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 cursor-pointer"
                form="product-form"
              >
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              id="product-form"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="id" className="text-sm">
                        Product ID
                      </Label>
                      <Input
                        id="id"
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        required
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="barcode" className="text-sm">
                        Barcode
                      </Label>
                      <Input
                        id="barcode"
                        name="barcode"
                        value={form.barcode}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-sm">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand" className="text-sm">
                        Brand
                      </Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="classification" className="text-sm">
                        Classification
                      </Label>
                      <Select
                        name="classification"
                        onValueChange={(value) =>
                          handleSelectChange("classification", value)
                        }
                        value={form.classification}
                      >
                        <SelectTrigger className="mt-1 h-9 text-xs">
                          <SelectValue placeholder="Select Classification" />
                        </SelectTrigger>
                        <SelectContent>
                          {classificationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-sm">
                        Category
                      </Label>
                      <Select
                        name="category"
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                        value={form.category}
                      >
                        <SelectTrigger className="mt-1 h-9 text-xs">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="supplier" className="text-sm">
                        Supplier
                      </Label>
                      <Input
                        id="supplier"
                        name="supplier"
                        value={form.supplier}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-sm">
                        Weight
                      </Label>
                      <Input
                        id="weight"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rackLevel" className="text-sm">
                        rackLevel
                      </Label>
                      <Input
                        id="rackLevel"
                        name="rackLevel"
                        type="number"
                        value={form.rackLevel == 0 ? "" : form.rackLevel}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-sm">
                        Price (PHP)
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={form.price == 0 ? "" : form.price}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount" className="text-sm">
                        Discount (%)
                      </Label>
                      <Input
                        id="discount"
                        name="discount"
                        type="number"
                        value={form.discount == 0 ? "" : form.discount}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minStockLevel" className="text-sm">
                        Min Stock Level
                      </Label>
                      <Input
                        id="minStockLevel"
                        name="minStockLevel"
                        type="number"
                        value={
                          form.minStockLevel == 0 ? "" : form.minStockLevel
                        }
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxStockLevel" className="text-sm">
                        Max Stock Level
                      </Label>
                      <Input
                        id="maxStockLevel"
                        name="maxStockLevel"
                        type="number"
                        value={
                          form.maxStockLevel == 0 ? "" : form.maxStockLevel
                        }
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentStockLevel" className="text-sm">
                        Current Stock Level
                      </Label>
                      <Input
                        id="currentStockLevel"
                        name="currentStockLevel"
                        type="number"
                        value={
                          form.currentStockLevel == 0
                            ? ""
                            : form.currentStockLevel
                        }
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expirationDate" className="text-sm">
                        Expiration Date
                      </Label>
                      <EnhancedDatePicker
                        date={
                          form.expirationDate
                            ? new Date(form.expirationDate)
                            : undefined
                        }
                        onDateChange={(date) =>
                          handleDateChange("expirationDate", date)
                        }
                        placeholder="Pick expiration date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateAdded" className="text-sm">
                        Date Added
                      </Label>
                      <EnhancedDatePicker
                        date={
                          form.dateAdded ? new Date(form.dateAdded) : undefined
                        }
                        onDateChange={(date) =>
                          handleDateChange("dateAdded", date)
                        }
                        placeholder="Pick date added"
                      />
                    </div>
                    <div>
                      <Label htmlFor="x" className="text-sm">
                        Coordinate X
                      </Label>
                      <Input
                        id="x"
                        name="x"
                        type="number"
                        value={
                          form.coordinates.x == 0 ? "" : form.coordinates.x
                        }
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="y" className="text-sm">
                        Coordinate Y
                      </Label>
                      <Input
                        id="y"
                        name="y"
                        type="number"
                        value={
                          form.coordinates.y == 0 ? "" : form.coordinates.y
                        }
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <Label htmlFor="image" className="text-sm">
                        Image URL
                      </Label>
                      <Input
                        id="image"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.available}
                      onCheckedChange={handleSwitch}
                      id="available"
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="available" className="text-sm">
                      Available
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="mt-1 text-sm resize-none h-64"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Page;
