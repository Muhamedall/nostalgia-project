import React from 'react';

import Image from 'next/image';
import img from './17cd6d9ef5ce6853a924c0449f28426e-Photoroom.png'
const CoverPage: React.FC = () => {
  return (
    <div className="cover-container flex flex-row">
      <Image
        src={img} // Replace with your image URL
        alt="Cover" 
        className="cover-image w-[20%]"
      />
      <div className="cover-text">
        <h1>The nostalgia .. is her</h1>
      </div>
    </div>
  );
};

export default CoverPage;