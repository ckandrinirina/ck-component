import React from 'react';
import type { SpinWheelOption } from '../types/wheelTypes';
import * as mathUtils from '../utils/wheelMathUtils';

/**
 * Wheel segment component
 */
export const WheelSegment: React.FC<{
  option: SpinWheelOption;
  index: number;
  total: number;
  radius: number;
  centerX: number;
  centerY: number;
  innerBorderColor: string;
  innerBorderWidth: number;
  fontSize: number;
}> = ({
  option,
  index,
  total,
  radius,
  centerX,
  centerY,
  innerBorderColor,
  innerBorderWidth,
  fontSize
}) => {
  // Calculate angles
  const anglePerSegment = 360 / total;
  const startAngle = index * anglePerSegment;
  const endAngle = (index + 1) * anglePerSegment;
  const midAngle = startAngle + (anglePerSegment / 2);
  
  // Create path
  const pathD = mathUtils.createArcPath(centerX, centerY, radius, startAngle, endAngle);
  
  // Calculate text position - place it at 70% from center to edge
  const textDistance = radius * 0.7;
  const textPos = mathUtils.polarToCartesian(centerX, centerY, textDistance, midAngle);
  
  return (
    <g key={option.id}>
      {/* Segment */}
      <path 
        d={pathD} 
        fill={option.color}
        stroke={innerBorderColor}
        strokeWidth={innerBorderWidth}
      />
      
      {/* Label */}
      <text
        x={textPos.x}
        y={textPos.y}
        fill="white"
        fontSize={fontSize}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          transform: `rotate(${midAngle}deg)`,
          transformOrigin: `${textPos.x}px ${textPos.y}px`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          pointerEvents: 'none'
        }}
      >
        {option.label}
      </text>
    </g>
  );
};

/**
 * Icon overlay component
 */
export const WheelIcons: React.FC<{
  options: SpinWheelOption[];
  anglePerSegment: number;
  radius: number;
  centerX: number;
  centerY: number;
}> = ({ options, anglePerSegment, radius, centerX, centerY }) => {
  return (
    <div className="absolute inset-0">
      {options.map((option, index) => {
        if (!option.icon) return null;
        
        const midAngle = index * anglePerSegment + (anglePerSegment / 2);
        const iconDistance = radius * 0.5;
        const iconPos = mathUtils.polarToCartesian(centerX, centerY, iconDistance, midAngle);
        
        return (
          <div
            key={`icon-${option.id}`}
            className="absolute flex items-center justify-center"
            style={{
              left: `${iconPos.x}px`,
              top: `${iconPos.y}px`,
              transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
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
  );
};