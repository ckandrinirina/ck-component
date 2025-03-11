import React, { useState, useRef } from 'react';

// Define the props interface for type safety
interface SpinWheelOption {
  id: string | number;
  label: string;
  color: string;
  icon?: React.ReactNode; // Optional icon component
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
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SpinWheelOption | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

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

  // Spin the wheel
  const spinWheel = () => {
    if (isSpinning) return;

    // Set spinning state
    setIsSpinning(true);
    
    // Calculate a random rotation between 2000 and 5000 degrees
    // Adding current rotation to ensure continuous spins
    const minRotation = 2000;
    const maxRotation = 5000;
    const randomSpin = Math.floor(Math.random() * (maxRotation - minRotation + 1) + minRotation);
    const totalRotation = rotation + randomSpin;
    
    // Animate rotation
    setRotation(totalRotation);

    // Calculate which segment will be selected after spin
    setTimeout(() => {
      const finalRotation = totalRotation % 360;
      const selectedIndex = Math.floor((360 - (finalRotation % 360)) / anglePerSegment);
      const selected = options[selectedIndex % options.length];
      
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

      {/* Result display */}
      {selectedOption && !isSpinning && (
        <div className="mt-6 text-center">
          <p className="text-lg">Result: <strong>{selectedOption.label}</strong></p>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;