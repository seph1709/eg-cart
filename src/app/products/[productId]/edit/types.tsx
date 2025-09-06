"use client";
export type Params = { params: Promise<{ productId: string }> };

// Enhanced Date Picker Component with Year Selection
export interface EnhancedDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}
