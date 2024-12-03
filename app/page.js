'use client';
import { useState, useEffect } from 'react';

const Page = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Fetch the video URL from the backend API
  const fetchVideoUrl = async () => {
    try {
      const response = await fetch('/api/receiveVideo');
      const data = await response.json();

      if (data.videoSrc) {
        setVideoSrc((prev) => (prev !== data.videoSrc ? data.videoSrc : prev)); // Update only if different
      }
    } catch (error) {
      console.error('Error fetching video URL:', error);
    }
  };

  useEffect(() => {
    // Start polling the server every 3 seconds
    const interval = setInterval(fetchVideoUrl, 3000);
    setPollingInterval(interval);

    return () => {
      // Clear the polling interval when the component unmounts
      clearInterval(interval);
    };
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
          Waiting for video...
        </div>
      )}
    </div>
  );
};

export default Page;
