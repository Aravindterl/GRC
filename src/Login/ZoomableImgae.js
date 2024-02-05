import React, { useState } from 'react';
import ReactImageZoom from 'react-image-zoom';
import './login.css';

const ZoomableImage = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const zoomProps = {
    width: 400,
    height: 400,
    zoomWidth: 800,
    img: images[currentIndex],
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsZoomed(false); // Reset zoom when changing images
  };

  return (
    <div className={`zoom-container ${isZoomed ? 'zoomed' : ''}`}>
      <ReactImageZoom {...zoomProps} />
      {isZoomed && (
        <div className="additional-content">
          {/* Add your additional content here */}
          <p>Additional Information</p>
        </div>
      )}
      <button onClick={() => setIsZoomed(!isZoomed)}>
        {isZoomed ? 'Zoom Out' : 'Zoom In'}
      </button>
      <button onClick={nextImage}>Next Image</button>
    </div>
  );
};

export default ZoomableImage;
