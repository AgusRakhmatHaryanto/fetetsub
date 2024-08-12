// components/DropdownCheckbox.jsx
import React, { useState } from 'react';

const DropdownCheckbox = ({ options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (id) => {
    const updatedSelection = selectedOptions.includes(id)
      ? selectedOptions.filter(item => item !== id)
      : [...selectedOptions, id];
    onChange(updatedSelection);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-between items-center"
      >
        <span>{selectedOptions.length} selected</span>
        <span className="ml-2">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <label key={option.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleToggle(option.id)}
                className="mr-2"
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;