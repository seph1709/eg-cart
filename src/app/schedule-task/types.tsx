export type ScheduleTaskStatus =
  | "Order placed"
  | "Unfulfilled"
  | "In transit"
  | "Completed";

export interface ScheduledTask {
  id: string;
  supplierName: string;
  arriveDate: string;
  dateStarted: string;
  productId: string;
  quantity: number;
  status: ScheduleTaskStatus;
  notes: string;
  totalCost: number;
  isPaid: boolean;
}
