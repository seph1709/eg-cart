"use client";
import {
  deleteScheduledTask,
  getScheduledTasks,
  insertScheduledTask,
  updateScheduledTask,
} from "@/api/apiProduct";
import { useState, useEffect } from "react";
import { ScheduledTask, ScheduleTaskStatus } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  Search,
  ArrowUpDown,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingIndicator from "@/components/Loading";

const statusOptions: ScheduleTaskStatus[] = [
  "Order placed",
  "Unfulfilled",
  "In transit",
  "Completed",
];

type SortField = "arriveDate" | "dateStarted" | "totalCost" | "isPaid";
type SortOrder = "asc" | "desc";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleTasks, setScheduleTasks] = useState<ScheduledTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ScheduledTask[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("arriveDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [formData, setFormData] = useState<ScheduledTask>({
    id: "",
    supplierName: "",
    arriveDate: "",
    dateStarted: "",
    productId: "",
    quantity: 0,
    status: "Order placed",
    notes: "",
    totalCost: 0,
    isPaid: false,
  });

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getScheduledTasks();
        setScheduleTasks(data);
        setIsLoading(false);

        console.log(data);

        return;
      } catch (error) {
        console.error("Failed to fetch scheduled tasks:", error);
        setIsLoading(false);

        return;
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    function filterAndSortTasks() {
      let filtered = [...scheduleTasks];

      // Apply search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.supplierName.toLowerCase().includes(query) ||
            task.id.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case "arriveDate":
            comparison =
              new Date(a.arriveDate).getTime() -
              new Date(b.arriveDate).getTime();
            break;
          case "dateStarted":
            comparison =
              new Date(a.dateStarted).getTime() -
              new Date(b.dateStarted).getTime();
            break;
          case "totalCost":
            comparison = a.totalCost - b.totalCost;
            break;
          case "isPaid":
            comparison = a.isPaid === b.isPaid ? 0 : a.isPaid ? -1 : 1;
            break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });

      setFilteredTasks(filtered);
    }
    filterAndSortTasks();
  }, [scheduleTasks, searchQuery, sortField, sortOrder]);

  const getStatusVariant = (
    status: ScheduleTaskStatus
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Completed":
        return "default";
      case "In transit":
        return "secondary";
      case "Order placed":
        return "outline";
      case "Unfulfilled":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatDateForInput = (dateString: string) => {
    return dateString;
  };

  const handleEdit = (task: ScheduledTask) => {
    setEditingTask(task);
    setFormData(task);
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setFormData({
      id: `TSK-${String(scheduleTasks.length + 1).padStart(3, "0")}`,
      supplierName: "",
      arriveDate: "",
      dateStarted: "",
      productId: "",
      quantity: 0,
      status: "Order placed",
      notes: "",
      totalCost: 0,
      isPaid: false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = async (updatedTask: ScheduledTask) => {
    const { data } = await updateScheduledTask(updatedTask.id, updatedTask);

    if (data != null) {
      const data = await getScheduledTasks();
      setScheduleTasks(data);
    }
  };

  const handleSave = async () => {
    const {
      id,
      supplierName,
      arriveDate,
      dateStarted,
      productId,
      quantity,
      status,
      totalCost,
    } = editingTask || {};

    if (
      id &&
      supplierName &&
      productId &&
      dateStarted &&
      arriveDate &&
      quantity &&
      totalCost &&
      status
    ) {
      // Update existing task - call your API here
      

      console.log("editing true with data");

      const taskId = editingTask!.id;
      const updatedTask = scheduleTasks.map((task) =>
        task.id === taskId ? formData : task
      )[0];
      handleUpdateTask(updatedTask);
    } else if (
      formData.id &&
      formData.supplierName &&
      formData.productId &&
      formData.dateStarted &&
      formData.arriveDate &&
      formData.quantity &&
      formData.totalCost &&
      formData.status
    ) {
      // Add new task - call your API here
      console.log("created true with data");
      const { data } = await insertScheduledTask(formData);

      console.log(data);

      if (data !== null) {
        console.log("updated");
        const data = await getScheduledTasks();
        setScheduleTasks(data);
      }
    }
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingTaskId) {
      // Call your delete API here
      const { data } = await deleteScheduledTask(deletingTaskId);
      setDeletingTaskId(null);
      setIsDeleteDialogOpen(false);

      console.log(data);

      if (data != null) {
        const data = await getScheduledTasks();
        setScheduleTasks(data);
      }
    }
  };

  const handleDelete = (taskId: string) => {
    setDeletingTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (
    field: keyof ScheduledTask,
    value: string | number | boolean
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  console.log(scheduleTasks.length);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl ">Schedule Task</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative w-[400px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by supplier name or task ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex gap-2">
              <Select
                value={sortField}
                onValueChange={(value) => setSortField(value as SortField)}
              >
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arriveDate">Arrival Date</SelectItem>
                  <SelectItem value="dateStarted">Start Date</SelectItem>
                  <SelectItem value="totalCost">Total Cost</SelectItem>
                  <SelectItem value="isPaid">Payment Status</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as SortOrder)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Scheduled Tasks ({filteredTasks.length}
            {filteredTasks.length !== scheduleTasks.length &&
              ` of ${scheduleTasks.length}`}
            )
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    Task ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    Product ID
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-900">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-900">
                    Total Cost
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-900">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    Date Started
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    Arrival Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No tasks found matching your search"
                        : "No scheduled tasks found"}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{task.id}</td>
                      <td className="px-4 py-3">{task.supplierName}</td>
                      <td className="px-4 py-3">{task.productId}</td>
                      <td className="px-4 py-3 text-right">
                        {task.quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(task.totalCost)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {task.isPaid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 inline-block" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 inline-block" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(task.dateStarted)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(task.arriveDate)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Make changes to the task here."
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskId" className="text-right">
                Task ID
              </Label>
              <Input
                id="taskId"
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                className="col-span-3"
                disabled={!!editingTask}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierName" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) =>
                  handleInputChange("supplierName", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product ID
              </Label>
              <Input
                id="productId"
                value={formData.productId}
                onChange={(e) => handleInputChange("productId", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value) || 0)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalCost" className="text-right">
                Total Cost
              </Label>
              <Input
                id="totalCost"
                type="number"
                step="0.01"
                value={formData.totalCost}
                onChange={(e) =>
                  handleInputChange(
                    "totalCost",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="col-span-3"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateStarted" className="text-right">
                Date Started
              </Label>
              <Input
                id="dateStarted"
                type="date"
                value={formatDateForInput(formData.dateStarted)}
                onChange={(e) =>
                  handleInputChange("dateStarted", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="arriveDate" className="text-right">
                Arrival Date
              </Label>
              <Input
                id="arriveDate"
                type="date"
                value={formatDateForInput(formData.arriveDate)}
                onChange={(e) =>
                  handleInputChange("arriveDate", e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange("status", value as ScheduleTaskStatus)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="col-span-3"
                placeholder="Add any additional notes here..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPaid" className="text-right">
                Payment Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPaid", checked as boolean)
                  }
                />
                <Label
                  htmlFor="isPaid"
                  className="text-sm font-normal cursor-pointer"
                >
                  Mark as paid
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              scheduled task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
