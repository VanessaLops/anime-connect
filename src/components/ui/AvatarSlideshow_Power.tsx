import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import the Image component from next/image

interface AvatarSlideshowProps {
  images: string[];
  interval?: number;
  size?: number;
}

const AvatarSlideshow: React.FC<AvatarSlideshowProps> = ({
  images,
  interval = 500,
  size = 20,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <Image
      src={images[currentIndex]}
      alt="Slideshow Avatar"
      width={size}
      height={size} 
      style={{
        objectFit: "contain",
        transition: "opacity 0.5s ease-in-out",
      }}
    />
  );
};

export default AvatarSlideshow;
