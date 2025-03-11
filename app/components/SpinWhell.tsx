import React, { useState, useRef, useEffect } from 'react';

// Define the props interface for type safety
interface SpinWheelOption {
  id: string | number;
  label: string;
  color: string;
  icon?: React.ReactNode; // Optional icon component
  probability?: number; // Added: Probability of this option being selected (0-100)
}

interface SpinWheelProps {
  options: SpinWheelOption[];
  onSelectOption?: (option: SpinWheelOption) => void;
  duration?: number; // Spin duration in milliseconds
  buttonText?: string;
  size?: number; // Size of the wheel in pixels
  fontSize?: number; // Font size for labels
  outerBorderColor?: string;
  outerBorderWidth?: number;
  innerBorderColor?: string;
  innerBorderWidth?: number;
  spinButtonColor?: string;
  spinButtonTextColor?: string;
  innerCircleSize?: number; // Added prop for inner circle size control
  showResetButton?: boolean; // Added prop to control reset button visibility
  resetButtonText?: string; // Text for reset button
  resetButtonColor?: string; // Color for reset button
  resetButtonTextColor?: string; // Text color for reset button
}

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
  innerCircleSize = 25, // Default to 25% of wheel size
  showResetButton = true,
  resetButtonText = 'RESET',
  resetButtonColor = '#f44336', // Red color for reset button
  resetButtonTextColor = '#fff',
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SpinWheelOption | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [normalizedOptions, setNormalizedOptions] = useState<SpinWheelOption[]>([]);
  
  // Normalize probabilities when options change
  useEffect(() => {
    setNormalizedOptions(normalizeOptionProbabilities(options));
  }, [options]);

  // Function to normalize probabilities to ensure they sum to 100%
  const normalizeOptionProbabilities = (opts: SpinWheelOption[]): SpinWheelOption[] => {
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
  };

  // Function to select an option based on probability
  const selectOptionByProbability = (): SpinWheelOption => {
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
  };

  // Reset the wheel to its initial state
  const resetWheel = () => {
    if (isSpinning) return; // Don't reset while spinning
    
    setRotation(0);
    setSelectedOption(null);
  };

  // Ensure we have at least 2 options
  if (options.length < 2) {
    return <div className="text-red-500 p-5">Please provide at least 2 options for the wheel.</div>;
  }

  // Calculate the angle for each segment
  const anglePerSegment = 360 / options.length;
  
  // Calculate SVG paths for the wheel segments
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  
  // Function to calculate coordinates on the circle
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Function to create an SVG arc path
  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  // Spin the wheel with probability-based selection
  const spinWheel = () => {
    if (isSpinning) return;

    // Set spinning state
    setIsSpinning(true);
    
    // Select an option based on probability
    const selected = selectOptionByProbability();
    
    // Find the index of the selected option
    const selectedIndex = normalizedOptions.findIndex(opt => opt.id === selected.id);
    
    // Calculate the rotation needed to land on the selected segment
    // We need to ensure the wheel stops with the pointer at the middle of the segment
    const segmentMiddleAngle = selectedIndex * anglePerSegment + (anglePerSegment / 2);
    const destinationAngle = 360 - segmentMiddleAngle; // The wheel rotates clockwise
    
    // Add extra rotations (2-5 full spins) to make the spin look natural
    const extraRotations = Math.floor(Math.random() * 3) + 2;
    const totalRotation = destinationAngle + (extraRotations * 360);
    
    // Set the new total rotation (existing rotation + new rotation)
    setRotation(rotation + totalRotation);

    // Calculate which segment will be selected after spin
    setTimeout(() => {
      setSelectedOption(selected);
      setIsSpinning(false);
      
      if (onSelectOption) {
        onSelectOption(selected);
      }
    }, duration);
  };

  // Calculate inner circle position (centered)
  const innerCircleRadius = (radius * innerCircleSize) / 100;
  const innerCirclePosition = 50 - (innerCircleSize / 2);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Container for the wheel */}
      <div 
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* The wheel */}
        <div 
          ref={wheelRef}
          className="wheel absolute w-full h-full rounded-full overflow-hidden"
          style={{
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            border: `${outerBorderWidth}px solid ${outerBorderColor}`,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${duration/1000}s cubic-bezier(0.1, 0.25, 0.1, 1)` : 'none',
          }}
        >
          {/* SVG for wheel segments */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {options.map((option, index) => {
              const startAngle = index * anglePerSegment;
              const endAngle = (index + 1) * anglePerSegment;
              const pathD = createArcPath(startAngle, endAngle);
              
              return (
                <g key={option.id}>
                  <path 
                    d={pathD} 
                    fill={option.color}
                    stroke={innerBorderColor}
                    strokeWidth={innerBorderWidth}
                  />
                </g>
              );
            })}

            {/* SVG Text Labels - Using SVG text for better positioning */}
            {options.map((option, index) => {
              const midAngle = index * anglePerSegment + (anglePerSegment / 2);
              // Calculate text position - place it at 70% from center to edge
              const textDistance = radius * 0.7;
              const textPos = polarToCartesian(centerX, centerY, textDistance, midAngle);
              
              // Rotate text to align with segment
              const textRotation = midAngle;
              
              return (
                <g key={`text-${option.id}`} style={{ pointerEvents: 'none' }}>
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      transform: `rotate(${textRotation}deg)`,
                      transformOrigin: `${textPos.x}px ${textPos.y}px`,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    }}
                  >
                    {option.label}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Icons (React components need to be rendered outside SVG) */}
          <div className="absolute inset-0">
            {options.map((option, index) => {
              if (!option.icon) return null;
              
              const midAngle = index * anglePerSegment + (anglePerSegment / 2);
              // Calculate icon position - place it at 50% from center to edge
              const iconDistance = radius * 0.5;
              const iconPos = polarToCartesian(centerX, centerY, iconDistance, midAngle);
              
              return (
                <div
                  key={`icon-${option.id}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${iconPos.x}px`,
                    top: `${iconPos.y}px`,
                    transform: `translate(-50%, -50%) rotate(${midAngle}deg)`, // Added rotation to match text
                    zIndex: 5,
                    width: '40px',
                    height: '40px',
                  }}
                >
                  {option.icon}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inner circle */}
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
        ></div>
      </div>

      {/* Result display and reset button */}
      <div className="mt-6 text-center">
        {selectedOption && !isSpinning && (
          <p className="text-lg mb-4">Result: <strong>{selectedOption.label}</strong></p>
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
          >
            {resetButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SpinWheel;