import type { ReactNode } from 'react';

/**
 * Defines a single option/segment for the spin wheel
 */
export interface SpinWheelOption {
  id: string | number;
  label: string;
  color: string;
  icon?: ReactNode;
  probability?: number; // 0-100
}

/**
 * Props for the SpinWheel component
 */
export interface SpinWheelProps {
  options: SpinWheelOption[];
  onSelectOption?: (option: SpinWheelOption) => void;
  duration?: number;
  buttonText?: string;
  size?: number;
  fontSize?: number;
  outerBorderColor?: string;
  outerBorderWidth?: number;
  innerBorderColor?: string;
  innerBorderWidth?: number;
  spinButtonColor?: string;
  spinButtonTextColor?: string;
  innerCircleSize?: number;
  showResetButton?: boolean;
  resetButtonText?: string;
  resetButtonColor?: string;
  resetButtonTextColor?: string;
}