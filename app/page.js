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
        let data;
        if (event.data instanceof Blob) {
          // Convert Blob to text
          const text = await event.data.text();
          data = JSON.parse(text); // Parse JSON string
        } else {
          // Parse directly if it's already a string
          data = JSON.parse(event.data);
        }

        const { videoSrc } = data;
        setVideoSrc(videoSrc);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed in Project Two.');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error in Project Two:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Video Player</h1>
      {videoSrc ? (
        <iframe
          className="w-full max-w-3xl aspect-video border"
          src={videoSrc.replace('watch?v=', 'embed/')} // Convert to embeddable URL
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      ) : (
        <p className="text-gray-500">No video selected.</p>
      )}
    </div>
  );
};

export default Page;
