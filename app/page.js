'use client';
import { useState, useEffect } from 'react';

const Page = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);  // Track if video is loaded

  const fetchVideoUrl = async () => {
    try {
      const response = await fetch('/api/receiveVideo');
      const data = await response.json();

      if (data.videoSrc && !isVideoLoaded) {
        setVideoSrc(data.videoSrc);
        setIsVideoLoaded(true);  // Stop polling after video is loaded
      }
    } catch (error) {
      console.error('Error fetching video URL:', error);
    }
  };

  // Fetch video URL initially and set up polling
  useEffect(() => {
    fetchVideoUrl();  // Initial fetch when component is mounted

    const interval = setInterval(() => {
      if (!isVideoLoaded) { // Poll only if the video is not yet loaded
        fetchVideoUrl();
      }
    }, 2000);  // Poll every 2 seconds
    return () => clearInterval(interval); // Cleanup the interval when component unmounts
  }, [isVideoLoaded]); // Re-run if video is loaded

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
