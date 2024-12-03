'use client';

import React, { useEffect, useState } from 'react';

const Page = () => {
  const [videoSrc, setVideoSrc] = useState(null); // Set initial state to null

  useEffect(() => {
    // Connect to the WebSocket server at the deployed URL for Project One
    const ws = new WebSocket('ws://stream1tablet.vercel.app/api/websocket/route.js'); // Update with correct WebSocket URL

    ws.onopen = () => {
      console.log('WebSocket connection established in Project Two.');
    };

    ws.onmessage = async (event) => {
      try {
        let data;
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          data = JSON.parse(text);
        } else {
          data = JSON.parse(event.data);
        }

        // Parse the video source from the incoming message
        const { videoSrc } = data;
        const vimeoEmbedUrl = videoSrc.replace('vimeo.com/', 'player.vimeo.com/video/');
        setVideoSrc(`${vimeoEmbedUrl}?autoplay=1`); // Set the video source
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
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      {/* Conditionally render iframe only when videoSrc is available */}
      {videoSrc ? (
        <iframe
          className="w-full h-full"
          src={videoSrc}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo Video"
        ></iframe>
      ) : (
        <div className="w-full h-full bg-black"></div> // Black placeholder
      )}
    </div>
  );
};

export default Page;
