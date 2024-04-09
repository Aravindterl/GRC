import React, { useState } from 'react';
import CircleComponent from './ZoomableImgae';
// import { AnimateSharedLayout } from 'framer-motion';

const ScaleOfUniverse = () => {
  const initialCircles = [
    { id: 1, label: 'Circle 1', isSelected: false },
    { id: 2, label: 'Circle 2', isSelected: false },
    { id: 3, label: 'Circle 3', isSelected: false },
    { id: 4, label: 'Circle 3', isSelected: false },
    { id: 5, label: 'Circle 3', isSelected: false },
    { id: 6, label: 'Circle 3', isSelected: false },
    { id: 7, label: 'Circle 3', isSelected: false },
    { id: 8, label: 'Circle 3', isSelected: false },

    { id: 9, label: 'Circle 3', isSelected: false },
    { id: 11, label: 'Circle 3', isSelected: false },{ id: 3, label: 'Circle 3', isSelected: false },

    // ... Add more circles as needed
    { id: 10, label: 'Circle 10', isSelected: false }
  ];

  // State for all circles
  const [circles, setCircles] = useState(initialCircles);

  // Function to handle selecting a circle
  const handleSelect = (id) => {
    const updatedCircles = circles.map(circle => ({
      ...circle,
      isSelected: circle.id === id
    }));
    setCircles(updatedCircles);
  };

  return (
    <div className="container">
      {circles.map(circle => (
        <CircleComponent
          key={circle.id}
          id={circle.id}
          content={circle.label}
          isSelected={circle.isSelected}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};


export default ScaleOfUniverse;
