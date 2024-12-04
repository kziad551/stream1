'use client';
import { useState, useEffect } from 'react';

const Page = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  const fetchVideoUrl = async () => {
    try {
      const response = await fetch('/api/receiveVideo');
      const data = await response.json();

      if (data.videoSrc) {
        setVideoSrc(data.videoSrc);
      }
    } catch (error) {
      console.error('Error fetching video URL:', error);
    }
  };

  // Fetch video URL initially and set up polling
  useEffect(() => {
    fetchVideoUrl();

    const interval = setInterval(fetchVideoUrl, 100); // Poll every 2 seconds
    return () => clearInterval(interval); // Cleanup the interval
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
