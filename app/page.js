'use client'
import { useState, useEffect } from 'react';

const Page = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  // Fetch the video URL from the backend API
  const fetchVideoUrl = async () => {
    try {
      const response = await fetch('/api/receiveVideo');
      const data = await response.json();

      if (data.videoSrc) {
        setVideoSrc(data.videoSrc); // Set the video ID for the iframe
      } else {
        console.error('Error fetching video:', data.error);
      }
    } catch (error) {
      console.error('Error fetching video URL:', error);
    }
  };

  useEffect(() => {
    fetchVideoUrl(); // Fetch video URL when the page loads
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      {videoSrc ? (
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${videoSrc}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo Video"
        />
      ) : (
        <div className="w-full h-full bg-black flex items-center justify-center text-white">
          Loading video...
        </div>
      )}
    </div>
  );
};

export default Page;
