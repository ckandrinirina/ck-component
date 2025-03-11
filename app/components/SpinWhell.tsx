import React, { useRef, useMemo } from 'react';
import type { SpinWheelProps } from '../types/wheelTypes';
import { useWheelSpin } from '../hooks/useWheelSpin';
import { WheelSegment, WheelIcons } from './WheelComponents';

/**
 * SpinWheel component
 */
const SpinWheel: React.FC<SpinWheelProps> = ({
  options = [],
  onSelectOption,
  duration = 5000,
  buttonText = 'SPIN',
  size = 400,
  fontSize = 16,
  outerBorderColor = '#333',
  outerBorderWidth = 3,
  innerBorderColor = '#fff',
  innerBorderWidth = 2,
  spinButtonColor = '#4CAF50',
  spinButtonTextColor = '#fff',
  innerCircleSize = 25,
  showResetButton = true,
  resetButtonText = 'RESET',
  resetButtonColor = '#f44336',
  resetButtonTextColor = '#fff',
}) => {
  // Use custom hook for wheel spin logic
  const {
    isSpinning,
    selectedOption,
    rotation,
    normalizedOptions,
    spinWheel,
    resetWheel
  } = useWheelSpin(options, duration, onSelectOption);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Ensure we have at least 2 options
  if (options.length < 2) {
    return <div className="text-red-500 p-5">Please provide at least 2 options for the wheel.</div>;
  }
  
  // Calculate dimensions
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const anglePerSegment = 360 / options.length;
  const innerCirclePosition = 50 - (innerCircleSize / 2);

  // Memoize wheel styles for performance
  const wheelStyles = useMemo(() => ({
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    border: `${outerBorderWidth}px solid ${outerBorderColor}`,
    transform: `rotate(${rotation}deg)`,
    transition: isSpinning 
      ? `transform ${duration/1000}s cubic-bezier(0.11, 0.68, 0.18, 1.03)` 
      : 'none',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  }), [rotation, isSpinning, duration, outerBorderWidth, outerBorderColor]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Container for the wheel */}
      <div 
        className="relative"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {/* The wheel */}
        <div 
          ref={wheelRef}
          className="wheel absolute w-full h-full rounded-full overflow-hidden"
          style={wheelStyles}
        >
          {/* SVG for wheel segments */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {normalizedOptions.map((option, index) => (
              <WheelSegment
                key={option.id}
                option={option}
                index={index}
                total={normalizedOptions.length}
                radius={radius}
                centerX={centerX}
                centerY={centerY}
                innerBorderColor={innerBorderColor}
                innerBorderWidth={innerBorderWidth}
                fontSize={fontSize}
              />
            ))}
          </svg>
          
          {/* Icons overlay */}
          <WheelIcons
            options={normalizedOptions}
            anglePerSegment={anglePerSegment}
            radius={radius}
            centerX={centerX}
            centerY={centerY}
          />
        </div>

        {/* Inner circle with spin button */}
        <div 
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: `${innerCircleSize}%`,
            height: `${innerCircleSize}%`,
            top: `${innerCirclePosition}%`,
            left: `${innerCirclePosition}%`,
            backgroundColor: '#fff',
            border: `${innerBorderWidth}px solid ${innerBorderColor}`,
            zIndex: 10,
            boxShadow: '0 0 5px rgba(0,0,0,0.3) inset',
          }}
        >
          <button 
            className="w-full h-full rounded-full flex items-center justify-center font-bold cursor-pointer"
            style={{
              backgroundColor: spinButtonColor,
              color: spinButtonTextColor,
              fontSize: `${fontSize * 0.8}px`,
            }}
            onClick={spinWheel}
            disabled={isSpinning}
            aria-label={buttonText}
          >
            {buttonText}
          </button>
        </div>
        
        {/* Indicator/pointer */}
        <div
          className="absolute"
          style={{
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '30px',
            zIndex: 20,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            backgroundColor: '#FF5722',
          }}
          aria-hidden="true"
        ></div>
      </div>

      {/* Result display and reset button */}
      <div className="mt-6 text-center">
        {selectedOption && !isSpinning && (
          <p className="text-lg mb-4" aria-live="polite">
            Result: <strong>{selectedOption.label}</strong>
          </p>
        )}
        
        {/* Reset button */}
        {showResetButton && !isSpinning && selectedOption && (
          <button
            className="mt-4 px-6 py-2 rounded font-bold cursor-pointer"
            style={{
              backgroundColor: resetButtonColor,
              color: resetButtonTextColor,
              fontSize: `${fontSize * 0.8}px`,
            }}
            onClick={resetWheel}
            aria-label={resetButtonText}
          >
            {resetButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;