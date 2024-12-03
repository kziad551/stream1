'use client';

import React, { useEffect, useState } from 'react';

const Page = () => {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('WebSocket connection established in Project Two.');
    };

    ws.onmessage = async (event) => {
      try {
        const { videoSrc } = JSON.parse(event.data);
        setVideoSrc(videoSrc);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed in Project Two.');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
     
      {videoSrc ? (
        <div className="w-full max-w-2xl">
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${new URL(videoSrc).searchParams.get('v')}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>No video selected. Click a button in Project One to load a video.</p>
      )}
    </div>
  );
};

export default Page;
