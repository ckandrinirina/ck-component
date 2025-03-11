import React, { useState } from 'react';
import SpinWhell from '~/components/SpinWhell';
import { FiGift, FiStar, FiHeart, FiAward, FiCoffee, FiSmile } from 'react-icons/fi';

// Define the wheel options type
interface WheelOption {
  id: string | number;
  label: string;
  color: string;
  icon?: React.ReactNode;
}

const WhellGames = () => {
  // Set up state to track the selected option
  const [result, setResult] = useState<WheelOption | null>(null);

  // Example wheel options with different colors and icons
  const wheelOptions: WheelOption[] = [
    { id: 1, label: 'Prize 1', color: '#E74C3C', icon: <FiGift size={20} /> },
    { id: 2, label: 'Prize 2', color: '#3498DB', icon: <FiStar size={20} /> },
    { id: 3, label: 'Prize 3', color: '#2ECC71', icon: <FiHeart size={20} /> },
    { id: 4, label: 'Prize 4', color: '#F39C12', icon: <FiAward size={20} /> },
    { id: 5, label: 'Prize 5', color: '#9B59B6', icon: <FiCoffee size={20} /> },
    { id: 6, label: 'Prize 6', color: '#1ABC9C', icon: <FiSmile size={20} /> },
  ];

  // Callback function when the wheel selects an option
  const handleSpinResult = (option: WheelOption) => {
    setResult(option);
    console.log('Spin resulted in:', option);
    // Here you could trigger additional effects or state changes
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-8 text-center">Spin Wheel Game</h1>
      
      <div className="flex flex-col items-center">
        {/* Render the SpinWhell component with our options */}
        <SpinWhell
          options={wheelOptions}
          onSelectOption={handleSpinResult}
          duration={5000}
          size={400}
          buttonText="SPIN"
          fontSize={16}
          outerBorderColor="#333"
          spinButtonColor="#4CAF50"
        />
        
        {/* Display the selected prize below the wheel */}
        {result && (
          <div className="mt-8 p-5 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold">Congratulations!</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {result.icon}
              <p className="text-xl">You won: <strong>{result.label}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhellGames;