import { useState, useEffect, useCallback } from 'react';
import type { SpinWheelOption } from '../types/wheelTypes';

/**
 * Custom hook to manage wheel spin logic
 */
export const useWheelSpin = (
  options: SpinWheelOption[], 
  duration: number, 
  onSelectOption?: (option: SpinWheelOption) => void
) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SpinWheelOption | null>(null);
  const [rotation, setRotation] = useState(0);
  const [normalizedOptions, setNormalizedOptions] = useState<SpinWheelOption[]>([]);

  // Normalize option probabilities when options change
  useEffect(() => {
    setNormalizedOptions(normalizeOptionProbabilities(options));
  }, [options]);

  /**
   * Normalizes option probabilities to ensure they sum to 100%
   */
  const normalizeOptionProbabilities = useCallback((opts: SpinWheelOption[]): SpinWheelOption[] => {
    // If no probability provided, assign equal probabilities
    const optionsWithProbability = opts.map(opt => ({
      ...opt,
      probability: opt.probability !== undefined ? opt.probability : 100 / opts.length
    }));

    // Calculate total probability
    const totalProbability = optionsWithProbability.reduce(
      (sum, opt) => sum + (opt.probability || 0), 
      0
    );

    // Normalize probabilities to sum to 100%
    if (totalProbability !== 100 && totalProbability > 0) {
      return optionsWithProbability.map(opt => ({
        ...opt,
        probability: ((opt.probability || 0) / totalProbability) * 100
      }));
    }

    return optionsWithProbability;
  }, []);

  /**
   * Selects an option based on probability distribution
   */
  const selectOptionByProbability = useCallback((): SpinWheelOption => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const option of normalizedOptions) {
      cumulativeProbability += option.probability || 0;
      if (random <= cumulativeProbability) {
        return option;
      }
    }
    
    // Fallback to last option (should rarely happen due to rounding)
    return normalizedOptions[normalizedOptions.length - 1];
  }, [normalizedOptions]);

  /**
   * Spins the wheel and selects an option
   */
  const spinWheel = useCallback(() => {
    if (isSpinning || normalizedOptions.length < 2) return;

    // Set spinning state
    setIsSpinning(true);
    
    // Select an option based on probability
    const selected = selectOptionByProbability();
    
    // Find the index of the selected option
    const selectedIndex = normalizedOptions.findIndex(opt => opt.id === selected.id);
    
    // Calculate angles and rotations
    const anglePerSegment = 360 / normalizedOptions.length;
    const segmentMiddleAngle = selectedIndex * anglePerSegment + (anglePerSegment / 2);
    const destinationAngle = 360 - segmentMiddleAngle; // The wheel rotates clockwise
    
    // Add extra rotations (3-5 full spins) to make the spin look natural
    const extraRotations = Math.floor(Math.random() * 3) + 3;
    const totalRotation = destinationAngle + (extraRotations * 360);
    
    // Set the new total rotation (existing rotation + new rotation)
    setRotation(prevRotation => prevRotation + totalRotation);

    // Handle completion after animation finishes
    setTimeout(() => {
      setSelectedOption(selected);
      setIsSpinning(false);
      
      if (onSelectOption) {
        onSelectOption(selected);
      }
    }, duration);
  }, [isSpinning, normalizedOptions, selectOptionByProbability, duration, onSelectOption]);

  /**
   * Resets the wheel to its initial state
   */
  const resetWheel = useCallback(() => {
    if (isSpinning) return;
    setRotation(0);
    setSelectedOption(null);
  }, [isSpinning]);

  return {
    isSpinning,
    selectedOption,
    rotation,
    normalizedOptions,
    spinWheel,
    resetWheel
  };
};