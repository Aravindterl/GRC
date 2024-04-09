import React from 'react';
// import { motion } from 'framer-motion';

// const Circle = ({ content, id, onClick }) => {
//   return (
//     <motion.div
//       layoutId={id}
//       initial={{ scale: 1 }}
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={() => onClick(id)}
//       className="circle"
//     >
//       {'Hello Darling'}
//     </motion.div>
//   );
// };

// export default Circle;
const CircleComponent = ({ id, content, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(id);
  };

  const circleClass = `circle ${isSelected ? 'selected' : ''}`;

  return (
    <div className={circleClass} onClick={handleClick}>
      <span className="circle-text">{content}</span>
    </div>
  );
};

export default CircleComponent;
